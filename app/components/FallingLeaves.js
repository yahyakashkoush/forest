'use client'

import { useEffect, useState } from 'react'

const FallingLeaves = () => {
  const [leaves, setLeaves] = useState([])

  useEffect(() => {
    const leafShapes = [
      // Maple leaf SVG
      'M12 2C12 2 8 6 8 10C8 14 12 18 12 18C12 18 16 14 16 10C16 6 12 2 12 2Z M8 10C8 10 4 8 2 12C2 12 4 16 8 14C8 14 8 12 8 10Z M16 10C16 10 20 8 22 12C22 12 20 16 16 14C16 14 16 12 16 10Z',
      // Oak leaf SVG
      'M12 2C12 2 10 4 8 8C6 12 8 16 12 18C16 16 18 12 16 8C14 4 12 2 12 2Z M8 8C8 8 6 6 4 8C2 10 4 12 6 12C6 12 7 10 8 8Z M16 8C16 8 18 6 20 8C22 10 20 12 18 12C18 12 17 10 16 8Z',
      // Simple leaf SVG
      'M12 2C12 2 8 4 6 8C4 12 6 16 12 20C18 16 20 12 18 8C16 4 12 2 12 2Z'
    ]

    const colors = [
      '#4a7c59', // Forest green
      '#3d2914', // Brown
      '#2a4a2a', // Dark green
      '#5a4a3a', // Dark brown
      '#1a3a1a'  // Very dark green
    ]

    const generateLeaves = () => {
      const newLeaves = []
      for (let i = 0; i < 15; i++) {
        newLeaves.push({
          id: i,
          left: Math.random() * 100,
          animationDuration: 10 + Math.random() * 10,
          animationDelay: Math.random() * 5,
          size: 0.5 + Math.random() * 1,
          shape: leafShapes[Math.floor(Math.random() * leafShapes.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360
        })
      }
      setLeaves(newLeaves)
    }

    generateLeaves()
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute opacity-70"
          style={{
            left: `${leaf.left}%`,
            animationDuration: `${leaf.animationDuration}s`,
            animationDelay: `${leaf.animationDelay}s`,
            transform: `scale(${leaf.size}) rotate(${leaf.rotation}deg)`,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="leaf-fall-animation"
            style={{
              animation: `leafFall ${leaf.animationDuration}s linear infinite`,
              animationDelay: `${leaf.animationDelay}s`
            }}
          >
            <path
              d={leaf.shape}
              fill={leaf.color}
              opacity="0.7"
            />
          </svg>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes leafFall {
          0% {
            transform: translateY(-100vh) rotate(0deg) translateX(0px);
            opacity: 1;
          }
          25% {
            transform: translateY(25vh) rotate(90deg) translateX(20px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(-10px);
            opacity: 0.6;
          }
          75% {
            transform: translateY(75vh) rotate(270deg) translateX(15px);
            opacity: 0.4;
          }
          100% {
            transform: translateY(100vh) rotate(360deg) translateX(0px);
            opacity: 0;
          }
        }
        
        .leaf-fall-animation {
          animation: leafFall linear infinite;
        }
      `}</style>
    </div>
  )
}

export default FallingLeaves