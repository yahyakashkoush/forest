const mongoose = require('mongoose')

// Enhanced Product Schema (same as in index.js)
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
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const Product = mongoose.model('Product', productSchema)

// Sample products data
const sampleProducts = [
  {
    name: "Shadow Hoodie Pro",
    description: "Premium dark hoodie for urban rebels who walk in shadows",
    fullDescription: "Crafted from the finest organic cotton, this hoodie embodies the spirit of the forest. Perfect for those who find beauty in darkness and strength in solitude. Features a relaxed fit with ribbed cuffs and hem.",
    price: 89.99,
    salePrice: 79.99,
    category: "Hoodies",
    subcategory: "Premium",
    brand: "FOREST",
    sku: "FOREST-SHADOW-001",
    images: [
      {
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMGEwYTBhIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaGFkb3cgSG9vZGllPC90ZXh0Pgo8L3N2Zz4=",
        alt: "Shadow Hoodie Pro - Front View",
        isPrimary: true,
        order: 0
      }
    ],
    variants: [
      {
        color: "Midnight Black",
        colorCode: "#000000",
        sizes: [
          { size: "S", quantity: 15, reserved: 0, lowStockThreshold: 5 },
          { size: "M", quantity: 25, reserved: 2, lowStockThreshold: 5 },
          { size: "L", quantity: 20, reserved: 1, lowStockThreshold: 5 },
          { size: "XL", quantity: 10, reserved: 0, lowStockThreshold: 5 }
        ]
      },
      {
        color: "Forest Green",
        colorCode: "#0f1a0f",
        sizes: [
          { size: "S", quantity: 8, reserved: 0, lowStockThreshold: 5 },
          { size: "M", quantity: 12, reserved: 1, lowStockThreshold: 5 },
          { size: "L", quantity: 15, reserved: 0, lowStockThreshold: 5 },
          { size: "XL", quantity: 6, reserved: 0, lowStockThreshold: 5 }
        ]
      },
      {
        color: "Dark Brown",
        colorCode: "#1a0f0a",
        sizes: [
          { size: "S", quantity: 5, reserved: 0, lowStockThreshold: 5 },
          { size: "M", quantity: 8, reserved: 0, lowStockThreshold: 5 },
          { size: "L", quantity: 10, reserved: 1, lowStockThreshold: 5 },
          { size: "XL", quantity: 4, reserved: 0, lowStockThreshold: 5 }
        ]
      }
    ],
    materials: "100% Organic Cotton, Recycled Polyester Lining",
    care: "Machine wash cold, Tumble dry low, Do not bleach",
    weight: 650,
    dimensions: { length: 70, width: 55, height: 2 },
    tags: ["streetwear", "urban", "dark", "gothic", "premium", "hoodie"],
    metaTitle: "Shadow Hoodie Pro - Premium Dark Streetwear | FOREST",
    metaDescription: "Discover the Shadow Hoodie Pro - premium organic cotton hoodie for urban rebels. Available in multiple colors and sizes with fast shipping.",
    status: "active",
    featured: true,
    isDigital: false
  },
  {
    name: "Whisper Tee",
    description: "Minimalist t-shirt that speaks in silence",
    fullDescription: "A perfect blend of comfort and style. This premium t-shirt features a soft cotton blend that feels like a whisper against your skin. Designed for those who appreciate subtle elegance.",
    price: 45.99,
    category: "T-Shirts",
    subcategory: "Basic",
    brand: "FOREST",
    sku: "FOREST-WHISPER-002",
    images: [
      {
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMWExYTFhIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5XaGlzcGVyIFRlZTwvdGV4dD4KPC9zdmc+",
        alt: "Whisper Tee - Front View",
        isPrimary: true,
        order: 0
      }
    ],
    variants: [
      {
        color: "Charcoal Gray",
        colorCode: "#36454f",
        sizes: [
          { size: "S", quantity: 20, reserved: 0, lowStockThreshold: 5 },
          { size: "M", quantity: 30, reserved: 3, lowStockThreshold: 5 },
          { size: "L", quantity: 25, reserved: 1, lowStockThreshold: 5 },
          { size: "XL", quantity: 15, reserved: 0, lowStockThreshold: 5 },
          { size: "XXL", quantity: 8, reserved: 0, lowStockThreshold: 5 }
        ]
      },
      {
        color: "Ash White",
        colorCode: "#f5f5f5",
        sizes: [
          { size: "S", quantity: 12, reserved: 0, lowStockThreshold: 5 },
          { size: "M", quantity: 18, reserved: 2, lowStockThreshold: 5 },
          { size: "L", quantity: 15, reserved: 0, lowStockThreshold: 5 },
          { size: "XL", quantity: 10, reserved: 1, lowStockThreshold: 5 }
        ]
      }
    ],
    materials: "60% Cotton, 40% Modal Blend",
    care: "Machine wash warm, Tumble dry medium",
    weight: 180,
    dimensions: { length: 72, width: 50, height: 1 },
    tags: ["basic", "minimal", "comfortable", "everyday", "tee"],
    metaTitle: "Whisper Tee - Minimalist Cotton T-Shirt | FOREST",
    metaDescription: "Soft and comfortable Whisper Tee made from premium cotton blend. Perfect for everyday wear with minimalist design.",
    status: "active",
    featured: false,
    isDigital: false
  },
  {
    name: "Void Jacket",
    description: "Embrace the darkness with this statement jacket",
    fullDescription: "A bold statement piece for those who dare to be different. This jacket features unique design elements inspired by the depths of the forest, with premium materials and attention to detail.",
    price: 159.99,
    salePrice: 139.99,
    category: "Jackets",
    subcategory: "Statement",
    brand: "FOREST",
    sku: "FOREST-VOID-003",
    images: [
      {
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMGYwZjBmIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Wb2lkIEphY2tldDwvdGV4dD4KPC9zdmc+",
        alt: "Void Jacket - Front View",
        isPrimary: true,
        order: 0
      }
    ],
    variants: [
      {
        color: "Deep Black",
        colorCode: "#000000",
        sizes: [
          { size: "S", quantity: 6, reserved: 1, lowStockThreshold: 3 },
          { size: "M", quantity: 10, reserved: 0, lowStockThreshold: 3 },
          { size: "L", quantity: 8, reserved: 2, lowStockThreshold: 3 },
          { size: "XL", quantity: 5, reserved: 0, lowStockThreshold: 3 }
        ]
      },
      {
        color: "Midnight Navy",
        colorCode: "#191970",
        sizes: [
          { size: "S", quantity: 4, reserved: 0, lowStockThreshold: 3 },
          { size: "M", quantity: 7, reserved: 1, lowStockThreshold: 3 },
          { size: "L", quantity: 6, reserved: 0, lowStockThreshold: 3 },
          { size: "XL", quantity: 3, reserved: 0, lowStockThreshold: 3 }
        ]
      }
    ],
    materials: "Shell: 100% Nylon, Lining: 100% Polyester, Insulation: Down Alternative",
    care: "Dry clean only, Do not bleach",
    weight: 850,
    dimensions: { length: 75, width: 60, height: 3 },
    tags: ["jacket", "outerwear", "statement", "premium", "winter"],
    metaTitle: "Void Jacket - Premium Statement Outerwear | FOREST",
    metaDescription: "Make a statement with the Void Jacket. Premium materials and unique design for those who embrace the darkness.",
    status: "active",
    featured: true,
    isDigital: false
  },
  {
    name: "Silent Pants",
    description: "Move through the world without a sound",
    fullDescription: "Designed for stealth and comfort, these pants offer the perfect balance of style and functionality. Made with technical fabrics that move with you.",
    price: 79.99,
    category: "Pants",
    subcategory: "Technical",
    brand: "FOREST",
    sku: "FOREST-SILENT-004",
    images: [
      {
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMmEyYTJhIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaWxlbnQgUGFudHM8L3RleHQ+Cjwvc3ZnPg==",
        alt: "Silent Pants - Front View",
        isPrimary: true,
        order: 0
      }
    ],
    variants: [
      {
        color: "Shadow Black",
        colorCode: "#1c1c1c",
        sizes: [
          { size: "28", quantity: 8, reserved: 0, lowStockThreshold: 3 },
          { size: "30", quantity: 12, reserved: 1, lowStockThreshold: 3 },
          { size: "32", quantity: 15, reserved: 2, lowStockThreshold: 3 },
          { size: "34", quantity: 10, reserved: 0, lowStockThreshold: 3 },
          { size: "36", quantity: 6, reserved: 0, lowStockThreshold: 3 }
        ]
      },
      {
        color: "Urban Gray",
        colorCode: "#4a4a4a",
        sizes: [
          { size: "28", quantity: 5, reserved: 0, lowStockThreshold: 3 },
          { size: "30", quantity: 8, reserved: 0, lowStockThreshold: 3 },
          { size: "32", quantity: 10, reserved: 1, lowStockThreshold: 3 },
          { size: "34", quantity: 7, reserved: 0, lowStockThreshold: 3 },
          { size: "36", quantity: 4, reserved: 0, lowStockThreshold: 3 }
        ]
      }
    ],
    materials: "95% Cotton, 5% Elastane",
    care: "Machine wash cold, Hang dry",
    weight: 420,
    dimensions: { length: 110, width: 40, height: 1 },
    tags: ["pants", "technical", "comfortable", "stretch", "urban"],
    metaTitle: "Silent Pants - Technical Urban Pants | FOREST",
    metaDescription: "Move silently through the city with these technical pants. Comfortable stretch fabric with urban styling.",
    status: "active",
    featured: false,
    isDigital: false
  }
]

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/forest-fashion')
    console.log('Connected to MongoDB')

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts)
    console.log(`Inserted ${insertedProducts.length} sample products`)

    console.log('Sample products created successfully!')
    console.log('Products:')
    insertedProducts.forEach(product => {
      const totalStock = product.variants.reduce((total, variant) => 
        total + variant.sizes.reduce((sum, size) => sum + size.quantity, 0), 0
      )
      console.log(`- ${product.name} (${product.variants.length} colors, ${totalStock} total stock)`)
    })

  } catch (error) {
    console.error('Error seeding products:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the seeding function
if (require.main === module) {
  seedProducts()
}

module.exports = { seedProducts, sampleProducts }
