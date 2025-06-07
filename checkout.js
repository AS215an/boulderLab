// Checkout Page Logic
class CheckoutManager {
  constructor() {
    this.currentStep = 1;
    this.formData = {
      membership: {},
      payment: {},
    };
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadCartItems();
    this.updateCartCount();
    this.updateOrderReview();
    // Initialize step 1 as active
    this.goToStep(1);
  }

  bindEvents() {
    // Real-time validation listeners
    this.setupRealTimeValidation();

    // Step 1: Continue to Payment
    document
      .getElementById("continue-to-payment")
      .addEventListener("click", () => {
        if (this.validateStep1()) {
          this.saveStep1Data();
          this.goToStep(2);
        }
      });

    // Step 2: Confirm Order
    document.getElementById("confirm-order").addEventListener("click", () => {
      if (this.validateStep2()) {
        this.saveStep2Data();
        this.goToStep(3);
      }
    });

    // Step 3: Purchase
    document.getElementById("purchase-btn").addEventListener("click", () => {
      this.completePurchase();
    });

    // Edit buttons
    document.getElementById("edit-step1").addEventListener("click", () => {
      this.editStep(1);
    });

    document.getElementById("edit-step2").addEventListener("click", () => {
      this.editStep(2);
    });

    // Cart button
    const cartBtn = document.querySelector(".cart-btn");
    if (cartBtn && window.boulderLabCart) {
      cartBtn.addEventListener("click", () => {
        window.boulderLabCart.showCart();
      });
    }
  }

  validateStep1() {
    // Clear all previous error states
    this.clearFormErrors();

    // Get form values
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value.trim();
    const terms = document.getElementById("terms").checked;

    let isValid = true;

    // Validate required fields with enhanced validation
    if (!firstName) {
      this.showFieldError(
        "firstName",
        "firstName-error",
        "*Please complete all required fields before continuing."
      );
      isValid = false;
    } else if (!this.validateNameField("firstName", "firstName-error")) {
      isValid = false;
    }

    if (!lastName) {
      this.showFieldError(
        "lastName",
        "lastName-error",
        "*Please complete all required fields before continuing."
      );
      isValid = false;
    } else if (!this.validateNameField("lastName", "lastName-error")) {
      isValid = false;
    }

    if (!email) {
      this.showFieldError(
        "email",
        "email-error",
        "*Please complete all required fields before continuing."
      );
      isValid = false;
    } else if (!this.validateEmailField("email", "email-error")) {
      isValid = false;
    }

    if (!phone) {
      this.showFieldError(
        "phone",
        "phone-error",
        "*Please complete all required fields before continuing."
      );
      isValid = false;
    } else if (!this.validatePhoneField("phone", "phone-error")) {
      isValid = false;
    }

    if (!dob) {
      this.showFieldError(
        "dob",
        "dob-error",
        "*Please complete all required fields before continuing."
      );
      isValid = false;
    } else if (!this.validateDateField("dob", "dob-error")) {
      isValid = false;
    }

    // Validate terms and conditions
    if (!terms) {
      this.showCheckboxError("terms-error");
      isValid = false;
    }

    return isValid;
  }

  validateDateFormat(dateString) {
    // Check if date matches YYYY/MM/DD format (numbers only)
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    return dateRegex.test(dateString);
  }

