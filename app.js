// ===================================
// Global State & Configuration
// ===================================
const APP_CONFIG = {
    pdfWorkerSrc: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    animationDuration: 300,
    scrollOffset: 80
};

// Set PDF.js worker
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = APP_CONFIG.pdfWorkerSrc;
}

// ===================================
// Utility Functions
// ===================================
const utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    scrollToElement(element, offset = APP_CONFIG.scrollOffset) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    showMessage(elementId, message, type = 'success') {
        const messageEl = document.getElementById(elementId);
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `form-message ${type}`;
            setTimeout(() => {
                messageEl.className = 'form-message';
            }, 5000);
        }
    }
};

// ===================================
// Navigation Handler
// ===================================
class NavigationHandler {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.navMenu = document.getElementById('navMenu');
        this.mobileToggle = document.getElementById('mobileMenuToggle');
        this.sections = document.querySelectorAll('.content-section, .hero, .welcome-section');

        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupNavigation();
        this.setupMobileMenu();
        this.highlightActiveSection();
    }

    setupScrollEffect() {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', utils.debounce(handleScroll, 10));
    }

    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        utils.scrollToElement(targetElement);
                        this.setActiveLink(link);

                        // Close mobile menu if open
                        if (this.navMenu.classList.contains('active')) {
                            this.toggleMobileMenu();
                        }
                    }
                }
            });
        });
    }

    setupMobileMenu() {
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.mobileToggle.classList.toggle('active');
    }

    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    highlightActiveSection() {
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -80% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

                    if (correspondingLink) {
                        this.setActiveLink(correspondingLink);
                    }
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            if (section.id) {
                observer.observe(section);
            }
        });
    }
}

// ===================================
// PDF Viewer Handler
// ===================================
class PDFViewerHandler {
    constructor() {
        this.modal = document.getElementById('pdfModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.pdfIframe = document.getElementById('pdfIframe');
        this.currentPDF = null;

        this.init();
    }

    init() {
        this.setupModalClose();
    }

    setupModalClose() {
        // Close on click outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openPDF(pdfPath, title = 'PDF Viewer') {
        this.currentPDF = pdfPath;
        this.modalTitle.textContent = title;
        this.pdfIframe.src = pdfPath;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        this.pdfIframe.src = '';
        this.currentPDF = null;
        document.body.style.overflow = '';
    }

    downloadPDF(pdfPath) {
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = pdfPath.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// ===================================
// Contact Form Handler
// ===================================
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Validate
        if (!this.validateForm(data)) {
            return;
        }

        // Simulate form submission
        this.submitForm(data);
    }

    validateForm(data) {
        if (!data.name || !data.email || !data.subject || !data.message) {
            utils.showMessage('formMessage', 'Please fill in all fields.', 'error');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            utils.showMessage('formMessage', 'Please enter a valid email address.', 'error');
            return false;
        }

        return true;
    }

    async submitForm(data) {
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';

        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted:', data);

            // Show success message
            utils.showMessage(
                'formMessage',
                'Thank you for your message! We will get back to you soon.',
                'success'
            );

            // Reset form
            this.form.reset();

            // Restore button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1500);

        // In a real application, you would send data to a server:
        /*
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                utils.showMessage('formMessage', 'Message sent successfully!', 'success');
                this.form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            utils.showMessage('formMessage', 'Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
        */
    }
}

// ===================================
// Animation Handler
// ===================================
class AnimationHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
    }

    setupScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Animate content cards
        document.querySelectorAll('.content-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }

    setupHoverEffects() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
}

// ===================================
// Global Functions for Inline Events
// ===================================
let pdfViewer;

function openPDF(pdfPath) {
    const titles = {
        'Great_Depression_2_Ch_1.pdf': 'Great Depression 2 - Chapter 1',
        'Great_Depression_2_Ch_2.pdf': 'Great Depression 2 - Chapter 2'
    };

    const title = titles[pdfPath] || 'PDF Viewer';
    pdfViewer.openPDF(pdfPath, title);
}

function downloadPDF(pdfPath) {
    pdfViewer.downloadPDF(pdfPath);
}

function closeModal() {
    pdfViewer.closeModal();
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        utils.scrollToElement(element);
    }
}

// ===================================
// App Initialization
// ===================================
class App {
    constructor() {
        this.navigation = null;
        this.contactForm = null;
        this.animations = null;
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('GreatDepression2.com - Modern Website Initialized');

        // Initialize all handlers
        this.navigation = new NavigationHandler();
        pdfViewer = new PDFViewerHandler();
        this.contactForm = new ContactFormHandler();
        this.animations = new AnimationHandler();

        // Setup smooth scroll for all anchor links
        this.setupSmoothScroll();

        // Update copyright year
        this.updateCopyrightYear();

        // Add loading complete class
        document.body.classList.add('loaded');
    }

    updateCopyrightYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    utils.scrollToElement(targetElement);
                }
            });
        });
    }
}

// ===================================
// Start the Application
// ===================================
const app = new App();
app.init();

// ===================================
// Service Worker Registration (Optional)
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker for offline support
        /*
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
        */
    });
}

// ===================================
// Performance Monitoring
// ===================================
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }, 0);
    });
}

// ===================================
// Export for testing (if needed)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NavigationHandler,
        PDFViewerHandler,
        ContactFormHandler,
        AnimationHandler,
        utils
    };
}
