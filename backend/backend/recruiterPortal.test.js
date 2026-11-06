import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./model/User.js";
import Job from "./model/job.js";
import Application from "./model/Application.js";
import { login, register } from "./controllers/authController.js";
import {
  applyToJob,
  getMyApplication,
  getRecruiterApplications,
  updateApplicationStatus,
} from "./controllers/applicationController.js";
import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
} from "./controllers/jobController.js";
import {
  isCandidate,
  isRecruiter,
  verifyToken,
} from "./middleware/authMiddle.js";

const makeResponse = () => ({
  statusCode: 200,
  body: undefined,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

const setTestEnvironment = (t) => {
  const previous = {
    jwtSecret: process.env.JWT_SECRET,
    recruiterName: process.env.RECRUITER_NAME,
    recruiterEmail: process.env.RECRUITER_EMAIL,
    recruiterPassword: process.env.RECRUITER_PASSWORD,
  };
  process.env.JWT_SECRET = "test-jwt-secret";
  process.env.RECRUITER_NAME = "Test Company";
  process.env.RECRUITER_EMAIL = "recruiter@test.example";
  process.env.RECRUITER_PASSWORD = "test-recruiter-password";
  t.after(() => {
    for (const [key, value] of Object.entries({
      JWT_SECRET: previous.jwtSecret,
      RECRUITER_NAME: previous.recruiterName,
      RECRUITER_EMAIL: previous.recruiterEmail,
      RECRUITER_PASSWORD: previous.recruiterPassword,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
};

const makeQuery = (result) => ({
  populate() {
    return this;
  },
  select: async () => result,
  sort: async () => result,
});

test("recruiter and candidate credentials return distinct roles", async (t) => {
  setTestEnvironment(t);
  const candidate = {
    _id: "candidate-id",
    name: "Candidate",
    email: "candidate@test.example",
    role: "jobseeker",
    password: await bcrypt.hash("candidate-password", 4),
  };
  const recruiter = {
    _id: "recruiter-id",
    name: "Test Company",
    email: process.env.RECRUITER_EMAIL,
    role: "recruiter",
    password: await bcrypt.hash(process.env.RECRUITER_PASSWORD, 4),
  };
  t.mock.method(User, "findOne", (filter) => ({
    select: async () => {
      if (filter.email === candidate.email) return candidate;
      if (filter.email === recruiter.email) return recruiter;
      return null;
    },
  }));

  const candidateResponse = makeResponse();
  await login(
    {
      body: { email: candidate.email, password: "candidate-password" },
    },
    candidateResponse
  );
  assert.equal(candidateResponse.statusCode, 200);
  assert.equal(candidateResponse.body.user.role, "candidate");

  const recruiterResponse = makeResponse();
  await login(
    {
      body: {
        email: process.env.RECRUITER_EMAIL,
        password: process.env.RECRUITER_PASSWORD,
      },
    },
    recruiterResponse
  );
  assert.equal(recruiterResponse.statusCode, 200);
  assert.deepEqual(recruiterResponse.body.user, {
    id: recruiter._id,
    name: recruiter.name,
    email: recruiter.email,
    role: "recruiter",
  });

  const wrongPasswordResponse = makeResponse();
  await login(
    {
      body: {
        email: process.env.RECRUITER_EMAIL,
        password: "candidate-password",
      },
    },
    wrongPasswordResponse
  );
  assert.equal(wrongPasswordResponse.statusCode, 401);
});

test("public signup always creates a candidate", async (t) => {
  setTestEnvironment(t);
  let created;
  t.mock.method(User, "findOne", async () => null);
  t.mock.method(User, "create", async (document) => {
    created = document;
    return { ...document, _id: "new-candidate-id" };
  });

  const response = makeResponse();
  await register(
    {
      body: {
        name: "New User",
        email: "new-user@test.example",
        password: "candidate-password",
        role: "recruiter",
      },
    },
    response
  );
  assert.equal(response.statusCode, 201);
  assert.equal(created.role, "candidate");
  assert.equal(response.body.user.role, "candidate");

  const reservedEmailResponse = makeResponse();
  await register(
    {
      body: {
        name: "Impersonator",
        email: process.env.RECRUITER_EMAIL,
        password: "candidate-password",
      },
    },
    reservedEmailResponse
  );
  assert.equal(reservedEmailResponse.statusCode, 409);
});

test("valid tokens with the opposite role are forbidden", async (t) => {
  setTestEnvironment(t);
  const candidate = {
    _id: "candidate-id",
    email: "candidate@test.example",
    role: "candidate",
  };
  const recruiter = {
    _id: "recruiter-id",
    email: process.env.RECRUITER_EMAIL,
    role: "recruiter",
  };
  t.mock.method(User, "findById", async (id) =>
    id === candidate._id ? candidate : recruiter
  );

  const candidateResponse = makeResponse();
  const candidateToken = jwt.sign(
    { userId: candidate._id },
    process.env.JWT_SECRET
  );
  await verifyToken(
    { headers: { authorization: `Bearer ${candidateToken}` } },
    candidateResponse,
    () => isRecruiter({ user: candidate }, candidateResponse, () => {})
  );
  assert.equal(candidateResponse.statusCode, 403);

  const recruiterResponse = makeResponse();
  const recruiterToken = jwt.sign(
    { userId: recruiter._id },
    process.env.JWT_SECRET
  );
  await verifyToken(
    { headers: { authorization: `Bearer ${recruiterToken}` } },
    recruiterResponse,
    () => isCandidate({ user: recruiter }, recruiterResponse, () => {})
  );
  assert.equal(recruiterResponse.statusCode, 403);
});

test("missing and invalid bearer tokens return 401", async (t) => {
  setTestEnvironment(t);

  const missingResponse = makeResponse();
  await verifyToken({ headers: {} }, missingResponse, () => {
    assert.fail("next should not run without a token");
  });
  assert.equal(missingResponse.statusCode, 401);

  const invalidResponse = makeResponse();
  await verifyToken(
    { headers: { authorization: "Bearer invalid-token" } },
    invalidResponse,
    () => assert.fail("next should not run with an invalid token")
  );
  assert.equal(invalidResponse.statusCode, 401);
});

test("job creation uses the authenticated recruiter as owner", async (t) => {
  setTestEnvironment(t);
  let created;
  t.mock.method(Job, "create", async (document) => {
    created = document;
    return document;
  });
  const response = makeResponse();

  await createJob(
    {
      user: { _id: "real-recruiter-id", name: "Test Company" },
      body: {
        title: "Engineer",
        company: "Test Company",
        location: "Remote",
        jobType: "Remote",
        salary: "Competitive",
        experience: "3+ years",
        openings: 2,
        description: "Build things",
        requirements: ["JavaScript"],
        benefits: ["Health insurance"],
        postedBy: "attacker-controlled-id",
      },
    },
    response
  );

  assert.equal(response.statusCode, 201);
  assert.equal(created.postedBy, "real-recruiter-id");
  assert.equal(created.openings, 2);
  assert.deepEqual(created.requirements, ["JavaScript"]);
});

test("recruiter job browsing is scoped to its own jobs", async (t) => {
  const filters = [];
  t.mock.method(Job, "find", (filter) => {
    filters.push(filter);
    return makeQuery([]);
  });

  const recruiterResponse = makeResponse();
  await getAllJobs(
    { user: { _id: "recruiter-id", role: "recruiter" }, query: {} },
    recruiterResponse
  );
  assert.deepEqual(filters[0], { postedBy: "recruiter-id" });
  assert.deepEqual(recruiterResponse.body, { jobs: [] });

  const publicResponse = makeResponse();
  await getAllJobs({ query: {} }, publicResponse);
  assert.deepEqual(filters[1], {});
  assert.deepEqual(publicResponse.body, { jobs: [] });
});

test("recruiter cannot update or delete another recruiter's job", async (t) => {
  const filters = [];
  t.mock.method(Job, "findOne", async (filter) => {
    filters.push(filter);
    return null;
  });

  const updateResponse = makeResponse();
  await updateJob(
    {
      params: { id: "other-job" },
      user: { _id: "recruiter-id" },
      body: { title: "Changed" },
    },
    updateResponse
  );
  assert.equal(updateResponse.statusCode, 404);
  assert.deepEqual(filters[0], {
    _id: "other-job",
    postedBy: "recruiter-id",
  });

  const deleteResponse = makeResponse();
  await deleteJob(
    { params: { id: "other-job" }, user: { _id: "recruiter-id" } },
    deleteResponse
  );
  assert.equal(deleteResponse.statusCode, 404);
  assert.deepEqual(filters[1], {
    _id: "other-job",
    postedBy: "recruiter-id",
  });
});

test("application submission uses the authenticated candidate and supports jobId", async (t) => {
  let created;
  t.mock.method(Job, "findById", async () => ({ _id: "job-id" }));
  t.mock.method(Application, "findOne", async () => null);
  t.mock.method(Application, "create", async (document) => {
    created = document;
    return document;
  });
  const response = makeResponse();

  await applyToJob(
    {
      user: { _id: "candidate-id", resume: "profile-resume.pdf" },
      body: {
        jobId: "job-id",
        applicant: "attacker-controlled-id",
        resume: "submitted-resume.pdf",
      },
    },
    response
  );

  assert.equal(response.statusCode, 201);
  assert.deepEqual(created, {
    job: "job-id",
    applicant: "candidate-id",
    resume: "submitted-resume.pdf",
  });
});

test("candidate applications are queried only by authenticated applicant", async (t) => {
  let query;
  const applications = [{ _id: "own-application", status: "pending" }];
  t.mock.method(Application, "find", (filter) => {
    query = filter;
    return makeQuery(applications);
  });
  const response = makeResponse();

  await getMyApplication({ user: { _id: "candidate-id" } }, response);

  assert.deepEqual(query, { applicant: "candidate-id" });
  assert.deepEqual(response.body.applications, applications);
});

test("recruiter application inbox includes only jobs it owns", async (t) => {
  let applicationFilter;
  t.mock.method(Job, "find", () => ({
    select: async () => [{ _id: "owned-job" }],
  }));
  const application = {
    _id: "application-id",
    status: "pending",
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    resume: "resume.pdf",
    applicant: { _id: "candidate-id", name: "Candidate", email: "c@test.example" },
    job: { _id: "owned-job", title: "Engineer" },
  };
  t.mock.method(Application, "find", (filter) => {
    applicationFilter = filter;
    return makeQuery([application]);
  });
  const response = makeResponse();

  await getRecruiterApplications(
    { user: { _id: "recruiter-id" } },
    response
  );

  assert.deepEqual(applicationFilter, { job: { $in: ["owned-job"] } });
  assert.equal(response.body.applications[0].applicant.email, "c@test.example");
  assert.equal(response.body.applications[0].job.title, "Engineer");
  assert.equal(response.body.applications[0].resume, "resume.pdf");
});

test("recruiter may set considered or rejected only on owned applications", async (t) => {
  const application = {
    job: "owned-job",
    status: "pending",
    save: async function () {
      return this;
    },
  };
  let ownedJobId = "owned-job";
  t.mock.method(Application, "findById", async () => application);
  let ownershipFilter;
  t.mock.method(Job, "findOne", async (filter) => {
    ownershipFilter = filter;
    return filter.postedBy === "recruiter-id" && filter._id === ownedJobId
      ? { _id: ownedJobId }
      : null;
  });

  for (const status of ["considered", "rejected"]) {
    const response = makeResponse();
    await updateApplicationStatus(
      {
        params: { id: "application-id" },
        user: { _id: "recruiter-id" },
        body: { status },
      },
      response
    );
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.application.status, status);
    assert.deepEqual(ownershipFilter, {
      _id: "owned-job",
      postedBy: "recruiter-id",
    });
  }

  const invalidStatusResponse = makeResponse();
  await updateApplicationStatus(
    {
      params: { id: "application-id" },
      user: { _id: "recruiter-id" },
      body: { status: "accepted" },
    },
    invalidStatusResponse
  );
  assert.equal(invalidStatusResponse.statusCode, 400);

  application.job = "another-recruiters-job";
  const unauthorizedResponse = makeResponse();
  await updateApplicationStatus(
    {
      params: { id: "application-id" },
      user: { _id: "recruiter-id" },
      body: { status: "rejected" },
    },
    unauthorizedResponse
  );
  assert.equal(unauthorizedResponse.statusCode, 404);
});
