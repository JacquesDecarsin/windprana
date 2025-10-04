// Trip carousel and lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    
    // Set up initial slide width and position
    let slideWidth = slides[0].getBoundingClientRect().width;
    let slideMargin = 16; // 1rem gap
    let slideIndex = 0;
    let slidesToShow = calculateSlidesToShow();
    
    // Calculate visible slides based on viewport width
    function calculateSlidesToShow() {
        const viewportWidth = window.innerWidth;
        if (viewportWidth < 576) return 2;
        if (viewportWidth < 768) return 3;
        if (viewportWidth < 992) return 4;
        return 5;
    }
    
    // Update slideWidth on window resize
    window.addEventListener('resize', () => {
        slideWidth = slides[0].getBoundingClientRect().width;
        slidesToShow = calculateSlidesToShow();
        updateCarouselPosition();
    });
    
    // Move to specific slide
    function moveToSlide(index) {
        if (index < 0) {
            slideIndex = slides.length - slidesToShow;
        } else if (index > slides.length - slidesToShow) {
            slideIndex = 0;
        } else {
            slideIndex = index;
        }
        updateCarouselPosition();
    }
    
    // Update carousel position
    function updateCarouselPosition() {
        const offset = -slideIndex * (slideWidth + slideMargin);
        track.style.transform = `translateX(${offset}px)`;
    }
    
    // Add event listeners to buttons
    nextButton.addEventListener('click', () => {
        moveToSlide(slideIndex + 1);
    });
    
    prevButton.addEventListener('click', () => {
        moveToSlide(slideIndex - 1);
    });
    
    // Auto scroll carousel
    let autoScrollInterval = setInterval(() => {
        moveToSlide(slideIndex + 1);
    }, 3000);
    
    // Pause auto scroll on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        autoScrollInterval = setInterval(() => {
            moveToSlide(slideIndex + 1);
        }, 3000);
    });
    
    // Lightbox functionality
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-content img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentImageIndex = 0;
    
    // Open lightbox
    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            const imgSrc = slide.querySelector('img').src;
            // Replace thumbnail path with full-size image path
            const fullSizeImgSrc = imgSrc.replace('thumbnails/', '');
            
            lightboxImg.src = fullSizeImgSrc;
            currentImageIndex = index;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling while lightbox is open
        });
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Click outside to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Navigate through images in lightbox
    lightboxNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % slides.length;
        const imgSrc = slides[currentImageIndex].querySelector('img').src;
        const fullSizeImgSrc = imgSrc.replace('thumbnails/', '');
        lightboxImg.src = fullSizeImgSrc;
    });
    
    lightboxPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + slides.length) % slides.length;
        const imgSrc = slides[currentImageIndex].querySelector('img').src;
        const fullSizeImgSrc = imgSrc.replace('thumbnails/', '');
        lightboxImg.src = fullSizeImgSrc;
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowRight') {
            lightboxNext.click();
        } else if (e.key === 'ArrowLeft') {
            lightboxPrev.click();
        }
    });
});