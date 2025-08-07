const mongoose = require('mongoose')
require('dotenv').config()

// Product Schema (same as in index.js)
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

const Product = mongoose.model('Product', productSchema)

async function fixImages() {
  try {
    console.log('🔧 Fixing product images format...')
    
    // Connect to Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log('✅ Connected to MongoDB Atlas')
    
    // Get all products
    const products = await Product.find({})
    console.log(`📦 Found ${products.length} products to check`)
    
    let fixedCount = 0
    
    for (const product of products) {
      let needsUpdate = false
      let fixedImages = []
      
      if (product.images && Array.isArray(product.images)) {
        for (let i = 0; i < product.images.length; i++) {
          const img = product.images[i]
          
          if (typeof img === 'string') {
            // Convert old string format to new object format
            fixedImages.push({
              url: img,
              alt: `${product.name} - Image ${i + 1}`,
              isPrimary: i === 0,
              order: i
            })
            needsUpdate = true
          } else if (img && typeof img === 'object' && img.url) {
            // Already in correct format, but ensure all fields exist
            fixedImages.push({
              url: img.url,
              alt: img.alt || `${product.name} - Image ${i + 1}`,
              isPrimary: img.isPrimary !== undefined ? img.isPrimary : (i === 0),
              order: img.order !== undefined ? img.order : i
            })
            if (!img.alt || img.isPrimary === undefined || img.order === undefined) {
              needsUpdate = true
            }
          } else {
            console.warn(`⚠️ Invalid image found in product ${product.name}:`, img)
          }
        }
      } else if (product.images && !Array.isArray(product.images)) {
        console.warn(`⚠️ Product ${product.name} has non-array images:`, typeof product.images)
        fixedImages = []
        needsUpdate = true
      }
      
      if (needsUpdate) {
        await Product.findByIdAndUpdate(product._id, {
          images: fixedImages,
          updatedAt: new Date()
        })
        
        fixedCount++
        console.log(`✅ Fixed images for: ${product.name} (${fixedImages.length} images)`)
      }
    }
    
    console.log(`\n🎉 Image fix completed!`)
    console.log(`📊 Summary:`)
    console.log(`   Total products: ${products.length}`)
    console.log(`   Products fixed: ${fixedCount}`)
    console.log(`   Products already correct: ${products.length - fixedCount}`)
    
  } catch (error) {
    console.error('❌ Error fixing images:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB Atlas')
  }
}

// Run fix
if (require.main === module) {
  fixImages()
}

module.exports = { fixImages }
