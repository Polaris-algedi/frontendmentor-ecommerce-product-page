import "./style.css";

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
