'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { useCart } from '../../context/CartContext'

const ProductDetailPage = () => {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      console.log('Fetching product with ID:', params.id)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`)
      console.log('Product fetched:', response.data)
      
      const productData = response.data
      setProduct(productData)
      
      // Set default selections
      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0])
      }
      if (productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color')
      return
    }

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : null,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    })

    // Show success message
    alert('Added to cart!')
  }

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color')
      return
    }

    // Create WhatsApp message
    const message = `Hello! I'd like to purchase:\n\n${product.name}\nSize: ${selectedSize}\nColor: ${selectedColor}\nQuantity: ${quantity}\nPrice: $${(product.price * quantity).toFixed(2)}`
    
    const whatsappUrl = `https://wa.me/201097767079?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
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
                    src={product.images[activeImageIndex]} 
                    alt={product.name}
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
                        src={image} 
                        alt={`${product.name} ${index + 1}`}
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

            <div className="text-3xl font-bold text-forest-accent">
              ${product.price}
            </div>

            <p className="text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
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

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-white font-medium mb-3">Color</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
                        selectedColor === color
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

            {/* Quantity */}
            <div>
              <label className="block text-white font-medium mb-3">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-forest-lightGray hover:bg-forest-accent text-white hover:text-forest-black transition-colors duration-300 flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-white text-lg w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-forest-lightGray hover:bg-forest-accent text-white hover:text-forest-black transition-colors duration-300 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full forest-btn bg-transparent border-2 border-forest-accent text-forest-accent hover:bg-forest-accent hover:text-forest-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full forest-btn bg-forest-accent text-forest-black hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now via WhatsApp
              </button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-300">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
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