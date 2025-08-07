const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Multer configuration for file uploads
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/forest-fashion', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', async () => {
  console.log('Connected to MongoDB')

  // Fix existing orders that don't have payment fields
  try {
    const result = await mongoose.connection.db.collection('orders').updateMany(
      {
        $or: [
          { paymentMethod: { $exists: false } },
          { paymentStatus: { $exists: false } }
        ]
      },
      {
        $set: {
          paymentMethod: 'cash_on_delivery',
          paymentStatus: 'pending',
          updatedAt: new Date()
        }
      }
    )
    if (result.modifiedCount > 0) {
      console.log(`Fixed ${result.modifiedCount} existing orders`)
    }
  } catch (error) {
    console.log('Error fixing orders:', error.message)
  }
})

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)

// Product Schema - Enhanced Professional Version
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String },
  price: { type: Number, required: true },
  salePrice: { type: Number }, // Sale price if on discount
  category: { type: String, required: true },
  subcategory: { type: String }, // Additional categorization
  brand: { type: String, default: 'FOREST' },
  sku: { type: String, unique: true }, // Stock Keeping Unit

  // Enhanced Images with metadata
  images: [{
    url: { type: String, required: true },
    alt: { type: String }, // Alt text for accessibility
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  }],

  // Professional Inventory Management
  variants: [{
    color: { type: String, required: true },
    colorCode: { type: String }, // Hex color code
    sizes: [{
      size: { type: String, required: true },
      quantity: { type: Number, required: true, min: 0 },
      reserved: { type: Number, default: 0 }, // Reserved for pending orders
      lowStockThreshold: { type: Number, default: 5 }
    }]
  }],

  // Product Details
  materials: { type: String },
  care: { type: String },
  weight: { type: Number }, // in grams
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },

  // SEO and Marketing
  tags: [{ type: String }],
  metaTitle: { type: String },
  metaDescription: { type: String },

  // Status and Visibility
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'discontinued'],
    default: 'active'
  },
  featured: { type: Boolean, default: false },
  isDigital: { type: Boolean, default: false },

  // Timestamps and Tracking
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

// Add indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' })
productSchema.index({ category: 1, status: 1 })
productSchema.index({ sku: 1 })
productSchema.index({ featured: 1, status: 1 })

// Virtual for total stock
productSchema.virtual('totalStock').get(function() {
  let total = 0
  this.variants.forEach(variant => {
    variant.sizes.forEach(size => {
      total += size.quantity
    })
  })
  return total
})

// Virtual for available stock (excluding reserved)
productSchema.virtual('availableStock').get(function() {
  let available = 0
  this.variants.forEach(variant => {
    variant.sizes.forEach(size => {
      available += (size.quantity - size.reserved)
    })
  })
  return available
})

// Virtual for checking if in stock
productSchema.virtual('inStock').get(function() {
  return this.availableStock > 0
})

// Pre-save middleware to update timestamps
productSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

const Product = mongoose.model('Product', productSchema)

// Order Schema
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

const Order = mongoose.model('Order', orderSchema)

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
})

const Contact = mongoose.model('Contact', contactSchema)

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribed: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

const Newsletter = mongoose.model('Newsletter', newsletterSchema)

// Profile Schema
const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Profile = mongoose.model('Profile', profileSchema)

// Password Reset Token Schema
const passwordResetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // Expires after 1 hour
})

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema)

// Email configuration
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'forest.fashion.store@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
})

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'forest_secret_key_2024_dark_mysterious', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

// Middleware to verify admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'forest_secret_key_2024_dark_mysterious',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'forest_secret_key_2024_dark_mysterious',
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Forget Password - Send Reset Email
app.post('/api/auth/forget-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email address' })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')

    // Save reset token to database
    await PasswordReset.findOneAndDelete({ userId: user._id }) // Remove any existing tokens
    const passwordReset = new PasswordReset({
      userId: user._id,
      token: resetToken,
      email: email
    })
    await passwordReset.save()

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    // Email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0f1a0f, #1a2e1a); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #22c55e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌲 FOREST Fashion</h1>
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>We received a request to reset your password for your FOREST Fashion account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This link will expire in 1 hour</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password won't change until you create a new one</li>
            </ul>
            <p>Best regards,<br>The FOREST Fashion Team</p>
          </div>
          <div class="footer">
            <p>© 2025 FOREST Fashion. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email (for now, just log the reset URL)
    console.log('🔐 Password Reset URL:', resetUrl)
    console.log('📧 Email would be sent to:', email)

    // TODO: Uncomment when email is configured
    /*
    const mailOptions = {
      from: `"FOREST Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Reset Your FOREST Fashion Password',
      html: emailHtml
    }
    await emailTransporter.sendMail(mailOptions)
    */

    res.json({
      message: 'Password reset instructions sent to your email',
      resetUrl: resetUrl, // Remove this in production
      email: email
    })

  } catch (error) {
    console.error('Forget password error:', error)
    res.status(500).json({ message: 'Failed to send reset email' })
  }
})

