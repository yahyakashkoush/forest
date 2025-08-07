'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
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

  // Mock products data - in production, this would come from your API
  const mockProducts = [
    {
      id: 1,
      name: "Shadow Walker Coat",
      price: 299.99,
      category: "outerwear",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Dark Green", "Brown"],
      image: "/products/coat1.jpg",
      description: "A mysterious long coat that flows like shadows in the wind"
    },
    {
      id: 2,
      name: "Midnight Forest Dress",
      price: 199.99,
      category: "dresses",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Dark Green"],
      image: "/products/dress1.jpg",
      description: "Elegant dress inspired by moonlit forest paths"
    },
    {
      id: 3,
      name: "Woodland Guardian Jacket",
      price: 249.99,
      category: "outerwear",
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Brown", "Dark Green", "Black"],
      image: "/products/jacket1.jpg",
      description: "Protective jacket for forest wanderers"
    },
    {
      id: 4,
      name: "Mystic Raven Top",
      price: 89.99,
      category: "tops",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Gray"],
      image: "/products/top1.jpg",
      description: "Flowing top with raven-inspired details"
    },
    {
      id: 5,
      name: "Ancient Oak Pants",
      price: 149.99,
      category: "bottoms",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Brown", "Black", "Dark Green"],
      image: "/products/pants1.jpg",
      description: "Comfortable pants with bark-like texture"
    },
    {
      id: 6,
      name: "Ethereal Mist Skirt",
      price: 129.99,
      category: "bottoms",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Gray", "Black", "Dark Green"],
      image: "/products/skirt1.jpg",
      description: "Flowing skirt that moves like morning mist"
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // Apply filters
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category)
    }
    if (filters.size !== 'all') {
      filtered = filtered.filter(product => product.sizes.includes(filters.size))
    }
    if (filters.color !== 'all') {
      filtered = filtered.filter(product => product.colors.includes(filters.color))
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
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.sizes[0], // Default to first available size
      color: product.colors[0], // Default to first available color
      quantity: 1
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="loading-spinner"></div>
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
                  <option value="outerwear">Outerwear</option>
                  <option value="dresses">Dresses</option>
                  <option value="tops">Tops</option>
                  <option value="bottoms">Bottoms</option>
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
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
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
                  <option value="Black">Black</option>
                  <option value="Dark Green">Dark Green</option>
                  <option value="Brown">Brown</option>
                  <option value="Gray">Gray</option>
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
                  <option value="0-100">$0 - $100</option>
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
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="forest-card group"
                >
                  <div className="relative h-80 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-b from-forest-gray to-forest-darkGreen"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">Product Image</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                      <Link href={`/product/${product.id}`} className="forest-btn">
                        View Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="forest-btn bg-forest-accent text-forest-black hover:bg-opacity-90"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-forest text-xl font-semibold text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 mb-4 text-sm">{product.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-forest-accent font-bold text-lg">
                        ${product.price}
                      </span>
                      <span className="text-gray-500 text-sm capitalize">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="text-xs">
                        <span className="text-gray-400">Sizes: </span>
                        <span className="text-gray-300">{product.sizes.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {product.colors.map((color) => (
                        <div
                          key={color}
                          className="w-4 h-4 rounded-full border border-gray-600"
                          style={{
                            backgroundColor: color === 'Black' ? '#000000' :
                                           color === 'Dark Green' ? '#1a2e1a' :
                                           color === 'Brown' ? '#3d2914' :
                                           color === 'Gray' ? '#4a4a4a' : '#000000'
                          }}
                          title={color}
                        />
                      ))}
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