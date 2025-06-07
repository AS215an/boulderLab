// 🛒 BOULDER LAB - GLOBAL CART MANAGEMENT SYSTEM
// Cross-page persistent cart with localStorage

class BoulderLabCart {
  constructor() {
    this.cartKey = "boulderlab_cart";
    this.cartItems = this.loadCart();
    this.isInitialized = false;
  }

  // 🖼️ CENTRALIZED PRODUCT IMAGE PATH MAPPING
  // This prevents hard-coding mistakes and makes maintenance easier
  getProductImage(productType) {
    const imageMap = {
      "month-to-month": "Images/CardImages/Card2-MonthToMonth.png",
      "6-month": "Images/CardImages/Card3-6Month.png",
      "12-month": "Images/CardImages/Card4-12Month.png",
      "annual-regular": "Images/CardImages/Card5-Annual-Regular.png",
      "annual-family": "Images/CardImages/Card6-Annual-Family.png",
    };

    const imagePath = imageMap[productType];
    if (!imagePath) {
      console.warn(
        `⚠️ Unknown product type: ${productType}. Using fallback image.`
      );
      return "Images/CardImages/Card2-MonthToMonth.png"; // Fallback
    }

    return imagePath;
  }

  // Load cart from localStorage
  loadCart() {
    try {
      const saved = localStorage.getItem(this.cartKey);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn("Failed to load cart from localStorage:", error);
      return [];
    }
  }

  // Save cart to localStorage
  saveCart() {
    try {
      localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    } catch (error) {
      console.warn("Failed to save cart to localStorage:", error);
    }
  }

  // Initialize cart UI (call this on each page)
  initialize() {
    if (this.isInitialized) return;

    this.initializeElements();
    this.bindEvents();
    this.renderCart();

    // Update cart icon state on page load
    this.updateCartCount();

    this.isInitialized = true;
  }

  // Initialize DOM elements
  initializeElements() {
    this.cartOverlay = document.getElementById("cartOverlay");
    this.cartBackgroundOverlay = document.getElementById(
      "cartBackgroundOverlay"
    );
    this.cartCloseBtn = document.getElementById("cartCloseBtn");
    this.cartItemCount = document.getElementById("cartItemCount");
    this.cartItemsContainer = document.getElementById("cartItemsContainer");
    this.cartSubtotal = document.getElementById("cartSubtotal");
    this.cartEmptyState = document.getElementById("cartEmptyState");
    this.cartMainContent = document.getElementById("cartMainContent");

    // Global continue shopping button
    this.cartContinueBtn = document.querySelector(
      ".cart-global-actions .cart-continue-btn"
    );
  }

  // Bind global event listeners
  bindEvents() {
    if (this.cartCloseBtn) {
      this.cartCloseBtn.addEventListener("click", () => this.closeCart());
    }

    if (this.cartContinueBtn) {
      this.cartContinueBtn.addEventListener("click", () => this.closeCart());
    }

    if (this.cartBackgroundOverlay) {
      this.cartBackgroundOverlay.addEventListener("click", () =>
        this.closeCart()
      );
    }

    // Bind checkout button functionality
    this.bindCheckoutButton();
  }

