/* device.js — The Bonneville Beaker
 *
 * Detects the visitor's platform ONCE, on load, and does two things:
 *   1. Adds classes to <html> so CSS can adapt (ios / android / desktop,
 *      is-mobile / is-desktop, is-touch / no-touch).
 *   2. Exposes window.BB.device and a couple of "open in the native app"
 *      helpers you can wire to buttons/links.
 *
 * Runs before paint (it's loaded in <head>) so there's no flash of the
 * wrong layout.
 */
(function () {
  "use strict";

  var ua = navigator.userAgent || "";
  var maxTouch = navigator.maxTouchPoints || 0;

  // iPadOS 13+ reports itself as "MacIntel" with a touch screen, so we
  // catch that case explicitly instead of trusting the UA string alone.
  var isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && maxTouch > 1);
  var isAndroid = /Android/.test(ua);
  var isTouch = maxTouch > 0 || "ontouchstart" in window;

  // "Mobile" = a real phone/tablet OS. We don't call a small desktop
  // window "mobile"; that's what CSS breakpoints are for.
  var isMobile = isIOS || isAndroid;
  var os = isIOS ? "ios" : isAndroid ? "android" : "desktop";

  var root = document.documentElement;
  root.classList.add(
    os,
    isMobile ? "is-mobile" : "is-desktop",
    isTouch ? "is-touch" : "no-touch"
  );

  var device = {
    os: os,
    isIOS: isIOS,
    isAndroid: isAndroid,
    isMobile: isMobile,
    isTouch: isTouch
  };

  /* ----- "Open in app" helpers -------------------------------------
   * Modern iOS/Android usually route youtube.com / instagram.com links
   * straight into the installed app on their own (universal links), so
   * a plain link is often enough. These helpers give you an explicit
   * "open the app, fall back to web" path for buttons where you want it.
   * Fill in your real handles below.
   */
  var HANDLES = {
    youtube: "@TheBonnevilleBeaker", // <-- your real YouTube handle
    instagram: "thebonnevillebeaker"  // <-- your real Instagram handle
  };

  function go(url) {
    window.open(url, "_blank", "noopener");
  }

  function openYouTube() {
    go("https://www.youtube.com/" + HANDLES.youtube);
  }

  function openInstagram() {
    if (isMobile) {
      // instagram:// opens the app directly when installed.
      var web = "https://www.instagram.com/" + HANDLES.instagram + "/";
      var appUrl = "instagram://user?username=" + HANDLES.instagram;
      var t = Date.now();
      window.location.href = appUrl;
      // If the app didn't take over within a moment, use the website.
      setTimeout(function () {
        if (Date.now() - t < 1500) go(web);
      }, 800);
    } else {
      go("https://www.instagram.com/" + HANDLES.instagram + "/");
    }
  }

  window.BB = window.BB || {};
  window.BB.device = device;
  window.BB.openYouTube = openYouTube;
  window.BB.openInstagram = openInstagram;
  window.BB.HANDLES = HANDLES;
})();
