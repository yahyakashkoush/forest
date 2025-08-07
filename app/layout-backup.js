'use client'

import './globals.css'
import { Inter, Cinzel } from 'next/font/google'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FallingLeaves from './components/FallingLeaves'
import FogEffect from './components/FogEffect'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

const inter = Inter({ subsets: ['latin'] })
const cinzel = Cinzel({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <html lang="en">
        <head>
          <title>Forest - Born from the heart of the forest</title>
          <meta name="description" content="Discover the mysterious world of Forest fashion - where darkness meets elegance in an abandoned forest setting." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className={inter.className}>
          <div className="min-h-screen bg-forest-black">
            <div className="loading-spinner mx-auto mt-20"></div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <head>
        <title>Forest - Born from the heart of the forest</title>
        <meta name="description" content="Discover the mysterious world of Forest fashion - where darkness meets elegance in an abandoned forest setting." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
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
      </body>
    </html>
  )
}