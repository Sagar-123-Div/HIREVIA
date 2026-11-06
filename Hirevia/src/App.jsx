import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'
import Login from './pages/login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import FindJobsPage from './pages/Find job'
import Profile from './pages/Profile'
import MyApplications from './pages/MyApplications'
import SavedJobs from './pages/SavedJobs'
import JobDetails from './pages/JobDetails'
import RecruiterDashboard from './pages/RecruiterDashboard'
import RoleGate from './component/RoleGate'

const candidatePage = (page) => <RoleGate audience="candidate">{page}</RoleGate>

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={candidatePage(<Landing />)} />
        <Route path="/login" element={candidatePage(<Login />)} />
        <Route path="/signup" element={candidatePage(<Signup />)} />
        <Route path="/dashboard" element={candidatePage(<Dashboard />)} />
        <Route path="/find-job" element={candidatePage(<FindJobsPage />)} />
        <Route path="/jobs" element={candidatePage(<FindJobsPage />)} />
        <Route path="/jobs/:jobId" element={candidatePage(<JobDetails />)} />
        <Route path="/my-applications" element={candidatePage(<MyApplications />)} />
        <Route path="/saved-jobs" element={candidatePage(<SavedJobs />)} />
        <Route path="/profile" element={candidatePage(<Profile />)} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
