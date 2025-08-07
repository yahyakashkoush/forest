'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
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

  // Mock product data - in production, this would come from your API
  const mockProducts = {
    1: {
      id: 1,
      name: "Shadow Walker Coat",
      price: 299.99,
      category: "outerwear",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Dark Green", "Brown"],
      images: ["/products/coat1.jpg", "/products/coat2.jpg", "/products/coat3.jpg"],
      description: "A mysterious long coat that flows like shadows in the wind. Crafted from premium materials with attention to every dark detail.",
      fullDescription: `The Shadow Walker Coat is more than just outerwear—it's a statement piece for those who embrace the darkness. Made from high-quality materials that provide both comfort and durability, this coat features:

• Water-resistant fabric perfect for misty forest walks
• Deep pockets for storing your mysterious treasures  
• Adjustable hood with subtle gothic detailing
• Flowing silhouette that moves like shadows
• Premium lining for ultimate comfort

Each coat is carefully crafted to embody the essence of the dark forest, making you feel like a guardian of ancient secrets.`,
      care: "Machine wash cold, hang dry, do not bleach",
      materials: "65% Cotton, 30% Polyester, 5% Elastane",
      inStock: true
    },
    2: {
      id: 2,
      name: "Midnight Forest Dress",
      price: 199.99,
      category: "dresses",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Dark Green"],
      images: ["/products/dress1.jpg", "/products/dress2.jpg"],
      description: "Elegant dress inspired by moonlit forest paths",
      fullDescription: `Flow through the night like mist through ancient trees in this ethereal dress. The Midnight Forest Dress captures the essence of moonlit wanderings with its flowing silhouette and mysterious charm.

Features:
• Flowing A-line silhouette
• Subtle nature-inspired embroidery
• Comfortable stretch fabric
• Midi length perfect for any occasion
• Hidden side pockets

Perfect for evening events or mysterious forest gatherings.`,
      care: "Hand wash cold, lay flat to dry",
      materials: "70% Viscose, 25% Polyester, 5% Elastane",
      inStock: true
    },
    3: {
      id: 3,
      name: "Woodland Guardian Jacket",
      price: 249.99,
      category: "outerwear",
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Brown", "Dark Green", "Black"],
      images: ["/products/jacket1.jpg", "/products/jacket2.jpg"],
      description: "Protective jacket for forest wanderers",
      fullDescription: `Stand guard over the ancient woods in this rugged yet refined jacket. The Woodland Guardian combines functionality with dark aesthetic appeal.

Key Features:
• Weather-resistant outer shell
• Multiple utility pockets
• Adjustable cuffs and hem
• Reinforced shoulders and elbows
• Removable hood with drawstring

Built for those who protect the mysteries of the forest.`,
      care: "Machine wash cold, tumble dry low",
      materials: "80% Cotton, 20% Polyester",
      inStock: true
    }
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const productData = mockProducts[params.id]
      if (productData) {
        setProduct(productData)
        setSelectedSize(productData.sizes[0])
        setSelectedColor(productData.colors[0])
      }
      setLoading(false)
    }, 1000)
  }, [params.id])

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color')
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
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
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
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
              <div className="relative h-96 lg:h-[500px] bg-gradient-to-b from-forest-gray to-forest-darkGreen rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Product Image {activeImageIndex + 1}</p>
                  </div>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-20 h-20 bg-gradient-to-b from-forest-gray to-forest-darkGreen rounded-lg overflow-hidden border-2 transition-colors duration-300 ${
                      activeImageIndex === index ? 'border-forest-accent' : 'border-transparent'
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
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
              <p className="text-gray-400 capitalize">{product.category}</p>
            </div>

            <div className="text-3xl font-bold text-forest-accent">
              ${product.price}
            </div>

            <p className="text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
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

            {/* Color Selection */}
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
                className="w-full forest-btn bg-transparent border-2 border-forest-accent text-forest-accent hover:bg-forest-accent hover:text-forest-black"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full forest-btn bg-forest-accent text-forest-black hover:bg-opacity-90"
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
                  {product.fullDescription}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-white mb-2">Materials</h4>
                  <p className="text-gray-300">{product.materials}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Care Instructions</h4>
                  <p className="text-gray-300">{product.care}</p>
                </div>
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