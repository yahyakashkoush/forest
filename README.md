# 🌲 Forest Fashion - Dark Themed E-commerce Website

A fully immersive, dark-themed fashion e-commerce website inspired by abandoned forests. Built with Next.js, Node.js, and MongoDB.

## ✨ Features

### 🎨 Design & Atmosphere
- **Dark Forest Theme**: Mysterious, atmospheric design with black, dark green, and brown color palette
- **Animated Effects**: Falling leaves, fog animations, tree sway effects
- **Responsive Design**: Mobile-first approach, fully responsive across all devices
- **Custom Animations**: GSAP-powered smooth transitions and hover effects

### 🛍️ E-commerce Functionality
- **Product Catalog**: Full product grid with filtering (size, color, category, price)
- **Product Details**: High-quality image viewer, size/color selection, detailed descriptions
- **Shopping Cart**: Persistent cart with quantity management
- **WhatsApp Checkout**: Direct checkout via WhatsApp integration
- **User Authentication**: Secure login/register system with JWT

### 📱 Pages
1. **Home**: Hero section with brand logo, falling leaves overlay, featured products
2. **Shop**: Product grid with advanced filtering and sorting
3. **Product Details**: Comprehensive product information and purchase options
4. **About**: Brand story with mysterious, atmospheric content
5. **Contact**: Contact form with social media integration
6. **Admin Dashboard**: Complete product and order management

### 🔧 Admin Features
- **Product Management**: Add, edit, delete products with image upload
- **Order Management**: Track and update order statuses
- **User Management**: View and manage user accounts
- **Analytics Dashboard**: Sales stats, popular products, recent orders
- **Contact Management**: Handle customer inquiries

### 🚀 Technical Stack

#### Frontend
- **Next.js 14**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions
- **Axios**: HTTP client for API requests

#### Backend
- **Node.js**: Server runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **Cloudinary**: Image storage and optimization
- **Multer**: File upload handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd forest-fashion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/forest-fashion
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Start the backend server**
   ```bash
   npm run server
   ```

6. **Start the frontend development server**
   ```bash
   npm run dev
   ```

7. **Create admin user** (one-time setup)
   ```bash
   curl -X POST http://localhost:3001/api/seed-admin
   ```
   
   Default admin credentials:
   - Email: admin@forest-fashion.com
   - Password: admin123

### 🌐 Deployment

#### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Backend (Railway/Render)
1. Create a new service on Railway or Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy the `server` directory

#### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update `MONGODB_URI` in environment variables
3. Whitelist your deployment IP addresses

## 📁 Project Structure

```
forest-fashion/
├── app/                    # Next.js app directory
│   ├── components/         # Reusable components
│   ├── context/           # React context providers
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   ├── shop/              # Shop pages
│   ├── product/           # Product detail pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── auth/              # Authentication pages
│   └── admin/             # Admin dashboard
├── server/                # Backend API
│   └── index.js           # Express server
├── public/                # Static assets
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── README.md              # This file
```

## 🎯 Key Features Implementation

### Atmospheric Effects
- **Falling Leaves**: CSS animations with randomized timing and paths
- **Fog Effect**: Layered gradients with smooth movement animations
- **Tree Sway**: Subtle rotation animations for forest elements

### E-commerce Features
- **Cart Management**: Context-based state management with localStorage persistence
- **Product Filtering**: Real-time filtering by category, size, color, and price
- **WhatsApp Integration**: Direct checkout via WhatsApp with formatted messages
- **Image Handling**: Cloudinary integration for optimized image delivery

### Admin Dashboard
- **CRUD Operations**: Full product management with image upload
- **Order Tracking**: Status updates and order history
- **Analytics**: Revenue tracking and popular product insights
- **User Management**: Role-based access control

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variables**: Sensitive data stored securely

## 📱 Mobile Optimization

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Touch Interactions**: Optimized for mobile touch interfaces
- **Performance**: Optimized images and lazy loading
- **Accessibility**: ARIA labels and keyboard navigation support

## 🎨 Customization

### Colors
The color palette can be customized in `tailwind.config.js`:
```javascript
colors: {
  forest: {
    black: '#0a0a0a',
    darkGreen: '#1a2e1a',
    brown: '#3d2914',
    gray: '#2a2a2a',
    lightGray: '#4a4a4a',
    accent: '#4a7c59',
  }
}
```

### Animations
Modify animations in `globals.css` or add new ones using Framer Motion components.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by the mysterious beauty of abandoned forests
- Built with modern web technologies for optimal performance
- Designed for real-world e-commerce applications

## 📞 Support

For support, email support@forest-fashion.com or join our WhatsApp community.

---

**Forest Fashion** - *Born from the heart of the forest* 🌲✨