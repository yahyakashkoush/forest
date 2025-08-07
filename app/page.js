'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    fetchFeaturedProducts()

    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, observerOptions)

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.path-step, .product-card')
    animateElements.forEach(el => observer.observe(el))

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link')
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const targetId = link.getAttribute('href').substring(1)
        const targetSection = document.getElementById(targetId)
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      })
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?featured=true`)
      if (response.ok) {
        const data = await response.json()
        setFeaturedProducts(data.slice(0, 4))
      }
    } catch (error) {
      console.error('Error fetching featured products:', error)
    }
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          subject: 'رسالة من موقع FOREST',
          message: contactForm.message
        })
      })

      if (response.ok) {
        alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.')
        setContactForm({ name: '', email: '', message: '' })
      } else {
        throw new Error('فشل في إرسال الرسالة')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Home Section - The Forest Gate */}
      <section id="home" className="section home-section relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Layers */}
        <div className="forest-background absolute inset-0 z-0">
          {/* Base gradient layers */}
          <div className="bg-layer bg-base absolute inset-0"
               style={{
                 background: `
                   radial-gradient(circle at 20% 20%, rgba(15, 26, 15, 0.8) 0%, transparent 50%),
                   radial-gradient(circle at 80% 80%, rgba(26, 15, 10, 0.9) 0%, transparent 50%),
                   radial-gradient(circle at 40% 60%, rgba(10, 10, 10, 0.95) 0%, transparent 40%),
                   linear-gradient(135deg, #0a0a0a 0%, #0f1a0f 25%, #1a0f0a 50%, #0a0a0a 75%, #000000 100%)
                 `
               }}>
          </div>
          
          <div className="bg-layer bg-depth absolute inset-0"
               style={{
                 background: `
                   radial-gradient(ellipse at 30% 70%, rgba(255, 255, 255, 0.02) 0%, transparent 60%),
                   radial-gradient(ellipse at 70% 30%, rgba(255, 255, 255, 0.01) 0%, transparent 50%)
                 `,
                 animation: 'depthShift 20s ease-in-out infinite'
               }}>
          </div>
          
          <div className="bg-layer bg-atmosphere absolute inset-0"
               style={{
                 background: `
                   linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, transparent 30%),
                   linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, transparent 40%)
                 `
               }}>
          </div>
          
          {/* Tree silhouettes */}
          <div className="trees-container absolute inset-0 z-10">
            {/* Tree 1 - Left side, tall */}
            <div className="tree tree-1 absolute bottom-0 bg-black opacity-90"
                 style={{
                   left: '5%',
                   width: '8px',
                   height: '60%',
                   animation: 'treeSway 8s ease-in-out infinite'
                 }}>
              <div className="absolute bg-black opacity-80"
                   style={{
                     top: '-20%',
                     left: '-15px',
                     width: '38px',
                     height: '40%',
                     borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
                   }}>
              </div>
              <div className="absolute bg-black opacity-60"
                   style={{
                     top: '-10%',
                     left: '-10px',
                     width: '28px',
                     height: '30%',
                     borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%'
                   }}>
              </div>
            </div>

            {/* Tree 2 - Right side, medium */}
            <div className="tree tree-2 absolute bottom-0 bg-black opacity-90"
                 style={{
                   right: '10%',
                   width: '6px',
                   height: '45%',
                   animation: 'treeSway 10s ease-in-out infinite reverse',
                   animationDelay: '2s'
                 }}>
              <div className="absolute bg-black opacity-70"
                   style={{
                     top: '-25%',
                     left: '-12px',
                     width: '30px',
                     height: '35%',
                     borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%'
                   }}>
              </div>
            </div>

            {/* Tree 3 - Far left, background */}
            <div className="tree tree-3 absolute bottom-0 bg-black opacity-40"
                 style={{
                   left: '-2%',
                   width: '12px',
                   height: '70%',
                   animation: 'treeSway 12s ease-in-out infinite',
                   animationDelay: '1s'
                 }}>
              <div className="absolute bg-black opacity-60"
                   style={{
                     top: '-15%',
                     left: '-20px',
                     width: '52px',
                     height: '45%',
                     borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%'
                   }}>
              </div>
            </div>

            {/* Tree 4 - Center background */}
            <div className="tree tree-4 absolute bottom-0 bg-black opacity-30"
                 style={{
                   left: '45%',
                   width: '4px',
                   height: '35%',
                   animation: 'treeSway 15s ease-in-out infinite',
                   animationDelay: '3s'
                 }}>
              <div className="absolute bg-black opacity-50"
                   style={{
                     top: '-30%',
                     left: '-8px',
                     width: '20px',
                     height: '40%',
                     borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%'
                   }}>
              </div>
            </div>

            {/* Tree 5 - Right background */}
            <div className="tree tree-5 absolute bottom-0 bg-black opacity-50"
                 style={{
                   right: '25%',
                   width: '5px',
                   height: '40%',
                   animation: 'treeSway 9s ease-in-out infinite reverse',
                   animationDelay: '4s'
                 }}>
              <div className="absolute bg-black opacity-60"
                   style={{
                     top: '-20%',
                     left: '-10px',
                     width: '25px',
                     height: '35%',
                     borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
                   }}>
              </div>
            </div>

            {/* Tree 6 - Far right */}
            <div className="tree tree-6 absolute bottom-0 bg-black opacity-60"
                 style={{
                   right: '-1%',
                   width: '10px',
                   height: '55%',
                   animation: 'treeSway 11s ease-in-out infinite',
                   animationDelay: '1.5s'
                 }}>
              <div className="absolute bg-black opacity-70"
                   style={{
                     top: '-18%',
                     left: '-18px',
                     width: '46px',
                     height: '42%',
                     borderRadius: '50% 50% 50% 50% / 58% 58% 42% 42%'
                   }}>
              </div>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="particles-container absolute inset-0 z-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="particle absolute"
                style={{
                  left: `${10 + i * 10}%`,
                  animation: `particleFloat ${12 + i * 2}s linear infinite`,
                  animationDelay: `${i * 2}s`
                }}
              >
                <div className="w-1 h-1 bg-white/30 rounded-full"
                     style={{ boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}>
                </div>
              </div>
            ))}
          </div>
          
          {/* Fog layers */}
          <div className="fog-container absolute inset-0 z-6">
            <div className="fog fog-1 absolute rounded-full bg-white/5 blur-3xl"
                 style={{
                   top: '20%',
                   left: '-10%',
                   width: '300px',
                   height: '150px',
                   animation: 'fogDrift 25s ease-in-out infinite'
                 }}>
            </div>
            
            <div className="fog fog-2 absolute rounded-full bg-white/5 blur-3xl"
                 style={{
                   top: '60%',
                   right: '-15%',
                   width: '400px',
                   height: '200px',
                   animation: 'fogDrift 25s ease-in-out infinite',
                   animationDelay: '8s'
                 }}>
            </div>
            
            <div className="fog fog-3 absolute rounded-full bg-white/5 blur-3xl"
                 style={{
                   top: '40%',
                   left: '30%',
                   width: '250px',
                   height: '125px',
                   animation: 'fogDrift 25s ease-in-out infinite',
                   animationDelay: '15s'
                 }}>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="hero-content relative z-20 text-center px-4 max-w-4xl">
          {/* Mystical Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: 180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 2, delay: 1 }}
            className="hero-logo mb-16 relative"
          >
            <div className="relative inline-block">
              {/* Outer mystical rings */}
              <div className="absolute inset-0 w-32 h-32 mx-auto">
                <div className="w-full h-full border border-white/20 rounded-full"
                     style={{ animation: 'spin 20s linear infinite' }}>
                </div>
                <div className="absolute inset-2 border border-white/10 rounded-full"
                     style={{ animation: 'spin 15s linear infinite reverse' }}>
                </div>
              </div>
              
              {/* Main carved logo */}
              <svg width="120" height="120" viewBox="0 0 200 200" className="text-white mx-auto relative z-10">
                <defs>
                  <filter id="forestGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <path
                  filter="url(#forestGlow)"
                  d="M100 20L90 50L70 40L80 70L60 60L70 90L50 80L60 110L40 100L50 130L100 125L110 130L130 100L140 130L120 80L130 50L110 60L120 30L100 40L110 10L100 20Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    strokeDasharray: '1000',
                    strokeDashoffset: '1000',
                    animation: 'logoCarve 3s ease-in-out infinite alternate'
                  }}
                />
                <circle 
                  cx="100" 
                  cy="75" 
                  r="6" 
                  fill="currentColor"
                  style={{ animation: 'pulse 2s ease-in-out infinite' }}
                />
              </svg>
              
              {/* Floating energy orbs */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 text-white/30"
                  style={{
                    top: `${30 + 40 * Math.cos(i * Math.PI / 3)}%`,
                    left: `${30 + 40 * Math.sin(i * Math.PI / 3)}%`,
                    animation: `float 3s ease-in-out infinite ${i * 0.5}s`
                  }}
                >
                  <div 
                    className="w-full h-full bg-current rounded-full animate-pulse"
                    style={{
                      boxShadow: '0 0 20px currentColor',
                      animationDelay: `${i * 0.3}s`
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Brand Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 1.5 }}
            className="hero-title mb-8 relative"
          >
            <h1 className="font-forest font-bold text-white tracking-wider relative text-center">
              <span className="title-line block text-2xl md:text-3xl lg:text-4xl mb-2 opacity-80 font-light tracking-widest">ENTER THE</span>
              <span className="title-line title-main block text-5xl md:text-7xl lg:text-8xl"
                    style={{
                      textShadow: `
                        0 0 20px rgba(255, 255, 255, 0.3),
                        0 0 40px rgba(255, 255, 255, 0.2),
                        2px 2px 0px rgba(0, 0, 0, 0.8)
                      `,
                      animation: 'titleGlow 3s ease-in-out infinite alternate'
                    }}>
                FOREST
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 2.2 }}
            className="hero-subtitle mb-10 relative"
          >
            <p className="text-lg md:text-xl text-gray-200 font-light tracking-wide mb-3">
              Every click is a step deeper
            </p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 3 }}
              className="text-xs md:text-sm text-white/60 tracking-widest uppercase font-medium">
              Where silence speaks louder than words
            </motion.p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 3.5 }}
            className="relative"
          >
            <Link
              href="/shop"
              className="cta-button group relative inline-block px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-white/10 to-white/5 border-2 border-white/30 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:border-white/60"
              style={{
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="button-glow absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              
              <span className="button-text relative z-10 tracking-wider uppercase">
                Explore the Unknown
              </span>
              
              <span className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 4.5 }}
          className="scroll-indicator absolute bottom-8 right-8 z-20"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="text-white/30 text-xs tracking-widest uppercase font-light">Descend</div>
            <div className="scroll-line w-px h-10 bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
            <div className="scroll-dot w-1.5 h-1.5 bg-white/60 rounded-full"
                 style={{ animation: 'bounce 2s ease-in-out infinite' }}>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About Section - The Path */}
      <section id="about" className="section about-section relative min-h-screen flex items-center justify-center py-20"
               style={{
                 background: `
                   radial-gradient(circle at 30% 40%, rgba(15, 26, 15, 0.3) 0%, transparent 60%),
                   radial-gradient(circle at 70% 60%, rgba(26, 15, 10, 0.2) 0%, transparent 50%),
                   linear-gradient(180deg, #0a0a0a 0%, #0f1a0f 50%, #0a0a0a 100%)
                 `
               }}>
        <div className="path-container max-w-4xl mx-auto px-8 relative">
          <div className="path-line absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white/30 to-transparent transform -translate-x-1/2"></div>

          <div className="path-content relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="path-step flex items-center mb-32 group"
            >
              <div className="step-marker w-6 h-6 bg-white/90 rounded-full relative mx-10 z-10">
                <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping"></div>
              </div>
              <div className="step-content flex-1 max-w-md">
                <h3 className="font-unbounded text-2xl font-semibold mb-4 text-white">Born in Shadows</h3>
                <p className="text-gray-300 leading-relaxed">In the depths of forgotten woods, where silence speaks louder than words, FOREST was conceived.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="path-step flex items-center mb-32 flex-row-reverse group"
            >
              <div className="step-marker w-6 h-6 bg-white/90 rounded-full relative mx-10 z-10">
                <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              </div>
              <div className="step-content flex-1 max-w-md text-right">
                <h3 className="font-unbounded text-2xl font-semibold mb-4 text-white">Crafted for Rebels</h3>
                <p className="text-gray-300 leading-relaxed">Each piece tells a story of rebellion, of youth who dare to walk their own path through the darkness.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="path-step flex items-center group"
            >
              <div className="step-marker w-6 h-6 bg-white/90 rounded-full relative mx-10 z-10">
                <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
              </div>
              <div className="step-content flex-1 max-w-md">
                <h3 className="font-unbounded text-2xl font-semibold mb-4 text-white">Worn by Wanderers</h3>
                <p className="text-gray-300 leading-relaxed">Style with meaning. Fashion with soul. For those who find beauty in the mysterious and strength in solitude.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shop Section - The Grove */}
      <section id="shop" className="section shop-section relative min-h-screen flex items-center justify-center py-20"
               style={{
                 background: `
                   radial-gradient(circle at 20% 80%, rgba(15, 26, 15, 0.4) 0%, transparent 50%),
                   radial-gradient(circle at 80% 20%, rgba(26, 15, 10, 0.3) 0%, transparent 60%),
                   linear-gradient(45deg, #0a0a0a 0%, #0f1a0f 25%, #1a0f0a 50%, #0a0a0a 100%)
                 `
               }}>
        <div className="container mx-auto px-8">
          <div className="grove-header text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="font-unbounded text-5xl font-bold text-white mb-6"
              style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
            >
              The Grove
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-xl text-gray-300 tracking-wide"
            >
              Hidden artifacts await discovery
            </motion.p>
          </div>

          <div className="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="product-card group bg-white/5 border border-white/10 rounded-lg p-6 relative overflow-hidden hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="product-image relative h-48 mb-6 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url}
                        alt={typeof product.images[0] === 'string' ? product.name : product.images[0]?.alt || product.name}
                        className="w-full h-full object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-12 h-12 text-white/60">
                          <path d="M20 30h60v40H20z" fill="currentColor" opacity="0.6"/>
                          <path d="M30 20h40v20H30z" fill="currentColor" opacity="0.4"/>
                        </svg>
                      </div>
                    )}
                    <div className="product-glow absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="product-info text-center">
                    <h3 className="font-unbounded text-lg font-medium text-white mb-2">{product.name}</h3>
                    <div className="flex justify-center items-center space-x-2 mb-2">
                      <span className="text-white/80 font-semibold">${product.price}</span>
                      {product.salePrice && (
                        <span className="text-red-400 font-semibold">${product.salePrice}</span>
                      )}
                    </div>

                    {/* Stock and variants info */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="text-xs text-white/60 space-y-1">
                        <div className="flex justify-center items-center space-x-2">
                          <span>{product.variants.length} color{product.variants.length > 1 ? 's' : ''}</span>
                          <span>•</span>
                          <span className={`${
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
                            )} in stock
                          </span>
                        </div>

                        {/* Color dots */}
                        <div className="flex justify-center space-x-1">
                          {product.variants.slice(0, 3).map((variant, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full border border-white/30"
                              style={{ backgroundColor: variant.colorCode || '#000' }}
                              title={variant.color}
                            ></div>
                          ))}
                          {product.variants.length > 3 && (
                            <span className="text-white/40 text-xs">+{product.variants.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/product/${product._id}`}
                    className="absolute inset-0 z-10"
                  />
                </motion.div>
              ))
            ) : (
              // Placeholder products
              [...Array(4)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="product-card group bg-white/5 border border-white/10 rounded-lg p-6 relative overflow-hidden hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="product-image relative h-48 mb-6 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-12 h-12 text-white/60">
                        <path d="M20 30h60v40H20z" fill="currentColor" opacity="0.6"/>
                        <path d="M30 20h40v20H30z" fill="currentColor" opacity="0.4"/>
                      </svg>
                    </div>
                    <div className="product-glow absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="product-info text-center">
                    <h3 className="font-unbounded text-lg font-medium text-white mb-2">
                      {['Shadow Hoodie', 'Midnight Tee', 'Whisper Jacket', 'Void Pants'][index]}
                    </h3>
                    <p className="text-white/80 font-semibold">${[89, 45, 129, 79][index]}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center mt-16"
          >
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-white/10 border-2 border-white/30 text-white rounded-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 font-cinzel tracking-wider"
            >
              Enter the Full Grove
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact Section - The Whisper */}
      <section id="contact" className="section contact-section relative min-h-screen flex items-center justify-center py-20"
               style={{
                 background: `
                   radial-gradient(ellipse at 50% 100%, rgba(15, 26, 15, 0.6) 0%, transparent 70%),
                   radial-gradient(ellipse at 50% 0%, rgba(26, 15, 10, 0.4) 0%, transparent 60%),
                   linear-gradient(180deg, #0a0a0a 0%, #000000 100%)
                 `
               }}>
        <div className="container mx-auto px-8">
          <div className="cave-container max-w-2xl mx-auto">
            <div className="cave-entrance bg-white/3 border border-white/10 rounded-xl p-12 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center mb-12 relative z-10"
              >
                <h2 className="font-unbounded text-4xl font-bold text-white mb-4">The Whisper</h2>
                <p className="text-gray-300 text-lg">Speak into the void</p>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="whisper-form space-y-6 relative z-10"
                onSubmit={handleContactSubmit}
              >
                <div className="form-group relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-transparent focus:border-white/50 focus:bg-white/8 transition-all duration-300"
                    placeholder="Your Name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-4 top-4 text-white/60 transition-all duration-300 pointer-events-none"
                  >
                    Your Name
                  </label>
                </div>

                <div className="form-group relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-transparent focus:border-white/50 focus:bg-white/8 transition-all duration-300"
                    placeholder="Your Echo"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 top-4 text-white/60 transition-all duration-300 pointer-events-none"
                  >
                    Your Echo
                  </label>
                </div>

                <div className="form-group relative">
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-transparent focus:border-white/50 focus:bg-white/8 transition-all duration-300 resize-none"
                    placeholder="Your Whisper"
                  ></textarea>
                  <label
                    htmlFor="message"
                    className="absolute left-4 top-4 text-white/60 transition-all duration-300 pointer-events-none"
                  >
                    Your Whisper
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white/10 border-2 border-white/30 text-white py-4 rounded-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 font-cinzel tracking-wider relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {isSubmitting ? 'Sending into the Void...' : 'Send into the Darkness'}
                  </span>
                  <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                </button>
              </motion.form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
