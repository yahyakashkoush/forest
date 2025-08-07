// ===== CUSTOM CURSOR ===== 
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('body::before');
    if (cursor) {
        document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
    }
});

// Update CSS to use custom properties for cursor
const style = document.createElement('style');
style.textContent = `
    body::before {
        left: var(--cursor-x, 0px);
        top: var(--cursor-y, 0px);
    }
`;
document.head.appendChild(style);

// ===== SMOOTH SCROLLING & NAVIGATION =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Navigation link handling
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Update active nav link on scroll
    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    // Handle nav link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

// ===== PARALLAX EFFECTS =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.tree, .fog, .particle');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// ===== MOUSE PARALLAX FOR TREES =====
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const trees = document.querySelectorAll('.tree');
    trees.forEach((tree, index) => {
        const intensity = (index + 1) * 2;
        const xOffset = (mouseX - 0.5) * intensity;
        const yOffset = (mouseY - 0.5) * intensity;
        
        tree.style.transform += ` translate(${xOffset}px, ${yOffset}px)`;
    });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.path-step, .product-card, .form-group');
    animateElements.forEach(el => observer.observe(el));
});

// ===== PRODUCT CARD INTERACTIONS =====
document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add glow effect
            card.style.boxShadow = '0 20px 40px rgba(255, 255, 255, 0.1)';
            
            // Animate product placeholder
            const placeholder = card.querySelector('.product-placeholder');
            if (placeholder) {
                placeholder.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
            
            const placeholder = card.querySelector('.product-placeholder');
            if (placeholder) {
                placeholder.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Click handler for product cards
        card.addEventListener('click', () => {
            const productName = card.querySelector('.product-name').textContent;
            showProductModal(productName);
        });
    });
});

// ===== PRODUCT MODAL (Simple implementation) =====
function showProductModal(productName) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${productName}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>This is where the detailed product information would go.</p>
                <p>In a real implementation, this would show:</p>
                <ul>
                    <li>Product images</li>
                    <li>Detailed description</li>
                    <li>Size options</li>
                    <li>Add to cart functionality</li>
                </ul>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        color: white;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    `;
    
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // Close handlers
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    function closeModal() {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.8)';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
}

// ===== FORM HANDLING =====
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.whisper-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Your whisper has been sent into the void...', 'success');
            form.reset();
        });
    }
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'rgba(255, 100, 100, 0.9)' : 'rgba(100, 255, 100, 0.9)'};
        color: black;
        padding: 15px 20px;
        border-radius: 6px;
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Cinzel', serif;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ===== AMBIENT SOUND TOGGLE (Optional) =====
let ambientSound = null;

function toggleAmbientSound() {
    if (!ambientSound) {
        // In a real implementation, you would load an actual audio file
        console.log('Ambient forest sounds would play here');
        // ambientSound = new Audio('path/to/forest-ambient.mp3');
        // ambientSound.loop = true;
        // ambientSound.volume = 0.3;
        // ambientSound.play();
    } else {
        ambientSound.pause();
        ambientSound = null;
    }
}

// Add sound toggle button (optional)
document.addEventListener('DOMContentLoaded', () => {
    const soundToggle = document.createElement('button');
    soundToggle.innerHTML = '🔊';
    soundToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        font-size: 20px;
        transition: all 0.3s ease;
    `;
    
    soundToggle.addEventListener('click', toggleAmbientSound);
    soundToggle.addEventListener('mouseenter', () => {
        soundToggle.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    soundToggle.addEventListener('mouseleave', () => {
        soundToggle.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    
    document.body.appendChild(soundToggle);
});

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations here
}, 16)); // ~60fps

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0a0a0a;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 1s ease;
    `;
    
    loader.innerHTML = `
        <div style="
            font-family: 'Unbounded', sans-serif;
            font-size: 2rem;
            color: white;
            text-align: center;
            animation: pulse 2s ease-in-out infinite;
        ">
            ENTERING THE FOREST...
        </div>
    `;
    
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(loader)) {
                document.body.removeChild(loader);
            }
        }, 1000);
    }, 2000);
});
