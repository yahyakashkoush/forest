'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartModal from './CartModal'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { getCartItemsCount } = useCart()
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    if (pathname === '/') {
      // If on home page, scroll to section
      const section = document.getElementById(sectionId)
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    } else {
      // If on other page, navigate to home then scroll
      router.push(`/#${sectionId}`)
    }
  }

  const cartItemsCount = getCartItemsCount()

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-forest-black bg-opacity-90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button onClick={() => scrollToSection('home')} className="flex items-center space-x-3">
              <div className="relative">
                <svg width="40" height="40" viewBox="0 0 100 100" className="text-white">
                  <defs>
                    <filter id="navGlow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    filter="url(#navGlow)"
                    d="M50 10L45 25L35 20L40 35L30 30L35 45L25 40L30 55L20 50L25 65L15 60L20 75L50 70L55 75L65 60L70 75L60 50L65 35L55 40L60 25L50 30L55 15L50 10Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="opacity-80"
                  />
                  <circle cx="50" cy="45" r="3" fill="currentColor" className="animate-pulse"/>
                </svg>
                <div className="absolute inset-0 bg-white opacity-10 blur-md animate-pulse"></div>
              </div>
              <span className="font-unbounded text-2xl font-bold text-white tracking-wider">
                FOREST
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('home')}
                className="text-white hover:text-forest-accent transition-colors duration-300 font-medium font-cinzel tracking-wide"
              >
                Enter
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-white hover:text-forest-accent transition-colors duration-300 font-medium font-cinzel tracking-wide"
              >
                Path
              </button>
              <button
                onClick={() => scrollToSection('shop')}
                className="text-white hover:text-forest-accent transition-colors duration-300 font-medium font-cinzel tracking-wide"
              >
                Grove
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-white hover:text-forest-accent transition-colors duration-300 font-medium font-cinzel tracking-wide"
              >
                Whisper
              </button>
              <Link href="/shop" className="text-white hover:text-forest-accent transition-colors duration-300 font-medium">
                Full Shop
              </Link>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* User menu */}
              {user ? (
                <div className="relative group">
                  <button className="text-white hover:text-forest-accent transition-colors duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-forest-gray bg-opacity-90 backdrop-blur-md rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-300 border-b border-forest-lightGray">
                        {user.name}
                      </div>
                      {user.role === 'admin' && (
                        <>
                          <Link href="/admin" className="block px-4 py-2 text-sm text-white hover:bg-forest-accent hover:text-forest-black transition-colors duration-300">
                            Admin Dashboard
                          </Link>
                          <Link href="/admin?tab=orders" className="block px-4 py-2 text-sm text-white hover:bg-forest-accent hover:text-forest-black transition-colors duration-300">
                            Manage Orders
                          </Link>
                        </>
                      )}
                      <Link href="/profile" className="block px-4 py-2 text-sm text-white hover:bg-forest-accent hover:text-forest-black transition-colors duration-300">
                        Profile
                      </Link>
                      {user.role !== 'admin' && (
                        <Link href="/orders" className="block px-4 py-2 text-sm text-white hover:bg-forest-accent hover:text-forest-black transition-colors duration-300">
                          My Orders
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-forest-accent hover:text-forest-black transition-colors duration-300"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/auth" className="text-white hover:text-forest-accent transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:text-forest-accent transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-forest-accent text-forest-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-white hover:text-forest-accent transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden bg-forest-black bg-opacity-95 backdrop-blur-md border-t border-forest-lightGray">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => {
                    scrollToSection('home')
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:text-forest-accent transition-colors duration-300 font-cinzel"
                >
                  Enter
                </button>
                <button
                  onClick={() => {
                    scrollToSection('about')
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:text-forest-accent transition-colors duration-300 font-cinzel"
                >
                  Path
                </button>
                <button
                  onClick={() => {
                    scrollToSection('shop')
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:text-forest-accent transition-colors duration-300 font-cinzel"
                >
                  Grove
                </button>
                <button
                  onClick={() => {
                    scrollToSection('contact')
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:text-forest-accent transition-colors duration-300 font-cinzel"
                >
                  Whisper
                </button>
                <Link
                  href="/shop"
                  className="block px-3 py-2 text-white hover:text-forest-accent transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Full Shop
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

export default Navbar