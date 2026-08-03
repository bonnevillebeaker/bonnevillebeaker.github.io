/* script.js — The Bonneville Beaker
 * Loading screen + mobile menu + sticky header.
 */

/* -------- Loading screen behavior --------
 * "session" -> show once per browser session (default)
 * "always"  -> show on every page load
 * "home"    -> show only on the Home page
 */
var SPLASH_MODE = "session";

(function () {
  var pre = document.getElementById("preloader");
  if (!pre) return;

  var file = (location.pathname.split("/").pop() || "index.html");
  var isHome = file === "" || file === "index.html" || location.pathname.endsWith("/");
  var seen = false;
  try { seen = sessionStorage.getItem("bb_splash_shown") === "1"; } catch (e) {}

  var shouldShow =
    SPLASH_MODE === "always" ||
    (SPLASH_MODE === "session" && !seen) ||
    (SPLASH_MODE === "home" && isHome);

  if (!shouldShow) {
    pre.classList.add("preloader--hidden");
    return;
  }

  function done() {
    pre.classList.add("preloader--done");
    setTimeout(function () { pre.classList.add("preloader--hidden"); }, 550);
    try { sessionStorage.setItem("bb_splash_shown", "1"); } catch (e) {}
  }

  var MIN_MS = 900;
  var start = Date.now();
  window.addEventListener("load", function () {
    var wait = Math.max(0, MIN_MS - (Date.now() - start));
    setTimeout(done, wait);
  });
  setTimeout(done, 4000); // safety net
})();

document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".header");
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("primary-menu");
  var root = document.documentElement;

  /* ================= Mobile menu ================= */
  if (header && toggle && menu) {
    // Dimmed backdrop, inserted right after the header so CSS can target it.
    var backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    header.insertAdjacentElement("afterend", backdrop);

    function isOpen() { return header.classList.contains("nav-open"); }

    function openMenu() {
      header.classList.add("nav-open");
      root.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
      // Move focus into the menu for keyboard/screen-reader users.
      var first = menu.querySelector("a");
      if (first) first.focus({ preventScroll: true });
    }

    function closeMenu(returnFocus) {
      header.classList.remove("nav-open");
      root.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus) toggle.focus({ preventScroll: true });
    }

    toggle.addEventListener("click", function () {
      isOpen() ? closeMenu() : openMenu();
    });

    // Tap the dimmed area outside the menu to close.
    backdrop.addEventListener("click", function () { closeMenu(); });

    // Tapping any link closes the menu.
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMenu();
    });

    // Escape closes and returns focus to the button.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) closeMenu(true);
    });

    // If the window grows to desktop width, make sure we're not stuck open.
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 820 && isOpen()) closeMenu();
    });
  }

  /* ================= Sticky header ================= */
  var lastY = window.pageYOffset;
  var ticking = false;
  function onScroll() {
    var y = window.pageYOffset;
    if (!header.classList.contains("nav-open")) {
      if (y > lastY && y > 80) header.classList.add("header--hidden");
      else header.classList.remove("header--hidden");
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  });
});
