'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [tokenValid, setTokenValid] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link')
      setIsVerifying(false)
      return
    }

    verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-reset-token/${token}`)
      setTokenValid(true)
      setUserInfo(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid or expired reset link')
      setTokenValid(false)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setError('')

    // Validation
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        token,
        newPassword
      })

      setMessage(response.data.message)
      
      // Redirect to auth page after 3 seconds
      setTimeout(() => {
        router.push('/auth')
      }, 3000)

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-forest-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-accent mx-auto mb-4"></div>
          <p className="text-white">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-forest-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Invalid Reset Link</h2>
            <p className="mb-6">{error}</p>
            <div className="space-y-3">
              <Link 
                href="/forget-password"
                className="block w-full py-3 px-4 bg-forest-accent text-forest-black rounded-lg hover:bg-forest-accent/90 transition-colors duration-300"
              >
                Request New Reset Link
              </Link>
              <Link
                href="/auth"
                className="block w-full py-3 px-4 border border-forest-accent text-forest-accent rounded-lg hover:bg-forest-accent/10 transition-colors duration-300"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-forest-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Reset Your Password
          </h2>
          {userInfo && (
            <p className="mt-2 text-center text-sm text-gray-400">
              Hello <span className="text-forest-accent">{userInfo.userName}</span>, 
              enter your new password below.
            </p>
          )}
        </div>

        {message ? (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-8 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Password Reset Successful!</h3>
            <p className="mb-4">{message}</p>
            <p className="text-sm text-gray-400">Redirecting to login page in 3 seconds...</p>
            <Link
              href="/auth"
              className="inline-block mt-4 py-2 px-4 bg-forest-accent text-forest-black rounded-lg hover:bg-forest-accent/90 transition-colors duration-300"
            >
              Go to Login Now
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-forest-lightGray placeholder-gray-500 text-white bg-forest-gray focus:outline-none focus:ring-forest-accent focus:border-forest-accent sm:text-sm"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-forest-lightGray placeholder-gray-500 text-white bg-forest-gray focus:outline-none focus:ring-forest-accent focus:border-forest-accent sm:text-sm"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
                {error}
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
                    Resetting Password...
                  </div>
                ) : (
                  'Reset Password'
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
        )}
      </div>
    </div>
  )
}
