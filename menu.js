// Full-screen Menu Functionality
document.addEventListener("DOMContentLoaded", () => {
  // Get menu elements
  const fullScreenMenu = document.getElementById("fullScreenMenu");
  const menuToggle = document.querySelector(".menu-toggle");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const membershipLink = document.querySelector(
    '#fullScreenMenu a[href="#memberships-section"]'
  );

  // Check if all required elements exist
  if (fullScreenMenu && menuToggle && closeMenuBtn) {
    // Remove any existing event listeners on menuToggle to avoid conflicts
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);

    // Open menu
    newMenuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Hamburger menu clicked - opening full-screen menu");
      fullScreenMenu.classList.add("active");
      // Disable body scroll when menu is open
      document.body.style.overflow = "hidden";
    });

    // Close menu
    closeMenuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Close button clicked - closing full-screen menu");
      fullScreenMenu.classList.remove("active");
      // Re-enable body scroll
      document.body.style.overflow = "";
    });

    // Close menu when clicking outside the menu content (on the black background)
    fullScreenMenu.addEventListener("click", (e) => {
      if (e.target === fullScreenMenu) {
        console.log("Background clicked - closing full-screen menu");
        fullScreenMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && fullScreenMenu.classList.contains("active")) {
        console.log("Escape key pressed - closing full-screen menu");
        fullScreenMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Handle the specific membership link - allow navigation and close menu
    if (membershipLink) {
      membershipLink.addEventListener("click", (e) => {
        console.log(
          "Memberships link clicked - navigating to memberships section"
        );
        // Don't prevent default - allow the navigation to happen
        fullScreenMenu.classList.remove("active");
        document.body.style.overflow = "";
      });
    }

    // Note: All other menu links now behave as normal links
    // They will navigate to their respective pages when those pages are created
    // No preventDefault or menu-closing behavior for placeholder links

    console.log("Full-screen menu functionality initialized successfully");
  } else {
    console.error("Menu elements not found. Required elements:", {
      fullScreenMenu: !!fullScreenMenu,
      menuToggle: !!menuToggle,
      closeMenuBtn: !!closeMenuBtn,
    });
  }
});
