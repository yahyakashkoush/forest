'use client'

const FogEffect = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-1 opacity-20">
      <div className="absolute top-1/4 left-1/4 w-96 h-48 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-80 h-40 bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-32 bg-white/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
    </div>
  )
}

export default FogEffect