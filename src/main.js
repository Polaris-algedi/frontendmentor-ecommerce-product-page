import "./style.css";

// Data
const product = {
  id: 1,
  name: "Fall Limited Edition Sneakers",
  price: 125.0,
  images: [
    "./images/image-product-1.jpg",
    "./images/image-product-2.jpg",
    "./images/image-product-3.jpg",
    "./images/image-product-4.jpg",
  ],
  thumbnails: [
    "./images/image-product-1-thumbnail.jpg",
    "./images/image-product-2-thumbnail.jpg",
    "./images/image-product-3-thumbnail.jpg",
    "./images/image-product-4-thumbnail.jpg",
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  // ====== ---------------------------------------Focus Trap Start--------------------------------------- ======
  class FocusTrap {
    constructor(element) {
      this.element = element;
      this.focusableElements = [
        "button",
        "a",
        "input",
        "select",
        "textarea",
        '[tabindex]:not([tabindex="-1"])',
      ].join(",");
      // store bound handler so removeEventListener can match it
      this._boundTrapFocus = null;
    }

    getFocusableElements() {
      const focusable = this.element.querySelectorAll(this.focusableElements);
      return Array.from(focusable).filter((el) => {
        return (
          !el.hasAttribute("disabled") &&
          !el.getAttribute("aria-hidden") &&
          el.offsetParent !== null
        ); // Not visually hidden
      });
    }

    trapFocus(e) {
      const focusable = this.getFocusableElements();
      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    activate() {
      const focusable = this.getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      }

      // bind once and keep reference for removal
      this._boundTrapFocus = this.trapFocus.bind(this);
      this.element.addEventListener("keydown", this._boundTrapFocus);
    }

    deactivate() {
      if (this._boundTrapFocus) {
        this.element.removeEventListener("keydown", this._boundTrapFocus);
        this._boundTrapFocus = null;
      }
    }
  }
  let focusTrap = null;
  // ====== ---------------------------------------Focus Trap End--------------------------------------- ======
  // ====== ---------------------------------------Mobile Menu Start--------------------------------------- ======

  const menuOpen = document.querySelector(".mobile-menu__open");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuClose = document.querySelector(".mobile-menu__close");

  if (!menuOpen || !mobileMenu || !menuClose) {
    // Exit early if elements don’t exist
    return;
  }

  // Track if we're in mobile mode
  let isMobileMode = window.matchMedia("(max-width: 1279px)").matches;

  // Initialize ARIA state
  mobileMenu.setAttribute("aria-hidden", isMobileMode ? "true" : "false");

  // Define handlers once
  function openMenu() {
    if (!isMobileMode) return; // Safety guard
    menuOpen.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    mobileMenu.classList.add("open");
    menuClose.focus();
    focusTrap = new FocusTrap(mobileMenu);
    focusTrap.activate();
    document.body.classList.add("no-scroll"); // Prevent background scrolling
  }

  function closeMenu() {
    if (!isMobileMode) return;
    menuOpen.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.classList.remove("open");
    menuOpen.focus();
    if (focusTrap) {
      focusTrap.deactivate();
      focusTrap = null;
    }
    document.body.classList.remove("no-scroll"); // Allow background scrolling
  }

  function handleKeyDown(e) {
    if (
      e.key === "Escape" &&
      isMobileMode &&
      mobileMenu.classList.contains("open")
    ) {
      closeMenu();
    }
  }

  // Add listeners ONCE
  menuOpen.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  document.addEventListener("keydown", handleKeyDown);

  // Respond to resize
  const mediaQuery = window.matchMedia("(max-width: 1279px)");
  function handleViewportChange(e) {
    isMobileMode = e.matches;

    if (isMobileMode) {
      // Ensure menu is hidden on mobile load/resize
      mobileMenu.setAttribute("aria-hidden", "true");
      mobileMenu.classList.remove("open");
      menuOpen.setAttribute("aria-expanded", "false");
    } else {
      // On desktop: ensure menu is accessible and visible if needed
      mobileMenu.removeAttribute("aria-hidden");
      mobileMenu.classList.remove("open"); // hide visually
      menuOpen.setAttribute("aria-expanded", "false");
      // If a focus trap is active (from mobile), deactivate it so focus is not trapped on desktop
      if (focusTrap) {
        focusTrap.deactivate();
        focusTrap = null;
      }
      document.body.classList.remove("no-scroll");
    }
  }

  // Initialize and listen
  handleViewportChange(mediaQuery);
  mediaQuery.addEventListener("change", handleViewportChange);

  // ====== ---------------------------------------Mobile Menu End--------------------------------------- ======

  // ====== ---------------------------------------Lightbox functionality Start--------------------------------------- ======
  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.querySelector(".lightbox__close");
  const lightboxTrigger = document.querySelector(".lightbox-trigger"); // Select the first product image.

  function openLightbox() {
    lightbox.classList.add("lightbox-active");
    lightbox.classList.remove("hidden");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxClose.focus();
    focusTrap = new FocusTrap(lightbox);
    focusTrap.activate();

    document.body.classList.add("no-scroll");
  }
  function closeLightbox(e) {
    if (e.key === "Escape" || e.type === "click" || e.type === "change") {
      lightbox.classList.remove("lightbox-active");
      lightbox.classList.add("hidden");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxTrigger.focus();
      if (focusTrap) {
        focusTrap.deactivate();
        focusTrap = null;
      }
      document.body.classList.remove("no-scroll");
    }
  }

  function updateLightboxListener(e) {
    if (lightboxTrigger && lightbox) {
      if (mediaQuery.matches) {
        // Mobile: remove listener if it exists
        lightboxTrigger.removeEventListener("click", openLightbox);
        closeLightbox(e); // Close lightbox if open
      } else {
        // Desktop: add listener (ensure it's not added multiple times)
        lightboxTrigger.addEventListener("click", openLightbox);
      }
    }
  }
  // Run on load
  updateLightboxListener();

  // Re-run on resize
  mediaQuery.addEventListener("change", updateLightboxListener);

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", closeLightbox);

  // Thumbnail click to change main image
  const productImages = document.querySelector(".product-images");
  const productThumbnailButtons =
    productImages.querySelectorAll(".thumbnail-button");
  const productThumbnailImgs =
    productImages.querySelectorAll(".thumbnail-image");
  const lightboxThumbnailButtons =
    lightbox.querySelectorAll(".thumbnail-button");
  const lightboxThumbnailImgs = lightbox.querySelectorAll(".thumbnail-image");

  const mainImages = document.querySelectorAll(".product-image"); // Both main and lightbox images

  let currentIndex = 0;

  productThumbnailButtons.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const newSrc = thumbnail
        .querySelector("img")
        .getAttribute("src")
        .replace("-thumbnail", "");
      currentIndex = product.images.indexOf(newSrc);
      if (mainImages && newSrc) {
        mainImages.forEach((img) => {
          img.src = newSrc;
        });
        updateThumbnailActiveState(currentIndex);
        updateLightboxThumbnailActiveState(currentIndex);
      }
    });
  });

  lightboxThumbnailButtons.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const newSrc = thumbnail
        .querySelector("img")
        .getAttribute("src")
        .replace("-thumbnail", "");
      currentIndex = product.images.indexOf(newSrc);
      if (mainImages && newSrc) {
        mainImages.forEach((img) => {
          img.src = newSrc;
        });
        updateThumbnailActiveState(currentIndex);
        updateLightboxThumbnailActiveState(currentIndex);
      }
    });
  });

  // Next and previous buttons for lightbox
  const lightboxNextButton = document.querySelector(".lightbox__next");
  const lightboxPrevButton = document.querySelector(".lightbox__prev");
  const mobilePrevButton = document.querySelector(".mobile__prev");
  const mobileNextButton = document.querySelector(".mobile__next");

  const updateLightboxImage = (index) => {
    const newSrc = product.images[index];
    if (mainImages && newSrc) {
      mainImages.forEach((img) => {
        img.src = newSrc;
      });
    }
  };

  const updateThumbnailActiveState = (index) => {
    productThumbnailButtons.forEach((button, btnIndex) => {
      if (btnIndex === index) {
        button.classList.add("selected_thumbnail");
      } else {
        button.classList.remove("selected_thumbnail");
      }
    });
    productThumbnailImgs.forEach((img, imgIndex) => {
      if (imgIndex === index) {
        img.classList.add("selected_img");
      } else {
        img.classList.remove("selected_img");
      }
    });
  };

  const updateLightboxThumbnailActiveState = (index) => {
    lightboxThumbnailButtons.forEach((button, btnIndex) => {
      if (btnIndex === index) {
        button.classList.add("selected_thumbnail");
      } else {
        button.classList.remove("selected_thumbnail");
      }
    });
    lightboxThumbnailImgs.forEach((img, imgIndex) => {
      if (imgIndex === index) {
        img.classList.add("selected_img");
      } else {
        img.classList.remove("selected_img");
      }
    });
  };

  //
  // Calculation functions
  function getNextIndex(currentIndex, totalItems) {
    return (currentIndex + 1) % totalItems;
  }

  function getPrevIndex(currentIndex, totalItems) {
    return (currentIndex - 1 + totalItems) % totalItems;
  }

  function updateUI(index) {
    updateLightboxImage(index);
    updateThumbnailActiveState(index);
    updateLightboxThumbnailActiveState(index);
  }

  // Main setup function
  function setupNavigation(button, calculateNewIndex) {
    if (button) {
      button.addEventListener("click", () => {
        currentIndex = calculateNewIndex(currentIndex, product.images.length);
        updateUI(currentIndex);
      });
    }
  }

  // Usage
  setupNavigation(lightboxNextButton, getNextIndex);
  setupNavigation(lightboxPrevButton, getPrevIndex);
  setupNavigation(mobileNextButton, getNextIndex);
  setupNavigation(mobilePrevButton, getPrevIndex);

  // Initialize lightbox image
  updateLightboxImage(currentIndex);
  // ====== ---------------------------------------Lightbox functionality End--------------------------------------- ======

  // ====== ---------------------------------------Cart Logic Start--------------------------------------- ======

  // Quantity selector
  const decrementButton = document.querySelector(".quantity-decrement");
  const incrementButton = document.querySelector(".quantity-increment");
  const quantityDisplay = document.querySelector(".quantity-display");

  let quantity = 0;

  if (decrementButton && incrementButton && quantityDisplay) {
    decrementButton.addEventListener("click", () => {
      if (quantity > 0) {
        quantity--;
        quantityDisplay.textContent = quantity;
      }
    });

    incrementButton.addEventListener("click", () => {
      quantity++;
      quantityDisplay.textContent = quantity;
    });
  }

  // Add to cart functionality
  const cartEmptyMessage = document.querySelector(".cart-empty-message");
  const cartItemsContainer = document.querySelector(".cart-items");
  const addToCartButton = document.querySelector(".add-to-cart-button");
  const cartItemQuantity = document.querySelector(".cart-item__quantity");
  const cartItemTotal = document.querySelector(".cart-item__total");

  if (addToCartButton && cartItemQuantity) {
    addToCartButton.addEventListener("click", () => {
      if (quantity > 0) {
        const totalPrice = (product.price * quantity).toFixed(2);
        cartItemQuantity.textContent = quantity;
        cartItemTotal.textContent = `$${totalPrice}`;
        cartItemsContainer.classList.remove("hidden");
        cartEmptyMessage.classList.add("hidden");
        // show badge when adding to cart
        updateCartBadge(quantity);
      } else {
        cartItemsContainer.classList.add("hidden");
        cartEmptyMessage.classList.remove("hidden");
      }
    });
  }

  // Cart dropdown
  const cartIcon = document.querySelector(".cart-button");
  const cartDropdown = document.querySelector(".cart-dropdown");

  if (cartIcon && cartDropdown) {
    cartIcon.addEventListener("click", () => {
      const expanded = cartIcon.getAttribute("aria-expanded") === "true";
      const isOpening = !expanded;

      cartIcon.setAttribute("aria-expanded", String(isOpening));
      cartDropdown.classList.toggle("hidden", !isOpening);

      if (isOpening) {
        // Move focus to the cart heading (make it focusable)
        const title = cartDropdown.querySelector(".cart-dropdown__title");
        title.setAttribute("tabindex", "-1"); // makes it focusable but not tabbable
        title.focus();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        cartDropdown.classList.contains("hidden") === false
      ) {
        cartIcon.setAttribute("aria-expanded", "false");
        cartDropdown.classList.add("hidden");
        cartIcon.focus();
      }
    });
  }

  // Remove item from cart
  const cartItemRemove = document.querySelector(".cart-item__remove");

  if (cartItemRemove && cartItemsContainer && cartEmptyMessage) {
    cartItemRemove.addEventListener("click", () => {
      cartItemsContainer.classList.add("hidden");
      cartEmptyMessage.classList.remove("hidden");
      // remove badge when user removes item from cart
      updateCartBadge(0);
      // reset quantity state
      quantity = 0;
      if (quantityDisplay) quantityDisplay.textContent = "0";
    });
  }

  // -- Cart badge: keep header badge in sync with selected quantity
  const cartButton = document.querySelector(".cart-button");
  // ensure badge exists (create if missing)
  let cartQtyBadge = cartButton?.querySelector(".cart-qty");
  if (cartButton && !cartQtyBadge) {
    cartQtyBadge = document.createElement("span");
    cartQtyBadge.className = "cart-qty hidden";
    cartQtyBadge.setAttribute("aria-hidden", "true");
    cartQtyBadge.textContent = "0";
    cartButton.appendChild(cartQtyBadge);
  }
  // support multiple possible class names from different HTML states
  const qtyDisplay = document.querySelector(".quantity-display");
  const addToCartBtn = document.querySelector(".add-to-cart-button");
  const plusBtn = document.querySelector(".quantity-increment");
  const minusBtn = document.querySelector(".quantity-decrement");

  function updateCartBadge(count) {
    if (!cartQtyBadge) return;
    const n = Number(count) || 0;
    if (n > 0) {
      cartQtyBadge.textContent = String(n);
      cartQtyBadge.classList.remove("hidden");
    } else {
      cartQtyBadge.textContent = "0";
      cartQtyBadge.classList.add("hidden");
    }
  }

  // initialize badge hidden (show only after add-to-cart)
  updateCartBadge(0);

  // update when Add to cart clicked (uses the value shown in the quantity display)
  addToCartBtn?.addEventListener("click", () => {
    updateCartBadge(qtyDisplay ? parseInt(qtyDisplay.textContent, 10) : 0);
  });
});

// ====== ---------------------------------------Cart Logic End--------------------------------------- ======
