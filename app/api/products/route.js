import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  category: { type: String, required: true },
  subcategory: { type: String },
  brand: { type: String, default: 'FOREST' },
  sku: { type: String, unique: true },
  
  images: [{
    url: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  }],
  
  variants: [{
    color: { type: String, required: true },
    colorCode: { type: String },
    sizes: [{
      size: { type: String, required: true },
      quantity: { type: Number, required: true, min: 0 },
      reserved: { type: Number, default: 0 },
      lowStockThreshold: { type: Number, default: 5 }
    }]
  }],
  
  materials: { type: String },
  care: { type: String },
  weight: { type: Number },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },
  
  tags: [{ type: String }],
  metaTitle: { type: String },
  metaDescription: { type: String },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'discontinued'],
    default: 'active'
  },
  featured: { type: Boolean, default: false },
  isDigital: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Legacy fields for backward compatibility
  sizes: [String],
  colors: [String],
  inStock: { type: Boolean, default: true }
})

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
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
    
    const products = await Product.find({ status: { $ne: 'discontinued' } })
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

// POST - Create new product (Admin only)
export async function POST(request) {
  try {
    await connectDB()
    
    // TODO: Add authentication middleware
    // For now, we'll skip auth check
    
    const formData = await request.formData()
    const productData = {}
    
    // Extract form data
    for (const [key, value] of formData.entries()) {
      if (key === 'variants') {
        try {
          productData.variants = JSON.parse(value)
        } catch (e) {
          productData.variants = []
        }
      } else if (key === 'dimensions') {
        try {
          productData.dimensions = JSON.parse(value)
        } catch (e) {
          productData.dimensions = {}
        }
      } else if (key === 'tags') {
        productData.tags = value.split(',').map(tag => tag.trim()).filter(tag => tag)
      } else if (key.startsWith('images')) {
        // Handle file uploads
        if (!productData.images) productData.images = []
        // For now, we'll handle images as base64 strings
      } else {
        productData[key] = value
      }
    }
    
    // Generate SKU if not provided
    if (!productData.sku) {
      const prefix = productData.brand || 'FOREST'
      const timestamp = Date.now().toString().slice(-6)
      productData.sku = `${prefix}-${timestamp}`
    }
    
    // Convert string numbers to actual numbers
    if (productData.price) productData.price = parseFloat(productData.price)
    if (productData.salePrice) productData.salePrice = parseFloat(productData.salePrice)
    if (productData.weight) productData.weight = parseFloat(productData.weight)
    
    // Convert boolean strings
    productData.featured = productData.featured === 'true'
    productData.isDigital = productData.isDigital === 'true'
    
    const product = new Product(productData)
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
