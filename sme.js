(function () {
  "use strict";

  var workspace;
  var emptyState;
  var topZ = 10;
  var storageKey = "bonneville-sme-workspace-v1";

  function closeMenus(exceptName) {
    document.querySelectorAll("[data-menu]").forEach(function (menu) {
      var name = menu.getAttribute("data-menu");
      if (name === exceptName) return;
      menu.hidden = true;
      var button = document.querySelector('[data-menu-button="' + name + '"]');
      if (button) button.setAttribute("aria-expanded", "false");
    });
  }

  function setupMenus() {
    document.querySelectorAll("[data-menu-button]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        var name = button.getAttribute("data-menu-button");
        var menu = document.querySelector('[data-menu="' + name + '"]');
        var willOpen = menu.hidden;
        closeMenus(willOpen ? name : null);
        menu.hidden = !willOpen;
        button.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".sme-menu-group")) closeMenus();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenus();
    });
  }

  function updateEmptyState() {
    emptyState.hidden = Boolean(workspace.querySelector(".sme-pane"));
  }

  function bringToFront(pane) {
    topZ += 1;
    pane.style.zIndex = String(topZ);
    workspace.querySelectorAll(".sme-pane").forEach(function (candidate) {
      candidate.classList.toggle("is-active", candidate === pane);
    });
  }

  function clampPane(pane) {
    if (window.matchMedia("(max-width: 820px)").matches || pane.classList.contains("is-maximized")) return;
    var maxLeft = Math.max(0, workspace.clientWidth - Math.min(pane.offsetWidth, workspace.clientWidth));
    var maxTop = Math.max(0, workspace.clientHeight - 42);
    var left = Math.max(0, Math.min(parseFloat(pane.style.left) || pane.offsetLeft, maxLeft));
    var top = Math.max(0, Math.min(parseFloat(pane.style.top) || pane.offsetTop, maxTop));
    pane.style.left = left + "px";
    pane.style.top = top + "px";
    pane.style.width = Math.min(pane.offsetWidth, workspace.clientWidth - left) + "px";
    pane.style.height = Math.min(pane.offsetHeight, workspace.clientHeight - top) + "px";
  }

  function saveLayout() {
    var panes = Array.prototype.slice.call(workspace.querySelectorAll(".sme-pane")).map(function (pane) {
      return {
        id: pane.dataset.paneId,
        left: pane.style.left || pane.offsetLeft + "px",
        top: pane.style.top || pane.offsetTop + "px",
        width: pane.style.width || pane.offsetWidth + "px",
        height: pane.style.height || pane.offsetHeight + "px",
        maximized: pane.classList.contains("is-maximized")
      };
    });
    try { localStorage.setItem(storageKey, JSON.stringify(panes)); } catch (error) {}
  }

  function toggleMaximize(pane) {
    if (pane.classList.contains("is-maximized")) {
      pane.classList.remove("is-maximized");
      var old = pane.dataset.restoreRect ? JSON.parse(pane.dataset.restoreRect) : null;
      if (old) {
        pane.style.left = old.left;
        pane.style.top = old.top;
        pane.style.width = old.width;
        pane.style.height = old.height;
      }
    } else {
      pane.dataset.restoreRect = JSON.stringify({
        left: pane.style.left || pane.offsetLeft + "px",
        top: pane.style.top || pane.offsetTop + "px",
        width: pane.style.width || pane.offsetWidth + "px",
        height: pane.style.height || pane.offsetHeight + "px"
      });
      pane.classList.add("is-maximized");
    }
    bringToFront(pane);
    saveLayout();
  }

  function setupPane(pane) {
    var header = pane.querySelector(".sme-pane__header");
    var iframe = pane.querySelector("iframe");

    pane.addEventListener("pointerdown", function () { bringToFront(pane); });
    pane.addEventListener("mouseup", saveLayout);
    pane.addEventListener("touchend", saveLayout, { passive: true });

    pane.querySelector('[data-pane-action="close"]').addEventListener("click", function () {
      pane.remove();
      updateEmptyState();
      saveLayout();
    });
    pane.querySelector('[data-pane-action="maximize"]').addEventListener("click", function () {
      toggleMaximize(pane);
    });

    header.addEventListener("dblclick", function (event) {
      if (!event.target.closest(".sme-pane__controls")) toggleMaximize(pane);
    });

    header.addEventListener("pointerdown", function (event) {
      if (event.target.closest(".sme-pane__controls") || pane.classList.contains("is-maximized") || window.matchMedia("(max-width: 820px)").matches) return;
      event.preventDefault();
      bringToFront(pane);
      var startX = event.clientX;
      var startY = event.clientY;
      var startLeft = pane.offsetLeft;
      var startTop = pane.offsetTop;
      iframe.style.pointerEvents = "none";
      header.setPointerCapture(event.pointerId);

      function move(moveEvent) {
        var maxLeft = Math.max(0, workspace.clientWidth - pane.offsetWidth);
        var maxTop = Math.max(0, workspace.clientHeight - 42);
        pane.style.left = Math.max(0, Math.min(startLeft + moveEvent.clientX - startX, maxLeft)) + "px";
        pane.style.top = Math.max(0, Math.min(startTop + moveEvent.clientY - startY, maxTop)) + "px";
      }
      function finish() {
        header.removeEventListener("pointermove", move);
        header.removeEventListener("pointerup", finish);
        header.removeEventListener("pointercancel", finish);
        iframe.style.pointerEvents = "";
        clampPane(pane);
        saveLayout();
      }
      header.addEventListener("pointermove", move);
      header.addEventListener("pointerup", finish);
      header.addEventListener("pointercancel", finish);
    });

    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        if (!pane.classList.contains("is-maximized")) saveLayout();
      }).observe(pane);
    }
    bringToFront(pane);
  }

  function createSmartTurtlePane(saved) {
    var existing = workspace.querySelector('[data-pane-id="smart-turtle"]');
    if (existing) {
      bringToFront(existing);
      return existing;
    }
    var template = document.getElementById("smart-turtle-pane-template");
    var pane = template.content.firstElementChild.cloneNode(true);
    workspace.appendChild(pane);

    var defaultWidth = Math.min(1040, Math.max(620, workspace.clientWidth - 56));
    var defaultHeight = Math.min(720, Math.max(480, workspace.clientHeight - 48));
    pane.style.left = saved && saved.left ? saved.left : Math.max(20, (workspace.clientWidth - defaultWidth) / 2) + "px";
    pane.style.top = saved && saved.top ? saved.top : "24px";
    pane.style.width = saved && saved.width ? saved.width : defaultWidth + "px";
    pane.style.height = saved && saved.height ? saved.height : defaultHeight + "px";
    if (saved && saved.maximized) pane.classList.add("is-maximized");

    setupPane(pane);
    window.setTimeout(function () { clampPane(pane); saveLayout(); }, 0);
    updateEmptyState();
    return pane;
  }

  function restoreLayout() {
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch (error) {}
    if (!Array.isArray(saved)) return;
    saved.forEach(function (pane) {
      if (pane.id === "smart-turtle") createSmartTurtlePane(pane);
    });
  }

  function init() {
    workspace = document.getElementById("sme-workspace");
    emptyState = document.getElementById("sme-empty-state");
    setupMenus();
    document.querySelectorAll('[data-open-pane="smart-turtle"]').forEach(function (button) {
      button.addEventListener("click", function () {
        createSmartTurtlePane();
        closeMenus();
      });
    });
    window.addEventListener("resize", function () {
      workspace.querySelectorAll(".sme-pane").forEach(clampPane);
    });
    restoreLayout();
    updateEmptyState();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
