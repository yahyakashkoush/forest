import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

// Simple Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [String],
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

// Safe model creation
const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

// GET - Fetch single product
export async function GET(request, { params }) {
  try {
    await connectDB()
    
    const product = await Product.findById(params.id)
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
    
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
