'use client'

import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import FallingLeaves from './FallingLeaves'
import FogEffect from './FogEffect'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'

export default function ClientLayout({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-forest-black flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-forest-black relative overflow-hidden">
          <FogEffect />
          <FallingLeaves />
          <Navbar />
          <main className="relative z-10">
            {children}
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}