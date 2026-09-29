import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Service/Login";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginUser(email, password);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-sky-100 px-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <section className="hidden flex-col justify-between bg-gradient-to-br from-sky-700 via-blue-700 to-indigo-800 p-10 text-white md:flex">
          <div>
            <h1 className="mb-4 text-4xl font-bold">Welcome Back</h1>
            <p className="text-base leading-relaxed text-sky-100">
              Sign in to explore jobs, manage applications, and access your Hirevia dashboard.
            </p>
          </div>

          <div>
            <div className="mb-4 h-1 w-20 rounded-full bg-white/60" />
            <p className="text-sm text-sky-100/80">Fast access. Secure login. Simple workflow.</p>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="mt-6 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
            >
              Create a new account
            </button>
          </div>
        </section>

        <section className="p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Login</h2>
            <p className="mt-2 text-slate-500">Enter your email and password to continue.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-24 text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-50"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                Remember me
              </label>
              <button type="button" onClick={() => navigate("/forgot-password")} className="text-sm font-medium text-sky-700 hover:text-sky-800">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-sky-600 px-4 py-3 font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <button type="button" onClick={() => navigate("/signup")} className="font-semibold text-sky-700 hover:text-sky-800">
              Sign up
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}
