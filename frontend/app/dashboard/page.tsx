"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { logoutUser, getCurrentUser } from "../../lib/api"

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem("token")
    setToken(t)
  }, [])

  useEffect(() => {
    // fetch current user info when token is present
    async function loadUser() {
      const t = localStorage.getItem("token")
      if (!t) return
      try {
        const user = await getCurrentUser(t)
        setMessage(`Logged in as ${user.username || user.email}`)
      } catch (err) {
        console.warn("Failed fetching user info", err)
      }
    }

    loadUser()
  }, [])

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutUser(token)
      }
    } catch (err) {
      console.warn("Logout call failed (continuing to clear token)", err)
    }

    localStorage.removeItem("token")
    setToken(null)
    setMessage("Logged out successfully")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {token ? (
          <div>
            <p className="mb-4">You are currently logged in.</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-4">You are not logged in.</p>
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded">
              Go to Login
            </Link>
            <Link href="/register" className="ml-3 px-4 py-2 border rounded">
              Register
            </Link>
          </div>
        )}

        {message && <p className="mt-4 text-green-600">{message}</p>}
      </div>
    </div>
  )
}
