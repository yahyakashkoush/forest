const mongoose = require('mongoose')
require('dotenv').config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/forest-fashion')

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  fullDescription: String,
  price: Number,
  category: String,
  sizes: [String],
  colors: [String],
  images: [String],
  materials: String,
  care: String,
  inStock: Boolean,
  featured: Boolean,
  createdAt: { type: Date, default: Date.now }
})

const Product = mongoose.model('Product', productSchema)

// Sample images from Unsplash (free to use)
const sampleImages = {
  'T-Shirts': [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=600&fit=crop'
  ],
  'Hoodies': [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop'
  ],
  'Jackets': [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop'
  ]
}

async function addSampleImages() {
  try {
    console.log('Adding sample images to products...')
    
    const products = await Product.find({})
    
    for (const product of products) {
      if (product.images.length === 0) {
        const categoryImages = sampleImages[product.category] || sampleImages['T-Shirts']
        const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)]
        
        product.images = [randomImage]
        await product.save()
        
        console.log(`Added image to ${product.name}`)
      }
    }
    
    console.log('Sample images added successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error adding sample images:', error)
    process.exit(1)
  }
}

addSampleImages()