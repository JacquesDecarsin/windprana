/**
 * WindPrana - Kite & Yoga Adventure - Trips Page JavaScript
 * Handles responsive navigation, trip filtering, FAQ accordion, and other interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    setupMobileMenu();
    
    // Trip filtering functionality
    setupTripFilters();
    
    // FAQ accordion functionality
    setupFaqAccordion();
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Initialize testimonials if needed in the future
    // setupTestimonials();
});

/**
 * Sets up mobile menu toggle functionality
 */
function setupMobileMenu() {
    const menuButton = document.querySelector('.menu-mobile');
    const navigation = document.querySelector('nav');
    
    if (!menuButton || !navigation) return;
    
    menuButton.addEventListener('click', function() {
        // Toggle active class on menu button and navigation
        this.classList.toggle('active');
        navigation.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on a nav link
    const navLinks = navigation.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuButton.classList.remove('active');
            navigation.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navigation.contains(event.target);
        const isClickOnMenuButton = menuButton.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnMenuButton && navigation.classList.contains('active')) {
            menuButton.classList.remove('active');
            navigation.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Handle resize event to reset menu on desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navigation.classList.contains('active')) {
            menuButton.classList.remove('active');
            navigation.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

/**
 * Sets up trip filtering functionality
 */
function setupTripFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tripCards = document.querySelectorAll('.trips-card');
    
    if (!filterButtons.length || !tripCards.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected filter
            const filter = this.getAttribute('data-filter');
            
            // Show/hide trips based on filter
            tripCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    const categories = card.getAttribute('data-category').split(' ');
                    if (categories.includes(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
            
            // Add a smooth fade-in animation for visible cards
            setTimeout(() => {
                document.querySelectorAll('.trips-card[style="display: block;"]').forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('fade-in');
                    }, index * 100);
                });
            }, 50);
        });
    });
}

/**
 * Sets up FAQ accordion functionality
 */
function setupFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (!faqQuestions.length) return;
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Get the answer element
            const answer = this.nextElementSibling;
            
            // Check if this question is already active
            const isActive = this.classList.contains('active');
            
            // Close all other FAQ items
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.classList.remove('active');
                    q.nextElementSibling.style.display = 'none';
                }
            });
            
            // Toggle current FAQ item
            if (isActive) {
                this.classList.remove('active');
                answer.style.display = 'none';
            } else {
                this.classList.add('active');
                answer.style.display = 'block';
            }
        });
    });
    
    // Open the first FAQ item by default
    if (faqQuestions.length > 0) {
        faqQuestions[0].classList.add('active');
        faqQuestions[0].nextElementSibling.style.display = 'block';
    }
}

/**
 * Sets up smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Adds responsive behavior to the testimonials section
 * This function can be expanded later if needed for a testimonial slider
 */
function setupTestimonials() {
    // For future implementation if a slider is needed
    // Example:
    // const testimonials = document.querySelectorAll('.testimonial');
    // if (testimonials.length <= 1) return;
    // 
    // // Code for testimonial slider
}

/**
 * Enhances images with lazy loading and proper sizing
 */
function enhanceImages() {
    const tripImages = document.querySelectorAll('.trips-image');
    
    tripImages.forEach(imageContainer => {
        // Apply background images from data attribute if present
        const bgImage = imageContainer.getAttribute('data-bg');
        if (bgImage) {
            imageContainer.style.backgroundImage = `url(${bgImage})`;
            
            // Add lazy loading functionality
            const img = new Image();
            img.src = bgImage;
            img.onload = function() {
                imageContainer.classList.add('loaded');
            };
        }
    });
}

/**
 * Handle form submissions with validation
 */
function setupForms() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Simple validation
            if (!email || !/\S+@\S+\.\S+/.test(email)) {
                emailInput.classList.add('error');
                return;
            }
            
            // Remove error if previously added
            emailInput.classList.remove('error');
            
            // Show success message
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Thank you for subscribing!';
            successMessage.className = 'success-message';
            
            const formParent = newsletterForm.parentNode;
            formParent.appendChild(successMessage);
            
            // Hide form
            newsletterForm.style.display = 'none';
            
            // Here you would typically send the data to a server
            console.log('Subscription form submitted with email:', email);
        });
    }
}

/**
 * Adds responsive behavior to ensure proper display on all screen sizes
 */
function enhanceResponsiveness() {
    // Check viewport width and make adjustments if needed
    function checkViewport() {
        const width = window.innerWidth;
        
        // Add specific classes based on viewport width
        document.body.classList.toggle('small-viewport', width < 576);
        document.body.classList.toggle('medium-viewport', width >= 576 && width < 768);
        document.body.classList.toggle('large-viewport', width >= 768 && width < 992);
        document.body.classList.toggle('xlarge-viewport', width >= 992);
    }
    
    // Run initially
    checkViewport();
    
    // Update on resize
    window.addEventListener('resize', checkViewport);
    
    // Fix for iOS Safari 100vh issue
    const appHeight = () => {
        const doc = document.documentElement;
        doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    
    window.addEventListener('resize', appHeight);
    appHeight();
}

// Initialize all additional features
document.addEventListener('DOMContentLoaded', function() {
    enhanceImages();
    setupForms();
    enhanceResponsiveness();
});