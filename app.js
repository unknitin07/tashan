// Utility functions
const utils = {
  throttle: (func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  },

  debounce: (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  randomBetween: (min, max) => {
    return Math.random() * (max - min) + min;
  }
};

// Global function for placeholder messages
window.showPlaceholderMessage = function(linkName) {
  NotificationSystem.getInstance().show({
    title: `${linkName} Page`,
    message: `The ${linkName} page is currently under development. Please contact support for more information.`,
    type: 'info',
    duration: 4000
  });
};

// Notification System
class NotificationSystem {
  static instance = null;
  
  static getInstance() {
    if (!NotificationSystem.instance) {
      NotificationSystem.instance = new NotificationSystem();
    }
    return NotificationSystem.instance;
  }

  constructor() {
    this.container = document.getElementById('notification-container');
    this.notifications = [];
  }

  show({ title, message, type = 'info', duration = 3000 }) {
    const notification = this.createNotification({ title, message, type });
    this.container.appendChild(notification);
    this.notifications.push(notification);

    // Show notification
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
      this.remove(notification);
    }, duration);

    return notification;
  }

  createNotification({ title, message, type }) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };

    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${icons[type] || icons.info}</div>
        <div class="notification-text">
          <div class="notification-title">${title}</div>
          <div class="notification-message">${message}</div>
        </div>
      </div>
    `;

    // Click to dismiss
    notification.addEventListener('click', () => {
      this.remove(notification);
    });

    return notification;
  }

  remove(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      this.notifications = this.notifications.filter(n => n !== notification);
    }, 300);
  }
}

// Link Status Indicator
class LinkStatusIndicator {
  constructor() {
    this.indicator = document.getElementById('link-status');
    this.init();
  }

  init() {
    // Listen for external link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[target="_blank"]');
      if (link && link.href && link.href.startsWith('http')) {
        this.showStatus();
      }
    });
  }

  showStatus() {
    this.indicator.classList.add('show');
    setTimeout(() => {
      this.indicator.classList.remove('show');
    }, 2000);
  }
}

// Particle System
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.container = document.getElementById('particles');
    this.maxParticles = this.getMaxParticles();
    this.init();
  }

  getMaxParticles() {
    // Adjust particle count based on device performance
    const width = window.innerWidth;
    if (width < 768) return 20;
    if (width < 1200) return 35;
    return 50;
  }

  init() {
    // Create initial particles
    for (let i = 0; i < this.maxParticles; i++) {
      setTimeout(() => {
        this.createParticle();
      }, i * 100);
    }

    // Start animation loop
    this.animate();
  }

  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random starting position
    const startX = utils.randomBetween(-50, window.innerWidth + 50);
    const startY = window.innerHeight + 50;
    
    // Random properties
    const size = utils.randomBetween(1, 3);
    const duration = utils.randomBetween(12, 25);
    const opacity = utils.randomBetween(0.3, 0.8);
    const driftX = utils.randomBetween(-150, 150);
    
    particle.style.cssText = `
      left: ${startX}px;
      top: ${startY}px;
      width: ${size}px;
      height: ${size}px;
      opacity: ${opacity};
      animation: float ${duration}s linear infinite;
      animation-delay: ${utils.randomBetween(0, 5)}s;
      --drift-x: ${driftX}px;
    `;
    
    this.container.appendChild(particle);
    this.particles.push(particle);

    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
        this.particles = this.particles.filter(p => p !== particle);
      }
    }, (duration + 5) * 1000);
  }

  animate() {
    // Create new particles periodically
    if (this.particles.length < this.maxParticles) {
      if (Math.random() < 0.08) {
        this.createParticle();
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  updateMaxParticles() {
    this.maxParticles = this.getMaxParticles();
  }
}

// Button Ripple Effect
class RippleEffect {
  constructor() {
    this.init();
  }

  init() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => this.createRipple(e));
      button.addEventListener('mouseenter', (e) => this.createHoverEffect(e));
      button.addEventListener('mouseleave', (e) => this.removeHoverEffect(e));
    });
  }

  createRipple(e) {
    const button = e.currentTarget;
    const ripple = button.querySelector('.btn-ripple');
    
    if (ripple) {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        opacity: 1;
      `;
      
      // Trigger animation
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(2.5)';
        ripple.style.opacity = '0';
      });
    }
  }

  createHoverEffect(e) {
    const button = e.currentTarget;
    const glow = button.querySelector('.btn-glow');
    
    if (glow) {
      glow.style.opacity = '1';
    }
    
    // Add subtle vibration effect
    button.style.transform = 'translateY(-3px) scale(1.02)';
  }

  removeHoverEffect(e) {
    const button = e.currentTarget;
    const glow = button.querySelector('.btn-glow');
    
    if (glow && !button.classList.contains('btn-primary')) {
      glow.style.opacity = '0';
    }
    
    button.style.transform = '';
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.elements = [];
    this.init();
  }

  init() {
    // Create intersection observer for fade-in animations
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe elements
    const animatedElements = document.querySelectorAll(
      '.hero-title, .hero-subtitle, .hero-description, .button-group, .banner-container, .disclaimers'
    );

    animatedElements.forEach((el, index) => {
      el.style.cssText = `
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transition-delay: ${index * 0.15}s;
      `;
      this.observer.observe(el);
    });

    // Header scroll effect
    this.initHeaderScroll();
    
    // Parallax effects
    this.initParallax();
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        this.observer.unobserve(entry.target);
      }
    });
  }

  initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    const handleScroll = utils.throttle(() => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        header.style.background = 'rgba(10, 15, 28, 0.95)';
        header.style.backdropFilter = 'blur(20px) saturate(1.2)';
        header.style.borderBottomColor = 'rgba(0, 231, 208, 0.3)';
      } else {
        header.style.background = 'rgba(10, 15, 28, 0.9)';
        header.style.backdropFilter = 'blur(20px)';
        header.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
      }

      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      lastScrollY = currentScrollY;
    }, 10);

    window.addEventListener('scroll', handleScroll);
  }

  initParallax() {
    const banner = document.querySelector('.banner-img');
    const bannerFallback = document.querySelector('.banner-fallback');
    const floatingOrbs = document.querySelectorAll('.floating-orb');
    
    const handleParallax = utils.throttle(() => {
      const scrolled = window.scrollY;
      const rate = scrolled * -0.5;
      
      // Banner parallax
      const bannerElement = banner && banner.style.display !== 'none' ? banner : bannerFallback;
      if (bannerElement) {
        bannerElement.style.transform = `translateY(${rate * 0.1}px) scale(${1 + scrolled * 0.0001})`;
      }
      
      // Floating orbs parallax
      floatingOrbs.forEach((orb, index) => {
        const speed = 0.1 + (index * 0.05);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, 10);

    window.addEventListener('scroll', handleParallax);
  }
}

// Interactive Logo Animation
class LogoAnimation {
  constructor() {
    this.logo = document.querySelector('.logo');
    this.logoGlow = document.querySelector('.logo-glow');
    this.init();
  }

  init() {
    if (!this.logo) return;

    let hoverTimeout;

    this.logo.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      this.logo.style.transform = 'scale(1.1) rotate(5deg)';
      this.logo.style.filter = 'drop-shadow(0 0 30px rgba(0, 231, 208, 0.8))';
      
      if (this.logoGlow) {
        this.logoGlow.style.animation = 'logoGlow 0.5s ease-out forwards';
      }
    });

    this.logo.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        this.logo.style.transform = '';
        this.logo.style.filter = '';
      }, 100);
    });

    // Click animation
    this.logo.addEventListener('click', () => {
      this.logo.style.transform = 'scale(1.15) rotate(10deg)';
      setTimeout(() => {
        this.logo.style.transform = '';
      }, 200);
    });
  }
}

