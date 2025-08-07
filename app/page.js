'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl font-bold mb-6"
          >
            FOREST
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl mb-8 opacity-80"
          >
            Dark Fashion Collection
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <Link 
              href="/shop"
              className="inline-block px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              EXPLORE THE COLLECTION
            </Link>
          </motion.div>
        </div>

        {/* Simple scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="text-white/40 text-xs tracking-widest uppercase">Scroll</div>
            <div className="w-px h-10 bg-white/30"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-8"
          >
            About FOREST
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg opacity-80 leading-relaxed"
          >
            FOREST represents the intersection of darkness and elegance. 
            Our collection embodies the mysterious beauty of nature's shadows, 
            crafted for those who dare to embrace their darker aesthetic.
          </motion.p>
        </div>
      </section>

      {/* Shop Section */}
      <section className="min-h-screen flex items-center justify-center bg-black">
        <div className="max-w-6xl mx-auto text-center px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-12"
          >
            Featured Collection
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: item * 0.1 }}
                className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                <div className="h-48 bg-gray-600 rounded mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Product {item}</h3>
                <p className="text-gray-400 mb-4">Dark collection piece</p>
                <p className="text-lg font-bold">$99.99</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12"
          >
            <Link 
              href="/shop"
              className="inline-block px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              VIEW ALL PRODUCTS
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-2xl mx-auto text-center px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-8"
          >
            Get In Touch
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg opacity-80 mb-8"
          >
            Ready to embrace the darkness? Contact us to learn more about our collection.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              href="/contact"
              className="inline-block px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              CONTACT US
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
