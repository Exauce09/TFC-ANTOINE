import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Apply from './pages/Apply'
import MyApplications from './pages/MyApplications'
import Dashboard from './pages/Dashboard'
import ApplicationDetail from './pages/ApplicationDetail'
import ManageJobs from './pages/ManageJobs'
import Reports from './pages/Reports'
import NotificationsPage from './pages/NotificationsPage'
import ManageDepartments from './pages/ManageDepartments'
import Profile from './pages/Profile'
import Privacy from './pages/Privacy'

function PrivateRoute({ children, recruiterOnly = false, adminOnly = false }) {
  const { user, isRecruiter } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (recruiterOnly && !isRecruiter) return <Navigate to="/" />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetail />} />
            <Route path="jobs/:id/apply" element={
              <PrivateRoute><Apply /></PrivateRoute>
            } />
            <Route path="my-applications" element={
              <PrivateRoute><MyApplications /></PrivateRoute>
            } />
            <Route path="profile" element={
              <PrivateRoute><Profile /></PrivateRoute>
            } />
            <Route path="privacy" element={<Privacy />} />
            <Route path="dashboard" element={
              <PrivateRoute recruiterOnly><Dashboard /></PrivateRoute>
            } />
            <Route path="dashboard/jobs" element={
              <PrivateRoute recruiterOnly><ManageJobs /></PrivateRoute>
            } />
            <Route path="dashboard/reports" element={
              <PrivateRoute recruiterOnly><Reports /></PrivateRoute>
            } />
            <Route path="dashboard/notifications" element={
              <PrivateRoute recruiterOnly><NotificationsPage /></PrivateRoute>
            } />
            <Route path="dashboard/departments" element={
              <PrivateRoute recruiterOnly adminOnly><ManageDepartments /></PrivateRoute>
            } />
            <Route path="dashboard/applications/:id" element={
              <PrivateRoute recruiterOnly><ApplicationDetail /></PrivateRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
