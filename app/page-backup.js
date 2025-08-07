'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    
    // Auto-slide for featured products
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const featuredProducts = [
    {
      id: 1,
      name: "Shadow Walker Coat",
      price: 299.99,
      image: "/products/coat1.jpg",
      description: "Embrace the darkness with this mysterious long coat"
    },
    {
      id: 2,
      name: "Midnight Forest Dress",
      price: 199.99,
      image: "/products/dress1.jpg",
      description: "Flow like mist through the ancient trees"
    },
    {
      id: 3,
      name: "Woodland Guardian Jacket",
      price: 249.99,
      image: "/products/jacket1.jpg",
      description: "Protection from the elements and the unknown"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-b from-forest-black via-forest-darkGreen to-forest-brown opacity-90"></div>
          <div className="absolute inset-0 bg-dark-texture opacity-20"></div>
        </div>

        {/* Animated Trees */}
        <div className="absolute inset-0 z-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 opacity-30"
              style={{
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              <svg
                width="80"
                height="200"
                viewBox="0 0 80 200"
                className="animate-sway text-forest-darkGreen"
              >
                <path
                  d="M40 200L35 150L30 100L25 50L30 20L40 0L50 20L55 50L50 100L45 150L40 200Z"
                  fill="currentColor"
                />
                <circle cx="40" cy="30" r="15" fill="currentColor" opacity="0.7" />
                <circle cx="30" cy="40" r="12" fill="currentColor" opacity="0.6" />
                <circle cx="50" cy="35" r="10" fill="currentColor" opacity="0.8" />
              </svg>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="relative z-20 text-center px-4"
        >
          {/* Logo with Fog Effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 3, delay: 1 }}
            className="mb-8 relative"
          >
            <div className="relative inline-block">
              <svg width="120" height="120" viewBox="0 0 120 120" className="text-forest-accent mx-auto">
                <path
                  d="M60 6L54 24L36 18L42 36L24 30L30 48L12 42L18 60L6 54L24 66L18 84L36 78L30 96L48 90L42 108L60 102L54 114L66 96L84 102L78 84L96 90L90 72L108 78L102 60L114 66L96 54L102 36L84 42L90 24L72 30L78 12L60 18L66 6L60 6Z"
                  fill="currentColor"
                  className="animate-sway"
                />
              </svg>
              <div className="absolute inset-0 bg-forest-accent opacity-20 blur-xl animate-pulse"></div>
            </div>
          </motion.div>

          {/* Brand Name with Glitch Effect */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1.5 }}
            className="font-forest text-6xl md:text-8xl font-bold text-white mb-4 tracking-wider glitch"
            data-text="FOREST"
          >
            FOREST
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 font-light tracking-wide"
          >
            Born from the heart of the forest
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.5 }}
          >
            <Link href="/shop" className="forest-btn text-lg px-12 py-4 inline-block">
              Start Exploring
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-forest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-forest text-4xl md:text-5xl font-bold text-white mb-4">
              Whispers from the Dark
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover our most mysterious pieces, crafted in the shadows of ancient trees
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="forest-card group cursor-pointer"
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
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link href={`/product/${product.id}`} className="forest-btn">
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-forest text-xl font-semibold text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-forest-accent font-bold text-lg">
                      ${product.price}
                    </span>
                    <button className="text-forest-accent hover:text-white transition-colors duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 px-4 bg-forest-darkGreen bg-opacity-30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="font-forest text-4xl md:text-5xl font-bold text-white mb-6">
                Lost in the Woods
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                In the depths of forgotten forests, where shadows dance with moonlight 
                and ancient secrets whisper through the leaves, Forest was born. 
                We craft fashion that speaks to the soul of the wild, 
                embracing the beauty found in darkness.
              </p>
              <p className="text-gray-400 mb-8">
                Each piece tells a story of mystery, elegance, and the untamed spirit 
                that lives within us all.
              </p>
              <Link href="/about" className="forest-btn">
                Discover Our Story
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-96 bg-gradient-to-br from-forest-brown to-forest-darkGreen rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-dark-texture opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Forest Atmosphere Image</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-forest text-4xl md:text-5xl font-bold text-white mb-6">
              Join the Forest
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to receive whispers of new arrivals, exclusive offers, 
              and tales from the dark woods delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 px-4 py-3 bg-forest-gray bg-opacity-50 border border-forest-lightGray rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-forest-accent transition-colors duration-300"
              />
              <button className="forest-btn px-8 py-3">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage