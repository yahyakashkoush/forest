'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import axios from 'axios'
import { useCart } from '../context/CartContext'

const ShopPage = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: 'all',
    size: 'all',
    color: 'all',
    priceRange: 'all'
  })
  const [sortBy, setSortBy] = useState('name')
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from API...')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      console.log('Products fetched:', response.data)
      setProducts(response.data)
      setFilteredProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to mock products if API fails
      const mockProducts = [
        {
          _id: 'mock1',
          name: "Shadow Walker Coat",
          price: 299.99,
          category: "Outerwear",
          sizes: ["S", "M", "L", "XL"],
          colors: ["Black", "Dark Green", "Brown"],
          images: [],
          description: "A mysterious long coat that flows like shadows in the wind",
          inStock: true
        },
        {
          _id: 'mock2',
          name: "Midnight Forest Dress",
          price: 199.99,
          category: "Dresses",
          sizes: ["XS", "S", "M", "L"],
          colors: ["Black", "Dark Green"],
          images: [],
          description: "Elegant dress inspired by moonlit forest paths",
          inStock: true
        },
        {
          _id: 'mock3',
          name: "Woodland Guardian Jacket",
          price: 249.99,
          category: "Jackets",
          sizes: ["M", "L", "XL", "XXL"],
          colors: ["Brown", "Dark Green", "Black"],
          images: [],
          description: "Protective jacket for forest wanderers",
          inStock: true
        }
      ]
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = [...products]

    // Apply filters
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category && product.category.toLowerCase() === filters.category.toLowerCase()
      )
    }
    if (filters.size !== 'all') {
      filtered = filtered.filter(product => 
        product.sizes && product.sizes.includes(filters.size)
      )
    }
    if (filters.color !== 'all') {
      filtered = filtered.filter(product => 
        product.colors && product.colors.includes(filters.color)
      )
    }
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max
        } else {
          return product.price >= min
        }
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [filters, sortBy, products])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleAddToCart = (product) => {
    // Get first available variant and size
    let defaultColor = 'Black'
    let defaultSize = 'M'
    let imageUrl = null

    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0]
      defaultColor = firstVariant.color
      if (firstVariant.sizes && firstVariant.sizes.length > 0) {
        defaultSize = firstVariant.sizes[0].size
      }
    } else {
      // Fallback for old format
      if (product.colors && product.colors.length > 0) {
        defaultColor = product.colors[0]
      }
      if (product.sizes && product.sizes.length > 0) {
        defaultSize = product.sizes[0]
      }
    }

    // Handle image URL
    if (product.images && product.images.length > 0) {
      imageUrl = typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url
    }

    addToCart({
      id: product._id,
      name: product.name,
      price: product.salePrice || product.price,
      image: imageUrl,
      size: defaultSize,
      color: defaultColor,
      quantity: 1
    })
  }

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
  
  // Get unique sizes from products
  const allSizes = [...new Set(products.flatMap(p => p.sizes || []))]
  
  // Get unique colors from products
  const allColors = [...new Set(products.flatMap(p => p.colors || []))]

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="loading-spinner"></div>
          <span className="text-gray-400">Loading products...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="font-forest text-5xl md:text-6xl font-bold text-white mb-4">
            Dark Collection
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our mysterious collection of fashion pieces, each crafted with the essence of the dark forest
          </p>
          <p className="text-forest-accent mt-4">
            {products.length} products available
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-64 space-y-6"
          >
            <div className="forest-card p-6">
              <h3 className="font-forest text-xl font-semibold text-white mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">Size</label>
                <select
                  value={filters.size}
                  onChange={(e) => handleFilterChange('size', e.target.value)}
                  className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                >
                  <option value="all">All Sizes</option>
                  {allSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">Color</label>
                <select
                  value={filters.color}
                  onChange={(e) => handleFilterChange('color', e.target.value)}
                  className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                >
                  <option value="all">All Colors</option>
                  {allColors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                >
                  <option value="all">All Prices</option>
                  <option value="0-50">$0 - $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100-200">$100 - $200</option>
                  <option value="200-300">$200 - $300</option>
                  <option value="300">$300+</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({ category: 'all', size: 'all', color: 'all', priceRange: 'all' })}
                className="w-full px-4 py-2 text-forest-accent hover:text-white border border-forest-accent hover:bg-forest-accent transition-colors duration-300 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <p className="text-gray-400">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <div className="flex items-center space-x-2">
                <label className="text-gray-300">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-forest-gray border border-forest-lightGray rounded-lg text-white focus:outline-none focus:border-forest-accent"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="forest-card group"
                >
                  <div className="relative h-80 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url}
                        alt={typeof product.images[0] === 'string' ? product.name : product.images[0]?.alt || product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">No Image</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                      <Link href={`/product/${product._id}`} className="forest-btn">
                        View Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={(() => {
                          let totalStock = 0
                          if (product.variants && product.variants.length > 0) {
                            totalStock = product.variants.reduce((total, variant) =>
                              total + variant.sizes.reduce((sum, size) => sum + (size.quantity || 0), 0), 0
                            )
                          } else {
                            totalStock = product.inStock ? 999 : 0
                          }
                          return totalStock <= 0
                        })()}
                        className={`forest-btn ${
                          (() => {
                            let totalStock = 0
                            if (product.variants && product.variants.length > 0) {
                              totalStock = product.variants.reduce((total, variant) =>
                                total + variant.sizes.reduce((sum, size) => sum + (size.quantity || 0), 0), 0
                              )
                            } else {
                              totalStock = product.inStock ? 999 : 0
                            }
                            return totalStock <= 0
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-forest-accent text-forest-black hover:bg-opacity-90'
                          })()
                        }`}
                      >
                        {(() => {
                          let totalStock = 0
                          if (product.variants && product.variants.length > 0) {
                            totalStock = product.variants.reduce((total, variant) =>
                              total + variant.sizes.reduce((sum, size) => sum + (size.quantity || 0), 0), 0
                            )
                          } else {
                            totalStock = product.inStock ? 999 : 0
                          }
                          return totalStock <= 0 ? 'Out of Stock' : 'Add to Cart'
                        })()}
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-forest text-xl font-semibold text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 mb-4 text-sm">{product.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-forest-accent font-bold text-lg">
                          ${product.salePrice || product.price}
                        </span>
                        {product.salePrice && (
                          <span className="text-gray-400 text-sm line-through">
                            ${product.price}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 text-sm">
                        {product.category}
                      </span>
                    </div>

                    {/* Enhanced Variants Info */}
                    {product.variants && product.variants.length > 0 ? (
                      <div className="space-y-2 mb-3">
                        {/* Colors */}
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 text-xs">Colors ({product.variants.length}):</span>
                          <div className="flex space-x-1">
                            {product.variants.slice(0, 4).map((variant, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-gray-600"
                                style={{ backgroundColor: variant.colorCode || '#000' }}
                                title={variant.color}
                              ></div>
                            ))}
                            {product.variants.length > 4 && (
                              <span className="text-gray-400 text-xs">+{product.variants.length - 4}</span>
                            )}
                          </div>
                        </div>

                        {/* Stock Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-xs">Stock:</span>
                            <span className={`text-xs ${
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
                              )} items
                            </span>
                          </div>

                          {/* Featured Badge */}
                          {product.featured && (
                            <span className="px-2 py-1 text-xs bg-forest-accent/20 text-forest-accent rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Fallback for old format */
                      <div className="space-y-2 mb-3">
                        {/* Old Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                          <div>
                            <span className="text-gray-400 text-xs">Sizes: </span>
                            <span className="text-gray-300 text-xs">{product.sizes.join(', ')}</span>
                          </div>
                        )}

                        {/* Old Colors */}
                        {product.colors && product.colors.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-xs">Colors:</span>
                            <div className="flex space-x-1">
                              {product.colors.map((color) => (
                                <div
                                  key={color}
                                  className="w-4 h-4 rounded-full border border-gray-600"
                                  style={{
                                    backgroundColor:
                                      color === 'Black' ? '#000000' :
                                      color === 'Dark Green' ? '#1a2e1a' :
                                      color === 'Brown' ? '#3d2914' :
                                      color === 'Gray' ? '#4a4a4a' :
                                      color === 'White' ? '#ffffff' :
                                      color === 'Green' ? '#22c55e' :
                                      color === 'Blue' ? '#3b82f6' :
                                      color === 'Red' ? '#ef4444' :
                                      color === 'Navy' ? '#1e3a8a' : '#000000'
                                  }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Enhanced Stock Status */}
                    <div className="mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        (() => {
                          let totalStock = 0
                          if (product.variants && product.variants.length > 0) {
                            totalStock = product.variants.reduce((total, variant) =>
                              total + variant.sizes.reduce((sum, size) => sum + (size.quantity || 0), 0), 0
                            )
                          } else {
                            // Fallback for old format
                            totalStock = product.inStock ? 999 : 0
                          }

                          return totalStock > 10 ? 'bg-green-500 bg-opacity-20 text-green-400' :
                                 totalStock > 0 ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                                 'bg-red-500 bg-opacity-20 text-red-400'
                        })()
                      }`}>
                        {(() => {
                          let totalStock = 0
                          if (product.variants && product.variants.length > 0) {
                            totalStock = product.variants.reduce((total, variant) =>
                              total + variant.sizes.reduce((sum, size) => sum + (size.quantity || 0), 0), 0
                            )
                          } else {
                            // Fallback for old format
                            totalStock = product.inStock ? 999 : 0
                          }

                          return totalStock > 10 ? 'In Stock' :
                                 totalStock > 0 ? `Low Stock (${totalStock})` :
                                 'Out of Stock'
                        })()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopPage