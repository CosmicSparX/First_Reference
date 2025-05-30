// Navigation highlighting and functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Create mobile menu
    createMobileMenu();
    
    // Add mobile styles
    addMobileStyles();

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a, .footer-links a, .cta-buttons a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only if the link is pointing to an ID on the same page
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    let offset = 80; // Default offset for desktop
                    
                    // Adjust offset for mobile devices
                    if (window.innerWidth <= 768) {
                        offset = 60;
                    }
                    
                    window.scrollTo({
                        top: targetSection.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
                
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
            }
        });
    });
    
    // Navigation active state based on scroll position
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavLink);
    
    // Initialize the active link
    setActiveNavLink();
    
    // Animation for hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.classList.add('animate-on-load');
    }
    
    // Highlight effect for hero section
    const heroHighlight = document.querySelector('.hero h1 .highlight');
    if (heroHighlight) {
        setTimeout(() => {
            heroHighlight.classList.add('highlight-animate');
        }, 500);
    }
    
    // Add animations on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.card, .step, .bgv-image, .bgv-text, .bgv-text ul li, .stat-item, .hero-feature, .hero-testimonial, .benefit-item, .candidate-verification-image');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
                
                // If it's the stat items, trigger counter animation
                if (element.classList.contains('stat-item') && !element.classList.contains('counted')) {
                    animateCounters();
                    document.querySelectorAll('.stat-item').forEach(item => item.classList.add('counted'));
                }
            }
        });
    };
    
    // Run animations on load and scroll
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', function() {
        animateOnScroll();
        
        // Trigger animations for elements in viewport on page load
        document.querySelectorAll('.hero-feature, .hero-testimonial').forEach(el => {
            setTimeout(() => {
                el.classList.add('animate');
            }, 300);
        });
    });
    
    // Counter animation for hero stats
    function animateCounters() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const content = stat.textContent;
            
            // Extract the numeric part from the content
            let numStr = '';
            let suffix = '';
            let isMobile = window.innerWidth <= 768;
            
            if (content.includes('+')) {
                numStr = content.replace(/[^0-9]/g, '');
                suffix = '+';
            } else if (content.includes('hr') || content.includes('min')) {
                // Handle "1 hr" format
                const timeMatch = content.match(/(\d+(?:\.\d+)?)\s*(hr|min)/);
                if (timeMatch) {
                    numStr = timeMatch[1];
                    suffix = ' ' + timeMatch[2];
                }
            } else if (!content.includes('i')) {
                // For decimal numbers like 4.8
                numStr = content.trim();
            }
            
            const num = parseFloat(numStr);
            
            if (!isNaN(num)) {
                // Start from 0
                let startNum = 0;
                // Adjust duration and interval based on number size and device
                const duration = isMobile ? (num > 1000 ? 1000 : 1500) : 1500; // Shorter duration for large numbers on mobile
                const interval = isMobile ? (num > 1000 ? 10 : 20) : 20; // More frequent updates for large numbers on mobile
                const steps = duration / interval;
                const increment = num / steps;
                
                const icon = stat.querySelector('i');
                let iconHTML = '';
                if (icon) {
                    iconHTML = icon.outerHTML;
                    icon.remove();
                }
                
                stat.textContent = '0';
                if (iconHTML) {
                    stat.innerHTML = iconHTML + stat.textContent;
                }
                
                let currentNum = 0;
                const timer = setInterval(() => {
                    currentNum += increment;
                    let displayNum;
                    
                    if (numStr.includes('.')) {
                        // Handle decimal numbers
                        displayNum = Math.min(parseFloat(currentNum.toFixed(1)), num);
                    } else {
                        // Handle integers
                        displayNum = Math.min(Math.round(currentNum), num);
                    }
                    
                    // Format large numbers with commas for better readability
                    let formattedNum = displayNum;
                    if (displayNum >= 1000) {
                        formattedNum = displayNum.toLocaleString();
                    }
                    
                    if (iconHTML) {
                        stat.innerHTML = iconHTML + formattedNum + suffix;
                    } else {
                        stat.textContent = formattedNum + suffix;
                    }
                    
                    if (currentNum >= num) {
                        clearInterval(timer);
                        // Ensure final number is exactly the target number
                        let finalNum = num;
                        if (finalNum >= 1000) {
                            finalNum = finalNum.toLocaleString();
                        }
                        if (iconHTML) {
                            stat.innerHTML = iconHTML + finalNum + suffix;
                        } else {
                            stat.textContent = finalNum + suffix;
                        }
                    }
                }, interval);
            }
        });
    }

    // Initialize counter animation when stats come into view
    function initCounterAnimation() {
        const statItems = document.querySelectorAll('.stat-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statItems.forEach(item => {
            observer.observe(item);
        });
    }

    // Initialize counter animation
    initCounterAnimation();
    
    // Animations for sections on scroll
    const sections = document.querySelectorAll('section:not(.hero)');
    
    // Add delay classes to sections
    sections.forEach((section, index) => {
        const delay = index % 4;
        section.classList.add(`delay-${delay}00`);
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);
    
    // Observe only sections, not footer
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Highlight animation for hero section
    const highlight = document.querySelector('.highlight');
    if (highlight) {
        setTimeout(() => {
            highlight.classList.add('highlight-animate');
        }, 1000);
    }
    
    // Handle window resize for mobile menu
    window.addEventListener('resize', function() {
        // If we're in mobile view, ensure the menu closes when resizing larger
        if (window.innerWidth > 768) {
            const nav = document.querySelector('nav');
            const mobileToggle = document.querySelector('.mobile-toggle');
            
            if (nav && nav.classList.contains('mobile-active')) {
                nav.classList.remove('mobile-active');
                if (mobileToggle) {
                    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        }
    });

    // Add mobile-specific animation for hero image
    initMobileHeroImageAnimation();
});

// Mobile menu creation and functionality
function createMobileMenu() {
    // Check if we need to create a mobile menu based on window width
    const header = document.querySelector('header .container');
    const nav = document.querySelector('nav');
    
    // Only create if it doesn't exist yet
    if (!document.querySelector('.mobile-toggle')) {
        // Create the toggle button
        const mobileToggle = document.createElement('div');
        mobileToggle.className = 'mobile-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Add it to the header before the nav
        header.insertBefore(mobileToggle, nav);
        
        // Add toggle functionality
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling up
            nav.classList.toggle('mobile-active');
            
            // Change icon based on menu state
            if (nav.classList.contains('mobile-active')) {
                mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Close menu when clicking a link
        const mobileNavLinks = nav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('mobile-active');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileToggle.contains(event.target) && nav.classList.contains('mobile-active')) {
                nav.classList.remove('mobile-active');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

// Add mobile menu styles dynamically
function addMobileStyles() {
    // Check if styles already added
    if (!document.getElementById('mobile-menu-styles')) {
        const mobileStyle = document.createElement('style');
        mobileStyle.id = 'mobile-menu-styles';
        mobileStyle.textContent = `
            @media (min-width: 769px) {
                .mobile-toggle {
                    display: none !important;
                }
                
                nav {
                    display: block !important;
                    position: static !important;
                    box-shadow: none !important;
                    background: transparent !important;
                    width: auto !important;
                }
                
                nav ul {
                    flex-direction: row !important;
                    padding: 0 !important;
                }
                
                nav ul li {
                    border: none !important;
                    padding: 0 !important;
                    width: auto !important;
                }
            }
            
        .card, .step, .bgv-image, .bgv-text, .bgv-text ul li, .stat-item, .hero-feature, .hero-testimonial {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .card.animate, .step.animate, .bgv-image.animate, .bgv-text.animate, .bgv-text ul li.animate, .stat-item.animate, .hero-feature.animate, .hero-testimonial.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .hero-feature:nth-child(1) {
            transition-delay: 0.1s;
        }
        
        .hero-feature:nth-child(2), .card:nth-child(2), .step:nth-child(2), .stat-item:nth-child(2), .bgv-text ul li:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .hero-feature:nth-child(3), .card:nth-child(3), .step:nth-child(3), .stat-item:nth-child(3), .bgv-text ul li:nth-child(3) {
            transition-delay: 0.3s;
        }
        
        .hero-feature:nth-child(4), .step:nth-child(4), .bgv-text ul li:nth-child(4) {
            transition-delay: 0.4s;
        }
        
        .step:nth-child(5) {
            transition-delay: 0.5s;
        }
        
        .hero-image {
            opacity: 0;
            transform: translateX(50px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .hero-image.animate-on-load {
            opacity: 1;
            transform: translateX(0);
        }
        
        .highlight-animate::after {
            animation: highlightGrow 0.8s ease forwards;
                    }
                `;
                document.head.appendChild(mobileStyle);
    }
}

// Add mobile-specific animation for hero image
function initMobileHeroImageAnimation() {
    const heroImage = document.querySelector('.hero-image');
    if (!heroImage) return;
    
    // Check if on mobile
    if (window.innerWidth <= 768) {
        // Add a subtle animation effect for mobile
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroImage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateY(0)';
        }, 300);
        
        // Add subtle hover effect on tap for mobile
        heroImage.addEventListener('touchstart', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        heroImage.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// User Authentication
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    phone,
                    password
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Registration successful! Please login.');
                window.location.href = '/login.html';
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        }
    });
}

// Cart Management
function addToCart(service) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(service);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function removeFromCart(serviceId) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cart.filter(item => item.id !== serviceId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const orderSummary = document.getElementById('orderSummary');
    if (!cartItems || !orderSummary) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cartItems.innerHTML = '';
    
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartItems.innerHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>₹${item.price} x ${item.quantity}</p>
                <p>Total: ₹${itemTotal}</p>
                <button onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
        `;
    });

    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    orderSummary.innerHTML = `
        <h3>Order Summary</h3>
        <p>Subtotal: ₹${subtotal}</p>
        <p>Tax (18% GST): ₹${tax}</p>
        <p>Total: ₹${total}</p>
    `;
}

// Checkout Process
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to complete checkout');
            window.location.href = '/login.html';
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        const formData = new FormData(checkoutForm);
        const billingInfo = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            address: formData.get('address'),
            gstin: formData.get('gstin')
        };

        const orderData = {
            billingInfo,
            items: cart,
            paymentMethod: formData.get('paymentMethod'),
            total: calculateTotal(cart)
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.removeItem('cart');
                window.location.href = '/thank-you.html';
            } else {
                alert(data.message || 'Checkout failed');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed. Please try again.');
        }
    });
}

function calculateTotal(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18; // 18% GST
    return subtotal + tax;
}

// Initialize cart UI on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    
    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const serviceCard = e.target.closest('.card');
            const service = {
                id: serviceCard.dataset.serviceId,
                name: serviceCard.querySelector('h3').textContent,
                price: parseFloat(serviceCard.querySelector('.price').textContent.replace('₹', '')),
                quantity: 1
            };
            addToCart(service);
        });
    });
}); 