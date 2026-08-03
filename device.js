/* device.js — The Bonneville Beaker
 *
 * Detects the visitor's platform ONCE, on load, and does two things:
 *   1. Adds classes to <html> so CSS can adapt (ios / android / desktop,
 *      is-mobile / is-desktop, is-touch / no-touch).
 *   2. Exposes window.BB.device and "open in the native app" helpers.
 *
 * Runs before paint (loaded in <head>) so there's no flash of the wrong layout.
 */
(function () {
  "use strict";

  var ua = navigator.userAgent || "";
  var maxTouch = navigator.maxTouchPoints || 0;

  // iPadOS 13+ reports itself as "MacIntel" with a touch screen.
  var isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && maxTouch > 1);
  var isAndroid = /Android/.test(ua);
  var isTouch = maxTouch > 0 || "ontouchstart" in window;
  var isMobile = isIOS || isAndroid;
  var os = isIOS ? "ios" : isAndroid ? "android" : "desktop";

  var root = document.documentElement;
  root.classList.add(
    os,
    isMobile ? "is-mobile" : "is-desktop",
    isTouch ? "is-touch" : "no-touch"
  );

  window.BB = window.BB || {};
  window.BB.device = {
    os: os, isIOS: isIOS, isAndroid: isAndroid, isMobile: isMobile, isTouch: isTouch
  };

  /* ----- Social links -----------------------------------------------
   * These open the normal https pages. On iPhone/Android, the OS routes
   * youtube.com / instagram.com links straight into the installed app on
   * its own (universal links), so no hacky app-scheme redirect is needed.
   */
  var HANDLES = {
    youtube: "@bonnevillebeaker",
    instagram: "bonnevillebeaker"
  };

  function openYouTube() {
    window.open("https://www.youtube.com/" + HANDLES.youtube, "_blank", "noopener");
  }
  function openInstagram() {
    window.open("https://www.instagram.com/" + HANDLES.instagram + "/", "_blank", "noopener");
  }

  window.BB.openYouTube = openYouTube;
  window.BB.openInstagram = openInstagram;
  window.BB.HANDLES = HANDLES;
})();
