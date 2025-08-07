# FOREST - Immersive Youth Fashion Website

A fully immersive, artistic website for the youth fashion brand "FOREST" that creates the experience of stepping into a deep, dark, abandoned forest. Built with pure HTML, CSS, and JavaScript - no external images required.

## 🌲 Brand Concept

**FOREST** represents youth who find beauty in darkness, style with meaning, and strength in solitude. The brand embodies:
- Deep, poetic, rebellious spirit
- Mystical and cinematic atmosphere
- 90s minimalism meets haunted woods aesthetic
- Fashion for wanderers and rebels

## ✨ Features

### Visual Experience
- **100% CSS/SVG Design**: No external images - everything generated through code
- **Deep Forest Atmosphere**: Layered gradients, tree silhouettes, animated fog
- **Immersive Animations**: Floating particles, swaying trees, glowing elements
- **Parallax Effects**: Mouse and scroll-based depth movement
- **Custom Cursor**: Glowing orb that follows mouse movement

### Sections
1. **Home (The Forest Gate)**: Mystical entrance with animated logo and call-to-action
2. **About (The Path)**: Visual storytelling with glowing path markers
3. **Shop (The Grove)**: Product grid with hover effects and light reveals
4. **Contact (The Whisper)**: Cave-like form interface with ambient styling

### Technical Features
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: 60fps performance with throttled scroll events
- **Interactive Elements**: Product modals, form validation, notifications
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Performance Optimized**: Reduced animations on mobile devices

## 🎨 Design Elements

### Color Palette
- Primary: Deep blacks (#0a0a0a, #000000)
- Forest tones: Dark greens (#0f1a0f)
- Earth tones: Dark browns (#1a0f0a)
- Accents: White with low opacity (rgba(255,255,255,0.05-0.9))

### Typography
- **Headers**: Unbounded (modern, geometric)
- **Body**: Cinzel (elegant serif)
- **Weights**: 300-700 range for hierarchy

### Animations
- Tree swaying with natural easing
- Floating particles with random paths
- Fog drift with organic movement
- Logo carving effect with SVG path animation
- Glow effects on hover and focus states

## 🚀 Getting Started

### Installation
1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. No build process or dependencies required

### File Structure
```
forest-website/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS styling and animations
├── script.js           # JavaScript interactions and effects
└── README.md           # This documentation
```

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🎯 Key Interactions

### Navigation
- Smooth scroll between sections
- Active state tracking on scroll
- Hover effects with glow animations

### Product Cards
- Hover reveals with light effects
- Click opens product modal
- Parallax movement on mouse interaction

### Form Experience
- Floating labels with focus states
- Glow effects on input focus
- Success/error notifications
- Cave-like atmospheric styling

### Ambient Features
- Optional sound toggle (framework included)
- Custom cursor with glow trail
- Loading animation on page load
- Performance-optimized scroll effects

## 🔧 Customization

### Adding Products
Edit the `.products-grid` section in `index.html`:
```html
<div class="product-card" data-product="new-item">
    <div class="product-image">
        <div class="product-placeholder">
            <!-- Custom SVG icon here -->
        </div>
        <div class="product-glow"></div>
    </div>
    <div class="product-info">
        <h3 class="product-name">New Item</h3>
        <p class="product-price">$XX</p>
    </div>
</div>
```

### Modifying Colors
Update CSS custom properties in `styles.css`:
```css
:root {
    --forest-black: #0a0a0a;
    --forest-green: #0f1a0f;
    --forest-brown: #1a0f0a;
    --forest-white: rgba(255, 255, 255, 0.9);
}
```

### Animation Timing
Adjust animation durations in keyframes:
```css
@keyframes treeSway {
    /* Modify duration in animation property */
    animation: treeSway 8s ease-in-out infinite;
}
```

## 🌟 Advanced Features

### Performance Optimization
- Throttled scroll events (60fps)
- Reduced particle count on mobile
- CSS-only animations where possible
- Intersection Observer for efficient animations

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly labels
- Reduced motion respect (can be added)

### Extensibility
- Modular CSS structure
- Event-driven JavaScript
- Easy to add new sections
- Component-based product cards

## 📱 Mobile Experience

The mobile version includes:
- Simplified navigation
- Reduced particle effects for performance
- Touch-optimized interactions
- Responsive typography scaling
- Optimized tree animations

## 🎵 Audio Integration

Framework included for ambient forest sounds:
- Toggle button in bottom right
- Volume controls
- Loop functionality
- Audio file loading system

To implement:
1. Add audio files to project
2. Update file paths in `script.js`
3. Uncomment audio-related code

## 🔮 Future Enhancements

Potential additions:
- WebGL particle systems
- Three.js 3D forest elements
- Advanced parallax with depth layers
- Shopping cart functionality
- User accounts and wishlist
- Product filtering and search
- Blog/story section
- Social media integration

## 📄 License

This project is created as a demonstration of immersive web design. Feel free to use as inspiration or starting point for your own projects.

## 🌲 Philosophy

*"In the depths of the forest, where silence speaks louder than words, we find not just fashion, but identity. FOREST is for those who walk their own path through the darkness, finding beauty in the mysterious and strength in solitude."*

---

**Enter the Forest. Every click is a step deeper.**
