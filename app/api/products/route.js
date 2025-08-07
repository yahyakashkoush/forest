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

// GET - Fetch all products
export async function GET() {
  try {
    await connectDB()

    const products = await Product.find({ inStock: true })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(products)

  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request) {
  try {
    await connectDB()

    const { name, description, price, category, images } = await request.json()

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      images: images || []
    })

    await product.save()

    return NextResponse.json({
      message: 'Product created successfully',
      product
    }, { status: 201 })

  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 500 }
    )
  }
}