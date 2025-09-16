// import React, { createContext, useContext, useEffect } from 'react';
import { useState, useEffect } from 'react'
import bcrypt from 'bcryptjs'
import { useNavigate } from 'react-router-dom'

import useAuth from '../auth/AuthContext'
// import { ipcRenderer } from 'electron';
// const { api } = window
// const MyAuthContext = createContext(null)
// 'window.api' is the correct way to access it.
const { api } = window

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, error, loading } = useAuth()
  const [isApiReady, setIsApiReady] = useState(false) // New state to track API readiness
  const navigate = useNavigate()

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   const res = await window.api.login(username, password)
  //   if (res.ok) {
  //     navigate('/adminDashboard') // Protected will redirect to proper dashboard
  //     console.log("welcome");
  //   }
  //   else{
  //     console.log("Something went wrong");

  //   }
  // }

  useEffect(() => {
    // This check ensures the component doesn't try to use the API until it exists.
    if (api && api.login) {
      setIsApiReady(true)
      console.log('Application API is ready.')
    } else {
      console.error('Application API (window.api) is not available.')
      setErrorMessage('Application API is not ready. Please restart the app.')
    }
  }, []) // The empty dependency array ensures this runs only once.

  const handleLogin = async (e) => {
    e.preventDefault()
    // Check if the API is available first
    if (!isApiReady) {
      setErrorMessage('Application API is not ready. Please wait or restart the app.')
      return
    }
    if (!username || !password) {
      setErrorMessage('Please enter credentials')
      return
    }
    setIsLoading(true)
    setErrorMessage('')
    console.log('Trying login with:', username, password)

    try {
      const res = await login(username, password)
      console.log('API response:', res) // <-- Add this line

      if (res.ok) {
        if (res.user.role === 'admin') {
          // navigate('/adminDashboardLayout')
          navigate('/userDashboardLayout')
        } else {
          navigate('/userDashboardLayout')
        }
        console.log('Welcome', res.user.role)
      } else {
        console.log('Something went wrong:', res.message)
      }
    } catch (error) {
      console.error('Login process failed:', error)
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 space-y-10">
      {/* Section 1: Image */}
      <div className="w-full max-w-md flex justify-center">
        {/* <img
          src="https://images.unsplash.com/photo-1590080877777-e2c77b94560b?auto=format&fit=crop&w=600&q=80"
          alt="Marble Factory"
          className="rounded-lg shadow-md max-h-64 object-cover"
        /> */}
      </div>

      {/* Section 2: Login Form */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* {err && <small style={{ color:'red' }}>{err}</small>} */}
            {/* {error && <div className="error">{error}</div>} */}
            {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
          </div>
          <button
            type="submit"
            // disabled={loading}
            // disabled={isLoading}
            disabled={isLoading || !isApiReady} // Button is now disabled if the API isn't ready
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      {/* Section 3: Extra Info or Button */}
      {/* <div className="w-full max-w-md text-center text-gray-600">
        <p>
          Forgot your password?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Reset it here
          </a>
        </p>
      </div> */}
    </div>
  )
}
