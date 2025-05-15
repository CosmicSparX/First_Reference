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
                    window.scrollTo({
                        top: targetSection.offsetTop - 80, // Offset for fixed header
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
    
    // Form handling
    const interestForm = document.getElementById('interestForm');
    
    if (interestForm) {
        interestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formDataObj = {};
            
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Display submission message
            const formContainer = document.querySelector('.contact-form');
            
            // Success message HTML
            const successMessage = `
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Thank you for your interest!</h3>
                    <p>We've received your request and will send you a detailed Google Form shortly to collect your specific requirements.</p>
                    <p>Please check your email at <strong>${formDataObj.email}</strong></p>
                    <p>Our team will contact you within <strong>1 hour</strong>!</p>
                </div>
            `;
            
            // Replace form with success message
            formContainer.innerHTML = successMessage;
            
            // In a real application, you would send the data to a server here
            console.log('Form submitted with data:', formDataObj);
        });
    }
    
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
    
    // Counter animation for hero stats
    function animateCounters() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const content = stat.textContent;
            if (content.includes('+')) {
                const numStr = content.replace(/[^0-9]/g, '');
                const num = parseInt(numStr);
                
                if (!isNaN(num)) {
                    // Start from 0
                    let startNum = 0;
                    const duration = 1500; // 1.5 seconds
                    const interval = 20; // Update every 20ms
                    const increment = num / (duration / interval);
                    
                    const icon = stat.querySelector('i');
                    stat.textContent = '0';
                    if (icon) {
                        stat.prepend(icon);
                    }
                    
                    const timer = setInterval(() => {
                        startNum += increment;
                        const displayNum = Math.min(Math.round(startNum), num);
                        stat.textContent = displayNum + (content.includes('+') ? '+' : '');
                        if (icon) {
                            stat.prepend(icon);
                        }
                        
                        if (displayNum >= num) {
                            clearInterval(timer);
                        }
                    }, interval);
                }
            } else if (!content.includes('i')) {
                // For decimal numbers like 4.8
                const num = parseFloat(content);
                
                if (!isNaN(num)) {
                    // Start from 0
                    let startNum = 0;
                    const duration = 1500; // 1.5 seconds
                    const interval = 20; // Update every 20ms
                    const increment = num / (duration / interval);
                    
                    const icon = stat.querySelector('i');
                    stat.textContent = '0';
                    if (icon) {
                        stat.prepend(icon);
                    }
                    
                    const timer = setInterval(() => {
                        startNum += increment;
                        const displayNum = Math.min(parseFloat(startNum.toFixed(1)), num);
                        stat.textContent = displayNum;
                        if (icon) {
                            stat.prepend(icon);
                        }
                        
                        if (displayNum >= num) {
                            clearInterval(timer);
                        }
                    }, interval);
                }
            }
        });
    }
    
    // Add animations on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.card, .step, .bgv-image, .bgv-text, .bgv-text ul li, .stat-item, .hero-feature, .hero-testimonial');
        
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
    
    // Add animation styles
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
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
    document.head.appendChild(animationStyle);
    
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
    
    // Mobile menu toggle functionality
    function createMobileMenu() {
        // Check if we need to create a mobile menu based on window width
        if (window.innerWidth <= 768) {
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
                mobileToggle.addEventListener('click', function() {
                    nav.classList.toggle('mobile-active');
                    
                    // Change icon based on menu state
                    if (nav.classList.contains('mobile-active')) {
                        mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
                    } else {
                        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });
                
                // Add mobile menu styles
                const mobileStyle = document.createElement('style');
                mobileStyle.textContent = `
                    .mobile-toggle {
                        display: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: var(--primary-color);
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: rgba(30, 86, 160, 0.1);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                    }
                    
                    .mobile-toggle:hover {
                        background: rgba(30, 86, 160, 0.2);
                    }
                    
                    @media (max-width: 768px) {
                        .mobile-toggle {
                            display: flex;
                            position: absolute;
                            top: 20px;
                            right: 20px;
                        }
                        
                        nav {
                            display: none;
                            width: 100%;
                            background: white;
                            padding: 15px;
                            border-radius: 10px;
                            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                            margin-top: 10px;
                        }
                        
                        nav.mobile-active {
                            display: block;
                            animation: slideDown 0.3s ease forwards;
                        }
                        
                        nav ul {
                            flex-direction: column;
                            width: 100%;
                        }
                        
                        nav ul li {
                            margin: 0;
                            text-align: center;
                            padding: 12px 0;
                            border-bottom: 1px solid var(--border-color);
                        }
                        
                        nav ul li:last-child {
                            border-bottom: none;
                        }
                        
                        @keyframes slideDown {
                            from {
                                opacity: 0;
                                transform: translateY(-20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                    }
                `;
                document.head.appendChild(mobileStyle);
                
                // Close menu when clicking a link
                const mobileNavLinks = nav.querySelectorAll('a');
                mobileNavLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        nav.classList.remove('mobile-active');
                        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    });
                });
            }
        }
    }
    
    // Check for resize events to add mobile menu if needed
    window.addEventListener('resize', createMobileMenu);
    
    // Check on initial load
    createMobileMenu();
}); 