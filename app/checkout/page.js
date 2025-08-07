'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const CheckoutPage = () => {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  
  const [userProfile, setUserProfile] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }

    if (items.length === 0) {
      router.push('/shop')
      return
    }

    fetchUserProfile()
  }, [user, items, router])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUserProfile(response.data)
      }
    } catch (error) {
      console.error('Profile not found:', error)
      alert('Please complete your profile first')
      router.push('/profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    
    if (!userProfile) {
      alert('Please complete your profile first')
      router.push('/profile')
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const orderData = {
        items: items.map(item => ({
          product: item.id,
          name: item.name,
          price: item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity
        })),
        total: getCartTotal(),
        shippingAddress: {
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          email: userProfile.email,
          phone: userProfile.phone,
          street: userProfile.address?.street,
          city: userProfile.address?.city,
          state: userProfile.address?.state,
          zipCode: userProfile.address?.zipCode,
          country: userProfile.address?.country
        },
        paymentMethod,
        notes
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (response.status === 201) {
        clearCart()
        alert('Order placed successfully!')
        router.push('/orders')
      }
    } catch (error) {
      console.error('Order submission error:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="loading-spinner"></div>
          <span className="text-gray-400">Loading checkout...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-forest text-4xl font-bold text-white mb-8 text-center">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="forest-card p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-forest-gray bg-opacity-30 rounded-lg">
                    <div className="w-16 h-16 bg-forest-lightGray rounded-lg flex items-center justify-center">
                      <span className="text-forest-accent font-bold">{item.quantity}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-gray-400 text-sm">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-forest-accent font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-forest-lightGray pt-4">
                <div className="flex justify-between items-center text-xl font-bold text-white">
                  <span>Total:</span>
                  <span className="text-forest-accent">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="forest-card p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Payment & Shipping</h2>
              
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                {/* Shipping Address Display */}
                {userProfile && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Shipping Address</h3>
                    <div className="bg-forest-gray bg-opacity-30 p-4 rounded-lg text-gray-300">
                      <p>{userProfile.firstName} {userProfile.lastName}</p>
                      <p>{userProfile.email}</p>
                      <p>{userProfile.phone}</p>
                      {userProfile.address && (
                        <>
                          <p>{userProfile.address.street}</p>
                          <p>{userProfile.address.city}, {userProfile.address.state}</p>
                          <p>{userProfile.address.zipCode}</p>
                          <p>{userProfile.address.country}</p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-4 bg-forest-gray bg-opacity-30 rounded-lg cursor-pointer hover:bg-opacity-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-forest-accent"
                      />
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💵</span>
                        <div>
                          <p className="text-white font-medium">Cash on Delivery</p>
                          <p className="text-gray-400 text-sm">Pay when you receive your order</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-4 bg-forest-gray bg-opacity-30 rounded-lg cursor-pointer hover:bg-opacity-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="vodafone_cash"
                        checked={paymentMethod === 'vodafone_cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-forest-accent"
                      />
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📱</span>
                        <div>
                          <p className="text-white font-medium">Vodafone Cash</p>
                          <p className="text-gray-400 text-sm">Pay via Vodafone Cash</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-4 bg-forest-gray bg-opacity-30 rounded-lg cursor-pointer hover:bg-opacity-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="visa"
                        checked={paymentMethod === 'visa'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-forest-accent"
                      />
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💳</span>
                        <div>
                          <p className="text-white font-medium">Visa Card</p>
                          <p className="text-gray-400 text-sm">Pay with your Visa card</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <label htmlFor="notes" className="block text-white font-medium mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-forest-gray bg-opacity-50 border border-forest-lightGray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-forest-accent transition-colors duration-300"
                    placeholder="Any special instructions for your order..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full forest-btn bg-forest-accent text-forest-black hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-forest-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <span className="text-lg">🛍️</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CheckoutPage