// Background Interaction Effects
class BackgroundEffects {
  constructor() {
    this.init();
  }

  init() {
    // Mouse move particle trail
    let mouseTrail = [];
    const maxTrailLength = 8;

    document.addEventListener('mousemove', utils.throttle((e) => {
      mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
      
      if (mouseTrail.length > maxTrailLength) {
        mouseTrail.shift();
      }

      this.createMouseParticle(e.clientX, e.clientY);
    }, 100));

    // Click burst effect
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.btn') && !e.target.closest('.footer-link')) {
        this.createClickBurst(e.clientX, e.clientY);
      }
    });
  }

  createMouseParticle(x, y) {
    if (Math.random() > 0.8) { // Only create particle 20% of the time
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 3px;
        height: 3px;
        background: rgba(0, 231, 208, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: mouseParticleFade 1.5s ease-out forwards;
      `;
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 1500);
    }
  }

  createClickBurst(x, y) {
    const particleCount = window.innerWidth < 768 ? 6 : 10;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = utils.randomBetween(60, 120);
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: rgba(0, 255, 170, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
      `;
      
      document.body.appendChild(particle);
      
      // Animate particle
      let startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / 1200;
        
        if (progress < 1) {
          const currentX = x + vx * progress;
          const currentY = y + vy * progress + (progress * progress * 120); // Gravity effect
          const opacity = 1 - progress;
          
          particle.style.left = currentX + 'px';
          particle.style.top = currentY + 'px';
          particle.style.opacity = opacity;
          
          requestAnimationFrame(animate);
        } else {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }
      };
      
      requestAnimationFrame(animate);
    }
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.particleSystem = null;
    this.init();
  }

  init() {
    this.monitor();
    
    // Reduce effects on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.body.classList.add('reduced-motion');
    }

    // Detect if user prefers reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion');
    }
  }

  setParticleSystem(particleSystem) {
    this.particleSystem = particleSystem;
  }

  monitor() {
    const currentTime = performance.now();
    this.frameCount++;
    
    if (currentTime >= this.lastTime + 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      // Reduce particle count if FPS is low
      if (this.fps < 30 && this.particleSystem) {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
          if (index % 3 === 0 && particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        });
        this.particleSystem.updateMaxParticles();
      }
    }
    
    requestAnimationFrame(() => this.monitor());
  }
}

