(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var PROTON = 1.007276466621;
  var SODIUM_CATION = 22.989218;
  var C13_SPACING = 1.003354835;

  function $(id) { return document.getElementById(id); }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function formatNumber(value, digits) {
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  }

  function svgEl(name, attributes, text) {
    var el = document.createElementNS(NS, name);
    Object.keys(attributes || {}).forEach(function (key) { el.setAttribute(key, attributes[key]); });
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function clearSvg(svg) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  function addAxes(svg, options) {
    var left = options.left || 58;
    var right = options.right || 20;
    var top = options.top || 20;
    var bottom = options.bottom || 48;
    var width = options.width;
    var height = options.height;
    svg.appendChild(svgEl("rect", {
      x: left, y: top, width: width - left - right, height: height - top - bottom,
      rx: 6, fill: "#ffffff", stroke: "#d3e0e2"
    }));
    svg.appendChild(svgEl("line", { x1: left, y1: height - bottom, x2: width - right, y2: height - bottom, stroke: "#40585c", "stroke-width": 2 }));
    svg.appendChild(svgEl("line", { x1: left, y1: top, x2: left, y2: height - bottom, stroke: "#40585c", "stroke-width": 2 }));
    if (options.xLabel) svg.appendChild(svgEl("text", { x: (left + width - right) / 2, y: height - 12, "text-anchor": "middle", fill: "#52666a", "font-family": "Arial, sans-serif", "font-size": 15 }, options.xLabel));
    if (options.yLabel) {
      var label = svgEl("text", { x: 18, y: (top + height - bottom) / 2, "text-anchor": "middle", fill: "#52666a", "font-family": "Arial, sans-serif", "font-size": 15, transform: "rotate(-90 18 " + ((top + height - bottom) / 2) + ")" }, options.yLabel);
      svg.appendChild(label);
    }
    return { left: left, right: right, top: top, bottom: bottom, plotWidth: width - left - right, plotHeight: height - top - bottom };
  }

  function gaussian(x, mean, sigma) {
    var z = (x - mean) / sigma;
    return Math.exp(-0.5 * z * z);
  }

  function setupResolutionLab() {
    var rInput = $("resolution-r");
    var deltaInput = $("resolution-delta");
    if (!rInput || !deltaInput) return;

    function render() {
      var resolvingPower = Number(rInput.value);
      var separation = Number(deltaInput.value);
      var centerMz = 500;
      var fwhm = centerMz / resolvingPower;
      var sigma = fwhm / 2.354820045;
      var ratio = separation / fwhm;

      $("resolution-r-output").textContent = resolvingPower.toLocaleString();
      $("resolution-delta-output").textContent = separation.toFixed(3);
      $("resolution-width").textContent = fwhm.toFixed(4) + " Da";
      $("resolution-ratio").textContent = ratio.toFixed(2) + "×";

      var assessment;
      if (ratio < 0.6) assessment = "The signals strongly overlap and would probably be reported as one broad feature.";
      else if (ratio < 1) assessment = "The signals begin to form a shoulder, but separation is limited.";
      else if (ratio < 1.5) assessment = "The two peaks are distinguishable near the FWHM criterion.";
      else assessment = "The peaks are clearly separated under this simplified model.";
      $("resolution-assessment").textContent = assessment;

      var svg = $("resolution-plot");
      clearSvg(svg);
      var W = 700, H = 330;
      var box = addAxes(svg, { width: W, height: H, left: 60, right: 22, top: 22, bottom: 52, xLabel: "m/z near 500", yLabel: "intensity" });
      var halfRange = Math.max(0.11, separation * 1.35 + fwhm * 3.2);
      var xMin = centerMz - halfRange;
      var xMax = centerMz + separation + halfRange;
      var n = 420;
      var path1 = [];
      var path2 = [];
      var pathSum = [];

      function sx(x) { return box.left + (x - xMin) / (xMax - xMin) * box.plotWidth; }
      function sy(y) { return box.top + box.plotHeight - y * box.plotHeight * 0.88; }

      for (var i = 0; i <= n; i += 1) {
        var x = xMin + (xMax - xMin) * i / n;
        var y1 = gaussian(x, centerMz, sigma);
        var y2 = gaussian(x, centerMz + separation, sigma) * 0.92;
        var sum = clamp(y1 + y2, 0, 1.08);
        path1.push((i ? "L" : "M") + sx(x).toFixed(2) + " " + sy(y1).toFixed(2));
        path2.push((i ? "L" : "M") + sx(x).toFixed(2) + " " + sy(y2).toFixed(2));
        pathSum.push((i ? "L" : "M") + sx(x).toFixed(2) + " " + sy(sum).toFixed(2));
      }
      svg.appendChild(svgEl("path", { d: path1.join(" "), fill: "none", stroke: "#2DABBA", "stroke-width": 3, opacity: 0.65 }));
      svg.appendChild(svgEl("path", { d: path2.join(" "), fill: "none", stroke: "#e28a3b", "stroke-width": 3, opacity: 0.65 }));
      svg.appendChild(svgEl("path", { d: pathSum.join(" "), fill: "none", stroke: "#284f55", "stroke-width": 4 }));

      [centerMz, centerMz + separation].forEach(function (value, index) {
        var x = sx(value);
        svg.appendChild(svgEl("line", { x1: x, y1: H - box.bottom, x2: x, y2: H - box.bottom + 6, stroke: "#40585c", "stroke-width": 2 }));
        svg.appendChild(svgEl("text", { x: x, y: H - box.bottom + 24, "text-anchor": "middle", fill: "#53676b", "font-family": "Arial, sans-serif", "font-size": 13 }, value.toFixed(3)));
        svg.appendChild(svgEl("text", { x: x, y: box.top + 18 + index * 20, "text-anchor": "middle", fill: index ? "#aa5c1f" : "#177985", "font-family": "Arial, sans-serif", "font-size": 13, "font-weight": 700 }, index ? "ion B" : "ion A"));
      });

      var halfHeightY = sy(0.5);
      svg.appendChild(svgEl("line", { x1: box.left, y1: halfHeightY, x2: W - box.right, y2: halfHeightY, stroke: "#9cafb2", "stroke-dasharray": "5 5" }));
      svg.appendChild(svgEl("text", { x: W - box.right - 4, y: halfHeightY - 6, "text-anchor": "end", fill: "#7b8d90", "font-family": "Arial, sans-serif", "font-size": 12 }, "half maximum"));
    }

    rInput.addEventListener("input", render);
    deltaInput.addEventListener("input", render);
    render();
  }

  function setupCentroidDemo() {
    var svg = $("centroid-plot");
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-centroid-mode]"));
    if (!svg || !buttons.length) return;
    var mode = "profile";

    function render() {
      clearSvg(svg);
      var W = 760, H = 310;
      var box = addAxes(svg, { width: W, height: H, left: 58, right: 20, top: 18, bottom: 48, xLabel: "m/z", yLabel: "intensity" });
      var peaks = [
        { mz: 100.000, intensity: 0.72, sigma: 0.075 },
        { mz: 101.003, intensity: 1.00, sigma: 0.085 },
        { mz: 102.006, intensity: 0.36, sigma: 0.078 }
      ];
      var min = 99.45, max = 102.55;
      function sx(x) { return box.left + (x - min) / (max - min) * box.plotWidth; }
      function sy(y) { return box.top + box.plotHeight - y * box.plotHeight * 0.86; }

      if (mode === "profile" || mode === "both") {
        var path = [];
        for (var i = 0; i <= 500; i += 1) {
          var x = min + (max - min) * i / 500;
          var y = 0;
          peaks.forEach(function (peak) { y += peak.intensity * gaussian(x, peak.mz, peak.sigma); });
          y += 0.006 * Math.sin(i * 0.71) + 0.004 * Math.sin(i * 0.19);
          path.push((i ? "L" : "M") + sx(x).toFixed(2) + " " + sy(Math.max(0, y)).toFixed(2));
        }
        svg.appendChild(svgEl("path", { d: path.join(" "), fill: "none", stroke: "#2DABBA", "stroke-width": 4 }));
      }

      if (mode === "centroid" || mode === "both") {
        peaks.forEach(function (peak) {
          var x = sx(peak.mz);
          svg.appendChild(svgEl("line", { x1: x, y1: sy(0), x2: x, y2: sy(peak.intensity), stroke: "#e0762e", "stroke-width": mode === "both" ? 3 : 5, "stroke-dasharray": mode === "both" ? "6 4" : "none" }));
          svg.appendChild(svgEl("circle", { cx: x, cy: sy(peak.intensity), r: 4, fill: "#e0762e" }));
          svg.appendChild(svgEl("text", { x: x, y: sy(peak.intensity) - 10, "text-anchor": "middle", fill: "#9a4f1d", "font-family": "Arial, sans-serif", "font-size": 12, "font-weight": 700 }, peak.mz.toFixed(3)));
        });
      }

      [100, 101, 102].forEach(function (tick) {
        var x = sx(tick);
        svg.appendChild(svgEl("line", { x1: x, y1: H - box.bottom, x2: x, y2: H - box.bottom + 6, stroke: "#40585c", "stroke-width": 2 }));
        svg.appendChild(svgEl("text", { x: x, y: H - box.bottom + 22, "text-anchor": "middle", fill: "#52666a", "font-family": "Arial, sans-serif", "font-size": 13 }, String(tick)));
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        mode = button.getAttribute("data-centroid-mode");
        buttons.forEach(function (candidate) { candidate.classList.toggle("is-active", candidate === button); });
        render();
      });
    });
    render();
  }

  function setupAdductCalculator() {
    var massInput = $("neutral-mass");
    var select = $("adduct-select");
    if (!massInput || !select) return;
    var forms = {
      "protonated": { delta: PROTON, charge: 1, text: "One proton is added and the ion carries one positive charge." },
      "sodiated": { delta: SODIUM_CATION, charge: 1, text: "A sodium cation is added and the ion carries one positive charge." },
      "deprotonated": { delta: -PROTON, charge: 1, text: "One proton is removed and the ion carries one negative charge." },
      "double-protonated": { delta: 2 * PROTON, charge: 2, text: "Two protons are added and the total mass is divided by two positive charges." }
    };
    function render() {
      var neutral = Math.max(0, Number(massInput.value) || 0);
      var form = forms[select.value];
      var mz = (neutral + form.delta) / form.charge;
      $("adduct-result").textContent = mz.toFixed(4);
      $("adduct-explanation").textContent = form.text;
    }
    massInput.addEventListener("input", render);
    select.addEventListener("change", render);
    render();
  }

  function setupChargeLab() {
    var slider = $("charge-slider");
    var svg = $("charge-plot");
    if (!slider || !svg) return;
    function render() {
      var z = Number(slider.value);
      var neutralMass = 1000;
      var mz = (neutralMass + z * PROTON) / z;
      var spacing = C13_SPACING / z;
      $("charge-output").textContent = z + "+";
      $("charge-mz").textContent = mz.toFixed(4);
      $("isotope-spacing").textContent = spacing.toFixed(4) + " m/z";

      clearSvg(svg);
      var W = 700, H = 280;
      var box = addAxes(svg, { width: W, height: H, left: 58, right: 20, top: 20, bottom: 48, xLabel: "m/z", yLabel: "intensity" });
      var intensities = [1, 0.62, 0.24, 0.07, 0.018];
      var start = mz;
      var end = mz + spacing * 4;
      var pad = Math.max(spacing * 0.65, 0.12);
      function sx(value) { return box.left + (value - (start - pad)) / ((end + pad) - (start - pad)) * box.plotWidth; }
      function sy(value) { return box.top + box.plotHeight - value * box.plotHeight * 0.84; }
      intensities.forEach(function (intensity, index) {
        var value = mz + spacing * index;
        var x = sx(value);
        svg.appendChild(svgEl("line", { x1: x, y1: sy(0), x2: x, y2: sy(intensity), stroke: index === 0 ? "#2DABBA" : "#317d87", "stroke-width": 7, "stroke-linecap": "round" }));
        svg.appendChild(svgEl("text", { x: x, y: H - box.bottom + 20, "text-anchor": "middle", fill: "#53676b", "font-family": "Arial, sans-serif", "font-size": 11 }, index === 0 ? mz.toFixed(2) : "+" + index));
      });
      svg.appendChild(svgEl("line", { x1: sx(mz), y1: box.top + 34, x2: sx(mz + spacing), y2: box.top + 34, stroke: "#e07d31", "stroke-width": 2 }));
      svg.appendChild(svgEl("path", { d: "M" + sx(mz) + " " + (box.top + 34) + " l8 -5 v10 z M" + sx(mz + spacing) + " " + (box.top + 34) + " l-8 -5 v10 z", fill: "#e07d31" }));
      svg.appendChild(svgEl("text", { x: (sx(mz) + sx(mz + spacing)) / 2, y: box.top + 25, "text-anchor": "middle", fill: "#a65721", "font-family": "Arial, sans-serif", "font-size": 13, "font-weight": 700 }, spacing.toFixed(4) + " m/z"));
      svg.appendChild(svgEl("text", { x: W - box.right - 6, y: box.top + 18, "text-anchor": "end", fill: "#2b5d64", "font-family": "Arial, sans-serif", "font-size": 14, "font-weight": 700 }, "charge state " + z + "+"));
    }
    slider.addEventListener("input", render);
    render();
  }

  function binomialDistribution(n, p) {
    var result = new Array(n + 1);
    result[0] = Math.pow(1 - p, n);
    for (var k = 1; k <= n; k += 1) {
      result[k] = result[k - 1] * (n - k + 1) / k * p / (1 - p);
    }
    return result;
  }

  function setupLabelingLab() {
    var enrichmentInput = $("label-enrichment");
    var sitesInput = $("label-sites");
    var svg = $("label-plot");
    if (!enrichmentInput || !sitesInput || !svg) return;

    function render() {
      var percent = Number(enrichmentInput.value);
      var p = percent / 100;
      var n = Number(sitesInput.value);
      var probs = binomialDistribution(n, p);
      var maxProb = Math.max.apply(null, probs);
      var expected = n * p;
      $("label-enrichment-output").textContent = percent.toFixed(percent % 1 ? 2 : 1) + "%";
      $("label-sites-output").textContent = String(n);
      $("expected-labels").textContent = expected.toFixed(2);
      $("m0-fraction").textContent = (probs[0] * 100).toFixed(2) + "%";

      clearSvg(svg);
      var W = 720, H = 350;
      var box = addAxes(svg, { width: W, height: H, left: 62, right: 20, top: 22, bottom: 58, xLabel: "number of heavy isotopes in the molecule", yLabel: "relative intensity" });
      var gap = 3;
      var barWidth = Math.max(3, (box.plotWidth - gap * (n + 1)) / (n + 1));
      probs.forEach(function (prob, k) {
        var relative = maxProb ? prob / maxProb : 0;
        var x = box.left + gap / 2 + k * (barWidth + gap);
        var y = box.top + box.plotHeight - relative * box.plotHeight * 0.88;
        var height = box.top + box.plotHeight - y;
        var rect = svgEl("rect", { x: x, y: y, width: barWidth, height: height, rx: Math.min(3, barWidth / 2), fill: k === 0 ? "#2DABBA" : "#e58637" });
        rect.appendChild(svgEl("title", {}, "M+" + k + ": " + (prob * 100).toFixed(3) + "% of molecules"));
        svg.appendChild(rect);
      });

      var tickEvery = Math.max(1, Math.ceil(n / 8));
      for (var k = 0; k <= n; k += tickEvery) {
        var tx = box.left + gap / 2 + k * (barWidth + gap) + barWidth / 2;
        svg.appendChild(svgEl("line", { x1: tx, y1: H - box.bottom, x2: tx, y2: H - box.bottom + 5, stroke: "#40585c", "stroke-width": 1.5 }));
        svg.appendChild(svgEl("text", { x: tx, y: H - box.bottom + 20, "text-anchor": "middle", fill: "#53676b", "font-family": "Arial, sans-serif", "font-size": 11 }, String(k)));
      }
      svg.appendChild(svgEl("text", { x: box.left + 8, y: box.top + 17, fill: "#177985", "font-family": "Arial, sans-serif", "font-size": 13, "font-weight": 700 }, "M0"));
      svg.appendChild(svgEl("text", { x: W - box.right - 7, y: box.top + 17, "text-anchor": "end", fill: "#a75c22", "font-family": "Arial, sans-serif", "font-size": 13, "font-weight": 700 }, "heavier isotopologues →"));
    }

    enrichmentInput.addEventListener("input", render);
    sitesInput.addEventListener("input", render);
    render();
  }

  function setupSmartTurtleButtons() {
    document.querySelectorAll("[data-open-smart-turtle]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: "sme-open-pane", moduleId: "smart-turtle" }, "*");
        } else {
          window.open("Smart_Turtle.html?formula=C6H12O6&deuterium=2&nL=12&simulate=1", "_blank", "noopener");
        }
      });
    });
  }

  function setupScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".ms-section-nav a"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var byId = {};
    links.forEach(function (link) { byId[link.getAttribute("href").slice(1)] = link; });
    var observer = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (entry) { return entry.isIntersecting; }).sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (!visible.length) return;
      links.forEach(function (link) { link.classList.remove("is-active"); });
      var active = byId[visible[0].target.id];
      if (active) active.classList.add("is-active");
    }, { rootMargin: "-20% 0px -65% 0px", threshold: [0.05, 0.25, 0.5] });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  function init() {
    setupResolutionLab();
    setupCentroidDemo();
    setupAdductCalculator();
    setupChargeLab();
    setupLabelingLab();
    setupSmartTurtleButtons();
    setupScrollSpy();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
