import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Review from './pages/Review'
import History from './pages/History'
import Pricing from './pages/Pricing'
import Settings from './pages/Settings'
import ReviewDetail from './pages/ReviewDetail'
import PrivateRoute from './components/PrivateRoute'

function AuthCallback() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const error = params.get('error')

    if (error || !token) {
      navigate('/login', { replace: true })
      return
    }

    const bootstrapUser = {
      id: null,
      email: '',
      username: 'GitHub User',
      avatar: null,
      plan: 'free',
      reviewsLimit: 5,
      reviewsUsed: 0,
      reviewsRemaining: 5
    }

    Promise.resolve(login(token, bootstrapUser)).then(() => {
      navigate('/dashboard', { replace: true })
    })
  }, [location.search, login, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}

function LegacyReviewDetailRedirect() {
  const location = useLocation()
  const reviewId = location.pathname.split('/').pop()

  if (!reviewId) {
    return <Navigate to="/history" replace />
  }

  return <Navigate to={`/history/${reviewId}`} replace />
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/review"
          element={
            <PrivateRoute>
              <Review />
            </PrivateRoute>
          }
        />

        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />

        <Route
          path="/history/:id"
          element={
            <PrivateRoute>
              <ReviewDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/review/:id"
          element={
            <PrivateRoute>
              <LegacyReviewDetailRedirect />
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
