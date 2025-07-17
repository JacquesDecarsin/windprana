// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuButton = document.querySelector('.menu-mobile');
    const navMenu = document.querySelector('nav');
    
    if (menuButton && navMenu) {
        menuButton.addEventListener('click', function() {
            menuButton.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Initialize spots filtering
    initSpotsFilter();
    
    // Initialize slideshows for each spot
    initSlideshows();
    
    // Initialize lazy loading for videos
    initLazyVideos();
    
    // Initialize FAQ accordions if they exist on the page
    initFAQAccordions();
    
    // Newsletter form validation
    initNewsletterForm();
});

/**
 * Initialize the spots filtering functionality
 */
function initSpotsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const spotSections = document.querySelectorAll('.spot-detail');
    
    if (filterButtons.length === 0 || spotSections.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Show/hide spots based on filter
            spotSections.forEach(spot => {
                const categories = spot.querySelector('.spot-type').getAttribute('data-category').split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    spot.style.display = 'block';
                    // Add a subtle animation when showing
                    spot.style.opacity = '0';
                    setTimeout(() => {
                        spot.style.opacity = '1';
                        spot.style.transition = 'opacity 0.3s ease';
                    }, 10);
                } else {
                    spot.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Initialize slideshows for each spot detail section
 */
function initSlideshows() {
    const slideshows = document.querySelectorAll('.slideshow-container');
    
    slideshows.forEach(slideshow => {
        const slides = slideshow.querySelectorAll('.slide');
        const dots = slideshow.closest('.spot-slideshow').querySelectorAll('.dot');
        const prevBtn = slideshow.querySelector('.prev');
        const nextBtn = slideshow.querySelector('.next');
        
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        
        // Function to show a specific slide
        function showSlide(n) {
            // Reset slide index if out of bounds
            if (n >= slides.length) currentSlide = 0;
            if (n < 0) currentSlide = slides.length - 1;
            
            // Hide all slides
            slides.forEach(slide => slide.style.display = 'none');
            
            // Remove active class from all dots
            if (dots.length > 0) {
                dots.forEach(dot => dot.classList.remove('active'));
            }
            
            // Show the current slide
            slides[currentSlide].style.display = 'block';
            
            // Mark the corresponding dot as active
            if (dots.length > 0 && dots[currentSlide]) {
                dots[currentSlide].classList.add('active');
            }
        }
        
        // Initialize with first slide
        showSlide(currentSlide);
        
        // Event listeners for navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide(--currentSlide);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide(++currentSlide);
            });
        }
        
        // Dot indicators
        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentSlide = index;
                    showSlide(currentSlide);
                });
            });
        }
        
        // Auto-rotate slides every 5 seconds
        setInterval(() => {
            showSlide(++currentSlide);
        }, 5000);
    });
}

/**
 * Initialize lazy loading for video embeds
 */
function initLazyVideos() {
    const videos = document.querySelectorAll('.video-container iframe');
    
    // Simple lazy loading - load videos when they come into view
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target.querySelector('iframe');
                    if (video.getAttribute('data-src')) {
                        video.setAttribute('src', video.getAttribute('data-src'));
                        video.removeAttribute('data-src');
                        videoObserver.unobserve(entry.target);
                    }
                }
            });
        }, { threshold: 0.1 });
        
        videos.forEach(video => {
            if (video.closest('.video-container')) {
                videoObserver.observe(video.closest('.video-container'));
            }
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        videos.forEach(video => {
            if (video.getAttribute('data-src')) {
                video.setAttribute('src', video.getAttribute('data-src'));
                video.removeAttribute('data-src');
            }
        });
    }
}

/**
 * Initialize FAQ accordion functionality if present on the page
 */
function initFAQAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Toggle current item
                item.classList.toggle('active');
                
                // Optional: close other open items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        }
    });
}

/**
 * Initialize newsletter form validation
 */
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Simple email validation
            if (!isValidEmail(email)) {
                showFormMessage(newsletterForm, 'Please enter a valid email address', 'error');
                return;
            }
            
            // Here you would normally send the data to your server
            // For this example, we'll just show a success message
            showFormMessage(newsletterForm, 'Thank you for subscribing!', 'success');
            
            // Clear the form
            emailInput.value = '';
        });
    }
}

/**
 * Simple email validation helper
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Show form feedback message
 */
function showFormMessage(form, message, type) {
    // Remove any existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    
    // Insert after the form
    form.insertAdjacentElement('afterend', messageEl);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}

/**
 * Smooth scroll to elements when clicking anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Skip if it's just a # or javascript:void(0)
        if (targetId === '#' || targetId === 'javascript:void(0)') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            
            // Close mobile menu if open
            const navMenu = document.querySelector('nav');
            const menuButton = document.querySelector('.menu-mobile');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuButton) menuButton.classList.remove('active');
            }
            
            // Calculate offset for fixed header
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            
            window.scrollTo({
                top: targetPosition - headerHeight - 20, // 20px additional padding
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Handle window resize events
 */
window.addEventListener('resize', function() {
    // Close mobile menu when resizing to desktop
    if (window.innerWidth > 768) {
        const navMenu = document.querySelector('nav');
        const menuButton = document.querySelector('.menu-mobile');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (menuButton) menuButton.classList.remove('active');
        }
    }
});