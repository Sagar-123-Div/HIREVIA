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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/find-job" element={<FindJobsPage />} />
        <Route path="/jobs" element={<FindJobsPage />} />
        <Route path="/jobs/:jobId" element={<JobDetails />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
