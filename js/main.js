// Beyond Limits OT - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Dynamic Year in Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Mobile Navigation Toggle for Sticky Nav
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Handle links with hash from other pages
    if (window.location.hash) {
        setTimeout(function() {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        // Check for success parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            if (formMessage) {
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.className = 'form-message success';
            }
            // Clear the URL parameter
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Form validation before submit
        contactForm.addEventListener('submit', function(e) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !message) {
                e.preventDefault();
                if (formMessage) {
                    formMessage.textContent = 'Please fill in all required fields.';
                    formMessage.className = 'form-message error';
                }
                return false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                if (formMessage) {
                    formMessage.textContent = 'Please enter a valid email address.';
                    formMessage.className = 'form-message error';
                }
                return false;
            }

            // If all validation passes, the form will submit normally
        });
    }

    // Header scroll effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }

            lastScrollTop = scrollTop;
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply animation to service cards and other elements
    const animatedElements = document.querySelectorAll('.service-card, .service-detail, .contact-detail-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add active class to current page nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageNavLinks = document.querySelectorAll('nav ul li a');
    pageNavLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Hamburger animation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
});

// ====================================
// STICKY SLIDER NAVIGATION
// ====================================
class StickyNavigation {
    constructor() {
        this.currentId = null;
        this.currentTab = null;
        this.tabContainerHeight = 70;
        this.heroTabs = document.querySelector('.et-hero-tabs');
        this.tabContainer = document.querySelector('.et-hero-tabs-container');
        this.tabs = document.querySelectorAll('.et-hero-tab');
        this.slider = document.querySelector('.et-hero-tab-slider');
        
        // Initialize even without hero section (for other pages)
        if (!this.tabContainer) return;
        
        this.init();
    }
    
    init() {
        // Set active tab based on current page or existing active class
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.tabs.forEach(tab => {
            if (tab.classList.contains('active') || tab.getAttribute('href') === currentPage) {
                tab.classList.add('active');
                this.currentTab = tab;
            }
        });
        
        // Initial slider position with small delay to ensure DOM is ready
        setTimeout(() => this.setSliderCss(), 10);
        
        // Event listeners
        if (this.heroTabs) {
            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        }
        window.addEventListener('resize', () => this.onResize(), { passive: true });
        window.addEventListener('load', () => this.setSliderCss());
        
        // Tab hover effects for slider
        this.tabs.forEach(tab => {
            tab.addEventListener('mouseenter', () => this.onTabHover(tab));
            tab.addEventListener('mouseleave', () => this.setSliderCss());
        });
    }
    
    onScroll() {
        this.checkTabContainerPosition();
    }
    
    onResize() {
        this.setSliderCss();
    }
    
    onTabHover(tab) {
        if (this.slider && tab) {
            const navLinks = document.querySelector('.nav-links');
            const navLinksRect = navLinks ? navLinks.getBoundingClientRect() : null;
            const tabRect = tab.getBoundingClientRect();
            
            const width = tab.offsetWidth;
            const left = navLinksRect ? tabRect.left - navLinksRect.left : tab.offsetLeft;
            
            this.slider.style.width = width + 'px';
            this.slider.style.left = left + 'px';
        }
    }
    
    checkTabContainerPosition() {
        if (!this.heroTabs || !this.tabContainer) return;

        if (window.pageYOffset > 80) {
            this.tabContainer.classList.add('et-hero-tabs-container--top');
        } else {
            this.tabContainer.classList.remove('et-hero-tabs-container--top');
        }
    }
    
    setSliderCss() {
        if (!this.slider) return;
        
        let width = 0;
        let left = 0;
        
        if (this.currentTab) {
            const navLinks = document.querySelector('.nav-links');
            const navLinksRect = navLinks ? navLinks.getBoundingClientRect() : null;
            const tabRect = this.currentTab.getBoundingClientRect();
            
            width = this.currentTab.offsetWidth;
            left = navLinksRect ? tabRect.left - navLinksRect.left : this.currentTab.offsetLeft;
        }
        
        this.slider.style.width = width + 'px';
        this.slider.style.left = left + 'px';
    }
}

// Initialize sticky navigation
document.addEventListener('DOMContentLoaded', function() {
    new StickyNavigation();
});

// ====================================
// PARALLAX SCROLL EFFECTS
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Parallax Background Elements
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const parent = element.closest('.parallax-section');
            if (!parent) return;
            
            const rect = parent.getBoundingClientRect();
            const elementTop = rect.top + scrolled;
            const elementHeight = parent.offsetHeight;
            
            // Only apply parallax when element is in viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const parallaxSpeed = 0.5;
                const yPos = (scrolled - elementTop) * parallaxSpeed;
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
    }
    
    // Hero Parallax Effect
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    function updateHeroParallax() {
        if (!hero || !heroContent) return;
        
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            // Parallax movement
            const parallaxSpeed = 0.5;
            heroContent.style.transform = `translate3d(0, ${scrolled * parallaxSpeed}px, 0)`;
            
            // Fade out effect
            const opacity = 1 - (scrolled / heroHeight) * 0.8;
            heroContent.style.opacity = Math.max(opacity, 0.2);
        }
    }
    
    // Scroll-triggered Animations
    const scrollElements = document.querySelectorAll(
        '.fade-in-up, .slide-in-left, .slide-in-right, .scale-in, .zoom-in, .stagger-container'
    );
    
    const elementInView = (el, offset = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return elementTop <= (window.innerHeight - offset);
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 80)) {
                displayScrollElement(el);
            }
        });
    };
    
    // Image Parallax (for images within sections)
    const parallaxImages = document.querySelectorAll('.about-image img, .service-detail-image img');
    
    function updateImageParallax() {
        parallaxImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrolled = window.pageYOffset;
                const imageTop = rect.top + scrolled;
                const speed = 0.15;
                const yPos = (scrolled - imageTop) * speed;
                
                img.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
    }
    
    // Mouse Move Parallax (subtle effect on hover)
    const parallaxSections = document.querySelectorAll('.service-card, .contact-detail-item');
    
    parallaxSections.forEach(section => {
        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const moveX = deltaX * 10;
            const moveY = deltaY * 10;
            
            section.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
        
        section.addEventListener('mouseleave', () => {
            section.style.transform = 'translate3d(0, 0, 0)';
        });
    });
    
    // Optimized Scroll Handler with RequestAnimationFrame
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                updateHeroParallax();
                handleScrollAnimation();
                updateImageParallax();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Event Listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    
    // ====================================
    // BACK TO TOP BUTTON
    // ====================================
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        function toggleBackToTop() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
        
        // Initial check
        toggleBackToTop();
        
        // Check on scroll
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        
        // Scroll to top when clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Initial call
    handleScrollAnimation();
    updateParallax();
    updateImageParallax();
});

// ====================================
// BACK TO TOP BUTTON (Standalone)
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        function toggleBackToTopBtn() {
            if (window.pageYOffset > 100) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        // Initial check
        toggleBackToTopBtn();
        
        // Check on scroll
        window.addEventListener('scroll', toggleBackToTopBtn, { passive: true });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
