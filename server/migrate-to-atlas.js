const mongoose = require('mongoose')
require('dotenv').config()

// Local MongoDB connection
const localDB = 'mongodb://localhost:27017/forest-fashion'

// Atlas MongoDB connection
const atlasDB = process.env.MONGODB_URI

// Schemas (same as in index.js)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
})

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

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    size: String,
    color: String,
    quantity: Number
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'vodafone_cash', 'visa'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
})

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribed: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

async function migrateData() {
  try {
    console.log('🚀 Starting migration from local MongoDB to Atlas...')
    
    // Connect to local database
    console.log('📡 Connecting to local MongoDB...')
    const localConnection = await mongoose.createConnection(localDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    // Connect to Atlas database
    console.log('☁️ Connecting to MongoDB Atlas...')
    const atlasConnection = await mongoose.createConnection(atlasDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    // Create models for both connections
    const LocalUser = localConnection.model('User', userSchema)
    const LocalProduct = localConnection.model('Product', productSchema)
    const LocalOrder = localConnection.model('Order', orderSchema)
    const LocalContact = localConnection.model('Contact', contactSchema)
    const LocalNewsletter = localConnection.model('Newsletter', newsletterSchema)
    
    const AtlasUser = atlasConnection.model('User', userSchema)
    const AtlasProduct = atlasConnection.model('Product', productSchema)
    const AtlasOrder = atlasConnection.model('Order', orderSchema)
    const AtlasContact = atlasConnection.model('Contact', contactSchema)
    const AtlasNewsletter = atlasConnection.model('Newsletter', newsletterSchema)
    
    // Migrate Users
    console.log('👤 Migrating users...')
    const users = await LocalUser.find({})
    if (users.length > 0) {
      await AtlasUser.deleteMany({}) // Clear existing
      await AtlasUser.insertMany(users)
      console.log(`✅ Migrated ${users.length} users`)
    } else {
      console.log('ℹ️ No users found in local database')
    }
    
    // Migrate Products
    console.log('🛍️ Migrating products...')
    const products = await LocalProduct.find({})
    if (products.length > 0) {
      await AtlasProduct.deleteMany({}) // Clear existing

      // Clean and fix product data before migration
      const cleanedProducts = products.map(product => {
        const productObj = product.toObject()

        // Fix images array - remove empty or invalid images
        if (productObj.images && productObj.images.length > 0) {
          productObj.images = productObj.images.filter(img =>
            img && (typeof img === 'string' || (img.url && img.url.trim()))
          ).map(img => {
            if (typeof img === 'string') {
              return {
                url: img,
                alt: productObj.name,
                isPrimary: false,
                order: 0
              }
            }
            return img
          })
        } else {
          // Remove images array if empty or invalid
          delete productObj.images
        }

        // Ensure variants exist or create default
        if (!productObj.variants || productObj.variants.length === 0) {
          if (productObj.colors && productObj.colors.length > 0) {
            // Convert old format to new
            productObj.variants = productObj.colors.map(color => ({
              color: color,
              colorCode: '#000000',
              sizes: (productObj.sizes || ['S', 'M', 'L', 'XL']).map(size => ({
                size: size,
                quantity: 10,
                reserved: 0,
                lowStockThreshold: 5
              }))
            }))
          } else {
            // Create default variant
            productObj.variants = [{
              color: 'Black',
              colorCode: '#000000',
              sizes: [
                { size: 'S', quantity: 10, reserved: 0, lowStockThreshold: 5 },
                { size: 'M', quantity: 10, reserved: 0, lowStockThreshold: 5 },
                { size: 'L', quantity: 10, reserved: 0, lowStockThreshold: 5 },
                { size: 'XL', quantity: 10, reserved: 0, lowStockThreshold: 5 }
              ]
            }]
          }
        }

        // Ensure required fields exist
        if (!productObj.status) productObj.status = 'active'
        if (!productObj.brand) productObj.brand = 'FOREST'
        if (productObj.featured === undefined) productObj.featured = false
        if (productObj.isDigital === undefined) productObj.isDigital = false

        return productObj
      })

      await AtlasProduct.insertMany(cleanedProducts)
      console.log(`✅ Migrated ${cleanedProducts.length} products`)
    } else {
      console.log('ℹ️ No products found in local database')
    }
    
    // Migrate Orders
    console.log('📦 Migrating orders...')
    const orders = await LocalOrder.find({})
    if (orders.length > 0) {
      await AtlasOrder.deleteMany({}) // Clear existing
      await AtlasOrder.insertMany(orders)
      console.log(`✅ Migrated ${orders.length} orders`)
    } else {
      console.log('ℹ️ No orders found in local database')
    }
    
    // Migrate Contacts
    console.log('📞 Migrating contacts...')
    const contacts = await LocalContact.find({})
    if (contacts.length > 0) {
      await AtlasContact.deleteMany({}) // Clear existing
      await AtlasContact.insertMany(contacts)
      console.log(`✅ Migrated ${contacts.length} contacts`)
    } else {
      console.log('ℹ️ No contacts found in local database')
    }
    
    // Migrate Newsletter subscriptions
    console.log('📧 Migrating newsletter subscriptions...')
    const newsletters = await LocalNewsletter.find({})
    if (newsletters.length > 0) {
      await AtlasNewsletter.deleteMany({}) // Clear existing
      await AtlasNewsletter.insertMany(newsletters)
      console.log(`✅ Migrated ${newsletters.length} newsletter subscriptions`)
    } else {
      console.log('ℹ️ No newsletter subscriptions found in local database')
    }
    
    console.log('🎉 Migration completed successfully!')
    console.log('📊 Summary:')
    console.log(`   Users: ${users.length}`)
    console.log(`   Products: ${products.length}`)
    console.log(`   Orders: ${orders.length}`)
    console.log(`   Contacts: ${contacts.length}`)
    console.log(`   Newsletter: ${newsletters.length}`)
    
    // Close connections
    await localConnection.close()
    await atlasConnection.close()
    
    console.log('✅ All connections closed. Migration complete!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
if (require.main === module) {
  migrateData()
}

module.exports = { migrateData }
