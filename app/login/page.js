'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the correct auth page
    router.replace('/auth')
  }, [router])

  return (
    <div className="min-h-screen bg-forest-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-accent mx-auto mb-4"></div>
        <p className="text-white">Redirecting to login page...</p>
      </div>
    </div>
  )
}
