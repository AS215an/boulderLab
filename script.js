document.addEventListener("DOMContentLoaded", () => {
  const filterNavbar = document.querySelector(".on-filters-navbar");
  const productCards = document.querySelectorAll(".product-card");
  const resultsCount = document.querySelector(".results-count");
  const pageTitle = document.querySelector(".memberships-page h1");

  const filterCategories = [
    { id: "all", label: "All" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "yearly", label: "Yearly" },
  ];

  function applyProductFilter(filterValue) {
    if (!productCards || !resultsCount || !pageTitle) return;
    let visibleProducts = 0;
    productCards.forEach((card) => {
      const cardCategory = card.dataset.category;

      // Find the wrapper element (could be .product-card or .product-card-link)
      const wrapper = card.closest(".product-card-link") || card;

      if (filterValue === "all" || filterValue === cardCategory) {
        wrapper.style.display = "block";
        visibleProducts++;
      } else {
        wrapper.style.display = "none";
      }
    });
    resultsCount.textContent = `${visibleProducts} Result${
      visibleProducts !== 1 ? "s" : ""
    }`;

    if (filterValue === "all") {
      pageTitle.textContent = "All Memberships";
    } else {
      const activeCategoryObject = filterCategories.find(
        (cat) => cat.id === filterValue
      );
      if (activeCategoryObject) {
        pageTitle.textContent = `${activeCategoryObject.label} Memberships`;
      } else {
        pageTitle.textContent = "Memberships";
      }
    }
  }

  function createFilterElement(
    type,
    { id, label },
    options = {} // Consolidated options
  ) {
    const element = document.createElement("button");
    element.dataset.filter = id;
    element.classList.add(
      type === "chip" ? "on-filter-chip" : "on-filter-text-tab"
    );

    const displayLabel =
      label.toLowerCase() === "all" ? "All" : label.toUpperCase();

    let iconHTML =
      '<span class="on-filter-clear-icon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>';

    if (type === "chip") {
      element.innerHTML = `<span>${displayLabel}</span>`;

      if (options.isInitialAll) {
        element.classList.add("is-initial-all-active");
      }
      if (options.isClearable) {
        element.classList.add("is-clearable");
        element.innerHTML += iconHTML;
      }
      if (options.isPrimary) {
        element.classList.add("is-primary-active-category-chip");
      }
      if (options.isSecondary) {
        element.classList.add("is-secondary-all-chip");
      }
    } else {
      element.innerHTML = `<span>${displayLabel}</span>`;
      if (options.isMainAllActiveTab) {
        element.classList.add("is-main-all-active");
      } else if (options.isInactiveTab) {
        element.classList.add("is-inactive");
      }
    }
    return element;
  }

  function renderFilterUI(activeFilterValue) {
    if (!filterNavbar) return;
    filterNavbar.innerHTML = "";

    const chipContainer = document.createElement("div");
    chipContainer.className = "on-filters-chip-container";

    if (activeFilterValue === "all") {
      chipContainer.appendChild(
        createFilterElement("chip", filterCategories[0], { isInitialAll: true })
      );
      filterNavbar.appendChild(chipContainer);

      filterCategories.slice(1).forEach((cat) => {
        filterNavbar.appendChild(
          createFilterElement("tab", cat, { isInactiveTab: true })
        );
      });
    } else {
      const activeCategory = filterCategories.find(
        (c) => c.id === activeFilterValue
      );
      if (activeCategory) {
        chipContainer.appendChild(
          createFilterElement("chip", filterCategories[0], {
            isClearable: true,
            isSecondary: true,
          })
        );
        chipContainer.appendChild(
          createFilterElement("chip", activeCategory, {
            isClearable: true,
            isPrimary: true,
          })
        );
      }
      filterNavbar.appendChild(chipContainer);

      filterNavbar.appendChild(
        createFilterElement("tab", filterCategories[0], {
          isMainAllActiveTab: true,
        })
      );

      filterCategories.slice(1).forEach((cat) => {
        if (cat.id !== activeFilterValue) {
          filterNavbar.appendChild(
            createFilterElement("tab", cat, { isInactiveTab: true })
          );
        }
      });
    }
    attachFilterEventListeners();
  }

  function attachFilterEventListeners() {
    const allFilterElements = filterNavbar.querySelectorAll(
      ".on-filter-chip, .on-filter-text-tab"
    );
    allFilterElements.forEach((element) => {
      element.addEventListener("click", (event) => {
        let targetElement = event.target;
        let filterButton = targetElement.closest(
          ".on-filter-chip, .on-filter-text-tab"
        );
        if (!filterButton) return;

        const newFilterValue = filterButton.dataset.filter;
        const isClearIconClick = targetElement.closest(".on-filter-clear-icon");

        if (isClearIconClick) {
          renderFilterUI("all");
          applyProductFilter("all");
          return;
        }

        if (filterButton.classList.contains("is-secondary-all-chip")) {
          return;
        }

        if (
          filterButton.classList.contains("is-primary-active-category-chip") &&
          newFilterValue !== "all"
        ) {
          renderFilterUI(newFilterValue);
          applyProductFilter(newFilterValue);
          return;
        }
        if (newFilterValue) {
          renderFilterUI(newFilterValue);
          applyProductFilter(newFilterValue);
        }
      });
    });
  }

  if (filterNavbar) {
    renderFilterUI("all");
    applyProductFilter("all");
  }

  // Ticker Pause/Play Functionality
  const ticker = document.getElementById("ticker");
  const pauseBtn = document.getElementById("pauseBtn");

  if (ticker && pauseBtn) {
    let isPaused = false;
    pauseBtn.addEventListener("click", () => {
      isPaused = !isPaused;
      ticker.style.animationPlayState = isPaused ? "paused" : "running";
      pauseBtn.textContent = isPaused ? "▶" : "❚❚";
      pauseBtn.setAttribute("aria-pressed", isPaused.toString());
    });
  }
});
