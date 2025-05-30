// Authentication and Cart Management

// API endpoints
const API_URL = 'http://localhost:5000/api';

// Authentication functions
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, data };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'An error occurred during login' };
    }
}

async function register(fullName, email, phone, password) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullName, email, phone, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'An error occurred during registration' };
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Cart functions
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(service) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === service.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: service.id,
            name: service.name,
            price: service.price,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartUI();
}

function removeFromCart(serviceId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== serviceId);
    saveCart(updatedCart);
    updateCartUI();
}

// Navigation functions
function updateNavigationButtons() {
    const profileBtn = document.querySelector('.profile-btn');
    const loginBtn = document.querySelector('.login-btn');
    const cartCount = document.querySelector('.cart-count');
    
    if (isAuthenticated()) {
        if (profileBtn) profileBtn.style.display = 'flex';
        if (loginBtn) loginBtn.style.display = 'none';
    } else {
        if (profileBtn) profileBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'flex';
    }
    
    // Update cart count
    if (cartCount) {
        const cart = getCart();
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = itemCount;
    }
}

// Update the updateCartUI function to also update navigation
function updateCartUI() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price}</p>
                </div>
                <div class="cart-item-quantity">
                    <span>Quantity: ${item.quantity}</span>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="btn secondary">Remove</button>
            </div>
        `).join('');
    }
    
    if (checkoutItemsContainer) {
        checkoutItemsContainer.innerHTML = cart.map(item => `
            <div class="checkout-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }
    
    const subtotal = calculateSubtotal(cart);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;
    
    if (subtotalElement) subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `₹${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `₹${total.toFixed(2)}`;
    
    // Update navigation buttons and cart count
    updateNavigationButtons();
}

function calculateSubtotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Checkout functions
async function processCheckout(billingInfo, paymentMethod) {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    const subtotal = calculateSubtotal(cart);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                billingInfo,
                paymentMethod,
                items: cart,
                total
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Clear cart after successful order
            saveCart([]);
            // Redirect to thank you page
            window.location.href = `thank-you.html?orderId=${data.orderId}`;
        } else {
            alert(data.message || 'Failed to process order');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('An error occurred during checkout');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Update navigation buttons on page load
    updateNavigationButtons();
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const result = await login(email, password);
            if (result.success) {
                updateNavigationButtons();
                window.location.href = 'index.html';
            } else {
                alert(result.message);
            }
        });
    }

    // Registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            
            const result = await register(fullName, email, phone, password);
            if (result.success) {
                window.location.href = 'login.html';
            } else {
                alert(result.message);
            }
        });
    }

    // Checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const billingInfo = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                company: document.getElementById('company').value,
                address: document.getElementById('address').value,
                gstin: document.getElementById('gstin').value
            };
            
            const paymentMethod = document.getElementById('paymentMethod').value;
            
            await processCheckout(billingInfo, paymentMethod);
        });
    }

    // Update cart UI on page load
    updateCartUI();
}); 