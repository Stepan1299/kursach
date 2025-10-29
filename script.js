// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Page navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // Prevent body scroll when mobile menu is open
    function toggleBodyScroll(disable) {
        if (disable) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    }

    // Navigation click handler
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target page
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === targetId) {
                    page.classList.add('active');
                }
            });

            // Close mobile menu
            navLinksContainer.classList.remove('active');
            mobileToggle.classList.remove('active');
            toggleBodyScroll(false);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinksContainer.classList.toggle('active');
            this.classList.toggle('active');
            toggleBodyScroll(navLinksContainer.classList.contains('active'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinksContainer.classList.contains('active') && 
                !navLinksContainer.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                navLinksContainer.classList.remove('active');
                mobileToggle.classList.remove('active');
                toggleBodyScroll(false);
            }
        });
    }

    // CTA buttons navigation
    const ctaButtons = document.querySelectorAll('.cta-buttons a, .btn-secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetNav = document.querySelector(`a[href="#${targetId}"]`);
                if (targetNav) {
                    targetNav.click();
                }
            }
        });
    });

    // Form validation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        
        // Validation rules
        const validators = {
            name: (value) => {
                if (!value.trim()) return 'Пожалуйста, введите ваше имя';
                if (value.length < 2) return 'Имя должно содержать минимум 2 символа';
                if (value.length > 50) return 'Имя не должно превышать 50 символов';
                return '';
            },
            email: (value) => {
                if (!value.trim()) return 'Пожалуйста, введите email';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Пожалуйста, введите корректный email';
                return '';
            },
            phone: (value) => {
                if (value && value.trim()) {
                    const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,}$/;
                    if (!phoneRegex.test(value)) return 'Пожалуйста, введите корректный номер телефона';
                }
                return '';
            },
            service: (value) => {
                if (!value) return 'Пожалуйста, выберите услугу';
                return '';
            },
            message: (value) => {
                if (!value.trim()) return 'Пожалуйста, введите сообщение';
                if (value.length < 10) return 'Сообщение должно содержать минимум 10 символов';
                if (value.length > 1000) return 'Сообщение не должно превышать 1000 символов';
                return '';
            }
        };

        // Validate single field
        function validateField(field) {
            const fieldName = field.name;
            const value = field.value;
            const errorSpan = field.parentElement.querySelector('.error-message');
            
            if (validators[fieldName]) {
                const error = validators[fieldName](value);
                
                if (error) {
                    field.classList.add('invalid');
                    field.classList.remove('valid');
                    if (errorSpan) errorSpan.textContent = error;
                    return false;
                } else {
                    field.classList.remove('invalid');
                    field.classList.add('valid');
                    if (errorSpan) errorSpan.textContent = '';
                    return true;
                }
            }
            return true;
        }

        // Add real-time validation
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('invalid')) {
                    validateField(this);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            formInputs.forEach(input => {
                if (input.hasAttribute('required') || input.value) {
                    if (!validateField(input)) {
                        isValid = false;
                    }
                }
            });

            if (isValid) {
                // Simulate form submission
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Отправка...';
                submitButton.disabled = true;

                setTimeout(() => {
                    alert('Спасибо за обращение! Мы свяжемся с вами в ближайшее время.');
                    contactForm.reset();
                    formInputs.forEach(input => {
                        input.classList.remove('valid', 'invalid');
                        const errorSpan = input.parentElement.querySelector('.error-message');
                        if (errorSpan) errorSpan.textContent = '';
                    });
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 1500);
            } else {
                // Scroll to first error
                const firstError = contactForm.querySelector('.invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });
    }

    // Animate elements on scroll (with performance optimization)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe animated elements with delay
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .feature-card');
    
    // Only animate on desktop or larger tablets
    const shouldAnimate = window.innerWidth > 768;
    
    animatedElements.forEach((el, index) => {
        if (shouldAnimate) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        } else {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });

    // Active navigation on scroll (throttled for performance)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(function() {
            const scrollPosition = window.scrollY;
            
            pages.forEach(page => {
                const pageTop = page.offsetTop;
                const pageHeight = page.offsetHeight;
                const pageId = page.id;
                
                if (scrollPosition >= pageTop - 100 && scrollPosition < pageTop + pageHeight - 100) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${pageId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, 100);
    }, { passive: true });

    // Smooth scroll for footer links
    document.querySelectorAll('footer a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetNav = document.querySelector(`.nav-link[href="#${targetId}"]`);
            if (targetNav) {
                targetNav.click();
            }
        });
    });

    // Add dynamic year to footer
    const currentYear = new Date().getFullYear();
    const footerText = document.querySelector('.footer-bottom p');
    if (footerText) {
        footerText.textContent = `© ${currentYear} NexForge Software. Все права защищены.`;
    }

    // Progress Bar on Scroll
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        window.addEventListener('scroll', function() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            progressBar.style.width = progress + '%';
        }, { passive: true });
    }

    // Animated Counter for Stats
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    // Observe stats and animate when visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    if (!stat.classList.contains('animated')) {
                        animateCounter(stat);
                        stat.classList.add('animated');
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        statsObserver.observe(statsGrid);
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }, { passive: true });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
        // Press 'Escape' to close mobile menu
        if (e.key === 'Escape' && navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
            mobileToggle.classList.remove('active');
            toggleBodyScroll(false);
        }
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});