const mongoose = require('mongoose')
require('dotenv').config()

async function testAtlasConnection() {
  try {
    console.log('🔗 Testing MongoDB Atlas connection...')
    console.log('📍 Connection URI:', process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@'))
    
    // Connect to Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log('✅ Successfully connected to MongoDB Atlas!')
    
    // Test database operations
    const db = mongoose.connection.db
    
    // List collections
    const collections = await db.listCollections().toArray()
    console.log('📊 Available collections:')
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`)
    })
    
    // Count documents in each collection
    console.log('\n📈 Document counts:')
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments()
      console.log(`   - ${collection.name}: ${count} documents`)
    }
    
    // Test a simple query
    const products = await db.collection('products').find({}).limit(3).toArray()
    console.log('\n🛍️ Sample products:')
    products.forEach(product => {
      console.log(`   - ${product.name} ($${product.price})`)
    })
    
    console.log('\n🎉 Atlas connection test completed successfully!')
    
  } catch (error) {
    console.error('❌ Atlas connection test failed:', error.message)
    if (error.message.includes('authentication failed')) {
      console.log('💡 Check your username and password in the connection string')
    }
    if (error.message.includes('network')) {
      console.log('💡 Check your internet connection and Atlas network access settings')
    }
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB Atlas')
  }
}

// Run test
if (require.main === module) {
  testAtlasConnection()
}

module.exports = { testAtlasConnection }
