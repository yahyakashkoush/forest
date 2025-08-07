'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'

const AdminDashboard = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({})
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [contacts, setContacts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    fullDescription: '',
    price: '',
    salePrice: '',
    category: '',
    subcategory: '',
    brand: 'FOREST',
    variants: [
      {
        color: '',
        colorCode: '#000000',
        sizes: [
          { size: 'S', quantity: 0, lowStockThreshold: 5 },
          { size: 'M', quantity: 0, lowStockThreshold: 5 },
          { size: 'L', quantity: 0, lowStockThreshold: 5 },
          { size: 'XL', quantity: 0, lowStockThreshold: 5 }
        ]
      }
    ],
    materials: '',
    care: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    tags: [],
    metaTitle: '',
    metaDescription: '',
    status: 'active',
    featured: false,
    isDigital: false
  })
  const [productImages, setProductImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/auth')
      return
    }

    if (user && user.role === 'admin') {
      fetchDashboardData()
    }
  }, [user, loading, router])

  useEffect(() => {
    // Check for tab parameter in URL
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'products', 'orders', 'contacts'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      }

      const [statsRes, productsRes, ordersRes, contactsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, config),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, config),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, config)
      ])

      setStats(statsRes.data)
      setProducts(productsRes.data)
      setOrders(ordersRes.data)
      setContacts(contactsRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactStatusUpdate = async (contactId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${contactId}/status`, {
        status: newStatus
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchDashboardData()
    } catch (error) {
      console.error('Error updating contact status:', error)
    }
  }

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      fullDescription: '',
      price: '',
      salePrice: '',
      category: '',
      subcategory: '',
      brand: 'FOREST',
      variants: [
        {
          color: '',
          colorCode: '#000000',
          sizes: [
            { size: 'S', quantity: 0, lowStockThreshold: 5 },
            { size: 'M', quantity: 0, lowStockThreshold: 5 },
            { size: 'L', quantity: 0, lowStockThreshold: 5 },
            { size: 'XL', quantity: 0, lowStockThreshold: 5 }
          ]
        }
      ],
      materials: '',
      care: '',
      weight: '',
      dimensions: {
        length: '',
        width: '',
        height: ''
      },
      tags: [],
      metaTitle: '',
      metaDescription: '',
      status: 'active',
      featured: false,
      isDigital: false
    })
    setProductImages([])
    setEditingProduct(null)
  }

  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSizeToggle = (size) => {
    setProductForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleColorToggle = (color) => {
    setProductForm(prev => ({
      ...prev,
      colors: prev.colors.includes(color) 
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setProductImages(files)
  }

  // Variant management functions
  const addVariant = () => {
    setProductForm(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: '',
          colorCode: '#000000',
          sizes: [
            { size: 'S', quantity: 0, lowStockThreshold: 5 },
            { size: 'M', quantity: 0, lowStockThreshold: 5 },
            { size: 'L', quantity: 0, lowStockThreshold: 5 },
            { size: 'XL', quantity: 0, lowStockThreshold: 5 }
          ]
        }
      ]
    }))
  }

  const removeVariant = (variantIndex) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants.filter((_, index) => index !== variantIndex)
    }))
  }

  const updateVariant = (variantIndex, field, value) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants.map((variant, index) =>
        index === variantIndex ? { ...variant, [field]: value } : variant
      )
    }))
  }

  const updateVariantSize = (variantIndex, sizeIndex, field, value) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) =>
        vIndex === variantIndex ? {
          ...variant,
          sizes: variant.sizes.map((size, sIndex) =>
            sIndex === sizeIndex ? { ...size, [field]: value } : size
          )
        } : variant
      )
    }))
  }

  const addSizeToVariant = (variantIndex) => {
    const newSize = prompt('Enter size name:')
    if (newSize) {
      setProductForm(prev => ({
        ...prev,
        variants: prev.variants.map((variant, index) =>
          index === variantIndex ? {
            ...variant,
            sizes: [...variant.sizes, { size: newSize, quantity: 0, lowStockThreshold: 5 }]
          } : variant
        )
      }))
    }
  }

  const removeSizeFromVariant = (variantIndex, sizeIndex) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) =>
        vIndex === variantIndex ? {
          ...variant,
          sizes: variant.sizes.filter((_, sIndex) => sIndex !== sizeIndex)
        } : variant
      )
    }))
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()

      // Add basic form fields
      const basicFields = ['name', 'description', 'fullDescription', 'price', 'salePrice',
                          'category', 'subcategory', 'brand', 'materials', 'care',
                          'weight', 'metaTitle', 'metaDescription', 'status', 'featured', 'isDigital']

      basicFields.forEach(key => {
        if (productForm[key] !== undefined && productForm[key] !== '') {
          formData.append(key, productForm[key])
        }
      })

      // Add complex fields as JSON strings
      formData.append('variants', JSON.stringify(productForm.variants))
      formData.append('dimensions', JSON.stringify(productForm.dimensions))
      formData.append('tags', productForm.tags.join(','))

      // Add images
      productImages.forEach(image => {
        formData.append('images', image)
      })

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }

      if (editingProduct) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingProduct._id}`, formData, config)
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, formData, config)
      }

      setShowProductForm(false)
      resetProductForm()
      fetchDashboardData()
      alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!')
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchDashboardData()
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error updating order status')
    }
  }

  const handlePaymentStatusUpdate = async (orderId, newPaymentStatus) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`,
        { paymentStatus: newPaymentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchDashboardData()
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('Error updating payment status')
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)

    // Convert old format to new format if needed
    let variants = []
    if (product.variants && product.variants.length > 0) {
      variants = product.variants
    } else if (product.colors && product.colors.length > 0) {
      // Convert old format to new format
      variants = product.colors.map(color => ({
        color: color,
        colorCode: '#000000',
        sizes: (product.sizes || ['S', 'M', 'L', 'XL']).map(size => ({
          size: size,
          quantity: 0,
          lowStockThreshold: 5
        }))
      }))
    } else {
      // Default variant if none exist
      variants = [{
        color: '',
        colorCode: '#000000',
        sizes: [
          { size: 'S', quantity: 0, lowStockThreshold: 5 },
          { size: 'M', quantity: 0, lowStockThreshold: 5 },
          { size: 'L', quantity: 0, lowStockThreshold: 5 },
          { size: 'XL', quantity: 0, lowStockThreshold: 5 }
        ]
      }]
    }

    setProductForm({
      name: product.name || '',
      description: product.description || '',
      fullDescription: product.fullDescription || '',
      price: product.price ? product.price.toString() : '',
      salePrice: product.salePrice ? product.salePrice.toString() : '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      brand: product.brand || 'FOREST',
      variants: variants,
      materials: product.materials || '',
      care: product.care || '',
      weight: product.weight ? product.weight.toString() : '',
      dimensions: product.dimensions || { length: '', width: '', height: '' },
      tags: product.tags || [],
      metaTitle: product.metaTitle || product.name || '',
      metaDescription: product.metaDescription || product.description || '',
      status: product.status || 'active',
      featured: product.featured || false,
      isDigital: product.isDigital || false
    })
    setShowProductForm(true)
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchDashboardData()
      alert('Product deleted successfully!')
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product. Please try again.')
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'products', name: 'Products', icon: '👕' },
    { id: 'orders', name: 'Orders', icon: '📦' },
    { id: 'contacts', name: 'Messages', icon: '💬' },
  ]

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const availableColors = ['Black', 'White', 'Gray', 'Brown', 'Green', 'Blue', 'Red', 'Navy']
  const categories = ['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Accessories']

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="font-forest text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome back, {user.name}. Manage your forest empire.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-forest-gray bg-opacity-30 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'bg-forest-accent text-forest-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Total Products', value: stats.totalProducts || 0, icon: '👕', color: 'bg-blue-500' },
                  { title: 'Total Orders', value: stats.totalOrders || 0, icon: '📦', color: 'bg-green-500' },
                  { title: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: 'bg-purple-500' },
                  { title: 'Revenue', value: `$${(stats.totalRevenue || 0).toFixed(2)}`, icon: '💰', color: 'bg-yellow-500' },
                ].map((stat, index) => (
                  <div key={index} className="forest-card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                        <span className="text-2xl">{stat.icon}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="forest-card p-6">
                <h3 className="font-forest text-xl font-semibold text-white mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-forest-lightGray">
                        <th className="pb-2 text-gray-400">Order ID</th>
                        <th className="pb-2 text-gray-400">Customer</th>
                        <th className="pb-2 text-gray-400">Total</th>
                        <th className="pb-2 text-gray-400">Status</th>
                        <th className="pb-2 text-gray-400">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats.recentOrders || []).slice(0, 5).map((order) => (
                        <tr key={order._id} className="border-b border-forest-lightGray border-opacity-30">
                          <td className="py-3 text-white">#{order._id.slice(-6)}</td>
                          <td className="py-3 text-gray-300">{order.user?.name || 'Guest'}</td>
                          <td className="py-3 text-forest-accent">${order.total.toFixed(2)}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'delivered' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                              order.status === 'shipped' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                              order.status === 'processing' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                              'bg-gray-500 bg-opacity-20 text-gray-400'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-forest text-2xl font-semibold text-white">Products</h3>
                <button 
                  onClick={() => {
                    resetProductForm()
                    setShowProductForm(true)
                  }}
                  className="forest-btn bg-forest-accent text-forest-black"
                >
                  Add New Product
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="forest-card p-6">
                    <div className="relative h-48 bg-gradient-to-b from-forest-gray to-forest-darkGreen rounded-lg mb-4 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-xs">No Image</p>
                          </div>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          product.status === 'inactive' ? 'bg-red-500/20 text-red-400' :
                          product.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {product.status?.toUpperCase() || 'ACTIVE'}
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {product.featured && (
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-forest-accent/20 text-forest-accent">
                            FEATURED
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">{product.name}</h4>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-400 text-sm">{product.category}</p>
                        {product.sku && (
                          <p className="text-gray-500 text-xs">SKU: {product.sku}</p>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-forest-accent font-bold">${product.price}</span>
                          {product.salePrice && (
                            <span className="text-red-400 font-bold">${product.salePrice}</span>
                          )}
                        </div>

                        {/* Total Stock */}
                        {product.variants && product.variants.length > 0 && (
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Total Stock</p>
                            <p className={`text-sm font-medium ${
                              (() => {
                                const totalStock = product.variants.reduce((total, variant) =>
                                  total + variant.sizes.reduce((sum, size) => sum + (size.quantity || 0), 0), 0
                                )
                                return totalStock > 10 ? 'text-green-400' :
                                       totalStock > 0 ? 'text-yellow-400' : 'text-red-400'
                              })()
                            }`}>
                              {product.variants.reduce((total, variant) =>
                                total + variant.sizes.reduce((sum, size) => sum + (size.quantity || 0), 0), 0
                              )}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Variants Summary */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400 mb-1">Colors: {product.variants.length}</p>
                          <div className="flex flex-wrap gap-1">
                            {product.variants.slice(0, 4).map((variant, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-gray-600"
                                style={{ backgroundColor: variant.colorCode || '#000' }}
                                title={variant.color}
                              ></div>
                            ))}
                            {product.variants.length > 4 && (
                              <span className="text-xs text-gray-400">+{product.variants.length - 4}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 px-3 py-2 bg-forest-accent bg-opacity-20 text-forest-accent rounded-lg hover:bg-opacity-30 transition-colors duration-300 text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product._id)}
                        className="flex-1 px-3 py-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-colors duration-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="font-forest text-2xl font-semibold text-white">Orders</h3>

              <div className="forest-card p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-forest-lightGray">
                        <th className="pb-3 text-gray-400">Order ID</th>
                        <th className="pb-3 text-gray-400">Customer</th>
                        <th className="pb-3 text-gray-400">Items</th>
                        <th className="pb-3 text-gray-400">Total</th>
                        <th className="pb-3 text-gray-400">Payment</th>
                        <th className="pb-3 text-gray-400">Status</th>
                        <th className="pb-3 text-gray-400">Date</th>
                        <th className="pb-3 text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b border-forest-lightGray border-opacity-30">
                          <td className="py-4 text-white">#{order._id.slice(-6)}</td>
                          <td className="py-4 text-gray-300">{order.user?.name || 'Guest'}</td>
                          <td className="py-4 text-gray-300">{order.items.length} items</td>
                          <td className="py-4 text-forest-accent">${order.total.toFixed(2)}</td>
                          <td className="py-4">
                            <div className="space-y-1">
                              <div className="text-xs text-gray-400">
                                {order.paymentMethod === 'cash_on_delivery' ? '💵 COD' :
                                 order.paymentMethod === 'vodafone_cash' ? '📱 Vodafone' :
                                 order.paymentMethod === 'visa' ? '💳 Visa' : order.paymentMethod}
                              </div>
                              <select
                                value={order.paymentStatus || 'pending'}
                                onChange={(e) => handlePaymentStatusUpdate(order._id, e.target.value)}
                                className="px-2 py-1 bg-forest-gray border border-forest-lightGray rounded text-white text-xs w-full"
                              >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                              </select>
                            </div>
                          </td>
                          <td className="py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                              className="px-2 py-1 bg-forest-gray border border-forest-lightGray rounded text-white text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4 text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-forest-accent hover:text-white transition-colors duration-300 text-sm"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <h3 className="font-forest text-2xl font-semibold text-white">Contact Messages</h3>

              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact._id} className="forest-card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-white">{contact.name}</h4>
                        <p className="text-gray-400 text-sm">{contact.email}</p>
                        <p className="text-forest-accent text-sm">{contact.subject}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={contact.status}
                          onChange={(e) => handleContactStatusUpdate(contact._id, e.target.value)}
                          className="px-2 py-1 bg-forest-gray border border-forest-lightGray rounded text-white text-sm"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                        <span className="text-gray-400 text-sm">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{contact.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Product Form Modal */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-forest-darkGreen rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-forest text-2xl font-semibold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setShowProductForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-4">
                {/* Basic Information */}
                <div className="bg-forest-gray/30 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={productForm.name}
                        onChange={handleProductFormChange}
                        required
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={productForm.brand}
                        onChange={handleProductFormChange}
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Regular Price *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={productForm.price}
                        onChange={handleProductFormChange}
                        required
                        step="0.01"
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Sale Price
                      </label>
                      <input
                        type="number"
                        name="salePrice"
                        value={productForm.salePrice}
                        onChange={handleProductFormChange}
                        step="0.01"
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={productForm.category}
                        onChange={handleProductFormChange}
                        required
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      >
                        <option value="">Select Category</option>
                        <option value="Hoodies">Hoodies</option>
                        <option value="T-Shirts">T-Shirts</option>
                        <option value="Jackets">Jackets</option>
                        <option value="Pants">Pants</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        name="subcategory"
                        value={productForm.subcategory}
                        onChange={handleProductFormChange}
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Weight (grams)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={productForm.weight}
                        onChange={handleProductFormChange}
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={productForm.status}
                        onChange={handleProductFormChange}
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                        <option value="discontinued">Discontinued</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Short Description *
                    </label>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleProductFormChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Full Description
                    </label>
                    <textarea
                      name="fullDescription"
                      value={productForm.fullDescription}
                      onChange={handleProductFormChange}
                      rows="5"
                      className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                    />
                  </div>
                </div>

                {/* Variants Management - Colors and Sizes with Stock */}
                <div className="bg-forest-gray/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-white">Variants & Inventory</h4>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="px-3 py-1 bg-forest-accent text-forest-black rounded-lg text-sm hover:bg-forest-accent/80 transition-colors"
                    >
                      Add Color Variant
                    </button>
                  </div>

                  {(productForm.variants || []).map((variant, variantIndex) => (
                    <div key={variantIndex} className="border border-forest-lightGray rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="text-white font-medium">Color Variant {variantIndex + 1}</h5>
                        {productForm.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(variantIndex)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            Color Name *
                          </label>
                          <input
                            type="text"
                            value={variant.color}
                            onChange={(e) => updateVariant(variantIndex, 'color', e.target.value)}
                            placeholder="e.g., Black, White, Navy"
                            className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            Color Code
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={variant.colorCode}
                              onChange={(e) => updateVariant(variantIndex, 'colorCode', e.target.value)}
                              className="w-12 h-10 rounded border border-forest-lightGray"
                            />
                            <input
                              type="text"
                              value={variant.colorCode}
                              onChange={(e) => updateVariant(variantIndex, 'colorCode', e.target.value)}
                              placeholder="#000000"
                              className="flex-1 px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sizes and Stock for this color */}
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-gray-300 text-sm font-medium">
                            Sizes & Stock
                          </label>
                          <button
                            type="button"
                            onClick={() => addSizeToVariant(variantIndex)}
                            className="px-2 py-1 bg-forest-accent/20 text-forest-accent rounded text-xs hover:bg-forest-accent/30 transition-colors"
                          >
                            Add Size
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                          {variant.sizes.map((size, sizeIndex) => (
                            <div key={sizeIndex} className="bg-forest-gray/50 p-3 rounded border">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-white font-medium">{size.size}</span>
                                {variant.sizes.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSizeFromVariant(variantIndex, sizeIndex)}
                                    className="text-red-400 hover:text-red-300 text-xs"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>

                              <div className="space-y-2">
                                <div>
                                  <label className="block text-gray-400 text-xs mb-1">Quantity</label>
                                  <input
                                    type="number"
                                    value={size.quantity}
                                    onChange={(e) => updateVariantSize(variantIndex, sizeIndex, 'quantity', parseInt(e.target.value) || 0)}
                                    min="0"
                                    className="w-full px-2 py-1 bg-forest-gray border border-forest-lightGray rounded text-white text-sm focus:outline-none focus:border-forest-accent"
                                  />
                                </div>

                                <div>
                                  <label className="block text-gray-400 text-xs mb-1">Low Stock Alert</label>
                                  <input
                                    type="number"
                                    value={size.lowStockThreshold}
                                    onChange={(e) => updateVariantSize(variantIndex, sizeIndex, 'lowStockThreshold', parseInt(e.target.value) || 0)}
                                    min="0"
                                    className="w-full px-2 py-1 bg-forest-gray border border-forest-lightGray rounded text-white text-sm focus:outline-none focus:border-forest-accent"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Product Images */}
                <div className="bg-forest-gray/30 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4">Product Images</h4>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Upload Images (Max 10 images)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      First image will be the primary image. Recommended size: 800x800px
                    </p>

                    {productImages.length > 0 && (
                      <div className="mt-3">
                        <p className="text-gray-300 text-sm mb-2">Selected Images: {productImages.length}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Array.from(productImages).map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded border border-forest-lightGray"
                              />
                              {index === 0 && (
                                <span className="absolute top-1 left-1 bg-forest-accent text-forest-black text-xs px-1 rounded">
                                  Primary
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-forest-gray/30 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4">Additional Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Materials
                      </label>
                      <textarea
                        name="materials"
                        value={productForm.materials}
                        onChange={handleProductFormChange}
                        rows="3"
                        placeholder="e.g., 100% Cotton, Organic Materials"
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Care Instructions
                      </label>
                      <textarea
                        name="care"
                        value={productForm.care}
                        onChange={handleProductFormChange}
                        rows="3"
                        placeholder="e.g., Machine wash cold, Tumble dry low"
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={productForm.tags.join(', ')}
                      onChange={(e) => setProductForm(prev => ({
                        ...prev,
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      }))}
                      placeholder="e.g., streetwear, urban, dark, gothic"
                      className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        value={productForm.dimensions.length}
                        onChange={(e) => setProductForm(prev => ({
                          ...prev,
                          dimensions: { ...prev.dimensions, length: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Width (cm)
                      </label>
                      <input
                        type="number"
                        value={productForm.dimensions.width}
                        onChange={(e) => setProductForm(prev => ({
                          ...prev,
                          dimensions: { ...prev.dimensions, width: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        value={productForm.dimensions.height}
                        onChange={(e) => setProductForm(prev => ({
                          ...prev,
                          dimensions: { ...prev.dimensions, height: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO & Marketing */}
                <div className="bg-forest-gray/30 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4">SEO & Marketing</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        name="metaTitle"
                        value={productForm.metaTitle}
                        onChange={handleProductFormChange}
                        placeholder="SEO title for search engines"
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Meta Description
                      </label>
                      <textarea
                        name="metaDescription"
                        value={productForm.metaDescription}
                        onChange={handleProductFormChange}
                        rows="3"
                        placeholder="SEO description for search engines (max 160 characters)"
                        className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                      />
                    </div>

                    <div className="flex items-center space-x-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={productForm.featured}
                          onChange={handleProductFormChange}
                          className="mr-2"
                        />
                        <span className="text-gray-300">Featured Product</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isDigital"
                          checked={productForm.isDigital}
                          onChange={handleProductFormChange}
                          className="mr-2"
                        />
                        <span className="text-gray-300">Digital Product</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-forest-accent text-forest-black rounded-lg hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard