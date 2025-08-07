'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [resetUrl, setResetUrl] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setError('')
    setResetUrl('')

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forget-password`, {
        email
      })

      setMessage(response.data.message)
      if (response.data.resetUrl) {
        setResetUrl(response.data.resetUrl) // For testing - remove in production
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-forest-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-forest-lightGray placeholder-gray-500 text-white bg-forest-gray focus:outline-none focus:ring-forest-accent focus:border-forest-accent focus:z-10 sm:text-sm"
              placeholder="Enter your email address"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg">
              <p>{message}</p>
              {resetUrl && (
                <div className="mt-3 p-3 bg-forest-gray rounded border">
                  <p className="text-xs text-gray-400 mb-2">For testing (remove in production):</p>
                  <Link 
                    href={resetUrl.replace('http://localhost:3000', '')}
                    className="text-forest-accent hover:text-forest-accent/80 text-sm break-all"
                  >
                    {resetUrl}
                  </Link>
                </div>
              )}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-forest-black bg-forest-accent hover:bg-forest-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-forest-black mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth"
              className="text-forest-accent hover:text-forest-accent/80 text-sm transition-colors duration-300"
            >
              ← Back to Login
            </Link>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link
              href="/auth"
              className="text-forest-accent hover:text-forest-accent/80 transition-colors duration-300"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
