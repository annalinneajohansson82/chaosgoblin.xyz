const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const overlay = navLinks;
const scrollThreshold = 100;
let isOpen = false;

function onScroll() {
  if (window.scrollY > scrollThreshold) {
    navbar.classList.add("navbar--scrolled");
  } else {
    navbar.classList.remove("navbar--scrolled");
  }
}

function openNav() {
  isOpen = true;
  hamburger.setAttribute("aria-expanded", "true");
  hamburger.setAttribute("aria-label", "Close navigation menu");
  hamburger.classList.add("hamburger--open");
  overlay.classList.add("nav-links--open");
  document.body.style.overflow = "hidden";
}

function closeNav() {
  isOpen = false;
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-label", "Open navigation menu");
  hamburger.classList.remove("hamburger--open");
  overlay.classList.remove("nav-links--open");
  document.body.style.overflow = "";
}

function toggleNav() {
  if (isOpen) {
    closeNav();
  } else {
    openNav();
  }
}

hamburger.addEventListener("click", toggleNav);

overlay.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isOpen) {
    closeNav();
  }
});

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
