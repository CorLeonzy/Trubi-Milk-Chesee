// TRUBI — MULTI-PAGE WEBSITE SCRIPT

// Loading Screen
window.addEventListener("load", function() {
  const loading = document.getElementById("loading-screen");
  if (!loading) return;
  
  // Simulate loading progress
  let progress = 0;
  const progressBar = document.querySelector('.loading-progress');
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progressBar) {
      progressBar.style.width = Math.min(progress, 100) + '%';
    }
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loading.classList.add("fade-out");
        setTimeout(() => {
          loading.style.display = "none";
        }, 600);
      }, 500);
    }
  }, 200);
});

// Mobile Navigation
(function mobileNavInit() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!mobileMenuBtn || !mobileMenu) return;
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  document.body.appendChild(overlay);
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    
    // Update aria attributes
    const isExpanded = mobileMenu.classList.contains('active');
    mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    mobileMenu.setAttribute('aria-hidden', !isExpanded);
  }
  
  // Close mobile menu
  function closeMobileMenu() {
    mobileMenuBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Update aria attributes
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
  
  // Event listeners
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  overlay.addEventListener('click', closeMobileMenu);
  
  // Close menu when clicking on links
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Close menu when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });
})();

// Header scroll effect
window.addEventListener('scroll', function() {
  const header = document.querySelector('.site-header');
  if (header) {
    if (window.scrollY > 100) {
      header.style.background = 'rgba(255, 255, 255, 0.98)';
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
      header.style.background = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = 'none';
    }
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Product filter functionality
document.addEventListener('DOMContentLoaded', function() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');
  
  if (filterTabs.length > 0 && productCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        filterTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        
        productCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
});

// Order product function
function orderProduct(productName) {
  const message = `Halo Trubi! Saya mau pesan ${productName}`;
  const whatsappUrl = `https://wa.me/6289525585293?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

// Animation on scroll
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    observer.observe(el);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimations();
  
  // Add loading state to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      if (this.href && this.href.includes('whatsapp')) {
        return; // Don't show loading for WhatsApp links
      }
      
      const originalText = this.innerHTML;
      this.innerHTML = '<span class="btn-icon">⏳</span>Loading...';
      this.style.pointerEvents = 'none';
      
      setTimeout(() => {
        this.innerHTML = originalText;
        this.style.pointerEvents = 'auto';
      }, 2000);
    });
  });
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
  // Add hover effects to product cards
  const productCards = document.querySelectorAll('.product-card, .quick-link, .value-card');
  productCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Add click effect to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
});

// Utility function for toast notifications
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}
