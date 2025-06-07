document.addEventListener("DOMContentLoaded", () => {
  const fullScreenMenu = document.getElementById("fullScreenMenu");
  const menuToggle = document.querySelector(".menu-toggle");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const membershipLink = document.querySelector(
    '#fullScreenMenu a[href="#memberships-section"]'
  );

  if (fullScreenMenu && menuToggle && closeMenuBtn) {
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);

    newMenuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      fullScreenMenu.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    closeMenuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      fullScreenMenu.classList.remove("active");
      document.body.style.overflow = "";
    });

    fullScreenMenu.addEventListener("click", (e) => {
      if (e.target === fullScreenMenu) {
        fullScreenMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && fullScreenMenu.classList.contains("active")) {
        fullScreenMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    if (membershipLink) {
      membershipLink.addEventListener("click", (e) => {
        fullScreenMenu.classList.remove("active");
        document.body.style.overflow = "";
      });
    }
  }
});
