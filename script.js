// Sample product data
let products = [
  {
    id: 1,
    name: "Pink Bunny",
    price: 12.99,
    description: "Soft pink bunny with cute pink dress",
    image: "images/still-life-crochet-plushies.jpg"
  },
  {
    id: 2,
    name: "Choco Woof",
    price: 14.99,
    description: "Adorable brown doggo plush",
    image: "images/crochet-plush-dog.jpg"
  },
  {
    id: 3,
    name: "Rainbow Unicorn",
    price: 16.99,
    description: "Magical unicorn with rainbow mane",
    image: "images/fantasy-unicorn-head.jpg"
  },
  {
    id: 4,
    name: "Sleepy Sloth",
    price: 15.99,
    description: "Cuddly sloth ready for naps",
    image: "images/top-view-crochet-plush-sloth.jpg"
  },
  {
    id: 5,
    name: "Christmas Reindeer",
    price: 16.99,
    description: "Wintery friend with cozy charm",
    image: "images/crochet-plushies-reinder.jpg",
  },
  {
    id: 6,
    name: "Ginger Fox",
    price: 15.99,
    description: "Cozy little fox with a cute smile",
    image: "images/crochet-plush-still-life-fox.jpg",
  },
  {
    id: 7,
    name: "Cute Tiger",
    price: 16.99,
    description: "Gentle stripes, mellow hugs",
    image: "images/plush-toy-tiger.jpg",
  }
];

let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  loadCartFromStorage();
  updateCartDisplay();
});

function toggleCart() {
  document.getElementById('cart').classList.toggle('active');
  // Prevent scrolling when cart is open
  document.body.style.overflow = document.getElementById('cart').classList.contains('active') ? 'hidden' : '';
}

// Scroll to section
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  closeSidebar();
}

// Toggle sidebar on mobile
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('active');
}

function closeSidebar() {
  document.querySelector('.sidebar').classList.remove('active');
}

function renderProducts() {
  const container = document.getElementById('product-container');
  container.innerHTML = '';
  
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="description">${product.description}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
        <button class="add-to-cart" onclick="addToCart(${product.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
    container.appendChild(productCard);
  });
}

// Cart functionality
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  updateCartDisplay();
  saveCartToStorage();
  document.getElementById('cart-badge').textContent = getTotalItems();
  alert(`${product.name} added to cart!`);
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += change;
  
  // Remove if quantity reaches 0
  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }
  
  updateCartDisplay();
  saveCartToStorage();
}

function removeItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartDisplay();
  saveCartToStorage();
}

function getTotalItems() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartBadge = document.getElementById('cart-badge');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTotal = document.getElementById('cart-total');
  const shippingCost = 5.00;
  
  // Update counts
  const totalItems = getTotalItems();
  cartCount.textContent = totalItems;
  cartBadge.textContent = totalItems;
  
  // Empty cart message
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    cartSubtotal.textContent = '0.00';
    cartTotal.textContent = shippingCost.toFixed(2);
    return;
  }
  
// cart item template in updateCartDisplay() :
cartItems.innerHTML = cart.map(item => `
  <div class="cart-item">
    <div class="cart-item-details">
      <div class="cart-item-title">${item.name}</div>
      <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
      <div class="cart-item-actions">
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
        <span class="quantity-display">${item.quantity}</span>
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        <button class="remove-item" onclick="removeItem(${item.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
`).join('');

  // Calculate totals
  const subtotal = getSubtotal();
  const total = subtotal + shippingCost;
  
  // Update totals
  cartSubtotal.textContent = subtotal.toFixed(2);
  cartTotal.textContent = total.toFixed(2);
  
}

function checkout() {
  if (cart.length === 0) {
    document.getElementById('checkout-msg').textContent = 'Your cart is empty!';
    document.getElementById('checkout-msg').style.color = 'red';
    return;
  }
  
  const total = getSubtotal() + 5.00;
  document.getElementById('checkout-msg').innerHTML = `
    <p>Thank you for your order!</p>
    <p>Total: $${total.toFixed(2)}</p>
  `;
  document.getElementById('checkout-msg').style.color = 'green';
  
  // Clear cart
  cart = [];
  updateCartDisplay();
  saveCartToStorage();
  
  // Close cart after 3 seconds
  setTimeout(() => {
    document.getElementById('cart').classList.remove('active');
    document.getElementById('checkout-msg').textContent = '';
  }, 3000);
}

// Save/load cart from localStorage
function saveCartToStorage() {
  localStorage.setItem('plushieCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem('plushieCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const btnText = document.getElementById('dark-mode-text');
  btnText.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  document.getElementById('dark-mode-text').textContent = '☀️ Light Mode';
}

document.querySelector('.contact-form').addEventListener('submit', function(e) {
  // Validasi sederhana
  const inputs = this.querySelectorAll('input[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = 'red';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });
  
  if (!isValid) {
    e.preventDefault();
    alert('Please fill in all required fields!');
  } else {
    // Tampilkan loading state
    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Form akan dikirim ke FormSubmit secara otomatis
  }
});

// Di script.js
document.querySelector('.contact-form').addEventListener('submit', function(e) {
  // Buat elemen pesan sukses
  const successMsg = document.createElement('div');
  successMsg.className = 'success-message';
  successMsg.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <p>Thank you! Your message has been sent.</p>
  `;
  
  // Ganti form dengan pesan sukses
  this.parentNode.replaceChild(successMsg, this);
  
  // Hilangkan pesan setelah 5 detik (opsional)
  setTimeout(() => {
    successMsg.remove();
    this.reset();
    this.parentNode.appendChild(this);
  }, 5000);
});