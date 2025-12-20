// EmailJS Configuration
(function() {
    try {
        const publicKey = "Vfk6hO5CP6gUn-ExC"; // ✅ Public Key
        emailjs.init(publicKey);
        console.log('✅ EmailJS initialized with Public Key:', publicKey);
    } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
        showNotification('Greška: EmailJS nije inicijalizovan.', 'error');
    }
})();

// DOM Elements
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('galleryModal');
const modalImage = document.querySelector('.modal-image');
const closeModal = document.querySelector('.close-modal');
const appointmentForm = document.getElementById('appointmentForm');
const backToTopBtn = document.getElementById('backToTop');

// Page Navigation State
let currentPage = 'home';
let previousPage = 'home';

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 HairStyle Studio Initialized');
    init();
});

function init() {
    setupEventListeners();
    setupPageTransitions();
    setupSmoothScrolling();
    setupIntersectionObserver();
    updateActiveNav();
    setupTestimonialsCarousel();
    setupBackToTop();
}

// Event Listeners Setup
function setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', debounce(handleScroll, 10));
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Gallery modal
    galleryItems.forEach(item => {
        item.addEventListener('click', openGalleryModal);
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', closeGalleryModal);
    }
    
    // Modal close on outside click
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeGalleryModal();
        }
    });
    
    // Appointment form submission
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Handle window resize
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Handle escape key for modal
    document.addEventListener('keydown', handleKeydown);
}

// Mobile Menu Toggle - FIXED
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Animate hamburger icon
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (navMenu.classList.contains('active')) {
            bar.style.transform = index === 0 ? 'rotate(45deg) translate(5px, 5px)' :
                             index === 1 ? 'opacity: 0' :
                             'rotate(-45deg) translate(7px, -6px)';
        } else {
            bar.style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking on a link
function handleNavClick(e) {
    e.preventDefault();
    
    const targetPage = this.getAttribute('data-page');
    if (targetPage === currentPage) return;
    
    previousPage = currentPage;
    currentPage = targetPage;
    
    // Close mobile menu if open
    if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    // Navigate to page with transition
    navigateToPage(targetPage);
}

// Handle Resize - FIXED
function handleResize() {
    // Update any layout-dependent elements
    updateActiveNav();
    
    // Close mobile menu on larger screens
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
}

// Form validation function
function validateFormData(data) {
    const required = ['name', 'email', 'phone', 'service', 'date', 'time'];
    
    for (const field of required) {
        if (!data[field] || data[field].trim() === '') {
            console.warn(`⚠️ Missing required field: ${field}`);
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        console.warn('⚠️ Invalid email format:', data.email);
        return false;
    }
    
    return true;
}

// Testimonials Carousel Setup
function setupTestimonialsCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    if (slides.length === 0) return;
    
    let currentIndex = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
        });
        slides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }
    
    // Auto-rotate testimonials
    let interval = setInterval(nextSlide, 5000);
    
    // Add event listeners for manual controls
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(interval);
            nextSlide();
            interval = setInterval(nextSlide, 5000);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(interval);
            prevSlide();
            interval = setInterval(nextSlide, 5000);
        });
    }
}

// Back to Top Button Setup
function setupBackToTop() {
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Handle Scroll Events
function handleScroll() {
    const scrolled = window.pageYOffset > 100;
    
    if (scrolled) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active navigation based on scroll position
    updateActiveNav();
}

// Navigation Click Handler
function handleNavClick(e) {
    e.preventDefault();
    
    const targetPage = this.getAttribute('data-page');
    if (targetPage === currentPage) return;
    
    previousPage = currentPage;
    currentPage = targetPage;
    
    // Close mobile menu if open
    if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    // Navigate to page with transition
    navigateToPage(targetPage);
}

// Page Navigation with Transitions
function navigateToPage(pageId) {
    console.log(`📍 Navigating to: ${pageId}`);
    
    // Remove active classes from all pages
    pages.forEach(page => {
        page.classList.remove('active', 'slide-left', 'slide-right');
    });
    
    // Update navigation links
    updateNavLinks(pageId);
    
    // Get target page element
    const targetPage = document.getElementById(pageId);
    if (!targetPage) return;
    
    // Determine transition direction
    const currentIndex = Array.from(pages).findIndex(page => page.id === currentPage);
    const targetIndex = Array.from(pages).findIndex(page => page.id === pageId);
    
    // Add appropriate transition class
    if (targetIndex > currentIndex) {
        targetPage.classList.add('slide-left');
    } else {
        targetPage.classList.add('slide-right');
    }
    
    // Show page after a brief delay for animation
    setTimeout(() => {
        targetPage.classList.add('active');
        
        // Scroll to top for internal navigation
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 50);
}

// Update Navigation Links
function updateNavLinks(activePage) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === activePage) {
            link.classList.add('active');
        }
    });
}

// Setup Page Transitions
function setupPageTransitions() {
    // Add CSS classes for transition states
    document.body.classList.add('page-transitions-enabled');
}

// Smooth Scrolling for internal links
function setupSmoothScrolling() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle data-page links specifically for our navigation
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            navigateToPage(pageId);
        });
    });
}