  // Bind checkout button to redirect to checkout page
  bindCheckoutButton() {
    // Handle both class selector and ID selector for checkout buttons
    const checkoutButtons = document.querySelectorAll(
      ".cart-checkout-btn, #cartCheckoutBtn"
    );

    checkoutButtons.forEach((checkoutBtn) => {
      if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
          // Only proceed to checkout if there are items in cart
          if (this.cartItems.length > 0) {
            window.location.href = "checkout.html";
          } else {
            // Optionally show a message or do nothing if cart is empty
            console.log("Cannot checkout with empty cart");
          }
        });
      }
    });
  }

  // Add product to cart
  addProduct(productData) {
    const newItem = {
      id: `${productData.type}-${Date.now()}`,
      title: productData.title,
      price: productData.price,
      quantity: productData.quantity || 1,
      months: productData.months,
      location: productData.location,
      image: productData.image || this.getProductImage(productData.type), // Use centralized image mapping
      type: productData.type, // e.g., 'month-to-month', '6-month', etc.
    };

    // Check if same product with same options already exists
    const existingIndex = this.cartItems.findIndex(
      (item) =>
        item.title === newItem.title &&
        item.months === newItem.months &&
        item.location === newItem.location
    );

    if (existingIndex >= 0) {
      // Update quantity of existing item
      this.cartItems[existingIndex].quantity += newItem.quantity;
    } else {
      // Add as new item
      this.cartItems.push(newItem);
    }

    this.saveCart();
    this.renderCart();
    this.showCart();

    return newItem.id;
  }

  // Remove item from cart
  removeItem(itemId) {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    this.saveCart();
    this.renderCart();

    if (this.cartItems.length === 0) {
      this.showEmptyState();
    }
  }

  // Update item quantity
  updateQuantity(itemId, newQuantity) {
    const item = this.cartItems.find((item) => item.id === itemId);
    if (item && newQuantity > 0) {
      item.quantity = newQuantity;
      this.saveCart();
      this.renderCart();
    } else if (item && newQuantity <= 0) {
      this.removeItem(itemId);
    }
  }

  // Calculate total quantity
  getTotalQuantity() {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Calculate subtotal
  getSubtotal() {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // Render cart items
  renderCart() {
    this.updateCartCount();
    this.updateSubtotal();
    this.updateCheckoutButton();

    if (!this.cartItemsContainer) return;

    if (this.cartItems.length === 0) {
      this.showEmptyState();
      return;
    }

    this.showMainContent();
    this.cartItemsContainer.innerHTML = "";

    // Add all cart items
    this.cartItems.forEach((item) => {
      const itemHTML = this.createCartItemHTML(item);
      this.cartItemsContainer.appendChild(itemHTML);
    });

    // Add global continue shopping button if there are multiple items
    if (this.cartItems.length > 0) {
      this.addGlobalContinueButton();
    }
  }

  // Update checkout button state
  updateCheckoutButton() {
    const checkoutButtons = document.querySelectorAll(
      ".cart-checkout-btn, #cartCheckoutBtn"
    );

    checkoutButtons.forEach((checkoutBtn) => {
      if (checkoutBtn) {
        if (this.cartItems.length === 0) {
          checkoutBtn.disabled = true;
          checkoutBtn.style.opacity = "0.5";
          checkoutBtn.style.cursor = "not-allowed";
        } else {
          checkoutBtn.disabled = false;
          checkoutBtn.style.opacity = "1";
          checkoutBtn.style.cursor = "pointer";
        }
      }
    });
  }

  // Add global continue shopping button
  addGlobalContinueButton() {
    const continueButtonHTML = document.createElement("div");
    continueButtonHTML.className = "cart-global-continue";
    continueButtonHTML.innerHTML = `
      <button class="cart-global-continue-btn">
        <span>X</span>
        <span>CONTINUE SHOPPING</span>
      </button>
    `;

    this.cartItemsContainer.appendChild(continueButtonHTML);

    // Bind event listener
    const globalContinueBtn = continueButtonHTML.querySelector(
      ".cart-global-continue-btn"
    );
    globalContinueBtn.addEventListener("click", () => this.closeCart());
  }

  // Create HTML for individual cart item
  createCartItemHTML(item) {
    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.setAttribute("data-item-id", item.id);

    itemElement.innerHTML = `
      <!-- Product Info Header -->
      <div class="cart-product-header">
        <span class="cart-product-name">${item.title}</span>
        <span class="cart-product-price">$${item.price.toFixed(2)}</span>
      </div>

      <!-- Separator -->
      <div class="cart-separator"></div>

      <!-- Product Details Container -->
      <div class="cart-content-wrapper">
        <!-- Left: Product Image -->
        <div class="cart-product-image">
          <img src="${item.image}" alt="${
      item.title
    }" class="cart-product-img" />
        </div>

        <!-- Right: Product Info + Quantity -->
        <div class="cart-right-section">
          <!-- Product Info -->
          <div class="cart-product-info">
            <div class="cart-detail-row">
              <span class="cart-detail-label">Month(s):</span>
              <span class="cart-detail-value">${item.months}</span>
            </div>
            <div class="cart-detail-separator"></div>
            <div class="cart-detail-row">
              <span class="cart-detail-label">Location:</span>
              <span class="cart-detail-value">${item.location}</span>
            </div>
            <div class="cart-detail-separator location-separator"></div>
          </div>

          <!-- Quantity Selector aligned to bottom -->
          <div class="cart-quantity-section">
            <button class="cart-quantity-btn cart-minus-btn" ${
              item.quantity <= 1 ? "disabled" : ""
            }>
              <span class="cart-quantity-icon">−</span>
            </button>
            <div class="cart-quantity-display">
              <span class="cart-quantity-value">${item.quantity}</span>
            </div>
            <button class="cart-quantity-btn cart-plus-btn">
              <span class="cart-quantity-icon">+</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Individual item actions (only REMOVE button) -->
      <div class="cart-actions">
        <button class="cart-remove-btn" data-remove-id="${item.id}">
          <span>X</span>
          <span>REMOVE</span>
        </button>
      </div>

      <!-- Section divider -->
      <hr class="cart-divider-bottom" />
    `;

    // Bind controls for this item
    this.bindItemControls(itemElement, item.id);

    return itemElement;
  }

  // Bind controls for individual cart item
  bindItemControls(itemElement, itemId) {
    const minusBtn = itemElement.querySelector(".cart-minus-btn");
    const plusBtn = itemElement.querySelector(".cart-plus-btn");
    const removeBtn = itemElement.querySelector(".cart-remove-btn");

    minusBtn.addEventListener("click", () => {
      const item = this.cartItems.find((i) => i.id === itemId);
      if (item && item.quantity > 1) {
        this.updateQuantity(itemId, item.quantity - 1);
      }
    });

    plusBtn.addEventListener("click", () => {
      const item = this.cartItems.find((i) => i.id === itemId);
      if (item) {
        this.updateQuantity(itemId, item.quantity + 1);
      }
    });

    removeBtn.addEventListener("click", () => {
      this.removeItem(itemId);
    });
  }

  // Update cart count in header and icon state
  updateCartCount() {
    const totalQuantity = this.getTotalQuantity();

    // Update cart count in cart overlay
    if (this.cartItemCount) {
      this.cartItemCount.textContent = totalQuantity
        .toString()
        .padStart(2, "0");
    }

    // Update cart count in page header (different element)
    const headerCartCount = document.querySelector(".cart-count");
    if (headerCartCount) {
      headerCartCount.textContent = totalQuantity.toString().padStart(2, "0");
      // Debug: Log to console to check if this is being called
      console.log(
        "Cart count updated to:",
        totalQuantity.toString().padStart(2, "0")
      );
      console.log("Cart count element:", headerCartCount);
    }

    // Update cart icon state based on items in cart
    this.updateCartIconState(totalQuantity);
  }

  // Update cart icon appearance based on item count
  updateCartIconState(totalQuantity) {
    const cartBtn = document.querySelector(".cart-btn");
    const cartCount = document.querySelector(".cart-count");

    if (cartBtn && cartCount) {
      if (totalQuantity > 0) {
        // Add active state class for blue background
        cartBtn.classList.add("cart-has-items");
        cartCount.classList.add("cart-count-active");
      } else {
        // Remove active state class for default appearance
        cartBtn.classList.remove("cart-has-items");
        cartCount.classList.remove("cart-count-active");
      }
    }
  }

  // Update subtotal
  updateSubtotal() {
    if (this.cartSubtotal) {
      const subtotal = this.getSubtotal();
      this.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    }
  }

  // Show cart overlay
  showCart() {
    this.renderCart();
    if (this.cartBackgroundOverlay) {
      this.cartBackgroundOverlay.classList.add("show");
    }
    if (this.cartOverlay) {
      this.cartOverlay.classList.add("show");
    }
  }

  // Close cart
  closeCart() {
    if (this.cartOverlay) {
      this.cartOverlay.classList.remove("show");
    }
    if (this.cartBackgroundOverlay) {
      this.cartBackgroundOverlay.classList.remove("show");
    }
  }

  // Show empty state
  showEmptyState() {
    if (this.cartEmptyState) {
      this.cartEmptyState.style.display = "flex";
    }
    if (this.cartMainContent) {
      this.cartMainContent.style.display = "none";
    }
    if (this.cartOverlay) {
      this.cartOverlay.classList.add("empty");
    }
  }

  // Show main content
  showMainContent() {
    if (this.cartEmptyState) {
      this.cartEmptyState.style.display = "none";
    }
    if (this.cartMainContent) {
      this.cartMainContent.style.display = "block";
    }
    if (this.cartOverlay) {
      this.cartOverlay.classList.remove("empty");
    }
  }

  // Clear entire cart
  clearCart() {
    this.cartItems = [];
    this.saveCart();
    this.renderCart();
    this.showEmptyState();
  }

  // Get cart items (for external access)
  getCartItems() {
    return [...this.cartItems];
  }

  // Get cart item count
  getItemCount() {
    return this.cartItems.length;
  }
}

// 🌍 GLOBAL INSTANCE
// Create single global instance that persists across pages
if (typeof window !== "undefined") {
  window.boulderLabCart = window.boulderLabCart || new BoulderLabCart();

  // Initialize cart and update count on page load
  document.addEventListener("DOMContentLoaded", function () {
    if (window.boulderLabCart && !window.boulderLabCart.isInitialized) {
      window.boulderLabCart.initialize();
    }
    // Always update cart count on page load to ensure sync
    if (window.boulderLabCart) {
      window.boulderLabCart.updateCartCount();
    }
  });
}
