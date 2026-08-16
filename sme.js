(function () {
  "use strict";

  var workspace;
  var emptyState;
  var snapPreview;
  var topZ = 10;
  var storageKey = "bonneville-sme-workspace-v2";
  var mobileQuery = "(max-width: 820px)";
  var minPaneWidth = 360;
  var minPaneHeight = 300;
  var moduleDefinitions = {
    "understanding-mass-spectrometry": {
      templateId: "understanding-mass-spectrometry-pane-template",
      defaultWidth: 900,
      defaultHeight: 760
    },
    "smart-turtle": {
      templateId: "smart-turtle-pane-template",
      defaultWidth: 1040,
      defaultHeight: 720
    },
    "bonneville-brass": {
      templateId: "bonneville-brass-pane-template",
      defaultWidth: 1040,
      defaultHeight: 760
    },
    "bonneville-brass-editor": {
      templateId: "bonneville-brass-editor-pane-template",
      defaultWidth: 1180,
      defaultHeight: 760
    },
    "bonneville-brass-fourier": {
      templateId: "bonneville-brass-fourier-pane-template",
      defaultWidth: 1180,
      defaultHeight: 780
    },
    "pubchem-periodic-table": {
      templateId: "pubchem-periodic-table-pane-template",
      defaultWidth: 1120,
      defaultHeight: 800
    },
    "pubchem-structure-sketcher": {
      templateId: "pubchem-structure-sketcher-pane-template",
      defaultWidth: 1120,
      defaultHeight: 800
    },
    "circuitjs": {
      templateId: "circuitjs-pane-template",
      defaultWidth: 1120,
      defaultHeight: 800
    },
    "stellarium": {
      templateId: "stellarium-pane-template",
      defaultWidth: 1120,
      defaultHeight: 800
    },
    "custom-url": {
      templateId: "custom-url-pane-template",
      defaultWidth: 960,
      defaultHeight: 720,
      transient: true
    }
  };

  function isMobile() {
    return window.matchMedia(mobileQuery).matches;
  }

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
      if (event.key === "Escape") {
        closeMenus();
        hideSnapPreview();
      }
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

  function numberFromStyle(value, fallback) {
    var parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function getPaneRect(pane) {
    return {
      left: numberFromStyle(pane.style.left, pane.offsetLeft),
      top: numberFromStyle(pane.style.top, pane.offsetTop),
      width: numberFromStyle(pane.style.width, pane.offsetWidth),
      height: numberFromStyle(pane.style.height, pane.offsetHeight)
    };
  }

  function setPaneRect(pane, rect) {
    pane.style.left = Math.round(rect.left) + "px";
    pane.style.top = Math.round(rect.top) + "px";
    pane.style.width = Math.round(rect.width) + "px";
    pane.style.height = Math.round(rect.height) + "px";
  }

  function readStoredRect(value) {
    if (!value) return null;
    try {
      var parsed = JSON.parse(value);
      if ([parsed.left, parsed.top, parsed.width, parsed.height].every(Number.isFinite)) return parsed;
    } catch (error) {}
    return null;
  }

  function storeFloatingRect(pane, rect) {
    var value = rect || getPaneRect(pane);
    pane.dataset.floatingRect = JSON.stringify(value);
  }

  function getFloatingRect(pane) {
    return readStoredRect(pane.dataset.floatingRect);
  }

  function snapRect(target) {
    var width = workspace.clientWidth;
    var height = workspace.clientHeight;
    var leftWidth = Math.floor(width / 2);
    var rightWidth = width - leftWidth;
    var topHeight = Math.floor(height / 2);
    var bottomHeight = height - topHeight;

    switch (target) {
      case "left": return { left: 0, top: 0, width: leftWidth, height: height };
      case "right": return { left: leftWidth, top: 0, width: rightWidth, height: height };
      case "top": return { left: 0, top: 0, width: width, height: topHeight };
      case "bottom": return { left: 0, top: topHeight, width: width, height: bottomHeight };
      case "top-left": return { left: 0, top: 0, width: leftWidth, height: topHeight };
      case "top-right": return { left: leftWidth, top: 0, width: rightWidth, height: topHeight };
      case "bottom-left": return { left: 0, top: topHeight, width: leftWidth, height: bottomHeight };
      case "bottom-right": return { left: leftWidth, top: topHeight, width: rightWidth, height: bottomHeight };
      default: return null;
    }
  }

  function clearSnap(pane) {
    pane.classList.remove("is-snapped");
    delete pane.dataset.snapTarget;
  }

  function layoutSnappedPane(pane) {
    var target = pane.dataset.snapTarget;
    if (!target || pane.classList.contains("is-maximized") || isMobile()) return;
    var rect = snapRect(target);
    if (rect) setPaneRect(pane, rect);
  }

  function applySnap(pane, target, preserveFloating) {
    if (!target || isMobile()) return;
    if (preserveFloating !== false && !pane.dataset.snapTarget && !pane.classList.contains("is-maximized")) {
      storeFloatingRect(pane);
    }
    pane.classList.remove("is-maximized");
    pane.dataset.snapTarget = target;
    pane.classList.add("is-snapped");
    layoutSnappedPane(pane);
    bringToFront(pane);
  }

  function clampPane(pane) {
    if (isMobile() || pane.classList.contains("is-maximized")) return;
    if (pane.dataset.snapTarget) {
      layoutSnappedPane(pane);
      return;
    }

    var availableWidth = workspace.clientWidth;
    var availableHeight = workspace.clientHeight;
    var minimumWidth = Math.min(minPaneWidth, availableWidth);
    var minimumHeight = Math.min(minPaneHeight, availableHeight);
    var rect = getPaneRect(pane);

    rect.width = Math.min(Math.max(minimumWidth, rect.width), availableWidth);
    rect.height = Math.min(Math.max(minimumHeight, rect.height), availableHeight);
    rect.left = Math.max(0, Math.min(rect.left, availableWidth - rect.width));
    rect.top = Math.max(0, Math.min(rect.top, availableHeight - rect.height));
    setPaneRect(pane, rect);
  }

  function saveLayout() {
    var panes = Array.prototype.slice.call(workspace.querySelectorAll(".sme-pane")).filter(function (pane) {
      var definition = moduleDefinitions[pane.dataset.paneId];
      return !(definition && definition.transient);
    }).map(function (pane) {
      return {
        id: pane.dataset.paneId,
        left: pane.style.left || pane.offsetLeft + "px",
        top: pane.style.top || pane.offsetTop + "px",
        width: pane.style.width || pane.offsetWidth + "px",
        height: pane.style.height || pane.offsetHeight + "px",
        maximized: pane.classList.contains("is-maximized"),
        snapTarget: pane.dataset.snapTarget || null,
        floatingRect: getFloatingRect(pane)
      };
    });
    try { localStorage.setItem(storageKey, JSON.stringify(panes)); } catch (error) {}
  }

  function toggleMaximize(pane) {
    if (pane.classList.contains("is-maximized")) {
      pane.classList.remove("is-maximized");
      if (pane.dataset.snapTarget) {
        pane.classList.add("is-snapped");
        layoutSnappedPane(pane);
      } else {
        var floating = getFloatingRect(pane);
        if (floating) setPaneRect(pane, floating);
        clampPane(pane);
      }
    } else {
      if (!pane.dataset.snapTarget) storeFloatingRect(pane);
      pane.classList.remove("is-snapped");
      pane.classList.add("is-maximized");
    }
    bringToFront(pane);
    saveLayout();
  }

  function ensureSnapPreview() {
    if (snapPreview) return snapPreview;
    snapPreview = document.createElement("div");
    snapPreview.className = "sme-snap-preview";
    snapPreview.hidden = true;
    snapPreview.setAttribute("aria-hidden", "true");
    workspace.appendChild(snapPreview);
    return snapPreview;
  }

  function showSnapPreview(target) {
    var preview = ensureSnapPreview();
    var rect = snapRect(target);
    if (!rect) {
      hideSnapPreview();
      return;
    }
    preview.dataset.snapTarget = target;
    preview.style.left = rect.left + "px";
    preview.style.top = rect.top + "px";
    preview.style.width = rect.width + "px";
    preview.style.height = rect.height + "px";
    preview.hidden = false;
  }

  function hideSnapPreview() {
    if (!snapPreview) return;
    snapPreview.hidden = true;
    delete snapPreview.dataset.snapTarget;
  }

  function detectSnapTarget(clientX, clientY) {
    var rect = workspace.getBoundingClientRect();
    var x = clientX - rect.left;
    var y = clientY - rect.top;
    var width = rect.width;
    var height = rect.height;
    var edgeThreshold = 34;
    var cornerReach = Math.min(120, Math.max(72, Math.min(width, height) * 0.16));

    var nearLeft = x <= edgeThreshold;
    var nearRight = x >= width - edgeThreshold;
    var nearTop = y <= edgeThreshold;
    var nearBottom = y >= height - edgeThreshold;

    if ((nearLeft || x <= cornerReach) && (nearTop || y <= cornerReach) && x <= cornerReach && y <= cornerReach) return "top-left";
    if ((nearRight || x >= width - cornerReach) && (nearTop || y <= cornerReach) && x >= width - cornerReach && y <= cornerReach) return "top-right";
    if ((nearLeft || x <= cornerReach) && (nearBottom || y >= height - cornerReach) && x <= cornerReach && y >= height - cornerReach) return "bottom-left";
    if ((nearRight || x >= width - cornerReach) && (nearBottom || y >= height - cornerReach) && x >= width - cornerReach && y >= height - cornerReach) return "bottom-right";
    if (nearLeft) return "left";
    if (nearRight) return "right";
    if (nearTop) return "top";
    if (nearBottom) return "bottom";
    return null;
  }

  function setIframeInteraction(pane, enabled) {
    var iframe = pane.querySelector("iframe");
    if (iframe) iframe.style.pointerEvents = enabled ? "" : "none";
  }

  function beginPaneDrag(event, pane, header) {
    if (event.target.closest(".sme-pane__controls") || pane.classList.contains("is-maximized") || isMobile()) return;
    event.preventDefault();
    bringToFront(pane);

    var workspaceBounds = workspace.getBoundingClientRect();
    var pointerX = event.clientX - workspaceBounds.left;
    var pointerY = event.clientY - workspaceBounds.top;

    if (pane.dataset.snapTarget) {
      var snappedRect = getPaneRect(pane);
      var xRatio = snappedRect.width ? (pointerX - snappedRect.left) / snappedRect.width : 0.5;
      var floating = getFloatingRect(pane) || {
        left: pointerX - 480,
        top: pointerY - 19,
        width: Math.min(960, workspace.clientWidth - 40),
        height: Math.min(700, workspace.clientHeight - 40)
      };
      clearSnap(pane);
      floating.left = pointerX - Math.max(0.08, Math.min(0.92, xRatio)) * floating.width;
      floating.top = pointerY - 19;
      setPaneRect(pane, floating);
      clampPane(pane);
    }

    var startRect = getPaneRect(pane);
    var startX = event.clientX;
    var startY = event.clientY;
    var pendingSnap = null;
    pane.dataset.manipulating = "drag";
    setIframeInteraction(pane, false);
    header.setPointerCapture(event.pointerId);

    function move(moveEvent) {
      var maxLeft = Math.max(0, workspace.clientWidth - startRect.width);
      var maxTop = Math.max(0, workspace.clientHeight - startRect.height);
      pane.style.left = Math.max(0, Math.min(startRect.left + moveEvent.clientX - startX, maxLeft)) + "px";
      pane.style.top = Math.max(0, Math.min(startRect.top + moveEvent.clientY - startY, maxTop)) + "px";

      pendingSnap = detectSnapTarget(moveEvent.clientX, moveEvent.clientY);
      if (pendingSnap) showSnapPreview(pendingSnap);
      else hideSnapPreview();
    }

    function finish() {
      header.removeEventListener("pointermove", move);
      header.removeEventListener("pointerup", finish);
      header.removeEventListener("pointercancel", cancel);
      setIframeInteraction(pane, true);
      delete pane.dataset.manipulating;
      hideSnapPreview();

      if (pendingSnap) applySnap(pane, pendingSnap, true);
      else {
        clampPane(pane);
        storeFloatingRect(pane);
      }
      saveLayout();
    }

    function cancel() {
      pendingSnap = null;
      finish();
    }

    header.addEventListener("pointermove", move);
    header.addEventListener("pointerup", finish);
    header.addEventListener("pointercancel", cancel);
  }

  function addResizeHandles(pane) {
    ["n", "ne", "e", "se", "s", "sw", "w", "nw"].forEach(function (direction) {
      var handle = document.createElement("div");
      handle.className = "sme-resize-handle sme-resize-handle--" + direction;
      handle.dataset.resizeDirection = direction;
      handle.setAttribute("aria-hidden", "true");
      pane.appendChild(handle);

      handle.addEventListener("pointerdown", function (event) {
        if (pane.classList.contains("is-maximized") || isMobile()) return;
        event.preventDefault();
        event.stopPropagation();
        bringToFront(pane);
        hideSnapPreview();

        var startRect = getPaneRect(pane);
        if (pane.dataset.snapTarget) {
          clearSnap(pane);
          storeFloatingRect(pane, startRect);
        }

        var startX = event.clientX;
        var startY = event.clientY;
        var directionValue = handle.dataset.resizeDirection;
        var startRight = startRect.left + startRect.width;
        var startBottom = startRect.top + startRect.height;
        var minimumWidth = Math.min(minPaneWidth, workspace.clientWidth);
        var minimumHeight = Math.min(minPaneHeight, workspace.clientHeight);

        pane.dataset.manipulating = "resize";
        setIframeInteraction(pane, false);
        handle.setPointerCapture(event.pointerId);

        function move(moveEvent) {
          var dx = moveEvent.clientX - startX;
          var dy = moveEvent.clientY - startY;
          var next = {
            left: startRect.left,
            top: startRect.top,
            width: startRect.width,
            height: startRect.height
          };

          if (directionValue.indexOf("e") !== -1) {
            next.width = Math.max(minimumWidth, Math.min(startRect.width + dx, workspace.clientWidth - startRect.left));
          }
          if (directionValue.indexOf("s") !== -1) {
            next.height = Math.max(minimumHeight, Math.min(startRect.height + dy, workspace.clientHeight - startRect.top));
          }
          if (directionValue.indexOf("w") !== -1) {
            next.left = Math.max(0, Math.min(startRect.left + dx, startRight - minimumWidth));
            next.width = startRight - next.left;
          }
          if (directionValue.indexOf("n") !== -1) {
            next.top = Math.max(0, Math.min(startRect.top + dy, startBottom - minimumHeight));
            next.height = startBottom - next.top;
          }

          setPaneRect(pane, next);
        }

        function finish() {
          handle.removeEventListener("pointermove", move);
          handle.removeEventListener("pointerup", finish);
          handle.removeEventListener("pointercancel", finish);
          setIframeInteraction(pane, true);
          delete pane.dataset.manipulating;
          clampPane(pane);
          storeFloatingRect(pane);
          saveLayout();
        }

        handle.addEventListener("pointermove", move);
        handle.addEventListener("pointerup", finish);
        handle.addEventListener("pointercancel", finish);
      });
    });
  }

  function setupPane(pane) {
    var header = pane.querySelector(".sme-pane__header");

    pane.addEventListener("pointerdown", function () { bringToFront(pane); });
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
      beginPaneDrag(event, pane, header);
    });

    addResizeHandles(pane);

    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        if (!pane.classList.contains("is-maximized") && !pane.dataset.manipulating) saveLayout();
      }).observe(pane);
    }
    bringToFront(pane);
  }

  function createModulePane(moduleId, saved) {
    var definition = moduleDefinitions[moduleId];
    if (!definition) return null;
    var existing = workspace.querySelector('[data-pane-id="' + moduleId + '"]');
    if (existing) {
      bringToFront(existing);
      return existing;
    }

    var template = document.getElementById(definition.templateId);
    if (!template) return null;
    var pane = template.content.firstElementChild.cloneNode(true);
    workspace.appendChild(pane);

    var horizontalInset = 56;
    var verticalInset = 48;
    var defaultWidth = Math.min(definition.defaultWidth, Math.max(620, workspace.clientWidth - horizontalInset));
    var defaultHeight = Math.min(definition.defaultHeight, Math.max(480, workspace.clientHeight - verticalInset));
    var alreadyOpen = workspace.querySelectorAll(".sme-pane").length - 1;
    var offset = Math.min(alreadyOpen * 28, 112);

    pane.style.left = saved && saved.left ? saved.left : Math.max(20, (workspace.clientWidth - defaultWidth) / 2 + offset) + "px";
    pane.style.top = saved && saved.top ? saved.top : 24 + offset + "px";
    pane.style.width = saved && saved.width ? saved.width : defaultWidth + "px";
    pane.style.height = saved && saved.height ? saved.height : defaultHeight + "px";

    if (saved && saved.floatingRect) pane.dataset.floatingRect = JSON.stringify(saved.floatingRect);
    else storeFloatingRect(pane, getPaneRect(pane));
    if (saved && saved.snapTarget) pane.dataset.snapTarget = saved.snapTarget;
    if (saved && saved.maximized) pane.classList.add("is-maximized");
    else if (saved && saved.snapTarget) pane.classList.add("is-snapped");

    setupPane(pane);
    window.setTimeout(function () {
      if (pane.dataset.snapTarget && !pane.classList.contains("is-maximized")) layoutSnappedPane(pane);
      else clampPane(pane);
      saveLayout();
    }, 0);
    updateEmptyState();
    return pane;
  }

  function restoreLayout() {
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch (error) {}
    if (!Array.isArray(saved)) return;
    var enabledPanes = saved.filter(function (pane) {
      return pane && moduleDefinitions[pane.id];
    });
    enabledPanes.forEach(function (pane) {
      createModulePane(pane.id, pane);
    });
    if (enabledPanes.length !== saved.length) {
      try { localStorage.setItem(storageKey, JSON.stringify(enabledPanes)); } catch (error) {}
    }
  }

  function init() {
    workspace = document.getElementById("sme-workspace");
    emptyState = document.getElementById("sme-empty-state");
    ensureSnapPreview();
    setupMenus();

    document.querySelectorAll("[data-open-pane]").forEach(function (button) {
      button.addEventListener("click", function () {
        createModulePane(button.getAttribute("data-open-pane"));
        closeMenus();
      });
    });

    var customEmbedButton = document.getElementById("sme-open-custom-embed");
    var customEmbedInput = document.getElementById("sme-custom-url");
    if (customEmbedButton && customEmbedInput) {
      customEmbedButton.addEventListener("click", function () {
        var source = customEmbedInput.value.trim();
        if (!source) {
          customEmbedInput.focus();
          customEmbedInput.setCustomValidity("Enter a web address first.");
          customEmbedInput.reportValidity();
          return;
        }
        var parsed;
        try {
          parsed = new URL(source);
        } catch (error) {
          customEmbedInput.setCustomValidity("Enter a valid address, including https://");
          customEmbedInput.reportValidity();
          return;
        }
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          customEmbedInput.setCustomValidity("Only http and https addresses can be embedded.");
          customEmbedInput.reportValidity();
          return;
        }
        customEmbedInput.setCustomValidity("");
        var existing = workspace.querySelector('[data-pane-id="custom-url"]');
        if (existing) existing.remove();
        var pane = createModulePane("custom-url");
        var iframe = pane && pane.querySelector("iframe");
        if (iframe) iframe.src = parsed.href;
        closeMenus();
      });
      customEmbedInput.addEventListener("input", function () {
        customEmbedInput.setCustomValidity("");
      });
    }

    window.addEventListener("message", function (event) {
      var data = event.data || {};
      if (data.type === "sme-open-pane" && moduleDefinitions[data.moduleId]) {
        createModulePane(data.moduleId);
      }
    });

    window.addEventListener("resize", function () {
      workspace.querySelectorAll(".sme-pane").forEach(function (pane) {
        if (pane.dataset.snapTarget) layoutSnappedPane(pane);
        else clampPane(pane);
      });
      hideSnapPreview();
      saveLayout();
    });
    restoreLayout();

    // Plain HTML topic pages can request a companion tool without loading
    // JavaScript themselves. Example: Science_Made_Easy.html?open=smart-turtle
    var requestedModule = new URLSearchParams(window.location.search).get("open");
    if (requestedModule && moduleDefinitions[requestedModule]) {
      createModulePane(requestedModule);
      try {
        var cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (error) {}
    }

    updateEmptyState();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
