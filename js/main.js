/* ========================================
   THE ELITE NEST - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== PRELOADER ====================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1500);
    });
    // Fallback: hide preloader after 3 seconds max
    setTimeout(() => preloader.classList.add('hidden'), 3000);

    // ==================== NAVBAR SCROLL ====================
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Header background
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==================== RESPONSIVE DROPDOWN MENU ====================
    const hamburger = document.getElementById('hamburger');
    const mobileDropdown = document.getElementById('mobileDropdown');
    const dropItems = document.querySelectorAll('.mobile-drop-link, .mobile-drop-btn');

    if (hamburger && mobileDropdown) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = hamburger.classList.toggle('active');
            mobileDropdown.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close dropdown when any item inside is clicked
        dropItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileDropdown.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (header && !header.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileDropdown.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDropdown.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileDropdown.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        // Auto close on window resize past 992px
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && mobileDropdown.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileDropdown.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ==================== ACTIVE NAV LINK ON SCROLL ====================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    const dropNavItems = document.querySelectorAll('.mobile-drop-link');

    function updateActiveNav() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });

                dropNavItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ==================== HERO SLIDER ====================
    const heroSlides = document.querySelectorAll('.hero-slide');
    const sliderArrowLeft = document.querySelector('.slider-arrow-left');
    const sliderArrowRight = document.querySelector('.slider-arrow-right');
    const sliderDots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5500;

    function updateSlider(index) {
        heroSlides.forEach(s => s.classList.remove('active'));
        if (heroSlides[index]) {
            heroSlides[index].classList.add('active');
        }
        currentSlide = index;

        // Update indicator dots
        sliderDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === index);
        });
    }

    function goToSlide(dir) {
        let next;
        if (dir === 'next') {
            next = (currentSlide + 1) % heroSlides.length;
        } else {
            next = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        }
        updateSlider(next);
    }

    // Arrow clicks
    if (sliderArrowLeft) {
        sliderArrowLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide('prev');
            resetAutoSlide();
        });
    }

    if (sliderArrowRight) {
        sliderArrowRight.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide('next');
            resetAutoSlide();
        });
    }

    // Dot clicks
    sliderDots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            const slideIdx = parseInt(dot.getAttribute('data-slide'));
            updateSlider(slideIdx);
            resetAutoSlide();
        });
    });

    // Auto-slide
    function startAutoSlide() {
        slideInterval = setInterval(() => goToSlide('next'), slideDuration);
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    if (heroSlides.length > 1) {
        updateSlider(0);
        startAutoSlide();
    }

    // ==================== COUNTER ANIMATION ====================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;

        const statsSection = document.querySelector('.stats-bar');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            statsAnimated = true;

            statNumbers.forEach(num => {
                const target = parseInt(num.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const counter = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(counter);
                    }
                    num.textContent = Math.floor(current);
                }, 16);
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Check on load

    // ==================== GALLERY FILTER ====================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                    item.style.display = '';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });
        });
    });

    // ==================== LIGHTBOX ====================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    let lightboxImages = [];
    let lightboxIndex = 0;

    // Collect all gallery images
    function updateLightboxImages() {
        lightboxImages = [];
        document.querySelectorAll('.gallery-item:not(.hidden) img').forEach(img => {
            lightboxImages.push(img.src.replace('w=500', 'w=1200'));
        });
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateLightboxImages();
            // Find the index of this item in visible items
            const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
            visibleItems.forEach((vi, i) => {
                if (vi === item) lightboxIndex = i;
            });
            lightboxImg.src = lightboxImages[lightboxIndex];
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });

    lightboxPrev.addEventListener('click', () => {
        lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        lightboxImg.src = lightboxImages[lightboxIndex];
    });

    lightboxNext.addEventListener('click', () => {
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        lightboxImg.src = lightboxImages[lightboxIndex];
    });

    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });

    // ==================== TESTIMONIAL SLIDER ====================
    const testimonialTrack = document.getElementById('testimonialTrack');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;

    function goToTestimonial(index) {
        currentTestimonial = index;
        testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToTestimonial(parseInt(dot.getAttribute('data-index')));
        });
    });

    // Auto-slide testimonials
    setInterval(() => {
        const nextIndex = (currentTestimonial + 1) % dots.length;
        goToTestimonial(nextIndex);
    }, 5000);

    // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        // Show success message (replace with actual form submission)
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = '#2ecc71';
        submitBtn.style.borderColor = '#2ecc71';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
            submitBtn.disabled = false;
            contactForm.reset();
        }, 3000);
    });

    // ==================== SCROLL ANIMATIONS ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to animated elements
    const animatedElements = document.querySelectorAll(
        '.room-card, .service-card, .why-us-card, .about-grid, .contact-grid, .gallery-item, .stat-item'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // ==================== SMOOTH SCROLL FOR ALL ANCHOR LINKS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
