'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const OrdersPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }
    fetchOrders()
  }, [user, router])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 bg-opacity-20 text-yellow-400'
      case 'processing': return 'bg-blue-500 bg-opacity-20 text-blue-400'
      case 'shipped': return 'bg-purple-500 bg-opacity-20 text-purple-400'
      case 'delivered': return 'bg-green-500 bg-opacity-20 text-green-400'
      case 'cancelled': return 'bg-red-500 bg-opacity-20 text-red-400'
      default: return 'bg-gray-500 bg-opacity-20 text-gray-400'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 bg-opacity-20 text-yellow-400'
      case 'paid': return 'bg-green-500 bg-opacity-20 text-green-400'
      case 'failed': return 'bg-red-500 bg-opacity-20 text-red-400'
      default: return 'bg-gray-500 bg-opacity-20 text-gray-400'
    }
  }

  const getPaymentMethodDisplay = (method) => {
    switch (method) {
      case 'cash_on_delivery': return '💵 Cash on Delivery'
      case 'vodafone_cash': return '📱 Vodafone Cash'
      case 'visa': return '💳 Visa Card'
      default: return method
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="loading-spinner"></div>
          <span className="text-gray-400">Loading orders...</span>
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
          className="max-w-6xl mx-auto"
        >
          <h1 className="font-forest text-4xl font-bold text-white mb-8 text-center">
            My Orders
          </h1>

          {orders.length === 0 ? (
            <div className="forest-card p-8 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-semibold text-white mb-4">No Orders Yet</h2>
              <p className="text-gray-400 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
              <button
                onClick={() => router.push('/shop')}
                className="forest-btn bg-forest-accent text-forest-black hover:bg-opacity-90"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="forest-card p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <p className="text-gray-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus || 'pending')}`}>
                        Payment: {(order.paymentStatus || 'pending').charAt(0).toUpperCase() + (order.paymentStatus || 'pending').slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-medium text-white mb-4">Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-3 bg-forest-gray bg-opacity-30 rounded-lg">
                            <div className="w-12 h-12 bg-forest-lightGray rounded-lg flex items-center justify-center">
                              <span className="text-forest-accent font-bold text-sm">{item.quantity}</span>
                            </div>
                            <div className="flex-1">
                              <h5 className="text-white font-medium">{item.name}</h5>
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
                    </div>

                    {/* Order Details */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-4">Order Details</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-forest-gray bg-opacity-30 rounded-lg">
                          <p className="text-gray-400 text-sm">Payment Method</p>
                          <p className="text-white font-medium">{getPaymentMethodDisplay(order.paymentMethod)}</p>
                        </div>
                        
                        <div className="p-3 bg-forest-gray bg-opacity-30 rounded-lg">
                          <p className="text-gray-400 text-sm">Total Amount</p>
                          <p className="text-forest-accent font-bold text-xl">${order.total.toFixed(2)}</p>
                        </div>

                        {order.shippingAddress && (
                          <div className="p-3 bg-forest-gray bg-opacity-30 rounded-lg">
                            <p className="text-gray-400 text-sm mb-2">Shipping Address</p>
                            <div className="text-white text-sm">
                              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                              <p>{order.shippingAddress.street}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                              <p>{order.shippingAddress.zipCode}</p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          </div>
                        )}

                        {order.notes && (
                          <div className="p-3 bg-forest-gray bg-opacity-30 rounded-lg">
                            <p className="text-gray-400 text-sm">Order Notes</p>
                            <p className="text-white text-sm">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default OrdersPage
