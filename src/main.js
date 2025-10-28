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
  // Mobile menu toggle
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

  // === Define handlers once ===
  function openMenu() {
    if (!isMobileMode) return; // Safety guard
    menuOpen.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    mobileMenu.classList.add("open");
    menuClose.focus();
  }

  function closeMenu() {
    if (!isMobileMode) return;
    menuOpen.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.classList.remove("open");
    menuOpen.focus();
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

  // === Add listeners ONCE ===
  menuOpen.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  document.addEventListener("keydown", handleKeyDown);

  // === Respond to resize ===
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
    }
  }

  // Initialize and listen
  handleViewportChange(mediaQuery);
  mediaQuery.addEventListener("change", handleViewportChange);

  // Lightbox functionality
  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.querySelector(".lightbox__close");
  const productImage = document.querySelector(".product-image"); // Select the first product image.

  if (productImage && lightbox) {
    productImage.addEventListener("click", () => {
      if (window.innerWidth >= 1280) {
        // Don't show lightbox on mobile
        lightbox.classList.add("lightbox-active");
        lightbox.classList.remove("hidden");
        lightbox.setAttribute("aria-hidden", "false");
      }
    });
  }

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener("click", () => {
      lightbox.classList.remove("lightbox-active");
      lightbox.classList.add("hidden");
      lightbox.setAttribute("aria-hidden", "true");
    });
  }

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

  productThumbnailImgs.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const newSrc = thumbnail.getAttribute("src").replace("-thumbnail", "");
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

  lightboxThumbnailImgs.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const newSrc = thumbnail.getAttribute("src").replace("-thumbnail", "");
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
      } else {
        cartItemsContainer.classList.add("hidden");
        cartEmptyMessage.classList.remove("hidden");
      }
    });
  }

  // Cart toggle
  const cartIcon = document.querySelector(".cart-button");
  const cartDropdown = document.querySelector(".cart-dropdown");

  if (cartIcon && cartDropdown) {
    cartIcon.addEventListener("click", () => {
      const expanded = cartIcon.getAttribute("aria-expanded") === "true";
      cartIcon.setAttribute("aria-expanded", String(!expanded));
      cartDropdown.classList.toggle("hidden");
    });
  }

  // Remove item from cart
  const cartItemRemove = document.querySelector(".cart-item__remove");

  if (cartItemRemove && cartItemsContainer && cartEmptyMessage) {
    cartItemRemove.addEventListener("click", () => {
      cartItemsContainer.classList.add("hidden");
      cartEmptyMessage.classList.remove("hidden");
    });
  }
});
