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

function PrivateRoute({ children, recruiterOnly = false }) {
  const { user, isRecruiter } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (recruiterOnly && !isRecruiter) return <Navigate to="/" />
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
            <Route path="dashboard" element={
              <PrivateRoute recruiterOnly><Dashboard /></PrivateRoute>
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