  showFieldError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    field.classList.add("error");
    error.classList.add("show");
  }

  showCheckboxError(errorId) {
    const error = document.getElementById(errorId);
    error.classList.add("show");
  }

  clearFormErrors() {
    // Remove error classes from all form inputs
    const inputs = document.querySelectorAll(".form-input");
    inputs.forEach((input) => {
      input.classList.remove("error");
    });

    // Hide all error messages
    const errorMessages = document.querySelectorAll(
      ".error-message, .checkbox-error"
    );
    errorMessages.forEach((error) => {
      error.classList.remove("show");
    });
  }

  validateStep2() {
    // Clear all previous error states
    this.clearFormErrors();

    // Get form values
    const cardName = document.getElementById("cardName").value.trim();
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const expiryDate = document.getElementById("expiryDate").value.trim();
    const securityCode = document.getElementById("securityCode").value.trim();

    let isValid = true;

    // Validate required fields with enhanced validation
    if (!cardName) {
      this.showFieldError(
        "cardName",
        "cardName-error",
        "*Please complete all required fields before continuing."
      );
      isValid = false;
    } else if (!this.validateCardNameField("cardName", "cardName-error")) {
      isValid = false;
    }

    if (!cardNumber) {
      this.showFieldError(
        "cardNumber",
        "cardNumber-error",
        "*Please complete all required fields before continuing."
      );
      isValid = false;
    } else if (
      !this.validateCardNumberField("cardNumber", "cardNumber-error")
    ) {
      isValid = false;
    }

    if (!expiryDate) {
      this.showFieldError(
        "expiryDate",
        "expiryDate-error",
        "*Please complete all required fields before continuing."
      );
      isValid = false;
    } else if (
      !this.validateExpiryDateField("expiryDate", "expiryDate-error")
    ) {
      isValid = false;
    }

    if (!securityCode) {
      this.showFieldError(
        "securityCode",
        "securityCode-error",
        "*Please complete all required fields before continuing."
      );
      isValid = false;
    } else if (
      !this.validateSecurityCodeField("securityCode", "securityCode-error")
    ) {
      isValid = false;
    }

    return isValid;
  }

  saveStep1Data() {
    this.formData.membership = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      dob: document.getElementById("dob").value,
      newsletter: document.getElementById("newsletter").checked,
    };

    // Update summary
    document.getElementById(
      "summary-name"
    ).textContent = `${this.formData.membership.firstName} ${this.formData.membership.lastName}`;
    document.getElementById("summary-phone").textContent =
      this.formData.membership.phone;
    document.getElementById("summary-email").textContent =
      this.formData.membership.email;
    document.getElementById("summary-dob").textContent =
      this.formData.membership.dob;
  }

  saveStep2Data() {
    this.formData.payment = {
      cardName: document.getElementById("cardName").value,
      cardNumber: document.getElementById("cardNumber").value,
      expiryDate: document.getElementById("expiryDate").value,
      securityCode: document.getElementById("securityCode").value,
    };

    // Update summary with masked data
    document.getElementById("payment-summary-name").textContent =
      this.formData.payment.cardName;
    document.getElementById("payment-summary-card").textContent =
      this.formData.payment.cardNumber;
    document.getElementById("payment-summary-expiry").textContent = "••• / •••";
    document.getElementById("payment-summary-security").textContent = "•••";

    // Update order review information
    this.updateOrderReview();
  }

  updateOrderReview() {
    const reviewContainer = document.getElementById("review-items-container");
    if (!reviewContainer) return;

    reviewContainer.innerHTML = "";

    // Get cart items
    let cartItems = [];
    if (window.boulderLabCart && window.boulderLabCart.getCartItems) {
      cartItems = window.boulderLabCart.getCartItems();
    } else {
      // Fallback: get items from DOM
      const orderItems = document.querySelectorAll(".order-item");
      orderItems.forEach((orderItem) => {
        const title = orderItem.querySelector(".order-item-title").textContent;
        const priceText =
          orderItem.querySelector(".order-item-price").textContent;
        const price = parseFloat(priceText.replace("$", ""));
        const quantity = parseInt(
          orderItem.querySelector(".qty-display").textContent
        );

        // Extract location and months/plan from meta
        const metaRows = orderItem.querySelectorAll(".order-meta-row");
        let location = "Brunswick";
        let monthsOrPlan = "1";
        let isAnnual = false;

        metaRows.forEach((row) => {
          const label = row.querySelector("span:first-child").textContent;
          const value = row.querySelector("span:last-child").textContent;
          if (label.includes("Location")) location = value;
          if (label.includes("Month") || label.includes("Plan")) {
            monthsOrPlan = value;
            isAnnual = label.includes("Plan");
          }
        });

        // Extract unit price from meta data instead of dividing
        let unitPrice = price;
        metaRows.forEach((row) => {
          const label = row.querySelector("span:first-child").textContent;
          const value = row.querySelector("span:last-child").textContent;
          if (label.includes("Unit Price")) {
            unitPrice = parseFloat(value.replace("$", ""));
          }
        });

        cartItems.push({
          title,
          price: unitPrice,
          quantity,
          months: isAnnual ? 12 : parseInt(monthsOrPlan) || 1,
          location,
          isAnnual,
        });
      });
    }

    // Create review items
    let grandTotal = 0;

    cartItems.forEach((item) => {
      const reviewItem = document.createElement("div");
      reviewItem.className = "review-item";

      const isAnnual = item.title.toLowerCase().includes("annual");
      const metaLabel = isAnnual ? "Plan:" : "Month(s):";
      const metaValue = isAnnual
        ? item.title.toLowerCase().includes("family")
          ? "FAMILY"
          : "REGULAR"
        : item.months;

      const itemTotal = item.price * item.quantity;
      grandTotal += itemTotal;

      // Build the HTML - only show Unit Price and Quantity
      let detailsHTML = `
        <div class="summary-row">
          <span class="summary-label">Unit Price:</span>
          <span class="summary-value">$${item.price.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Quantity:</span>
          <span class="summary-value">${item.quantity}</span>
        </div>
      `;

      // Only show Subtotal if quantity > 1
      if (item.quantity > 1) {
        detailsHTML += `
          <div class="summary-row">
            <span class="summary-label">Subtotal:</span>
            <span class="summary-value">$${itemTotal.toFixed(2)}</span>
          </div>
        `;
      }

      reviewItem.innerHTML = `
        <div class="review-item-header">
          <h4 class="review-item-title">${item.title}</h4>
        </div>
        <div class="review-details">
          ${detailsHTML}
        </div>
      `;

      reviewContainer.appendChild(reviewItem);
    });

    // Add startup fee
    const startupFee = 39.0;
    const startupFeeElement = document.createElement("div");
    startupFeeElement.className = "review-item startup-fee";
    startupFeeElement.innerHTML = `
      <div class="review-item-header">
        <h4 class="review-item-title">STARTUP FEE - INDIVIDUAL</h4>
        <div class="review-item-price">$${startupFee.toFixed(2)}</div>
      </div>
    `;
    reviewContainer.appendChild(startupFeeElement);

    // Add startup fee to grand total
    grandTotal += startupFee;

    // Add grand total at the end
    const totalElement = document.createElement("div");
    totalElement.className = "review-grand-total";
    totalElement.innerHTML = `
      <div class="summary-row grand-total-row">
        <span class="summary-label total-label">Total:</span>
        <span class="summary-value total-value">$${grandTotal.toFixed(2)}</span>
      </div>
    `;
    reviewContainer.appendChild(totalElement);
  }

  setupRealTimeValidation() {
    // First Name validation
    document.getElementById("firstName").addEventListener("input", (e) => {
      this.validateNameField("firstName", "firstName-error");
    });

    // Last Name validation
    document.getElementById("lastName").addEventListener("input", (e) => {
      this.validateNameField("lastName", "lastName-error");
    });

    // Phone Number validation
    document.getElementById("phone").addEventListener("input", (e) => {
      this.validatePhoneField("phone", "phone-error");
    });

    // Date of Birth validation
    document.getElementById("dob").addEventListener("input", (e) => {
      this.validateDateField("dob", "dob-error");
    });

    // Email validation
    document.getElementById("email").addEventListener("input", (e) => {
      this.validateEmailField("email", "email-error");
    });

    // Payment field validations
    // Card Name validation
    document.getElementById("cardName").addEventListener("input", (e) => {
      this.validateCardNameField("cardName", "cardName-error");
    });

    // Card Number validation
    document.getElementById("cardNumber").addEventListener("input", (e) => {
      this.validateCardNumberField("cardNumber", "cardNumber-error");
    });

    // Expiry Date validation
    document.getElementById("expiryDate").addEventListener("input", (e) => {
      this.validateExpiryDateField("expiryDate", "expiryDate-error");
    });

    // Security Code validation
    document.getElementById("securityCode").addEventListener("input", (e) => {
      this.validateSecurityCodeField("securityCode", "securityCode-error");
    });
  }

  validateNameField(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    const nameRegex = /^[a-zA-Z\s]*$/; // Only letters and spaces

    if (value && !nameRegex.test(value)) {
      this.showFieldError(fieldId, errorId, "*Name must only contain letters.");
      return false;
    } else {
      this.clearFieldError(fieldId, errorId);
      return true;
    }
  }

  validatePhoneField(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const value = field.value.replace(/\s/g, ""); // Remove whitespace
    const phoneRegex = /^\d+$/; // Only numbers

    if (value && !phoneRegex.test(value)) {
      this.showFieldError(
        fieldId,
        errorId,
        "*Phone number must only contain numbers."
      );
      return false;
    } else if (value && value.length > 10) {
      this.showFieldError(
        fieldId,
        errorId,
        "*Too many digits. Please enter a 10-digit phone number."
      );
      return false;
    } else if (value && value.length > 0 && value.length < 10) {
      this.showFieldError(
        fieldId,
        errorId,
        "*Phone number must be exactly 10 digits."
      );
      return false;
    } else {
      this.clearFieldError(fieldId, errorId);
      return true;
    }
  }

  validateDateField(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();

    if (value && !this.validateDateFormat(value)) {
      this.showFieldError(
        fieldId,
        errorId,
        "*Invalid format. Please use YYYY/MM/DD (e.g., 2003/04/21)."
      );
      return false;
    } else {
      this.clearFieldError(fieldId, errorId);
      return true;
    }
  }

  validateEmailField(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value && !emailRegex.test(value)) {
      this.showFieldError(
        fieldId,
        errorId,
        "Please enter a valid email address."
      );
      return false;
    } else {
      this.clearFieldError(fieldId, errorId);
      return true;
    }
  }

  validateCardNameField(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    const nameRegex = /^[a-zA-Z\s]*$/; // Only letters and spaces

    if (value && !nameRegex.test(value)) {
      this.showFieldError(fieldId, errorId, "*Name must only contain letters.");
      return false;
    } else {
      this.clearFieldError(fieldId, errorId);
      return true;
    }
  }

  validateCardNumberField(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const value = field.value.replace(/\s/g, ""); // Remove whitespace
    const numberRegex = /^\d+$/; // Only numbers

    if (value && !numberRegex.test(value)) {
      this.showFieldError(
        fieldId,
        errorId,
        "*Card number must only contain numbers."
      );
      return false;
    } else if (value && (value.length < 13 || value.length > 19)) {
      this.showFieldError(
        fieldId,
        errorId,
        "*Please enter a valid card number (13-19 digits)."
      );
      return false;
    } else {
      this.clearFieldError(fieldId, errorId);
      return true;
    }
  }

  validateExpiryDateField(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format

    if (value && !expiryRegex.test(value)) {
      this.showFieldError(
        fieldId,
        errorId,
        "*Please enter a valid expiry date (MM/YY)."
      );
      return false;
    } else if (value && expiryRegex.test(value)) {
      // Check if date is not expired
      const [month, year] = value.split("/");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
      const currentMonth = currentDate.getMonth() + 1;

      const cardYear = parseInt(year);
      const cardMonth = parseInt(month);

      if (
        cardYear < currentYear ||
        (cardYear === currentYear && cardMonth < currentMonth)
      ) {
        this.showFieldError(
          fieldId,
          errorId,
          "*Card has expired. Please use a valid card."
        );
        return false;
      }
    }

    this.clearFieldError(fieldId, errorId);
    return true;
  }

  validateSecurityCodeField(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    const cvcRegex = /^\d{3,4}$/; // 3 or 4 digits

    if (value && !cvcRegex.test(value)) {
      this.showFieldError(
        fieldId,
        errorId,
        "*Security code must be 3 or 4 digits."
      );
      return false;
    } else {
      this.clearFieldError(fieldId, errorId);
      return true;
    }
  }

  showFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    field.classList.add("error");
    if (error) {
      error.textContent = message;
      error.classList.add("show");
    }
  }

  clearFieldError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    field.classList.remove("error");
    if (error) {
      error.classList.remove("show");
    }
  }

  goToStep(stepNumber) {
    // Remove active class from all steps
    document.querySelectorAll(".checkout-step").forEach((step) => {
      step.classList.remove("active");
    });

    // Mark steps as completed or active
    for (let i = 1; i <= 3; i++) {
      const step = document.getElementById(`step${i}`);
      const editBtn = document.getElementById(`edit-step${i}`);

      if (i < stepNumber) {
        // Previous steps are completed
        step.classList.add("completed");
        step.classList.remove("active");
        if (editBtn) editBtn.style.display = "block";
      } else if (i === stepNumber) {
        // Current step is active
        step.classList.add("active");
        step.classList.remove("completed");
        if (editBtn) editBtn.style.display = "none";
      } else {
        // Future steps are inactive
        step.classList.remove("active", "completed");
        if (editBtn) editBtn.style.display = "none";
      }
    }

    this.currentStep = stepNumber;

    // Handle quantity controls based on step
    this.toggleQuantityControls(stepNumber);

    // Update order review if on step 3
    if (stepNumber === 3) {
      this.updateOrderReview();
    }
  }

  toggleQuantityControls(stepNumber) {
    const quantityControls = document.querySelectorAll(".quantity-controls");
    const orderSummary = document.querySelector(".order-summary");

    if (stepNumber === 3) {
      // Step 3: Disable quantity controls
      quantityControls.forEach((control) => {
        control.classList.add("disabled");
        const buttons = control.querySelectorAll(".qty-btn");
        buttons.forEach((btn) => {
          btn.disabled = true;
          btn.style.cursor = "not-allowed";
        });
      });
      if (orderSummary) {
        orderSummary.classList.add("final-step");
      }
    } else {
      // Steps 1-2: Enable quantity controls
      quantityControls.forEach((control) => {
        control.classList.remove("disabled");
        const buttons = control.querySelectorAll(".qty-btn");
        buttons.forEach((btn) => {
          btn.disabled = false;
          btn.style.cursor = "pointer";
        });
      });
      if (orderSummary) {
        orderSummary.classList.remove("final-step");
      }
    }
  }

  editStep(stepNumber) {
    // Clear any future step completions when editing a previous step
    for (let i = stepNumber + 1; i <= 3; i++) {
      const futureStep = document.getElementById(`step${i}`);
      if (futureStep) {
        futureStep.classList.remove("completed");
      }
    }

    // Go back to the step to edit
    this.goToStep(stepNumber);
  }

  loadCartItems() {
    const orderItemsContainer = document.getElementById("order-items");

    if (window.boulderLabCart && window.boulderLabCart.getCartItems) {
      const cartItems = window.boulderLabCart.getCartItems();

      if (cartItems.length > 0) {
        orderItemsContainer.innerHTML = "";

        cartItems.forEach((item) => {
          const orderItemHTML = this.createOrderItemHTML(item);
          orderItemsContainer.appendChild(orderItemHTML);
        });

        this.updatePricing();
      } else {
        // Default item if cart is empty
        this.createDefaultOrderItem();
      }
    } else {
      // Default item if cart system is not available
      this.createDefaultOrderItem();
    }
  }

  createDefaultOrderItem() {
    const orderItemsContainer = document.getElementById("order-items");
    const defaultItem = {
      title: "Month to Month Membership",
      price: 149.5,
      quantity: 1,
      months: 1,
      location: "Brunswick",
      image: "Images/CardImages/Card2-MonthToMonth.png",
    };

    const orderItemHTML = this.createOrderItemHTML(defaultItem);
    orderItemsContainer.appendChild(orderItemHTML);
    this.updatePricing();
  }

  createOrderItemHTML(item) {
    const orderItem = document.createElement("div");
    orderItem.className = "order-item";
    orderItem.setAttribute("data-item-id", item.id || item.title); // Use id or title as identifier

    // Determine if this is an Annual membership
    const isAnnual = item.title.toLowerCase().includes("annual");
    const metaLabel = isAnnual ? "Plan:" : "Month(s):";
    const metaValue = isAnnual
      ? item.title.toLowerCase().includes("family")
        ? "FAMILY"
        : "REGULAR"
      : item.months;

    // Calculate subtotal for this item
    const itemSubtotal = item.price * item.quantity;

    // Build meta information - only show Unit Price, Quantity, and Subtotal (if quantity > 1)
    let metaHTML = `
      <div class="order-meta-row">
        <span>Unit Price:</span>
        <span>$${item.price.toFixed(2)}</span>
      </div>
      <div class="order-meta-row">
        <span>Quantity:</span>
        <span>${item.quantity}</span>
      </div>
    `;

    // Add Subtotal only if quantity > 1
    if (item.quantity > 1) {
      metaHTML += `
        <div class="order-meta-row">
          <span>Subtotal:</span>
          <span>$${itemSubtotal.toFixed(2)}</span>
        </div>
      `;
    }

    orderItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="order-item-image" />
      <div class="order-item-details">
        <h3 class="order-item-title">${item.title}</h3>
        <div class="order-item-price">$${item.price.toFixed(2)}</div>
        <div class="order-item-meta">
          ${metaHTML}
        </div>
        <div class="quantity-controls">
          <button class="qty-btn minus-btn" data-action="decrease" data-item-id="${
            item.id || item.title
          }">−</button>
          <div class="qty-display">${item.quantity}</div>
          <button class="qty-btn plus-btn" data-action="increase" data-item-id="${
            item.id || item.title
          }">+</button>
        </div>
      </div>
    `;

    // Add event listeners for quantity controls
    this.setupQuantityControls(orderItem, item);

    return orderItem;
  }

  setupQuantityControls(orderItem, item) {
    const minusBtn = orderItem.querySelector(".minus-btn");
    const plusBtn = orderItem.querySelector(".plus-btn");
    const qtyDisplay = orderItem.querySelector(".qty-display");

    minusBtn.addEventListener("click", () => {
      this.updateQuantity(item, -1, qtyDisplay, orderItem);
    });

    plusBtn.addEventListener("click", () => {
      this.updateQuantity(item, 1, qtyDisplay, orderItem);
    });
  }

  updateQuantity(item, change, qtyDisplay, orderItem) {
    const newQuantity = Math.max(0, item.quantity + change);

    if (newQuantity === 0) {
      // Remove item from cart and DOM
      if (window.boulderLabCart && window.boulderLabCart.removeItem) {
        window.boulderLabCart.removeItem(item.id || item.title);
      }
      orderItem.remove();
    } else {
      // Update quantity
      item.quantity = newQuantity;
      qtyDisplay.textContent = newQuantity;

      // Update cart if cart system exists
      if (window.boulderLabCart && window.boulderLabCart.updateQuantity) {
        window.boulderLabCart.updateQuantity(
          item.id || item.title,
          newQuantity
        );
      }
    }

    // Update pricing and cart count
    this.updatePricing();
    this.updateCartCount();
  }

  updatePricing() {
    let subtotal = 0;
    const startupFee = 39.0;

    if (window.boulderLabCart && window.boulderLabCart.getCartItems) {
      const cartItems = window.boulderLabCart.getCartItems();
      subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    } else {
      // Calculate from DOM if cart system not available
      const orderItems = document.querySelectorAll(".order-item");
      orderItems.forEach((orderItem) => {
        const priceText =
          orderItem.querySelector(".order-item-price").textContent;
        const price = parseFloat(priceText.replace("$", ""));
        const quantity = parseInt(
          orderItem.querySelector(".qty-display").textContent
        );
        subtotal += price * quantity;
      });
    }

    const total = subtotal + startupFee;

    document.getElementById(
      "subtotal-amount"
    ).textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("total-amount").textContent = `$${total.toFixed(
      2
    )}`;
  }

  updateCartCount() {
    if (window.boulderLabCart && window.boulderLabCart.getTotalQuantity) {
      const totalQuantity = window.boulderLabCart.getTotalQuantity();
      const cartCount = document.querySelector(".cart-count");
      if (cartCount) {
        cartCount.textContent = totalQuantity.toString().padStart(2, "0");
      }
    }
  }

  completePurchase() {
    // Clear the cart after successful purchase
    if (window.boulderLabCart && window.boulderLabCart.clearCart) {
      window.boulderLabCart.clearCart();
    } else {
      // Fallback: Clear cart data from localStorage if cart system uses it
      localStorage.removeItem("boulderLabCart");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cart");
    }

    // Update cart count display
    const cartCount = document.querySelector(".cart-count");
    if (cartCount) {
      cartCount.textContent = "00";
    }

    // Redirect to success page
    window.location.href = "checkout-success.html";
  }
}

// Initialize checkout when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CheckoutManager();
});
