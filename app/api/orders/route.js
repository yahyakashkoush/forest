import { NextResponse } from 'next/server'

// Simple orders endpoint
export async function GET() {
  try {
    // Return empty array for now
    return NextResponse.json([])
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const orderData = await request.json()
    
    // For now, just return success
    return NextResponse.json({
      message: 'Order created successfully',
      order: { id: Date.now(), ...orderData }
    }, { status: 201 })
    
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create order' },
      { status: 500 }
    )
  }
}