// Reset Password - Verify Token and Update Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    // Find reset token
    const passwordReset = await PasswordReset.findOne({ token })
    if (!passwordReset) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    // Find user
    const user = await User.findById(passwordReset.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user password
    user.password = hashedPassword
    await user.save()

    // Delete reset token
    await PasswordReset.findByIdAndDelete(passwordReset._id)

    console.log(`✅ Password reset successfully for user: ${user.email}`)

    res.json({ message: 'Password reset successfully' })

  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ message: 'Failed to reset password' })
  }
})

// Verify Reset Token
app.get('/api/auth/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params

    const passwordReset = await PasswordReset.findOne({ token }).populate('userId', 'name email')
    if (!passwordReset) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    res.json({
      valid: true,
      email: passwordReset.email,
      userName: passwordReset.userId.name
    })

  } catch (error) {
    console.error('Verify token error:', error)
    res.status(500).json({ message: 'Failed to verify token' })
  }
})

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const { category, featured, limit } = req.query
    let query = {}
    
    if (category && category !== 'all') {
      query.category = category
    }
    
    if (featured === 'true') {
      query.featured = true
    }

    let products = Product.find(query)
    
    if (limit) {
      products = products.limit(parseInt(limit))
    }

    const result = await products.exec()
    res.json(result)
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Enhanced Product Creation API
app.post('/api/products', authenticateToken, requireAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const {
      name,
      description,
      fullDescription,
      price,
      salePrice,
      category,
      subcategory,
      brand,
      variants, // JSON string of variants with colors and sizes
      materials,
      care,
      weight,
      dimensions,
      tags,
      metaTitle,
      metaDescription,
      status,
      featured,
      isDigital
    } = req.body

    console.log('Creating product with enhanced data:', req.body)
    console.log('Files received:', req.files ? req.files.length : 0)

    // Generate SKU automatically
    const sku = `FOREST-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Handle images with metadata
    const processedImages = []
    if (req.files && req.files.length > 0) {
      console.log(`Processing ${req.files.length} uploaded files`)
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i]
        try {
          // Convert image to base64
          const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
          processedImages.push({
            url: base64Image,
            alt: `${name} - Image ${i + 1}`,
            isPrimary: i === 0, // First image is primary
            order: i
          })
          console.log(`Converted image to base64: ${file.originalname}`)
        } catch (error) {
          console.warn('Failed to process image:', error.message)
        }
      }
    }

    // Parse variants from JSON string
    let parsedVariants = []
    if (variants) {
      try {
        parsedVariants = JSON.parse(variants)
      } catch (error) {
        console.warn('Failed to parse variants:', error.message)
        return res.status(400).json({ message: 'Invalid variants format' })
      }
    }

    // Parse dimensions
    let parsedDimensions = {}
    if (dimensions) {
      try {
        parsedDimensions = JSON.parse(dimensions)
      } catch (error) {
        parsedDimensions = {}
      }
    }

    const product = new Product({
      name,
      description,
      fullDescription: fullDescription || '',
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : undefined,
      category,
      subcategory: subcategory || '',
      brand: brand || 'FOREST',
      sku,
      images: processedImages,
      variants: parsedVariants,
      materials: materials || '',
      care: care || '',
      weight: weight ? parseFloat(weight) : undefined,
      dimensions: parsedDimensions,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      metaTitle: metaTitle || name,
      metaDescription: metaDescription || description,
      status: status || 'active',
      featured: featured === 'true' || featured === true,
      isDigital: isDigital === 'true' || isDigital === true,
      createdBy: req.user.userId,
      lastModifiedBy: req.user.userId
    })

    await product.save()
    console.log('Enhanced product created successfully:', product._id)
    console.log('Images saved:', product.images.length)
    console.log('Variants created:', product.variants.length)
    res.status(201).json(product)
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

app.put('/api/products/:id', authenticateToken, requireAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const {
      name,
      description,
      fullDescription,
      price,
      salePrice,
      category,
      subcategory,
      brand,
      variants,
      materials,
      care,
      weight,
      dimensions,
      tags,
      metaTitle,
      metaDescription,
      status,
      featured,
      isDigital
    } = req.body

    console.log('Updating product with data:', req.body)
    console.log('Files received:', req.files ? req.files.length : 0)

    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Handle images with metadata - keep existing if no new ones
    let processedImages = []

    // Ensure existing images are in correct format
    if (product.images && Array.isArray(product.images)) {
      processedImages = product.images.map((img, index) => {
        if (typeof img === 'string') {
          // Convert old string format to new object format
          return {
            url: img,
            alt: `${product.name} - Image ${index + 1}`,
            isPrimary: index === 0,
            order: index
          }
        } else if (img && typeof img === 'object' && img.url) {
          // Already in correct format
          return img
        } else {
          // Invalid image, skip
          return null
        }
      }).filter(img => img !== null)
    }

    // Process new uploaded files
    if (req.files && req.files.length > 0) {
      processedImages = []
      console.log(`Processing ${req.files.length} uploaded files for update`)
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i]
        try {
          // Convert image to base64
          const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
          processedImages.push({
            url: base64Image,
            alt: `${name || product.name} - Image ${i + 1}`,
            isPrimary: i === 0, // First image is primary
            order: i
          })
          console.log(`Converted image to base64: ${file.originalname}`)
        } catch (error) {
          console.warn('Failed to process image:', error.message)
        }
      }
    }

    // Parse variants from JSON string
    let parsedVariants = product.variants || []
    if (variants) {
      try {
        parsedVariants = JSON.parse(variants)
      } catch (error) {
        console.warn('Failed to parse variants:', error.message)
        return res.status(400).json({ message: 'Invalid variants format' })
      }
    }

    // Parse dimensions
    let parsedDimensions = product.dimensions || {}
    if (dimensions) {
      try {
        parsedDimensions = JSON.parse(dimensions)
      } catch (error) {
        parsedDimensions = product.dimensions || {}
      }
    }

    const updateData = {
      name: name || product.name,
      description: description || product.description,
      fullDescription: fullDescription || product.fullDescription,
      price: price ? parseFloat(price) : product.price,
      salePrice: salePrice ? parseFloat(salePrice) : product.salePrice,
      category: category || product.category,
      subcategory: subcategory || product.subcategory,
      brand: brand || product.brand,
      images: processedImages,
      variants: parsedVariants,
      materials: materials || product.materials,
      care: care || product.care,
      weight: weight ? parseFloat(weight) : product.weight,
      dimensions: parsedDimensions,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : product.tags,
      metaTitle: metaTitle || product.metaTitle,
      metaDescription: metaDescription || product.metaDescription,
      status: status || product.status,
      featured: featured === 'true' || featured === true,
      isDigital: isDigital === 'true' || isDigital === true,
      lastModifiedBy: req.user.userId,
      updatedAt: new Date()
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )

    console.log('Product updated successfully:', updatedProduct._id)
    console.log('Images saved:', updatedProduct.images.length)
    res.json(updatedProduct)
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

app.delete('/api/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Order Routes
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod, notes } = req.body

    // Validate required fields
    if (!items || !total || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // Validate payment method
    if (!['cash_on_delivery', 'vodafone_cash', 'visa'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' })
    }

    const order = new Order({
      user: req.user.userId,
      items,
      total,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
      notes: notes || '',
      updatedAt: new Date()
    })

    await order.save()

    // Populate the order with user and product details
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'name images')

    res.status(201).json(populatedOrder)
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    let query = {}
    if (req.user.role !== 'admin') {
      query.user = req.user.userId
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update order status (Admin only)
app.put('/api/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body
    const orderId = req.params.id

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    const validPaymentStatuses = ['pending', 'paid', 'failed']

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' })
    }

    const updateData = { updatedAt: new Date() }
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate('user', 'name email')
     .populate('items.product', 'name images')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single order
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id
    let query = { _id: orderId }

    // Non-admin users can only see their own orders
    if (req.user.role !== 'admin') {
      query.user = req.user.userId
    }

    const order = await Order.findOne(query)
      .populate('user', 'name email')
      .populate('items.product', 'name images')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.put('/api/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Contact Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    const contact = new Contact({
      name,
      email,
      subject,
      message
    })

    await contact.save()
    res.status(201).json({ message: 'Message sent successfully' })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/contact', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json(contacts)
  } catch (error) {
    console.error('Get contacts error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.put('/api/contact/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' })
    }

    res.json(contact)
  } catch (error) {
    console.error('Update contact status error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Profile Routes
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.userId })
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }
    res.json(profile)
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/profile', authenticateToken, async (req, res) => {
  try {
    console.log('Profile update request received')
    console.log('User ID:', req.user.userId)
    console.log('Request body:', req.body)
    
    const { firstName, lastName, email, phone, address } = req.body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !address) {
      console.log('Missing required fields')
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (!address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      console.log('Missing address fields')
      return res.status(400).json({ message: 'Complete address is required' })
    }

    // Check if profile already exists
    let profile = await Profile.findOne({ user: req.user.userId })
    console.log('Existing profile found:', !!profile)
    
    if (profile) {
      // Update existing profile
      profile.firstName = firstName
      profile.lastName = lastName
      profile.email = email
      profile.phone = phone
      profile.address = address
      profile.updatedAt = new Date()
      await profile.save()
      console.log('Profile updated successfully')
    } else {
      // Create new profile
      profile = new Profile({
        user: req.user.userId,
        firstName,
        lastName,
        email,
        phone,
        address
      })
      await profile.save()
      console.log('New profile created successfully')
    }

    res.json({ message: 'Profile updated successfully', profile })
  } catch (error) {
    console.error('Update profile error:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// WhatsApp Order Route
app.post('/api/whatsapp-order', authenticateToken, async (req, res) => {
  try {
    const { productId, size, color, quantity } = req.body

    // Get product details
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Get user profile
    const profile = await Profile.findOne({ user: req.user.userId })
    if (!profile) {
      return res.status(404).json({ message: 'Please complete your profile first' })
    }

    // Create WhatsApp message
    const customerInfo = `
🌲 *Forest Fashion - طلب جديد*

👤 *بيانات العميل:*
الاسم: ${profile.firstName} ${profile.lastName}
البريد الإلكتروني: ${profile.email}
رقم الهاتف: ${profile.phone}

📍 *عنوان التوصيل:*
${profile.address.street}
${profile.address.city}, ${profile.address.state}
${profile.address.zipCode}
${profile.address.country}

🛍️ *تفاصيل المنتج:*
المنتج: ${product.name}
السعر: ${product.price}
المقاس: ${size || 'غير محدد'}
اللون: ${color || 'غير محدد'}
الكمية: ${quantity || 1}

💰 *إجمالي الطلب:* ${(product.price * (quantity || 1)).toFixed(2)}

---
تم إرسال هذا الطلب من موقع Forest Fashion
    `.trim()

    // WhatsApp URL with pre-filled message
    const whatsappNumber = '201097767079' // Your WhatsApp number
    const encodedMessage = encodeURIComponent(customerInfo)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    res.json({ 
      message: 'WhatsApp order prepared successfully',
      whatsappUrl,
      customerInfo
    })
  } catch (error) {
    console.error('WhatsApp order error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Newsletter Routes
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body

    const existingSubscription = await Newsletter.findOne({ email })
    if (existingSubscription) {
      if (existingSubscription.subscribed) {
        return res.status(400).json({ message: 'Email already subscribed' })
      } else {
        existingSubscription.subscribed = true
        await existingSubscription.save()
        return res.json({ message: 'Subscription reactivated' })
      }
    }

    const subscription = new Newsletter({ email })
    await subscription.save()

    res.status(201).json({ message: 'Successfully subscribed to newsletter' })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/newsletter/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body

    const subscription = await Newsletter.findOne({ email })
    if (!subscription) {
      return res.status(404).json({ message: 'Email not found' })
    }

    subscription.subscribed = false
    await subscription.save()

    res.json({ message: 'Successfully unsubscribed' })
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Admin Dashboard Stats
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()
    const totalUsers = await User.countDocuments()
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)

    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', count: { $sum: '$items.quantity' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' }
    ])

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      topProducts
    })
  } catch (error) {
    console.error('Get admin stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Fix old orders (run once to update existing orders)
app.post('/api/fix-orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await Order.updateMany(
      {
        $or: [
          { paymentMethod: { $exists: false } },
          { paymentStatus: { $exists: false } }
        ]
      },
      {
        $set: {
          paymentMethod: 'cash_on_delivery',
          paymentStatus: 'pending',
          updatedAt: new Date()
        }
      }
    )

    res.json({
      message: 'Orders updated successfully',
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    console.error('Fix orders error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Seed initial admin user (run once)
app.post('/api/seed-admin', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin user already exists' })
    }

    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = new User({
      name: 'Forest Admin',
      email: 'admin@forest-fashion.com',
      password: hashedPassword,
      role: 'admin'
    })

    await admin.save()
    res.json({ message: 'Admin user created successfully' })
  } catch (error) {
    console.error('Seed admin error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Forest Fashion API is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Forest Fashion API server running on port ${PORT}`)
})