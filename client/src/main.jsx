import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'
import './index.css'

const TOKEN_STORAGE_KEY = 'codereview.auth.token'

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || ''

if (apiBaseUrl) {
  axios.defaults.baseURL = apiBaseUrl
}

axios.defaults.headers.common['Content-Type'] = 'application/json'

const applyAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete axios.defaults.headers.common.Authorization
}

const bootstrapAuthCallback = () => {
  const currentUrl = new URL(window.location.href)
  const token = currentUrl.searchParams.get('token')

  if (currentUrl.pathname === '/auth/callback' && token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    applyAuthToken(token)

    const redirectTo = currentUrl.searchParams.get('redirect') || '/dashboard'
    window.history.replaceState({}, document.title, redirectTo)
  }
}

const existingToken = localStorage.getItem(TOKEN_STORAGE_KEY)
applyAuthToken(existingToken)

bootstrapAuthCallback()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