// Intersection Observer for Animations
function setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Add stagger effect for grid items
                if (entry.target.classList.contains('gallery-item') || 
                    entry.target.classList.contains('team-member') || 
                    entry.target.classList.contains('feature-card') ||
                    entry.target.classList.contains('service-detail') ||
                    entry.target.classList.contains('award-card') ||
                    entry.target.classList.contains('faq-item') ||
                    entry.target.classList.contains('additional-card') ||
                    entry.target.classList.contains('about-image')) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, 100 * Array.from(entry.target.parentElement.children).indexOf(entry.target));
                } else {
                    entry.target.classList.add('animated');
                }
                observer.unobserve(entry.target);
            }   
        }); 
              
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.gallery-item, .team-member, .feature-card, .service-detail, .about-image, .award-card, .faq-item, .additional-card'
    );
    
    animatedElements.forEach((el, index) => {
        setTimeout(() => {
            observer.observe(el);
        }, 100 * index);
    });
}

// Update Active Navigation
function updateActiveNav() {
    const sections = document.querySelectorAll('.page');
    const scrollPosition = window.pageYOffset + 200; // Offset for fixed navbar
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    if (currentSection && currentSection !== currentPage) {
        previousPage = currentPage;
        currentPage = currentSection;
        updateNavLinks(currentSection);
    }
}

// Gallery Modal Functions
function openGalleryModal(e) {
    const imgSrc = this.querySelector('img').src;
    const altText = this.querySelector('img').alt;
    
    modalImage.src = imgSrc;
    modalImage.alt = altText;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation
    setTimeout(() => {
        modalImage.style.opacity = '1';
        modalImage.style.transform = 'scale(1)';
    }, 10);
}

function closeGalleryModal() {
    // Add exit animation
    modalImage.style.opacity = '0';
    modalImage.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Form Submission Handler - UPDATED WITH EMAILJS
function handleAppointmentSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<span class="loading"></span> Slanje...';
    submitBtn.disabled = true;
    
    // Validate form data
    if (!validateFormData(data)) {
        showNotification('Molimo popunite sva obavezna polja.', 'error');
        submitBtn.disabled = false;
        return;
    }
    
    // EmailJS Configuration
    const SERVICE_ID = "NAPAfrizer";
    const TEMPLATE_ID = "template_h79xsa9";
    
    const emailParams = {
        to_email: 'developmentnapa@gmail.com',
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        service: data.service,
        date: data.date,
        time: data.time,
        message: data.message || 'Nema dodatnih informacija',
        sent_date: new Date().toLocaleString('sr-RS')
    };
    
    console.log('📧 Email Parameters:', emailParams);
    
    emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams)
        .then((response) => {
            console.log('✅ Email sent successfully:', response);
            showNotification('Uspešno ste poslali poruku!', 'success');
            e.target.reset();
            submitBtn.innerHTML = 'Pošalji';
            submitBtn.disabled = false;
        })
        .catch((error) => {
            console.error('❌ Email sending failed:', error);
            showNotification('Došlo je do greške. Molimo pokušajte kasnije.', 'error');
            submitBtn.innerHTML = 'Pošalji';
            submitBtn.disabled = false;
        });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles for notification
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                z-index: 3000;
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                max-width: 400px;
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            .notification-success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            .notification-error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            .notification-info {
                background: #d1ecf1;
                color: #0c5460;
                border: 1px solid #bee5eb;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: auto;
            }
            .notification i {
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 3000);
    
    // Close button event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        default: return 'fa-info-circle';
    }
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 300);
}

// Handle Visibility Changes
function handleVisibilityChange() {
    if (document.hidden) {
        // Page is hidden - pause animations if needed
        document.body.classList.add('page-hidden');
    } else {
        // Page is visible - resume animations
        document.body.classList.remove('page-hidden');
    }
}

// Handle Window Resize
function handleResize() {
    // Update any layout-dependent elements
    updateActiveNav();
    
    // Close mobile menu on larger screens
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
}         

// Handle Keyboard Events
function handleKeydown(e) {
    // Close modal on escape key
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeGalleryModal();
    }
    
    // Navigate with arrow keys in gallery
    if (modal.style.display === 'block' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        navigateGallery(e.key);
    }
}

// Gallery Navigation with Arrow Keys
function navigateGallery(direction) {
    const currentIndex = Array.from(galleryItems).findIndex(item => 
        item.querySelector('img').src === modalImage.src
    );
    
    let newIndex;
    if (direction === 'ArrowLeft') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : galleryItems.length - 1;
    } else {
        newIndex = currentIndex < galleryItems.length - 1 ? currentIndex + 1 : 0;
    }
    
    modalImage.src = galleryItems[newIndex].querySelector('img').src;
}

// Utility Functions
function debounce(func, wait) {
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

// Preload Images for Better Performance
function preloadImages() {
    const images = [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1558452596-c2dcdb8136e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1490300630228-5c95fd2d41fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1514326887256-45d3b67dd782?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Add some interactive effects
function addInteractiveEffects() {
    // Add hover effects to buttons programmatically
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add loading animation to images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
    });
}

// Initialize interactive effects
setTimeout(addInteractiveEffects, 1000);

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        const navTiming = performance.getEntriesByType('navigation')[0];
        console.log('📊 Page Load Time:', navTiming.loadEventEnd - navTiming.navigationStart, 'ms');
    }
}

// Call performance monitoring
monitorPerformance();

// Export functions for potential module use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        navigateToPage,
        showNotification,
        validateFormData
    };
}