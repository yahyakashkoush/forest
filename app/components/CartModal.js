'use client'

import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const CartModal = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

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
      console.log('Profile not found or error:', error)
    }
  }

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return

    // Create WhatsApp message with customer info
    let message = `🌲 *Forest Fashion - طلب جديد من السلة*\n\n`

    // Add customer info if available
    if (user && userProfile) {
      message += `👤 *بيانات العميل:*\n`
      message += `الاسم: ${userProfile.firstName || ''} ${userProfile.lastName || ''}\n`
      message += `البريد الإلكتروني: ${userProfile.email || 'غير محدد'}\n`
      message += `الهاتف: ${userProfile.phone || 'غير محدد'}\n\n`

      message += `📍 *عنوان الشحن:*\n`
      if (userProfile.address) {
        message += `${userProfile.address.street || 'غير محدد'}\n`
        message += `${userProfile.address.city || 'غير محدد'}, ${userProfile.address.state || 'غير محدد'}\n`
        message += `${userProfile.address.zipCode || 'غير محدد'}\n`
        message += `${userProfile.address.country || 'غير محدد'}\n\n`
      } else {
        message += `غير محدد\n\n`
      }
    }

    // Add cart items
    message += `🛍️ *المنتجات المطلوبة:*\n`
    items.forEach(item => {
      message += `• ${item.name} (${item.size}, ${item.color}) - الكمية: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`
    })

    message += `\n💰 *المجموع الكلي: $${getCartTotal().toFixed(2)}*\n\n`
    message += `📦 *ملاحظات:*\n`
    message += `- يرجى تأكيد الطلب\n`
    message += `- سيتم التواصل معك لتأكيد التوصيل\n\n`
    message += `---\n`
    message += `تم إرسال هذا الطلب من موقع Forest Fashion`

    const phoneNumber = "201097767079";
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  }

  const handleCheckout = () => {
    if (items.length === 0) return

    if (!user) {
      router.push('/auth')
      return
    }

    onClose()
    router.push('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-forest-black bg-opacity-95 backdrop-blur-md border-l border-forest-lightGray shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-forest-lightGray">
                <h2 className="text-xl font-forest font-bold text-white">Your Cart</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center text-gray-400 mt-8">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <p>Your cart is empty</p>
                    <p className="text-sm mt-2">Start exploring our mysterious collection</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.size}-${item.color}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center space-x-4 bg-forest-gray bg-opacity-30 rounded-lg p-4"
                      >
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{item.name}</h3>
                          <p className="text-gray-400 text-sm">
                            {item.size} • {item.color}
                          </p>
                          <p className="text-forest-accent font-bold">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-forest-lightGray hover:bg-forest-accent text-white hover:text-forest-black transition-colors duration-300 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-white w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-forest-lightGray hover:bg-forest-accent text-white hover:text-forest-black transition-colors duration-300 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-forest-lightGray p-6 space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold text-white">
                    <span>Total:</span>
                    <span className="text-forest-accent">${getCartTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      className="w-full forest-btn bg-forest-accent text-forest-black hover:bg-opacity-90"
                    >
                      Place Order
                    </button>

                    <button
                      onClick={handleWhatsAppCheckout}
                      className="w-full forest-btn bg-green-600 text-white hover:bg-green-700"
                    >
                      Order via WhatsApp
                    </button>

                    <button
                      onClick={clearCart}
                      className="w-full px-4 py-2 text-red-400 hover:text-red-300 transition-colors duration-300 text-sm"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CartModal