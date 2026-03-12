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
    const error = params.get('error')

    if (error) {
      navigate('/login', { replace: true })
      return
    }

    // Token 现在通过 httpOnly cookie 传递，需要调用 API 验证
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include' // 重要：包含 cookies
        })

        if (!response.ok) {
          throw new Error('Auth verification failed')
        }

        const data = await response.json()
        
        // 登录成功，跳转到 dashboard
        Promise.resolve(login(data.token, data.user)).then(() => {
          navigate('/dashboard', { replace: true })
        })
      } catch (error) {
        console.error('OAuth callback error:', error)
        navigate('/login?error=oauth_failed', { replace: true })
      }
    }

    verifyAuth()
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
