const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const nodemailer = require('nodemailer')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Multer configuration for file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage })

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/forest-fashion', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB')
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

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  images: [{ type: String }],
  materials: { type: String },
  care: { type: String },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
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
  shippingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    country: String
  },
  createdAt: { type: Date, default: Date.now }
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

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (buffer, folder = 'forest-fashion') => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary is properly configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_name' ||
        !process.env.CLOUDINARY_API_KEY || 
        process.env.CLOUDINARY_API_KEY === 'your_cloudinary_key' ||
        !process.env.CLOUDINARY_API_SECRET || 
        process.env.CLOUDINARY_API_SECRET === 'your_cloudinary_secret') {
      console.warn('Cloudinary not configured, skipping image upload')
      resolve(null)
      return
    }

    cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error)
          reject(error)
        } else {
          resolve(result.secure_url)
        }
      }
    ).end(buffer)
  })
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

app.post('/api/products', authenticateToken, requireAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      fullDescription,
      price,
      category,
      sizes,
      colors,
      materials,
      care,
      inStock,
      featured
    } = req.body

    console.log('Creating product with data:', req.body)

    // Upload images to Cloudinary
    const imageUrls = []
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const imageUrl = await uploadToCloudinary(file.buffer, 'forest-fashion/products')
          if (imageUrl) {
            imageUrls.push(imageUrl)
          }
        } catch (error) {
          console.warn('Failed to upload image, continuing without it:', error.message)
        }
      }
    }

    const product = new Product({
      name,
      description,
      fullDescription: fullDescription || '',
      price: parseFloat(price),
      category,
      sizes: Array.isArray(sizes) ? sizes : (sizes ? sizes.split(',').filter(s => s.trim()) : []),
      colors: Array.isArray(colors) ? colors : (colors ? colors.split(',').filter(c => c.trim()) : []),
      images: imageUrls,
      materials: materials || '',
      care: care || '',
      inStock: inStock === 'true' || inStock === true,
      featured: featured === 'true' || featured === true
    })

    await product.save()
    console.log('Product created successfully:', product._id)
    res.status(201).json(product)
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

app.put('/api/products/:id', authenticateToken, requireAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      fullDescription,
      price,
      category,
      sizes,
      colors,
      materials,
      care,
      inStock,
      featured
    } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Upload new images if provided
    let imageUrls = product.images
    if (req.files && req.files.length > 0) {
      imageUrls = []
      for (const file of req.files) {
        try {
          const imageUrl = await uploadToCloudinary(file.buffer, 'forest-fashion/products')
          if (imageUrl) {
            imageUrls.push(imageUrl)
          }
        } catch (error) {
          console.warn('Failed to upload image, continuing without it:', error.message)
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        fullDescription: fullDescription || '',
        price: parseFloat(price),
        category,
        sizes: Array.isArray(sizes) ? sizes : (sizes ? sizes.split(',').filter(s => s.trim()) : []),
        colors: Array.isArray(colors) ? colors : (colors ? colors.split(',').filter(c => c.trim()) : []),
        images: imageUrls,
        materials: materials || '',
        care: care || '',
        inStock: inStock === 'true' || inStock === true,
        featured: featured === 'true' || featured === true
      },
      { new: true }
    )

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
    const { items, total, shippingAddress } = req.body

    const order = new Order({
      user: req.user.userId,
      items,
      total,
      shippingAddress
    })

    await order.save()
    res.status(201).json(order)
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

    // Send email notification (optional)
    // You can implement email sending here using nodemailer

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