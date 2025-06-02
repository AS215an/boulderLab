document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("header nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

  // Product Filtering
  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");
  const resultsCount = document.querySelector(".results-count");

  if (filterButtons.length > 0 && productCards.length > 0 && resultsCount) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Manage active button state
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filterValue = button.dataset.filter;
        let visibleProducts = 0;

        productCards.forEach((card) => {
          const cardCategory = card.dataset.category;
          if (filterValue === "all" || filterValue === cardCategory) {
            card.style.display = "block";
            visibleProducts++;
          } else {
            card.style.display = "none";
          }
        });
        resultsCount.textContent = `${visibleProducts} Result${
          visibleProducts !== 1 ? "s" : ""
        }`;
      });
    });
  }
});

// Ticker Pause/Play Functionality
document.addEventListener("DOMContentLoaded", () => {
  const ticker = document.getElementById("ticker");
  const pauseBtn = document.getElementById("pauseBtn");

  // Check if elements exist before adding event listeners
  if (ticker && pauseBtn) {
    let isPaused = false;

    pauseBtn.addEventListener("click", () => {
      isPaused = !isPaused;
      // Ensure the ticker element itself has its animation play state changed
      ticker.style.animationPlayState = isPaused ? "paused" : "running";
      pauseBtn.textContent = isPaused ? "▶" : "❚❚";
      pauseBtn.setAttribute("aria-pressed", isPaused.toString());
    });
  } else {
    // Optional: Log an error if elements are not found for debugging
    if (!ticker) console.error('Ticker element with ID "ticker" not found.');
    if (!pauseBtn)
      console.error('Pause button element with ID "pauseBtn" not found.');
  }
});
