'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const ProductDetailPage = () => {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [availableStock, setAvailableStock] = useState(0)
  const [userProfile, setUserProfile] = useState(null)
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    fetchProduct()
  }, [params.id])

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

  const fetchProduct = async () => {
    try {
      console.log('Fetching product with ID:', params.id)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`)
      console.log('Product fetched:', response.data)
      
      const productData = response.data
      setProduct(productData)

      // Set default selections for new variant system
      if (productData.variants && productData.variants.length > 0) {
        const firstVariant = productData.variants[0]
        setSelectedVariant(firstVariant)

        if (firstVariant.sizes && firstVariant.sizes.length > 0) {
          const firstSize = firstVariant.sizes[0]
          setSelectedSize(firstSize.size)
          setAvailableStock(firstSize.quantity - (firstSize.reserved || 0))
        }
      } else {
        // Fallback for old format
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0])
        }
        setAvailableStock(productData.inStock ? 999 : 0)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  // Handle variant selection
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant)
    if (variant.sizes && variant.sizes.length > 0) {
      const firstSize = variant.sizes[0]
      setSelectedSize(firstSize.size)
      setAvailableStock(firstSize.quantity - (firstSize.reserved || 0))
    }
  }

  // Handle size selection
  const handleSizeChange = (size) => {
    setSelectedSize(size)
    if (selectedVariant) {
      const sizeData = selectedVariant.sizes.find(s => s.size === size)
      if (sizeData) {
        setAvailableStock(sizeData.quantity - (sizeData.reserved || 0))
      }
    }
    // Reset quantity if it exceeds available stock
    if (quantity > availableStock) {
      setQuantity(1)
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedVariant) {
      alert('Please select size and color')
      return
    }

    if (availableStock < quantity) {
      alert('Not enough stock available')
      return
    }

    const imageUrl = product.images && product.images.length > 0 ?
      (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url) : null

    addToCart({
      id: product._id,
      name: product.name,
      price: product.salePrice || product.price,
      image: imageUrl,
      size: selectedSize,
      color: selectedVariant.color,
      quantity: quantity
    })

    // Show success message
    alert('Added to cart!')
  }

  const handleBuyNow = () => {
    if (!selectedSize || !selectedVariant) {
      alert('Please select size and color')
      return
    }

    if (availableStock < quantity) {
      alert('Not enough stock available')
      return
    }

    // Create WhatsApp message with customer info if available
    let message = `🌲 *Forest Fashion - طلب جديد*\n\n`

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

    // Add product info
    message += `🛍️ *تفاصيل المنتج:*\n`
    message += `المنتج: ${product.name}\n`
    message += `المقاس: ${selectedSize}\n`
    message += `اللون: ${selectedVariant?.color || 'غير محدد'}\n`
    message += `الكمية: ${quantity}\n`
    message += `السعر: $${((product.salePrice || product.price) * quantity).toFixed(2)}\n\n`

    message += `📦 *ملاحظات:*\n`
    message += `- يرجى تأكيد الطلب\n`
    message += `- سيتم التواصل معك لتأكيد التوصيل\n\n`
    message += `---\n`
    message += `تم إرسال هذا الطلب من موقع Forest Fashion`

    const phoneNumber = "201097767079";
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="loading-spinner"></div>
          <span className="text-gray-400">Loading product...</span>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/shop" className="forest-btn">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-forest-accent">Home</Link></li>
            <li>/</li>
            <li><Link href="/shop" className="hover:text-forest-accent">Shop</Link></li>
            <li>/</li>
            <li className="text-white">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={typeof product.images[activeImageIndex] === 'string' ?
                         product.images[activeImageIndex] :
                         product.images[activeImageIndex]?.url}
                    alt={typeof product.images[activeImageIndex] === 'string' ?
                         product.name :
                         product.images[activeImageIndex]?.alt || product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div 
                  className={`w-full h-full bg-gradient-to-b from-forest-gray to-forest-darkGreen flex items-center justify-center ${
                    product.images && product.images.length > 0 ? 'hidden' : 'flex'
                  }`}
                >
                  <div className="text-center text-gray-400">
                    <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No Image Available</p>
                  </div>
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-300 ${
                        activeImageIndex === index ? 'border-forest-accent' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={typeof image === 'string' ? image : image?.url}
                        alt={typeof image === 'string' ? `${product.name} ${index + 1}` : image?.alt || `${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-b from-forest-gray to-forest-darkGreen hidden items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div>
              <h1 className="font-forest text-3xl lg:text-4xl font-bold text-white mb-2">
                {product.name}
              </h1>
              <p className="text-gray-400">{product.category}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-forest-accent">
                ${product.salePrice || product.price}
              </div>
              {product.salePrice && (
                <div className="text-xl text-gray-400 line-through">
                  ${product.price}
                </div>
              )}
            </div>

            <p className="text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* Enhanced Color Selection */}
            {product.variants && product.variants.length > 0 ? (
              <div>
                <label className="block text-white font-medium mb-3">
                  Color ({product.variants.length} available)
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => handleVariantChange(variant)}
                      className={`relative flex items-center space-x-3 px-4 py-3 border rounded-lg transition-all duration-300 ${
                        selectedVariant === variant
                          ? 'border-forest-accent bg-forest-accent/10 text-white'
                          : 'border-forest-lightGray text-gray-300 hover:border-forest-accent hover:text-white'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white/30"
                        style={{ backgroundColor: variant.colorCode || '#000' }}
                      ></div>
                      <span className="font-medium">{variant.color}</span>
                      {selectedVariant === variant && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-forest-accent rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Fallback for old format products */
              <div className="space-y-6">
                {/* Old Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="block text-white font-medium mb-3">Color</label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedVariant({ color: color, colorCode: '#000' })}
                          className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
                            selectedVariant?.color === color
                              ? 'border-forest-accent bg-forest-accent text-forest-black'
                              : 'border-forest-lightGray text-white hover:border-forest-accent'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Old Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <label className="block text-white font-medium mb-3">Size</label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
                            selectedSize === size
                              ? 'border-forest-accent bg-forest-accent text-forest-black'
                              : 'border-forest-lightGray text-white hover:border-forest-accent'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Size Selection */}
            {selectedVariant && selectedVariant.sizes && selectedVariant.sizes.length > 0 && (
              <div>
                <label className="block text-white font-medium mb-3">
                  Size ({selectedVariant.sizes.length} available)
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedVariant.sizes.map((sizeData) => {
                    const availableQty = sizeData.quantity - (sizeData.reserved || 0)
                    const isOutOfStock = availableQty <= 0
                    const isLowStock = availableQty <= sizeData.lowStockThreshold

                    return (
                      <button
                        key={sizeData.size}
                        onClick={() => !isOutOfStock && handleSizeChange(sizeData.size)}
                        disabled={isOutOfStock}
                        className={`relative px-4 py-2 border rounded-lg transition-colors duration-300 ${
                          selectedSize === sizeData.size
                            ? 'border-forest-accent bg-forest-accent text-forest-black'
                            : isOutOfStock
                            ? 'border-gray-600 text-gray-500 cursor-not-allowed bg-gray-800'
                            : 'border-forest-lightGray text-white hover:border-forest-accent'
                        }`}
                      >
                        {sizeData.size}
                        {isOutOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-red-500 transform rotate-45"></div>
                          </div>
                        )}
                        {!isOutOfStock && isLowStock && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Stock Information */}
                {selectedSize && selectedVariant && (
                  <div className="mt-2 text-sm">
                    {(() => {
                      const sizeData = selectedVariant.sizes.find(s => s.size === selectedSize)
                      if (!sizeData) return null
                      const availableQty = sizeData.quantity - (sizeData.reserved || 0)

                      if (availableQty <= 0) {
                        return <span className="text-red-400">Out of stock</span>
                      } else if (availableQty <= sizeData.lowStockThreshold) {
                        return <span className="text-yellow-400">Only {availableQty} left in stock</span>
                      } else {
                        return <span className="text-green-400">{availableQty} in stock</span>
                      }
                    })()}
                  </div>
                )}
              </div>
            )}
            {/* Quantity */}
            <div>
              <label className="block text-white font-medium mb-3">
                Quantity {availableStock > 0 && `(${availableStock} available)`}
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-full bg-forest-lightGray hover:bg-forest-accent text-white hover:text-forest-black transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="text-white text-lg w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  disabled={quantity >= availableStock}
                  className="w-10 h-10 rounded-full bg-forest-lightGray hover:bg-forest-accent text-white hover:text-forest-black transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={availableStock <= 0 || !selectedVariant || !selectedSize}
                className="w-full forest-btn bg-transparent border-2 border-forest-accent text-forest-accent hover:bg-forest-accent hover:text-forest-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {availableStock <= 0 ? 'OUT OF STOCK' :
                 !selectedVariant ? 'Select Color' :
                 !selectedSize ? 'Select Size' : 'Add to Cart'}
              </button>
              {availableStock > 0 && selectedVariant && selectedSize && (
                <button
                  onClick={handleBuyNow}
                  disabled={availableStock <= 0 || !selectedVariant || !selectedSize}
                  className="w-full forest-btn bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                  </svg>
                  <span>ORDER VIA WHATSAPP</span>
                </button>
              )}
            </div>

            {/* Enhanced Stock Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  availableStock <= 0 ? 'bg-red-500' :
                  availableStock <= 5 ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className="text-gray-300">
                  {availableStock <= 0 ? 'Out of Stock' :
                   availableStock <= 5 ? `Low Stock (${availableStock} left)` : 'In Stock'}
                </span>
              </div>

              {/* Total Stock Info */}
              {product.variants && (
                <div className="text-sm text-gray-400">
                  Total: {product.variants.reduce((total, variant) =>
                    total + variant.sizes.reduce((sum, size) => sum + (size.quantity || 0), 0), 0
                  )} items
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16"
        >
          <div className="forest-card p-8">
            <div className="space-y-8">
              <div>
                <h3 className="font-forest text-2xl font-semibold text-white mb-4">Description</h3>
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {product.fullDescription || product.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {product.materials && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Materials</h4>
                    <p className="text-gray-300">{product.materials}</p>
                  </div>
                )}
                {product.care && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Care Instructions</h4>
                    <p className="text-gray-300">{product.care}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16"
        >
          <h3 className="font-forest text-3xl font-semibold text-white mb-8 text-center">
            You Might Also Like
          </h3>
          <div className="text-center">
            <Link href="/shop" className="forest-btn">
              Explore More Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetailPage