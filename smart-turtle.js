/*
 * Smart Turtle browser port
 * Copyright © 2024 Coleman Nielsen
 * GPL-3.0-or-later
 *
 * The scientific engine follows the uploaded Python v1.21 implementation:
 * exact per-element isotope distributions, exponentiation-by-squaring,
 * mass-keyed convolution, enrichment controls, adducts, element-specific nL, profile and
 * centroid rendering.
 */
(function () {
  "use strict";

  var DATA = window.SMART_TURTLE_ISOTOPES || [];
  var INTERNAL_PRUNE = 1e-12;
  var DISPLAY_PRUNE = 1e-5;
  var MASS_DIGITS = 6;
  var MAX_INTERMEDIATE_PEAKS = 80000;
  var COLORS = ["#1f62c4", "#d94b3d", "#1aa6a6", "#a44ac4", "#c58a00", "#2e8b57", "#ef6c00"];

  var ADducts = {
    "+H":       { composition: {H: 1}, charge: 1, label: "+H⁺" },
    "+Na":      { composition: {Na: 1}, charge: 1, label: "+Na⁺" },
    "+K":       { composition: {K: 1}, charge: 1, label: "+K⁺" },
    "+NH4":     { composition: {N: 1, H: 4}, charge: 1, label: "+NH₄⁺" },
    "+2H":      { composition: {H: 2}, charge: 2, label: "+2H²⁺" },
    "+2Na":     { composition: {Na: 2}, charge: 2, label: "+2Na²⁺" },
    "+2K":      { composition: {K: 2}, charge: 2, label: "+2K²⁺" },
    "+2NH4":    { composition: {N: 2, H: 8}, charge: 2, label: "+2NH₄²⁺" },
    "-H":       { composition: {H: -1}, charge: 1, label: "−H⁻" },
    "+Cl":      { composition: {Cl: 1}, charge: 1, label: "+Cl⁻" },
    "+Br":      { composition: {Br: 1}, charge: 1, label: "+Br⁻" },
    "+I":       { composition: {I: 1}, charge: 1, label: "+I⁻" },
    "+F":       { composition: {F: 1}, charge: 1, label: "+F⁻" },
    "+HCOO":    { composition: {H: 1, C: 1, O: 2}, charge: 1, label: "+HCOO⁻" },
    "+CH3COO":  { composition: {H: 3, C: 2, O: 2}, charge: 1, label: "+CH₃COO⁻" },
    "-2H":      { composition: {H: -2}, charge: 2, label: "−2H²⁻" },
    "+2Cl":     { composition: {Cl: 2}, charge: 2, label: "+2Cl²⁻" },
    "+2Br":     { composition: {Br: 2}, charge: 2, label: "+2Br²⁻" },
    "+2I":      { composition: {I: 2}, charge: 2, label: "+2I²⁻" },
    "+2F":      { composition: {F: 2}, charge: 2, label: "+2F²⁻" },
    "+2HCOO":   { composition: {H: 2, C: 2, O: 4}, charge: 2, label: "+2HCOO²⁻" },
    "+2CH3COO": { composition: {H: 6, C: 4, O: 4}, charge: 2, label: "+2CH₃COO²⁻" }
  };

  var state = {
    runs: [],
    firstNormalization: null,
    latestOutput: "",
    resizeTimer: null
  };

  var $ = function (id) { return document.getElementById(id); };
  var els = {};

  function roundMass(value) {
    return Number(value.toFixed(MASS_DIGITS));
  }

  function getElementCode(symbol) {
    var index = symbol.indexOf("(");
    return (index === -1 ? symbol : symbol.slice(0, index)).trim();
  }

  function buildNaturalTables() {
    var tables = Object.create(null);
    DATA.forEach(function (row) {
      var code = getElementCode(row.symbol);
      if (!tables[code]) tables[code] = [];
      tables[code].push({ symbol: row.symbol, mass: Number(row.mass), abundance: Number(row.abundance) });
    });
    return tables;
  }

  var NATURAL_TABLES = buildNaturalTables();

  function cloneTables() {
    var out = Object.create(null);
    Object.keys(NATURAL_TABLES).forEach(function (code) {
      out[code] = NATURAL_TABLES[code].map(function (x) {
        return { symbol: x.symbol, mass: x.mass, abundance: x.abundance };
      });
    });
    return out;
  }

  function setIsotopeAbundance(tables, symbol, abundance) {
    var code = getElementCode(symbol);
    var isotope = (tables[code] || []).find(function (x) { return x.symbol === symbol; });
    if (!isotope) throw new Error("The isotope data table does not contain " + symbol + ".");
    isotope.abundance = abundance;
  }

  function applyEnrichment(tables, enrichment) {
    if (enrichment.D !== null) {
      setIsotopeAbundance(tables, "H(2)", enrichment.D);
      setIsotopeAbundance(tables, "H(1)", 100 - enrichment.D);
    }
    if (enrichment.C13 !== null) {
      setIsotopeAbundance(tables, "C(13)", enrichment.C13);
      setIsotopeAbundance(tables, "C(12)", 100 - enrichment.C13);
    }
    if (enrichment.N15 !== null) {
      setIsotopeAbundance(tables, "N(15)", enrichment.N15);
      setIsotopeAbundance(tables, "N(14)", 100 - enrichment.N15);
    }
    if (enrichment.O18 !== null) {
      setIsotopeAbundance(tables, "O(18)", enrichment.O18);
      setIsotopeAbundance(tables, "O(16)", 100 - enrichment.O18);
    }
  }

  function normalizeTables(tables) {
    var out = Object.create(null);
    Object.keys(tables).forEach(function (code) {
      var isotopes = tables[code];
      var sum = isotopes.reduce(function (acc, x) { return acc + Math.max(0, x.abundance); }, 0);
      out[code] = {
        masses: isotopes.map(function (x) { return x.mass; }),
        probs: isotopes.map(function (x, index) {
          if (sum > 0) return Math.max(0, x.abundance) / sum;
          return index === 0 ? 1 : 0;
        })
      };
    });
    return out;
  }

  function tokenizeFormula(formula) {
    var clean = formula.replace(/\s+/g, "");
    if (!clean) throw new Error("Chemical formula cannot be empty.");
    var tokens = clean.match(/[A-Z][a-z]?|\d+|[()]/g);
    if (!tokens || tokens.join("") !== clean) {
      throw new Error("Formula contains unsupported characters. Use element symbols, whole-number counts, and parentheses.");
    }
    return tokens;
  }

  function parseFormula(formula) {
    var tokens = tokenizeFormula(formula);
    var index = 0;

    function parseGroup(expectClose) {
      var counts = Object.create(null);
      while (index < tokens.length) {
        var token = tokens[index];
        if (token === ")") {
          if (!expectClose) throw new Error("Formula has an unmatched closing parenthesis.");
          index += 1;
          return counts;
        }
        if (token === "(") {
          index += 1;
          var inner = parseGroup(true);
          var multiplier = 1;
          if (index < tokens.length && /^\d+$/.test(tokens[index])) {
            multiplier = Number(tokens[index++]);
            if (multiplier < 1) throw new Error("Formula counts must be positive whole numbers.");
          }
          Object.keys(inner).forEach(function (element) {
            counts[element] = (counts[element] || 0) + inner[element] * multiplier;
          });
          continue;
        }
        if (/^[A-Z][a-z]?$/.test(token)) {
          var element = token;
          index += 1;
          var count = 1;
          if (index < tokens.length && /^\d+$/.test(tokens[index])) {
            count = Number(tokens[index++]);
            if (count < 1) throw new Error("Formula counts must be positive whole numbers.");
          }
          counts[element] = (counts[element] || 0) + count;
          continue;
        }
        throw new Error("Unexpected formula token: " + token);
      }
      if (expectClose) throw new Error("Formula has an unmatched opening parenthesis.");
      return counts;
    }

    var result = parseGroup(false);
    if (index !== tokens.length) throw new Error("Formula could not be parsed completely.");
    if (!Object.keys(result).length) throw new Error("Chemical formula cannot be empty.");
    return result;
  }

  function applyAdduct(composition, key) {
    var adduct = ADducts[key];
    if (!adduct) throw new Error("Unknown adduct selection.");
    var adjusted = Object.assign(Object.create(null), composition);
    Object.keys(adduct.composition).forEach(function (element) {
      adjusted[element] = (adjusted[element] || 0) + adduct.composition[element];
      if (adjusted[element] < 0) {
        throw new Error("The selected adduct makes the " + element + " count negative.");
      }
      if (adjusted[element] === 0) delete adjusted[element];
    });
    return { composition: adjusted, charge: adduct.charge, label: adduct.label };
  }

  function pruneDistribution(map, relativeThreshold) {
    if (!map.size) return map;
    var max = 0;
    map.forEach(function (p) { if (p > max) max = p; });
    var threshold = max * relativeThreshold;
    var out = new Map();
    map.forEach(function (p, m) { if (p >= threshold) out.set(m, p); });

    if (out.size > MAX_INTERMEDIATE_PEAKS) {
      var top = Array.from(out.entries()).sort(function (a, b) { return b[1] - a[1]; }).slice(0, MAX_INTERMEDIATE_PEAKS);
      return new Map(top);
    }
    return out;
  }

  function convolve(d1, d2, prune) {
    var out = new Map();
    d1.forEach(function (p1, m1) {
      d2.forEach(function (p2, m2) {
        var mass = roundMass(m1 + m2);
        out.set(mass, (out.get(mass) || 0) + p1 * p2);
      });
    });
    return prune ? pruneDistribution(out, prune) : out;
  }

  function elementDistribution(masses, probs, count, prune) {
    var base = new Map();
    masses.forEach(function (mass, i) {
      var p = probs[i];
      if (p > 0) {
        var rounded = roundMass(mass);
        base.set(rounded, (base.get(rounded) || 0) + p);
      }
    });
    var result = new Map([[0, 1]]);
    var n = Math.trunc(count);
    while (n > 0) {
      if (n & 1) result = convolve(result, base, prune);
      n = n >> 1;
      if (n > 0) base = convolve(base, base, prune);
    }
    return result;
  }

  function computeDistribution(composition, isotopeTables, charge, labelableCounts) {
    var dist = new Map([[0, 1]]);
    labelableCounts = labelableCounts || {};

    var elements = Object.keys(composition);
    for (var e = 0; e < elements.length; e += 1) {
      var atom = elements[e];
      var count = Math.trunc(composition[atom]);
      if (count <= 0) continue;
      if (!isotopeTables[atom]) throw new Error("No isotope data are available for element '" + atom + "'.");

      var hasExplicitLimit = Object.prototype.hasOwnProperty.call(labelableCounts, atom);
      var labelable = hasExplicitLimit ? Math.min(Math.max(0, Math.trunc(labelableCounts[atom])), count) : count;
      var fixed = count - labelable;

      if (labelable > 0) {
        dist = convolve(
          dist,
          elementDistribution(isotopeTables[atom].masses, isotopeTables[atom].probs, labelable, INTERNAL_PRUNE),
          INTERNAL_PRUNE
        );
      }
      if (fixed > 0) {
        var lightMass = Math.min.apply(null, isotopeTables[atom].masses);
        if (!Number.isFinite(lightMass)) throw new Error("The light-isotope mass is missing for element '" + atom + "'.");
        dist = convolve(dist, new Map([[roundMass(fixed * lightMass), 1]]), INTERNAL_PRUNE);
      }
    }

    if (!dist.size) throw new Error("No peaks were computed. Check the formula and adduct.");
    var max = 0;
    dist.forEach(function (p) { if (p > max) max = p; });
    var peaks = Array.from(dist.entries())
      .filter(function (entry) { return entry[1] >= max * DISPLAY_PRUNE; })
      .sort(function (a, b) { return a[0] - b[0]; })
      .map(function (entry) { return { mz: entry[0] / charge, probability: entry[1] }; });
    return peaks;
  }

  function nullablePercent(input) {
    var raw = input.value.trim();
    if (raw === "") return null;
    var value = Number(raw);
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new Error(input.previousElementSibling.textContent + " must be between 0 and 100.");
    }
    return value;
  }

  function positiveNumber(input, label, minimum) {
    var value = Number(input.value);
    if (!Number.isFinite(value) || value < minimum) throw new Error(label + " must be at least " + minimum + ".");
    return value;
  }

  function readInputs() {
    var formula = els.formula.value.trim();
    var parsed = parseFormula(formula);
    var adducted = applyAdduct(parsed, els.adduct.value);
    var rp = positiveNumber(els.resolvingPower, "Resolving power", 100);
    var noise = Number(els.baselineNoise.value);
    if (!Number.isFinite(noise) || noise < 0 || noise > 100) throw new Error("Baseline noise must be between 0 and 100%.");

    var elementTotals = {
      H: Math.trunc(adducted.composition.H || 0),
      C: Math.trunc(adducted.composition.C || 0),
      N: Math.trunc(adducted.composition.N || 0),
      O: Math.trunc(adducted.composition.O || 0)
    };
    var warnings = [];

    function readLabelableCount(input, atom, total) {
      var raw = input.value.trim();
      if (raw === "") return total;
      var value = Number(raw);
      var notation = "nL," + atom;
      if (!Number.isInteger(value) || value < 0) {
        throw new Error(notation + " must be a non-negative whole number.");
      }
      if (value > total) {
        warnings.push(notation + " exceeded the total " + atom + " count and was limited to " + total + ".");
        return total;
      }
      return value;
    }

    var labelableCounts = {
      H: readLabelableCount(els.labelableHydrogens, "H", elementTotals.H),
      C: readLabelableCount(els.labelableCarbons, "C", elementTotals.C),
      N: readLabelableCount(els.labelableNitrogens, "N", elementTotals.N),
      O: readLabelableCount(els.labelableOxygens, "O", elementTotals.O)
    };

    var fixedRange = null;
    if (els.fixGraph.checked) fixedRange = positiveNumber(els.mzRange, "m/z range", 0.1);

    return {
      formula: formula,
      composition: adducted.composition,
      charge: adducted.charge,
      adductLabel: adducted.label,
      resolvingPower: rp,
      noise: noise,
      nL: labelableCounts.H,
      labelableCounts: labelableCounts,
      elementTotals: elementTotals,
      warning: warnings.join(" "),
      showProfile: els.showProfile.checked,
      showCentroid: els.showCentroid.checked,
      collapseNeutromers: els.collapseNeutromers.checked,
      fixedRange: fixedRange,
      enrichment: {
        D: nullablePercent(els.deuterium),
        C13: nullablePercent(els.carbon13),
        N15: nullablePercent(els.nitrogen15),
        O18: nullablePercent(els.oxygen18)
      }
    };
  }

  function formatNominalLabel(nominal) {
    if (nominal === 0) return "M0";
    return nominal > 0 ? "M+" + nominal : "M" + nominal;
  }

  function neutronCountForPeak(peak, baseIonMass, charge) {
    return Math.round(peak.mz * charge - baseIonMass);
  }

  function generateLabels(peaks, charge) {
    if (!peaks.length) return [];
    var baseMass = peaks[0].mz * charge;
    var groups = Object.create(null);
    peaks.forEach(function (peak, i) {
      var nominal = neutronCountForPeak(peak, baseMass, charge);
      if (!groups[nominal]) groups[nominal] = [];
      groups[nominal].push(i);
    });
    var labels = new Array(peaks.length);
    Object.keys(groups).forEach(function (nominalKey) {
      var nominal = Number(nominalKey);
      var indices = groups[nominalKey];
      indices.forEach(function (peakIndex, letterIndex) {
        labels[peakIndex] = formatNominalLabel(nominal) + (indices.length > 1 ? String.fromCharCode(97 + letterIndex) : "");
      });
    });
    return labels;
  }

  function aggregateByNeutronCount(peaks, charge) {
    if (!peaks.length) return [];
    var baseIonMass = peaks[0].mz * charge;
    var groups = new Map();
    peaks.forEach(function (peak) {
      var nominal = neutronCountForPeak(peak, baseIonMass, charge);
      if (!groups.has(nominal)) {
        groups.set(nominal, {
          nominal: nominal,
          probability: 0,
          intensity: 0,
          weightedMz: 0,
          memberCount: 0
        });
      }
      var group = groups.get(nominal);
      group.probability += peak.probability;
      if (Number.isFinite(peak.intensity)) group.intensity += peak.intensity;
      group.weightedMz += peak.mz * peak.probability;
      group.memberCount += 1;
    });
    return Array.from(groups.values()).sort(function (a, b) { return a.nominal - b.nominal; }).map(function (group) {
      return {
        nominal: group.nominal,
        label: formatNominalLabel(group.nominal),
        probability: group.probability,
        intensity: group.intensity,
        mz: group.probability > 0 ? group.weightedMz / group.probability : 0,
        memberCount: group.memberCount
      };
    });
  }

  function getCentroidPeaks(run) {
    return run.collapseNeutromers ? run.collapsedPeaks : run.peaks;
  }

  function formatOutput(run) {
    var lines = [
      "Normalized Isotopic Distribution:",
      "Formula: " + run.formula + "    Adduct: " + run.adductLabel + "    Charge: " + run.charge,
      "Labelable sites: nL,H=" + run.labelableCounts.H + "/" + run.elementTotals.H
        + "    nL,C=" + run.labelableCounts.C + "/" + run.elementTotals.C
        + "    nL,N=" + run.labelableCounts.N + "/" + run.elementTotals.N
        + "    nL,O=" + run.labelableCounts.O + "/" + run.elementTotals.O,
      "Representation: " + (run.collapseNeutromers ? "neutromers (grouped by additional-neutron count)" : "resolved isotope fine structure"),
      ""
    ];
    if (run.collapseNeutromers) {
      run.collapsedPeaks.forEach(function (peak) {
        lines.push(peak.label + ", Intensity: " + peak.intensity.toFixed(3) + ", centroid m/z: " + peak.mz.toFixed(4) + ", fine peaks combined: " + peak.memberCount);
      });
    } else {
      run.peaks.forEach(function (peak, i) {
        lines.push(run.labels[i] + ", Intensity: " + peak.intensity.toFixed(3) + ", m/z: " + peak.mz.toFixed(4));
      });
    }
    if (run.warning) lines.push("\n⚠ " + run.warning);
    return lines.join("\n");
  }

  function hashString(text) {
    var h = 2166136261;
    for (var i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function seededRandom(seed) {
    var x = seed || 123456789;
    return function () {
      x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
      return (x >>> 0) / 4294967296;
    };
  }

  function niceNumber(range, round) {
    if (!(range > 0)) return 1;
    var exponent = Math.floor(Math.log10(range));
    var fraction = range / Math.pow(10, exponent);
    var niceFraction;
    if (round) {
      if (fraction < 1.5) niceFraction = 1;
      else if (fraction < 3) niceFraction = 2;
      else if (fraction < 7) niceFraction = 5;
      else niceFraction = 10;
    } else {
      if (fraction <= 1) niceFraction = 1;
      else if (fraction <= 2) niceFraction = 2;
      else if (fraction <= 5) niceFraction = 5;
      else niceFraction = 10;
    }
    return niceFraction * Math.pow(10, exponent);
  }

  function getPlotRange(runs) {
    runs = runs || state.runs;
    if (!runs.length) return null;
    var latest = runs[runs.length - 1];
    if (latest.fixedRange !== null) {
      return { min: latest.peaks[0].mz - 0.5, max: latest.peaks[0].mz + latest.fixedRange };
    }
    var min = Infinity, max = -Infinity;
    runs.forEach(function (run) {
      run.peaks.forEach(function (p) {
        if (p.mz < min) min = p.mz;
        if (p.mz > max) max = p.mz;
      });
    });
    var span = Math.max(max - min, 0.5);
    var pad = Math.max(0.2, span * 0.045);
    return { min: min - pad, max: max + pad };
  }

  function gaussianHeight(x, peak, resolvingPower) {
    var fwhm = Math.max(peak.mz / resolvingPower, 1e-8);
    var sigma = fwhm / (2 * Math.sqrt(2 * Math.log(2)));
    return peak.intensity * Math.exp(-Math.pow(x - peak.mz, 2) / (2 * sigma * sigma));
  }


  function buildProfilePoints(run, range, plotWidth) {
    // One baseline sample per horizontal pixel plus explicit peak centers and
    // shoulders. The same point generator feeds the canvas and SVG export.
    var sampleCount = Math.min(1800, Math.max(650, Math.round(plotWidth)));
    var xValues = [];
    for (var i = 0; i < sampleCount; i += 1) {
      xValues.push(range.min + (range.max - range.min) * i / (sampleCount - 1));
    }
    run.peaks.forEach(function (peak) {
      if (peak.mz < range.min || peak.mz > range.max) return;
      var fwhm = peak.mz / run.resolvingPower;
      var sigma = fwhm / (2 * Math.sqrt(2 * Math.log(2)));
      xValues.push(peak.mz - 2 * sigma, peak.mz - sigma, peak.mz, peak.mz + sigma, peak.mz + 2 * sigma);
    });
    xValues = xValues
      .filter(function (x) { return x >= range.min && x <= range.max; })
      .sort(function (a, b) { return a - b; });

    var random = seededRandom(run.noiseSeed);
    return xValues.map(function (mz) {
      var intensity = 0;
      for (var p = 0; p < run.peaks.length; p += 1) {
        var peak = run.peaks[p];
        var fwhmPeak = peak.mz / run.resolvingPower;
        if (Math.abs(mz - peak.mz) <= 4.5 * fwhmPeak) {
          intensity += gaussianHeight(mz, peak, run.resolvingPower);
        }
      }
      if (run.noise > 0) intensity += (random() * 2 - 1) * run.noise;
      return { mz: mz, intensity: intensity };
    });
  }

  function renderGraph() {
    var canvas = els.canvas;
    var rect = canvas.getBoundingClientRect();
    var cssWidth = Math.max(320, Math.round(rect.width));
    var cssHeight = Math.max(260, Math.round(rect.height));
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    if (!state.runs.length) return;

    var range = getPlotRange();
    var margin = { left: 66, right: 18, top: 18, bottom: 54 };
    var plotW = Math.max(10, cssWidth - margin.left - margin.right);
    var plotH = Math.max(10, cssHeight - margin.top - margin.bottom);
    var displayMaximum = 100;
    state.runs.forEach(function (run) {
      getCentroidPeaks(run).forEach(function (peak) { displayMaximum = Math.max(displayMaximum, peak.intensity); });
    });
    var yMin = 0;
    var yMax = Math.max(110, Math.ceil(displayMaximum / 20) * 20 + 10);
    var xToPx = function (x) { return margin.left + (x - range.min) / (range.max - range.min) * plotW; };
    var yToPx = function (y) { return margin.top + plotH - (y - yMin) / (yMax - yMin) * plotH; };

    ctx.font = "12px Arial";
    ctx.strokeStyle = "#dfe7e8";
    ctx.fillStyle = "#516063";
    ctx.lineWidth = 1;

    // Y grid and labels.
    var yTickStep = niceNumber(yMax / 5, true);
    for (var yTick = 0; yTick <= yMax + yTickStep * 0.05; yTick += yTickStep) {
      var y = yToPx(yTick);
      ctx.beginPath(); ctx.moveTo(margin.left, y); ctx.lineTo(margin.left + plotW, y); ctx.stroke();
      ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(String(Math.round(yTick * 100) / 100), margin.left - 9, y);
    }

    // X grid and labels.
    var tickStep = niceNumber((range.max - range.min) / 6, true);
    var firstTick = Math.ceil(range.min / tickStep) * tickStep;
    var decimals = tickStep < 0.01 ? 4 : tickStep < 0.1 ? 3 : tickStep < 1 ? 2 : tickStep < 10 ? 1 : 0;
    for (var tick = firstTick; tick <= range.max + tickStep * 0.1; tick += tickStep) {
      var x = xToPx(tick);
      ctx.beginPath(); ctx.moveTo(x, margin.top); ctx.lineTo(x, margin.top + plotH); ctx.stroke();
      ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(tick.toFixed(decimals), x, margin.top + plotH + 9);
    }

    ctx.strokeStyle = "#68777a";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(margin.left, margin.top, plotW, plotH);
    ctx.fillStyle = "#334144";
    ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    ctx.font = "13px Arial";
    ctx.fillText("m/z", margin.left + plotW / 2, cssHeight - 7);
    ctx.save();
    ctx.translate(16, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Normalized Intensity", 0, 0);
    ctx.restore();

    ctx.save();
    ctx.beginPath(); ctx.rect(margin.left, margin.top, plotW, plotH); ctx.clip();
    state.runs.forEach(function (run) {
      ctx.strokeStyle = run.color;
      ctx.fillStyle = run.color;
      if (run.showProfile) {
        var profilePoints = buildProfilePoints(run, range, plotW);
        ctx.beginPath();
        profilePoints.forEach(function (point, pointIndex) {
          var px = xToPx(point.mz), py = yToPx(point.intensity);
          if (pointIndex === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.lineWidth = 1.7;
        ctx.stroke();
      }
      if (run.showCentroid) {
        ctx.globalAlpha = 0.65;
        ctx.setLineDash([5, 3]);
        ctx.lineWidth = 1.3;
        getCentroidPeaks(run).forEach(function (peak) {
          if (peak.mz < range.min || peak.mz > range.max) return;
          var x = xToPx(peak.mz);
          ctx.beginPath(); ctx.moveTo(x, yToPx(0)); ctx.lineTo(x, yToPx(peak.intensity)); ctx.stroke();
        });
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }
    });
    ctx.restore();
  }

  function renderLegend() {
    els.legend.innerHTML = "";
    state.runs.forEach(function (run, i) {
      var item = document.createElement("span");
      item.className = "legend-item";
      var swatch = document.createElement("span");
      swatch.className = "legend-swatch";
      swatch.style.backgroundColor = run.color;
      var label = document.createElement("span");
      label.textContent = (i + 1) + ". " + run.formula + " " + run.adductLabel;
      item.appendChild(swatch); item.appendChild(label);
      els.legend.appendChild(item);
    });
  }

  function setBusy(isBusy) {
    els.app.setAttribute("aria-busy", isBusy ? "true" : "false");
    els.simulate.disabled = isBusy;
    els.simulate.textContent = isBusy ? "Calculating…" : "Simulate";
  }

  function showError(message) {
    els.error.textContent = message;
    els.error.hidden = false;
    els.status.textContent = "Simulation failed.";
  }

  function clearError() {
    els.error.hidden = true;
    els.error.textContent = "";
  }

  function simulate() {
    clearError();
    setBusy(true);
    // Yield once so the busy state paints before a larger convolution.
    window.setTimeout(function () {
      try {
        var input = readInputs();
        var tables = cloneTables();
        applyEnrichment(tables, input.enrichment);
        var normalizedTables = normalizeTables(tables);
        var rawPeaks = computeDistribution(input.composition, normalizedTables, input.charge, input.labelableCounts);
        var rawCollapsedPeaks = aggregateByNeutronCount(rawPeaks, input.charge);
        var normalizationPeaks = input.collapseNeutromers ? rawCollapsedPeaks : rawPeaks;
        var peakMax = normalizationPeaks.reduce(function (m, p) { return Math.max(m, p.probability); }, 0);
        if (state.firstNormalization === null) state.firstNormalization = peakMax;
        var peaks = rawPeaks.map(function (p) {
          return { mz: p.mz, probability: p.probability, intensity: p.probability / state.firstNormalization * 100 };
        });
        var collapsedPeaks = aggregateByNeutronCount(peaks, input.charge);
        var run = {
          formula: input.formula,
          composition: input.composition,
          charge: input.charge,
          adductLabel: input.adductLabel,
          resolvingPower: input.resolvingPower,
          noise: input.noise,
          nL: input.nL,
          labelableCounts: input.labelableCounts,
          elementTotals: input.elementTotals,
          warning: input.warning,
          showProfile: input.showProfile,
          showCentroid: input.showCentroid,
          collapseNeutromers: input.collapseNeutromers,
          fixedRange: input.fixedRange,
          peaks: peaks,
          collapsedPeaks: collapsedPeaks,
          labels: generateLabels(peaks, input.charge),
          color: COLORS[state.runs.length % COLORS.length],
          noiseSeed: hashString(input.formula + input.adductLabel + JSON.stringify(input.enrichment) + JSON.stringify(input.labelableCounts) + state.runs.length)
        };
        run.output = formatOutput(run);
        state.runs.push(run);
        state.latestOutput = run.output;
        els.output.textContent = run.output;
        els.empty.hidden = true;
        els.save.disabled = false;
        els.reset.disabled = false;
        els.copy.disabled = false;
        var statusCount = input.collapseNeutromers ? collapsedPeaks.length : peaks.length;
        var statusDescription = input.collapseNeutromers
          ? statusCount + " neutromer" + (statusCount === 1 ? "" : "s") + " from " + peaks.length + " fine-structure peaks"
          : statusCount + " displayed isotope peak" + (statusCount === 1 ? "" : "s");
        els.status.textContent = "Run " + state.runs.length + ": " + statusDescription + "." + (run.warning ? " " + run.warning : "");
        renderLegend();
        renderGraph();
      } catch (error) {
        console.error(error);
        showError(error && error.message ? error.message : "Unknown simulation error.");
      } finally {
        setBusy(false);
      }
    }, 20);
  }

  function reset() {
    state.runs = [];
    state.firstNormalization = null;
    state.latestOutput = "";
    els.output.textContent = "No simulation yet.";
    els.status.textContent = "Enter a formula and select Simulate.";
    els.empty.hidden = false;
    els.legend.innerHTML = "";
    els.save.disabled = true;
    els.reset.disabled = true;
    els.copy.disabled = true;
    clearError();
    renderGraph();
  }

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function svgNumber(value) {
    return Number(value.toFixed(3));
  }

  function buildSvgMarkup(exportRuns, requestedWidth, requestedHeight) {
    var runs = Array.isArray(exportRuns) ? exportRuns : state.runs;
    if (!runs.length) return "";

    var rect = els.canvas && els.canvas.getBoundingClientRect ? els.canvas.getBoundingClientRect() : { width: 900, height: 480 };
    var sourceWidth = Math.max(320, Math.round(rect.width || 900));
    var sourceHeight = Math.max(260, Math.round(rect.height || 480));
    var width = Math.max(320, Math.round(requestedWidth || Math.max(900, sourceWidth)));
    var height = Math.max(260, Math.round(requestedHeight || Math.max(480, width * sourceHeight / sourceWidth)));
    var range = getPlotRange(runs);
    var margin = { left: 74, right: 24, top: 22, bottom: 62 };
    var plotW = Math.max(10, width - margin.left - margin.right);
    var plotH = Math.max(10, height - margin.top - margin.bottom);
    var displayMaximum = 100;
    runs.forEach(function (run) {
      getCentroidPeaks(run).forEach(function (peak) { displayMaximum = Math.max(displayMaximum, peak.intensity); });
    });
    var yMin = 0;
    var yMax = Math.max(110, Math.ceil(displayMaximum / 20) * 20 + 10);
    var xToPx = function (x) { return margin.left + (x - range.min) / (range.max - range.min) * plotW; };
    var yToPx = function (y) { return margin.top + plotH - (y - yMin) / (yMax - yMin) * plotH; };
    var parts = [];

    parts.push('<?xml version="1.0" encoding="UTF-8"?>');
    parts.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-labelledby="svg-title svg-desc">');
    parts.push('<title id="svg-title">Smart Turtle Mass Spectrometry Simulator isotope spectrum</title>');
    parts.push('<desc id="svg-desc">Vector mass spectrum generated locally by Smart Turtle Mass Spectrometry Simulator.</desc>');
    parts.push('<rect width="100%" height="100%" fill="#ffffff"/>');
    parts.push('<defs><clipPath id="smart-turtle-plot-clip"><rect x="' + margin.left + '" y="' + margin.top + '" width="' + plotW + '" height="' + plotH + '"/></clipPath></defs>');

    var yTickStep = niceNumber(yMax / 5, true);
    for (var yTick = 0; yTick <= yMax + yTickStep * 0.05; yTick += yTickStep) {
      var y = svgNumber(yToPx(yTick));
      var yTickLabel = Math.round(yTick * 100) / 100;
      parts.push('<line x1="' + margin.left + '" y1="' + y + '" x2="' + (margin.left + plotW) + '" y2="' + y + '" stroke="#dfe7e8" stroke-width="1"/>');
      parts.push('<text x="' + (margin.left - 9) + '" y="' + y + '" fill="#516063" font-family="Arial, sans-serif" font-size="12" text-anchor="end" dominant-baseline="middle">' + yTickLabel + '</text>');
    }

    var tickStep = niceNumber((range.max - range.min) / 6, true);
    var firstTick = Math.ceil(range.min / tickStep) * tickStep;
    var decimals = tickStep < 0.01 ? 4 : tickStep < 0.1 ? 3 : tickStep < 1 ? 2 : tickStep < 10 ? 1 : 0;
    for (var tick = firstTick; tick <= range.max + tickStep * 0.1; tick += tickStep) {
      var x = svgNumber(xToPx(tick));
      parts.push('<line x1="' + x + '" y1="' + margin.top + '" x2="' + x + '" y2="' + (margin.top + plotH) + '" stroke="#dfe7e8" stroke-width="1"/>');
      parts.push('<text x="' + x + '" y="' + (margin.top + plotH + 22) + '" fill="#516063" font-family="Arial, sans-serif" font-size="12" text-anchor="middle">' + escapeXml(tick.toFixed(decimals)) + '</text>');
    }

    parts.push('<rect x="' + margin.left + '" y="' + margin.top + '" width="' + plotW + '" height="' + plotH + '" fill="none" stroke="#68777a" stroke-width="1.2"/>');
    parts.push('<text x="' + (margin.left + plotW / 2) + '" y="' + (height - 12) + '" fill="#334144" font-family="Arial, sans-serif" font-size="13" text-anchor="middle">m/z</text>');
    parts.push('<text x="18" y="' + (margin.top + plotH / 2) + '" fill="#334144" font-family="Arial, sans-serif" font-size="13" text-anchor="middle" transform="rotate(-90 18 ' + (margin.top + plotH / 2) + ')">Normalized Intensity</text>');
    parts.push('<g clip-path="url(#smart-turtle-plot-clip)">');

    runs.forEach(function (run) {
      if (run.showProfile) {
        var points = buildProfilePoints(run, range, plotW);
        var path = points.map(function (point, index) {
          var command = index === 0 ? "M" : "L";
          return command + svgNumber(xToPx(point.mz)) + " " + svgNumber(yToPx(point.intensity));
        }).join(" ");
        parts.push('<path d="' + path + '" fill="none" stroke="' + escapeXml(run.color) + '" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>');
      }
      if (run.showCentroid) {
        getCentroidPeaks(run).forEach(function (peak) {
          if (peak.mz < range.min || peak.mz > range.max) return;
          var x = svgNumber(xToPx(peak.mz));
          parts.push('<line x1="' + x + '" y1="' + svgNumber(yToPx(0)) + '" x2="' + x + '" y2="' + svgNumber(yToPx(peak.intensity)) + '" stroke="' + escapeXml(run.color) + '" stroke-width="1.3" stroke-dasharray="5 3" opacity="0.65"/>');
        });
      }
    });

    parts.push('</g>');
    parts.push('<metadata>Generated by Smart Turtle Mass Spectrometry Simulator · The Bonneville Beaker</metadata>');
    parts.push('</svg>');
    return parts.join("\n");
  }

  function saveGraph() {
    if (!state.runs.length) return;
    var svg = buildSvgMarkup();
    var blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var latestFormula = state.runs[state.runs.length - 1].formula.replace(/[^A-Za-z0-9_-]+/g, "-");
    var link = document.createElement("a");
    link.download = "smart-turtle-mass-spectrometry-" + (latestFormula || "spectrum") + ".svg";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 0);
  }

  function copyOutput() {
    if (!state.latestOutput) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(state.latestOutput).then(function () {
        var old = els.copy.textContent; els.copy.textContent = "Copied";
        window.setTimeout(function () { els.copy.textContent = old; }, 1000);
      }).catch(function () { fallbackCopy(); });
    } else fallbackCopy();
  }

  function fallbackCopy() {
    var textarea = document.createElement("textarea");
    textarea.value = state.latestOutput;
    textarea.style.position = "fixed"; textarea.style.opacity = "0";
    document.body.appendChild(textarea); textarea.select();
    try { document.execCommand("copy"); } catch (e) {}
    textarea.remove();
  }

  function setupTabs() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".tab-button"));
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        buttons.forEach(function (b) {
          var active = b === button;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
          var panel = $("tab-" + b.dataset.tab);
          panel.classList.toggle("is-active", active);
          panel.hidden = !active;
        });
      });
    });
  }

  function cacheElements() {
    els.app = $("smart-turtle-app");
    els.form = $("smart-turtle-form");
    els.formula = $("chemical-formula");
    els.showProfile = $("show-profile");
    els.showCentroid = $("show-centroid");
    els.collapseNeutromers = $("collapse-neutromers");
    els.resolvingPower = $("resolving-power");
    els.baselineNoise = $("baseline-noise");
    els.adduct = $("adduct-type");
    els.fixGraph = $("fix-graph");
    els.mzRange = $("mz-range");
    els.deuterium = $("deuterium-enrichment");
    els.carbon13 = $("carbon13-enrichment");
    els.nitrogen15 = $("nitrogen15-enrichment");
    els.oxygen18 = $("oxygen18-enrichment");
    els.labelableHydrogens = $("labelable-hydrogens");
    els.labelableCarbons = $("labelable-carbons");
    els.labelableNitrogens = $("labelable-nitrogens");
    els.labelableOxygens = $("labelable-oxygens");
    els.simulate = $("simulate");
    els.reset = $("reset-graph");
    els.save = $("save-graph");
    els.copy = $("copy-output");
    els.error = $("form-error");
    els.status = $("spectrum-status");
    els.output = $("text-output");
    els.canvas = $("spectrum-canvas");
    els.empty = $("canvas-empty-state");
    els.legend = $("run-legend");
  }

  function init() {
    cacheElements();
    if (!DATA.length) {
      showError("The isotope data file did not load.");
      els.simulate.disabled = true;
      return;
    }
    setupTabs();
    els.fixGraph.addEventListener("change", function () { els.mzRange.disabled = !els.fixGraph.checked; });
    els.form.addEventListener("submit", function (event) { event.preventDefault(); simulate(); });
    els.reset.addEventListener("click", reset);
    els.save.addEventListener("click", saveGraph);
    els.copy.addEventListener("click", copyOutput);
    window.addEventListener("resize", function () {
      window.clearTimeout(state.resizeTimer);
      state.resizeTimer = window.setTimeout(renderGraph, 100);
    });
    renderGraph();
  }

  // Expose the calculation engine for automated testing and for the future
  // dockable SME pane. The same engine can power both the standalone page and
  // an embedded workspace instance without duplicating scientific logic.
  window.SmartTurtleEngine = {
    parseFormula: parseFormula,
    applyAdduct: applyAdduct,
    aggregateByNeutronCount: aggregateByNeutronCount,
    exportSvg: buildSvgMarkup,
    calculate: function (options) {
      options = options || {};
      var parsed = parseFormula(options.formula || "");
      var adducted = applyAdduct(parsed, options.adduct || "+H");
      var tables = cloneTables();
      applyEnrichment(tables, Object.assign({D: null, C13: null, N15: null, O18: null}, options.enrichment || {}));
      var normalizedTables = normalizeTables(tables);
      var elementTotals = {
        H: Math.trunc(adducted.composition.H || 0),
        C: Math.trunc(adducted.composition.C || 0),
        N: Math.trunc(adducted.composition.N || 0),
        O: Math.trunc(adducted.composition.O || 0)
      };
      var requested = Object.assign({}, options.nLByElement || {}, options.labelableCounts || {});
      if (requested.H === undefined && options.nL !== undefined && options.nL !== null) requested.H = options.nL;
      if (requested.H === undefined && options.nLH !== undefined) requested.H = options.nLH;
      if (requested.C === undefined && options.nLC !== undefined) requested.C = options.nLC;
      if (requested.N === undefined && options.nLN !== undefined) requested.N = options.nLN;
      if (requested.O === undefined && options.nLO !== undefined) requested.O = options.nLO;
      var labelableCounts = {};
      ["H", "C", "N", "O"].forEach(function (atom) {
        var raw = requested[atom];
        labelableCounts[atom] = raw === undefined || raw === null
          ? elementTotals[atom]
          : Math.max(0, Math.min(elementTotals[atom], Math.trunc(Number(raw) || 0)));
      });
      return {
        composition: adducted.composition,
        charge: adducted.charge,
        adductLabel: adducted.label,
        nL: labelableCounts.H,
        labelableCounts: labelableCounts,
        elementTotals: elementTotals,
        peaks: computeDistribution(adducted.composition, normalizedTables, adducted.charge, labelableCounts)
      };
    }
  };

  if (typeof document === "undefined") return;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
