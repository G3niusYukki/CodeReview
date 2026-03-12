import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const TOKEN_STORAGE_KEY = 'codereview.auth.token'

const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY)

const setStoredToken = (token) => {
  if (!token) return
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

const applyAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete axios.defaults.headers.common.Authorization
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(getStoredToken())
  const [loading, setLoading] = useState(true)

  const isAuthenticated = Boolean(user && token)

  const setSession = (nextToken, nextUser = null) => {
    setToken(nextToken || null)
    applyAuthToken(nextToken)

    if (nextToken) {
      setStoredToken(nextToken)
    } else {
      clearStoredToken()
    }

    if (nextUser !== null) {
      setUser(nextUser)
    }
  }

  const clearSession = () => {
    setUser(null)
    setSession(null)
  }

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/user/profile')
      setUser(response.data.user)
      return response.data.user
    } catch (error) {
      clearSession()
      return null
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => fetchUser()

  const login = async (nextToken, userData) => {
    setSession(nextToken, userData)
    return userData
  }

  const logout = () => {
    clearSession()
    setLoading(false)
  }

  useEffect(() => {
    const existingToken = getStoredToken()

    if (!existingToken) {
      applyAuthToken(null)
      setLoading(false)
      return
    }

    setToken(existingToken)
    applyAuthToken(existingToken)
    fetchUser()
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      tokenStorageKey: TOKEN_STORAGE_KEY,
      login,
      logout,
      fetchUser,
      refreshUser,
      getToken: getStoredToken,
      setSession,
      clearSession
    }),
    [user, token, loading, isAuthenticated]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { TOKEN_STORAGE_KEY, getStoredToken, setStoredToken, clearStoredToken, applyAuthToken }
