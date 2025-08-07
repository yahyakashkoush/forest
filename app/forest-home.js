'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const ForestHome = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    
    // Custom cursor movement
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px')
      document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px')
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

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
    <div className="min-h-screen" style={{ cursor: 'none' }}>
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
            <h1 className="font-forest text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-wider relative">
              <span className="title-line block">ENTER THE</span>
              <span className="title-line title-main block text-7xl md:text-9xl lg:text-10xl"
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
            className="hero-subtitle mb-12 relative"
          >
            <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide mb-4">
              Every click is a step deeper
            </p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 3 }}
              className="text-sm md:text-base text-white/60 tracking-widest uppercase font-medium">
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
          transition={{ duration: 1, delay: 4 }}
          className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="text-white/40 text-xs tracking-widest uppercase">Descend</div>
            <div className="scroll-line w-px h-10 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
            <div className="scroll-dot w-2 h-2 bg-white/70 rounded-full"
                 style={{ animation: 'bounce 2s ease-in-out infinite' }}>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default ForestHome
