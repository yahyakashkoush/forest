const mongoose = require('mongoose')
require('dotenv').config()

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)

async function checkUsers() {
  try {
    console.log('🔍 Checking users in MongoDB Atlas...')
    
    // Connect to Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log('✅ Connected to MongoDB Atlas')
    
    // Get all users
    const users = await User.find({}, { password: 0 }) // Exclude password from output
    
    console.log(`\n👥 Found ${users.length} users in Atlas:`)
    console.log('=' .repeat(50))
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. 👤 User Details:`)
      console.log(`   📧 Email: ${user.email}`)
      console.log(`   👤 Name: ${user.name}`)
      console.log(`   🔑 Role: ${user.role}`)
      console.log(`   📅 Created: ${user.createdAt.toLocaleDateString()}`)
      console.log(`   🆔 ID: ${user._id}`)
      console.log('-'.repeat(30))
    })
    
    // Check admin user specifically
    const adminUser = await User.findOne({ role: 'admin' })
    if (adminUser) {
      console.log('\n🔐 Admin User Found:')
      console.log(`   📧 Email: ${adminUser.email}`)
      console.log(`   👤 Name: ${adminUser.name}`)
      console.log(`   🔑 Role: ${adminUser.role}`)
      console.log(`   ✅ Admin can login with: ${adminUser.email} / admin123`)
    } else {
      console.log('\n❌ No admin user found!')
    }
    
    console.log('\n📊 Summary:')
    console.log(`   Total Users: ${users.length}`)
    console.log(`   Admin Users: ${users.filter(u => u.role === 'admin').length}`)
    console.log(`   Regular Users: ${users.filter(u => u.role === 'user').length}`)
    
  } catch (error) {
    console.error('❌ Error checking users:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected from MongoDB Atlas')
  }
}

// Run check
if (require.main === module) {
  checkUsers()
}

module.exports = { checkUsers }
