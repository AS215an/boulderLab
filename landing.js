// Landing Page JavaScript
class LandingPage {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 3;
    this.autoRotateTimer = null;
    this.isAutoRotating = true;
    this.rotateInterval = 10000; // 10 seconds

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.startAutoRotation();
    this.setupFooterForm();
    this.setupProgressRings();
    this.setupModal();
  }

  setupEventListeners() {
    // Navigation circle click handlers
    const navCircles = document.querySelectorAll(".nav-circle");
    navCircles.forEach((circle, index) => {
      circle.addEventListener("click", () => {
        this.goToSlideManual(index);
      });

      // Keyboard accessibility
      circle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.goToSlideManual(index);
        }
      });
    });

    // Cart icon click handler
    const cartBtn = document.querySelector(".cart-btn");
    if (cartBtn) {
      cartBtn.addEventListener("click", () => {
        // You can add cart functionality here
        console.log("Cart clicked");
      });
    }

    // Search icon click handler
    const searchBtn = document.querySelector(".search-btn");
    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        // You can add search functionality here
        console.log("Search clicked");
      });
    }

    // Optional: You can add hover behavior here if needed
    // For now, we'll let the auto-rotation continue even on hover

    // Handle window focus/blur for performance
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pauseAutoRotation();
      } else {
        this.resumeAutoRotation();
      }
    });
  }

  setupModal() {
    const modal = document.getElementById("firstTimeModal");
    const closeBtn = document.getElementById("modalClose");
    const modalLinks = document.querySelectorAll(".modal-link");
    const waiverBtn = document.querySelector(".complete-waiver-btn");

    // Show modal after 3 seconds (optional - can be removed if always visible)
    // setTimeout(() => {
    //   if (modal) {
    //     modal.style.display = 'block';
    //   }
    // }, 3000);

    // Close modal
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    // Handle modal link clicks
    modalLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const linkText = link.textContent.trim();
        if (linkText.includes("Age limit")) {
          console.log("Age limit info requested");
          // Add your age limit info logic here
        } else if (linkText.includes("Already filled")) {
          console.log("Already filled waiver check");
          // Add your waiver check logic here
        } else if (linkText.includes("Contact us")) {
          console.log("Contact us requested");
          // Add your contact logic here
        }
      });
    });

    // Handle waiver button click
    if (waiverBtn) {
      waiverBtn.addEventListener("click", () => {
        console.log("Complete waiver clicked");
        // Add your waiver completion logic here
        // For example: window.open('/waiver-form', '_blank');
      });
    }

    // Close modal when clicking outside
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    }
  }

  goToSlide(slideIndex, isManual = false) {
    if (slideIndex === this.currentSlide) return;

    // Update slides
    const slides = document.querySelectorAll(".welcome-slide");
    const navCircles = document.querySelectorAll(".nav-circle");

    // Remove active classes
    slides[this.currentSlide].classList.remove("active");
    navCircles[this.currentSlide].classList.remove("active");

    // Add active classes to new slide
    this.currentSlide = slideIndex;
    slides[this.currentSlide].classList.add("active");
    navCircles[this.currentSlide].classList.add("active");

    // Reset progress ring animation
    this.resetProgressRings();

    // Handle manual vs automatic slide changes
    if (isManual) {
      // Pause briefly for manual interaction, then restart
      this.pauseAutoRotation();
      setTimeout(() => {
        this.resumeAutoRotation();
      }, 2000); // 2 second pause after manual interaction
    } else {
      // For automatic slides, just animate the current progress ring
      this.animateProgressRing(this.currentSlide);
    }
  }

  goToSlideManual(slideIndex) {
    this.goToSlide(slideIndex, true);
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(nextIndex, false); // false indicates automatic slide change
  }

  startAutoRotation() {
    if (!this.isAutoRotating) return;

    // Clear any existing timer
    if (this.autoRotateTimer) {
      clearInterval(this.autoRotateTimer);
    }

    // Start progress animation for current slide immediately
    this.animateProgressRing(this.currentSlide);

    // Set up the auto-advance timer
    this.autoRotateTimer = setInterval(() => {
      this.nextSlide();
    }, this.rotateInterval);
  }

  pauseAutoRotation() {
    this.isAutoRotating = false;
    if (this.autoRotateTimer) {
      clearInterval(this.autoRotateTimer);
      this.autoRotateTimer = null;
    }
    this.resetProgressRings();
  }

  resumeAutoRotation() {
    this.isAutoRotating = true;
    this.startAutoRotation();
  }

  setupProgressRings() {
    const circles = document.querySelectorAll(".progress-ring-circle");
    circles.forEach((circle) => {
      const radius = circle.r.baseVal.value; // radius is 15
      const circumference = radius * 2 * Math.PI; // 94.2
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = circumference;
    });
  }

  animateProgressRing(slideIndex) {
    const navCircle = document.querySelectorAll(".nav-circle")[slideIndex];
    const progressRing = navCircle.querySelector(".progress-ring-circle");

    if (progressRing) {
      // Reset the animation with smooth transition
      progressRing.style.animation = "none";
      progressRing.style.strokeDashoffset = "94.2"; // Reset to start position
      progressRing.offsetHeight; // Trigger reflow

      // Start the smooth animation for the current slide duration
      progressRing.style.animation = `fillProgress ${this.rotateInterval}ms ease-out forwards`;
    }
  }

  resetProgressRings() {
    const progressRings = document.querySelectorAll(".progress-ring-circle");
    progressRings.forEach((ring) => {
      ring.style.animation = "none";
      const radius = ring.r.baseVal.value;
      const circumference = radius * 2 * Math.PI;
      ring.style.strokeDashoffset = circumference;
    });
  }

  setupFooterForm() {
    const form = document.querySelector(".signup-form");
    const emailInput = document.querySelector(".email-input");
    const submitBtn = document.querySelector(".signup-btn");

    if (form && emailInput && submitBtn) {
      submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleEmailSignup(emailInput.value);
      });

      emailInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.handleEmailSignup(emailInput.value);
        }
      });
    }
  }

  handleEmailSignup(email) {
    if (!this.isValidEmail(email)) {
      this.showMessage("Please enter a valid email address", "error");
      return;
    }

    // Here you would typically send the email to your server
    console.log("Email signup:", email);
    this.showMessage("Thank you for signing up!", "success");

    // Clear the input
    const emailInput = document.querySelector(".email-input");
    if (emailInput) {
      emailInput.value = "";
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showMessage(message, type) {
    // Create a temporary message element
    const messageEl = document.createElement("div");
    messageEl.textContent = message;
    messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 4px;
            color: white;
            font-weight: 700;
            z-index: 10000;
            transition: opacity 0.3s ease;
            ${
              type === "success"
                ? "background: #28a745;"
                : "background: #dc3545;"
            }
        `;

    document.body.appendChild(messageEl);

    // Remove message after 3 seconds
    setTimeout(() => {
      messageEl.style.opacity = "0";
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.parentNode.removeChild(messageEl);
        }
      }, 300);
    }, 3000);
  }
}

// Smooth scroll for anchor links
function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Handle explore block clicks with smooth scrolling
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the landing page
  const landingPage = new LandingPage();

  // Add smooth scrolling to explore blocks
  const exploreBlocks = document.querySelectorAll(".explore-block");
  exploreBlocks.forEach((block) => {
    block.addEventListener("click", (e) => {
      const href = block.getAttribute("onclick");
      if (href && href.includes("#")) {
        e.preventDefault();
        const target = href.match(/#[\w-]+/);
        if (target) {
          smoothScroll(target[0]);
        }
      }
    });
  });

  // Add keyboard navigation for explore blocks
  exploreBlocks.forEach((block) => {
    block.setAttribute("tabindex", "0");
    block.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        block.click();
      }
    });
  });

  // Optimize images loading
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("load", () => {
      img.style.opacity = "1";
    });

    img.addEventListener("error", () => {
      console.warn("Failed to load image:", img.src);
      img.style.opacity = "0.5";
    });
  });

  // Add intersection observer for animations
  if ("IntersectionObserver" in window) {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe explore blocks for scroll animations
    exploreBlocks.forEach((block) => {
      observer.observe(block);
    });
  }
});

// Performance optimization
window.addEventListener("load", () => {
  // Preload critical images
  const criticalImages = [
    "Images/HomePage/welcome-image3.png",
    "Images/HomePage/welcome-image-2.png",
    "Images/HomePage/welcome-image-1.png",
  ];

  criticalImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
});

// Handle window resize for responsive behavior
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Recalculate any layout-dependent elements
    const welcomeImages = document.querySelectorAll(".welcome-image img");
    welcomeImages.forEach((img) => {
      if (img.complete) {
        img.style.height = "auto";
      }
    });
  }, 250);
});
