'use client'

import { useEffect, useState } from 'react'

const FogEffect = () => {
  const [fogLayers, setFogLayers] = useState([])

  useEffect(() => {
    const generateFogLayers = () => {
      const layers = []
      for (let i = 0; i < 3; i++) {
        layers.push({
          id: i,
          animationDuration: 15 + Math.random() * 10,
          animationDelay: Math.random() * 5,
          opacity: 0.1 + Math.random() * 0.2,
          scale: 0.8 + Math.random() * 0.4
        })
      }
      setFogLayers(layers)
    }

    generateFogLayers()
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {fogLayers.map((layer) => (
        <div
          key={layer.id}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at ${50 + Math.random() * 50}% ${30 + Math.random() * 40}%, 
              rgba(26, 46, 26, ${layer.opacity}) 0%, 
              rgba(61, 41, 20, ${layer.opacity * 0.5}) 30%, 
              transparent 70%)`,
            animation: `fogMove ${layer.animationDuration}s ease-in-out infinite`,
            animationDelay: `${layer.animationDelay}s`,
            transform: `scale(${layer.scale})`
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes fogMove {
          0%, 100% {
            transform: translateX(-50px) translateY(-20px) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateX(30px) translateY(10px) scale(1.1);
            opacity: 0.5;
          }
          50% {
            transform: translateX(50px) translateY(-10px) scale(0.9);
            opacity: 0.7;
          }
          75% {
            transform: translateX(-20px) translateY(20px) scale(1.05);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  )
}

export default FogEffect