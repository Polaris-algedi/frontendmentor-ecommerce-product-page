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

// Mobile menu toggle
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuClose = document.querySelector(".mobile-menu__close");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.setAttribute("aria-hidden", String(expanded));
    mobileMenu.classList.toggle("open");
  });
}

if (menuClose && mobileMenu) {
  menuClose.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.classList.remove("open");
  });
}

// Lightbox functionality
const lightbox = document.getElementById("lightbox");
const lightboxClose = document.querySelector(".lightbox__close");
const productImage = document.querySelector(".product-image");
const lightboxOverlay = document.querySelector(".lightbox__overlay");

if (productImage && lightbox) {
  productImage.addEventListener("click", () => {
    lightbox.classList.add("lightbox-active");
    lightbox.classList.remove("hidden");
    lightbox.setAttribute("aria-hidden", "false");
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
const productThumbnailImgs = productImages.querySelectorAll(".thumbnail-image");
const lightboxThumbnailButtons = lightbox.querySelectorAll(".thumbnail-button");
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
const lightboxMainImage = document.querySelector(".lightbox-main-image");
const nextButton = document.querySelector(".lightbox__next");
const prevButton = document.querySelector(".lightbox__prev");

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

if (nextButton) {
  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % product.images.length;
    updateLightboxImage(currentIndex);
    updateThumbnailActiveState(currentIndex);
    updateLightboxThumbnailActiveState(currentIndex);
  });
}

if (prevButton) {
  prevButton.addEventListener("click", () => {
    currentIndex =
      (currentIndex - 1 + product.images.length) % product.images.length;
    updateLightboxImage(currentIndex);
    updateThumbnailActiveState(currentIndex);
    updateLightboxThumbnailActiveState(currentIndex);
  });
}

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
const addToCartButton = document.querySelector(".add-to-cart-button");
const cartCount = document.querySelector(".cart-count");

if (addToCartButton && cartCount) {
  addToCartButton.addEventListener("click", () => {
    if (quantity > 0) {
      cartCount.textContent = quantity;
      cartCount.classList.remove("hidden");
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
