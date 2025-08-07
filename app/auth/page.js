'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { login, register } = useAuth()
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required'
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      let result
      if (isLogin) {
        result = await login(formData.email, formData.password)
      } else {
        result = await register(formData.name, formData.email, formData.password)
      }

      if (result.success) {
        router.push('/')
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setErrors({})
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="forest-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <svg width="60" height="60" viewBox="0 0 60 60" className="text-forest-accent mx-auto">
                <path
                  d="M30 3L27 12L18 9L21 18L12 15L15 24L6 21L9 30L3 27L12 33L9 42L18 39L15 48L24 45L21 54L30 51L27 57L33 48L42 51L39 42L48 45L45 36L54 39L51 30L57 33L48 27L51 18L42 21L45 12L36 15L39 6L30 9L33 3L30 3Z"
                  fill="currentColor"
                  className="animate-sway"
                />
              </svg>
              <div className="absolute inset-0 bg-forest-accent opacity-20 blur-md animate-pulse"></div>
            </div>
            <h1 className="font-forest text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Forest'}
            </h1>
            <p className="text-gray-400">
              {isLogin 
                ? 'Enter the shadows once more' 
                : 'Begin your journey into darkness'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400 text-sm">
                {errors.general}
              </div>
            )}

            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-white font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-forest-gray bg-opacity-50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                    errors.name ? 'border-red-500' : 'border-forest-lightGray focus:border-forest-accent'
                  }`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-red-400 text-sm">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-white font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-forest-gray bg-opacity-50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                  errors.email ? 'border-red-500' : 'border-forest-lightGray focus:border-forest-accent'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-red-400 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-white font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-forest-gray bg-opacity-50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                  errors.password ? 'border-red-500' : 'border-forest-lightGray focus:border-forest-accent'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-red-400 text-sm">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-forest-gray bg-opacity-50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-forest-lightGray focus:border-forest-accent'
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-red-400 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full forest-btn bg-forest-accent text-forest-black hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-forest-black border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={toggleMode}
              className="mt-2 text-forest-accent hover:text-white transition-colors duration-300 font-medium"
            >
              {isLogin ? 'Create one here' : 'Sign in instead'}
            </button>
          </div>

          {/* Forgot Password */}
          {isLogin && (
            <div className="mt-4 text-center">
              <Link
                href="/forget-password"
                className="text-gray-400 hover:text-forest-accent transition-colors duration-300 text-sm"
              >
                Forgot your password?
              </Link>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            By {isLogin ? 'signing in' : 'creating an account'}, you agree to our{' '}
            <a href="#" className="text-forest-accent hover:text-white transition-colors duration-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-forest-accent hover:text-white transition-colors duration-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default AuthPage