// Enhanced Link Functionality
class LinkManager {
  constructor() {
    this.init();
  }

  init() {
    // Add click tracking for external links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link) {
        this.handleLinkClick(link, e);
      }
    });
  }

  handleLinkClick(link, event) {
    const href = link.getAttribute('href');
    
    // Handle external links
    if (href && href.startsWith('http')) {
      const linkText = link.textContent.trim();
      
      NotificationSystem.getInstance().show({
        title: 'Opening External Link',
        message: `Redirecting to ${linkText}...`,
        type: 'info',
        duration: 2000
      });
    }
    
    // Handle internal placeholder links
    if (href && href.startsWith('#')) {
      event.preventDefault();
      const linkText = link.textContent.trim();
      showPlaceholderMessage(linkText);
    }
  }
}

// Main Application
class JalwaGamesApp {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize notification system first
      this.components.notificationSystem = NotificationSystem.getInstance();
      
      // Initialize all components
      this.components.particleSystem = new ParticleSystem();
      this.components.rippleEffect = new RippleEffect();
      this.components.scrollAnimations = new ScrollAnimations();
      this.components.logoAnimation = new LogoAnimation();
      this.components.backgroundEffects = new BackgroundEffects();
      this.components.linkStatusIndicator = new LinkStatusIndicator();
      this.components.linkManager = new LinkManager();
      this.components.performanceMonitor = new PerformanceMonitor();
      
      // Connect components
      this.components.performanceMonitor.setParticleSystem(this.components.particleSystem);

      // Add custom styles
      this.addCustomStyles();
      
      // Initialize responsive handling
      this.handleResize();
      
      // Show welcome notification
      setTimeout(() => {
        this.components.notificationSystem.show({
          title: '🎮 Welcome to Jalwa Games!',
          message: 'Experience the future of online gaming with exciting rewards and bonuses.',
          type: 'success',
          duration: 5000
        });
      }, 1000);
      
      console.log('🎮 Jalwa Games - Futuristic Gaming Platform Loaded Successfully!');
    } catch (error) {
      console.error('Error initializing Jalwa Games app:', error);
      
      // Show error notification if notification system is available
      if (this.components.notificationSystem) {
        this.components.notificationSystem.show({
          title: 'Loading Error',
          message: 'Some features may not work properly. Please refresh the page.',
          type: 'error',
          duration: 5000
        });
      }
    }
  }

  addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes mouseParticleFade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0) translateY(-30px); }
      }

      .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }

      .btn:active {
        transform: translateY(-1px) scale(0.98) !important;
      }

      .logo {
        filter: drop-shadow(0 0 10px rgba(0, 231, 208, 0.3));
      }

      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* Enhanced button hover states */
      .btn:hover .btn-text {
        text-shadow: 0 0 10px currentColor;
      }

      /* Loading state for external links */
      .btn.loading {
        opacity: 0.8;
        pointer-events: none;
      }

      .btn.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  handleResize() {
    const handleResize = utils.debounce(() => {
      // Update particle system for new screen size
      if (this.components.particleSystem) {
        this.components.particleSystem.updateMaxParticles();
      }

      // Recalculate particle positions on resize
      const particles = document.querySelectorAll('.particle');
      particles.forEach(particle => {
        if (Math.random() > 0.5) {
          particle.style.left = utils.randomBetween(-50, window.innerWidth + 50) + 'px';
        }
      });
    }, 250);

    window.addEventListener('resize', handleResize);
  }
}

// Initialize the application
new JalwaGamesApp();
