'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const ProfilePage = () => {
  const router = useRouter()
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [user, setUser] = useState(null)

  // Check authentication and load profile data
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth')
        return
      }

      try {
        // Get user info
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!userResponse.ok) {
          localStorage.removeItem('token')
          router.push('/auth')
          return
        }

        const userData = await userResponse.json()
        setUser(userData.user)

        // Try to get existing profile
        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setProfileData({
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            email: profileData.email || userData.user.email,
            phone: profileData.phone || '',
            address: {
              street: profileData.address?.street || '',
              city: profileData.address?.city || '',
              state: profileData.address?.state || '',
              zipCode: profileData.address?.zipCode || '',
              country: profileData.address?.country || ''
            }
          })
        } else {
          // No profile exists, set email from user data
          setProfileData(prev => ({
            ...prev,
            email: userData.user.email
          }))
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setProfileData({
        ...profileData,
        address: {
          ...profileData.address,
          [addressField]: value
        }
      })
    } else {
      setProfileData({
        ...profileData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('Please log in first')
        router.push('/auth')
        return
      }

      console.log('Submitting profile data:', profileData)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })

      const responseData = await response.json()
      console.log('Server response:', responseData)

      if (response.ok) {
        setSubmitStatus('success')
      } else {
        console.error('Profile update error:', responseData)
        alert(`Error: ${responseData.message || 'Failed to update profile'}`)
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      alert(`Network error: ${error.message}`)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-forest-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-darkGreen to-forest-black opacity-80"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="font-forest text-5xl md:text-7xl font-bold text-white mb-6">
              Your Profile
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Update your information to enhance your forest journey
            </p>
            {user && (
              <p className="text-lg text-forest-accent mt-4">
                Welcome back, {user.name}!
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="forest-card p-8">
            <h2 className="font-forest text-3xl font-bold text-white mb-6">
              Personal Information
            </h2>
            <p className="text-gray-400 mb-8">
              Keep your profile updated so we can provide you with the best service and 
              ensure smooth delivery of your forest treasures.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Details */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-white font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-forest-gray bg-opacity-50 border border-forest-lightGray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-forest-accent transition-colors duration-300"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-white font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-forest-gray bg-opacity-50 border border-forest-lightGray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-forest-accent transition-colors duration-300"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-white font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-forest-gray bg-opacity-50 border border-forest-lightGray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-forest-accent transition-colors duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-white font-medium mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-forest-gray bg-opacity-50 border border-forest-lightGray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-forest-accent transition-colors duration-300"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Shipping Address</h3>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="address.street" className="block text-white font-medium mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="address.street"
                      name="address.street"
                      value={profileData.address.street}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-forest-gray bg-opacity-50 border border-forest-lightGray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-forest-accent transition-colors duration-300"
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="address.city" className="block text-white font-medium mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="address.city"
                        name="address.city"
                        value={profileData.address.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-forest-gray bg-opacity-50 border border-forest-lightGray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-forest-accent transition-colors duration-300"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label htmlFor="address.state" className="block text-white font-medium mb-2">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        id="address.state"
                        name="address.state"
                        value={profileData.address.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-forest-gray bg-opacity-50 border border-forest-lightGray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-forest-accent transition-colors duration-300"
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="address.zipCode" className="block text-white font-medium mb-2">
                        ZIP/Postal Code *
                      </label>
                      <input
                        type="text"
                        id="address.zipCode"
                        name="address.zipCode"
                        value={profileData.address.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-forest-gray bg-opacity-50 border border-forest-lightGray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-forest-accent transition-colors duration-300"
                        placeholder="10001"
                      />
                    </div>
                    <div>
                      <label htmlFor="address.country" className="block text-white font-medium mb-2">
                        Country *
                      </label>
                      <select
                        id="address.country"
                        name="address.country"
                        value={profileData.address.country}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-forest-gray bg-opacity-50 border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent transition-colors duration-300"
                      >
                        <option value="">Select Country</option>
                        <option value="EG">Egypt</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="IT">Italy</option>
                        <option value="ES">Spain</option>
                        <option value="NL">Netherlands</option>
                        <option value="BE">Belgium</option>
                        <option value="CH">Switzerland</option>
                        <option value="AT">Austria</option>
                        <option value="SE">Sweden</option>
                        <option value="NO">Norway</option>
                        <option value="DK">Denmark</option>
                        <option value="FI">Finland</option>
                        <option value="JP">Japan</option>
                        <option value="KR">South Korea</option>
                        <option value="SG">Singapore</option>
                        <option value="HK">Hong Kong</option>
                        <option value="NZ">New Zealand</option>
                        <option value="SA">Saudi Arabia</option>
                        <option value="AE">UAE</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full forest-btn bg-forest-accent text-forest-black hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-forest-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating Profile...</span>
                    </div>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-400">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Profile updated successfully! Your information has been saved to the database.</span>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Sorry, there was an error updating your profile. Please try again.</span>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Additional Information Card */}
          <div className="mt-8 forest-card p-8">
            <h3 className="font-forest text-2xl font-bold text-white mb-4">
              Why We Need This Information
            </h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-forest-accent bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-forest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p><strong className="text-white">Shipping:</strong> We need your address to deliver your forest treasures safely to your doorstep.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-forest-accent bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-forest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p><strong className="text-white">Communication:</strong> Your phone and email help us keep you updated on orders and special offers.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-forest-accent bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-forest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p><strong className="text-white">Security:</strong> Your information is encrypted and stored securely in our database.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-forest-accent bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-forest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p><strong className="text-white">WhatsApp Orders:</strong> Your profile data will be automatically included when you order via WhatsApp.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage