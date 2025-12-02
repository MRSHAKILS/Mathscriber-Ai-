'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, logoutUser } from '@/lib/api'

interface User {
  id: string
  email: string
  username?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password)

      if (response.success && response.token && response.user) {
        setToken(response.token)
        setUser(response.user)
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        return { success: true }
      }

      return { success: false, error: response.error || 'Login failed' }
    } catch (error) {
      return { success: false, error: 'An error occurred during login' }
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await registerUser(username, email, password)

      if (response.success && response.token && response.user) {
        setToken(response.token)
        setUser(response.user)
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        return { success: true }
      }

      return { success: false, error: response.error || 'Registration failed' }
    } catch (error) {
      return { success: false, error: 'An error occurred during registration' }
    }
  }

  const logout = async () => {
    if (token) {
      await logoutUser(token)
    }
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
