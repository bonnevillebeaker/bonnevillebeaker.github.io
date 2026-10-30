/* pUC19 — NCBI GenBank L09137.2, 2686 bp. Public sequence data from NCBI. */
const PUC19 =
    'TCGCGCGTTTCGGTGATGACGGTGAAAACCTCTGACACATGCAGCTCCCGGAGACGGTCACAGCTTGTCTGTAAGCGGAT'+
    'GCCGGGAGCAGACAAGCCCGTCAGGGCGCGTCAGCGGGTGTTGGCGGGTGTCGGGGCTGGCTTAACTATGCGGCATCAGA'+
    'GCAGATTGTACTGAGAGTGCACCATATGCGGTGTGAAATACCGCACAGATGCGTAAGGAGAAAATACCGCATCAGGCGCC'+
    'ATTCGCCATTCAGGCTGCGCAACTGTTGGGAAGGGCGATCGGTGCGGGCCTCTTCGCTATTACGCCAGCTGGCGAAAGGG'+
    'GGATGTGCTGCAAGGCGATTAAGTTGGGTAACGCCAGGGTTTTCCCAGTCACGACGTTGTAAAACGACGGCCAGTGAATT'+
    'CGAGCTCGGTACCCGGGGATCCTCTAGAGTCGACCTGCAGGCATGCAAGCTTGGCGTAATCATGGTCATAGCTGTTTCCT'+
    'GTGTGAAATTGTTATCCGCTCACAATTCCACACAACATACGAGCCGGAAGCATAAAGTGTAAAGCCTGGGGTGCCTAATG'+
    'AGTGAGCTAACTCACATTAATTGCGTTGCGCTCACTGCCCGCTTTCCAGTCGGGAAACCTGTCGTGCCAGCTGCATTAAT'+
    'GAATCGGCCAACGCGCGGGGAGAGGCGGTTTGCGTATTGGGCGCTCTTCCGCTTCCTCGCTCACTGACTCGCTGCGCTCG'+
    'GTCGTTCGGCTGCGGCGAGCGGTATCAGCTCACTCAAAGGCGGTAATACGGTTATCCACAGAATCAGGGGATAACGCAGG'+
    'AAAGAACATGTGAGCAAAAGGCCAGCAAAAGGCCAGGAACCGTAAAAAGGCCGCGTTGCTGGCGTTTTTCCATAGGCTCC'+
    'GCCCCCCTGACGAGCATCACAAAAATCGACGCTCAAGTCAGAGGTGGCGAAACCCGACAGGACTATAAAGATACCAGGCG'+
    'TTTCCCCCTGGAAGCTCCCTCGTGCGCTCTCCTGTTCCGACCCTGCCGCTTACCGGATACCTGTCCGCCTTTCTCCCTTC'+
    'GGGAAGCGTGGCGCTTTCTCATAGCTCACGCTGTAGGTATCTCAGTTCGGTGTAGGTCGTTCGCTCCAAGCTGGGCTGTG'+
    'TGCACGAACCCCCCGTTCAGCCCGACCGCTGCGCCTTATCCGGTAACTATCGTCTTGAGTCCAACCCGGTAAGACACGAC'+
    'TTATCGCCACTGGCAGCAGCCACTGGTAACAGGATTAGCAGAGCGAGGTATGTAGGCGGTGCTACAGAGTTCTTGAAGTG'+
    'GTGGCCTAACTACGGCTACACTAGAAGAACAGTATTTGGTATCTGCGCTCTGCTGAAGCCAGTTACCTTCGGAAAAAGAG'+
    'TTGGTAGCTCTTGATCCGGCAAACAAACCACCGCTGGTAGCGGTGGTTTTTTTGTTTGCAAGCAGCAGATTACGCGCAGA'+
    'AAAAAAGGATCTCAAGAAGATCCTTTGATCTTTTCTACGGGGTCTGACGCTCAGTGGAACGAAAACTCACGTTAAGGGAT'+
    'TTTGGTCATGAGATTATCAAAAAGGATCTTCACCTAGATCCTTTTAAATTAAAAATGAAGTTTTAAATCAATCTAAAGTA'+
    'TATATGAGTAAACTTGGTCTGACAGTTACCAATGCTTAATCAGTGAGGCACCTATCTCAGCGATCTGTCTATTTCGTTCA'+
    'TCCATAGTTGCCTGACTCCCCGTCGTGTAGATAACTACGATACGGGAGGGCTTACCATCTGGCCCCAGTGCTGCAATGAT'+
    'ACCGCGAGACCCACGCTCACCGGCTCCAGATTTATCAGCAATAAACCAGCCAGCCGGAAGGGCCGAGCGCAGAAGTGGTC'+
    'CTGCAACTTTATCCGCCTCCATCCAGTCTATTAATTGTTGCCGGGAAGCTAGAGTAAGTAGTTCGCCAGTTAATAGTTTG'+
    'CGCAACGTTGTTGCCATTGCTACAGGCATCGTGGTGTCACGCTCGTCGTTTGGTATGGCTTCATTCAGCTCCGGTTCCCA'+
    'ACGATCAAGGCGAGTTACATGATCCCCCATGTTGTGCAAAAAAGCGGTTAGCTCCTTCGGTCCTCCGATCGTTGTCAGAA'+
    'GTAAGTTGGCCGCAGTGTTATCACTCATGGTTATGGCAGCACTGCATAATTCTCTTACTGTCATGCCATCCGTAAGATGC'+
    'TTTTCTGTGACTGGTGAGTACTCAACCAAGTCATTCTGAGAATAGTGTATGCGGCGACCGAGTTGCTCTTGCCCGGCGTC'+
    'AATACGGGATAATACCGCGCCACATAGCAGAACTTTAAAAGTGCTCATCATTGGAAAACGTTCTTCGGGGCGAAAACTCT'+
    'CAAGGATCTTACCGCTGTTGAGATCCAGTTCGATGTAACCCACTCGTGCACCCAACTGATCTTCAGCATCTTTTACTTTC'+
    'ACCAGCGTTTCTGGGTGAGCAAAAACAGGAAGGCAAAATGCCGCAAAAAAGGGAATAAGGGCGACACGGAAATGTTGAAT'+
    'ACTCATACTCTTCCTTTTTCAATATTATTGAAGCATTTATCAGGGTTATTGTCTCATGAGCGGATACATATTTGAATGTA'+
    'TTTAGAAAAATAAACAAATAGGGGTTCCGCGCACATTTCCCCGAAAAGTGCCACCTGACGTCTAAGAAACCATTATTATC'+
    'ATGACATTAACCTATAAAAATAGGCGTATCACGAGGCCCTTTCGTC';
/* ============================================================
   Smart Turtle DNA Toolkit
   Restriction digests, PCR, CRISPR and ligation, read out on a
   simulated agarose gel. Runs entirely in the browser: nothing
   you load or paste is ever sent anywhere.
   ============================================================ */
(() => {
"use strict";

const $ = x => document.getElementById(x);
const COLORS = ['#1f62c4','#d94b3d','#1aa6a6','#a44ac4','#c47a1f','#4a8a35'];

/* ---------- sequence utilities ---------- */
const COMP = {A:'T',C:'G',G:'C',T:'A',R:'Y',Y:'R',S:'S',W:'W',K:'M',M:'K',
              B:'V',D:'H',H:'D',V:'B',N:'N'};
const rc = s => s.split('').reverse().map(c => COMP[c] || 'N').join('');
const IUPAC = {R:'[AG]',Y:'[CT]',S:'[GC]',W:'[AT]',K:'[GT]',M:'[AC]',
               B:'[CGT]',D:'[AGT]',H:'[ACT]',V:'[ACG]',N:'[ACGT]'};
const toRe = site => new RegExp('(?=' + site.split('').map(c => IUPAC[c] || c).join('') + ')', 'g');
const clean = s => s.toUpperCase().replace(/[^ACGTRYSWKMBDHVN]/g, '');

/* ---------- restriction enzymes ----------
   c5 / c3 are cut offsets measured from the START of the recognition
   site on the top strand. c5 = top-strand cut, c3 = bottom-strand cut.
   Type IIS enzymes simply have offsets past the end of the site.      */
const ENZYMES = {
  AatII:{s:'GACGTC',c5:5,c3:1},   AluI:{s:'AGCT',c5:2,c3:2},
  ApaI:{s:'GGGCCC',c5:5,c3:1},    BamHI:{s:'GGATCC',c5:1,c3:5},
  BglII:{s:'AGATCT',c5:1,c3:5},   ClaI:{s:'ATCGAT',c5:2,c3:4},
  DraI:{s:'TTTAAA',c5:3,c3:3},    EcoRI:{s:'GAATTC',c5:1,c3:5},
  EcoRV:{s:'GATATC',c5:3,c3:3},   HaeIII:{s:'GGCC',c5:2,c3:2},
  HhaI:{s:'GCGC',c5:3,c3:1},      HindIII:{s:'AAGCTT',c5:1,c3:5},
  KpnI:{s:'GGTACC',c5:5,c3:1},    MluI:{s:'ACGCGT',c5:1,c3:5},
  MspI:{s:'CCGG',c5:1,c3:3},      NcoI:{s:'CCATGG',c5:1,c3:5},
  NdeI:{s:'CATATG',c5:2,c3:4},    NheI:{s:'GCTAGC',c5:1,c3:5},
  NotI:{s:'GCGGCCGC',c5:2,c3:6},  PstI:{s:'CTGCAG',c5:5,c3:1},
  PvuII:{s:'CAGCTG',c5:3,c3:3},   SacI:{s:'GAGCTC',c5:5,c3:1},
  SacII:{s:'CCGCGG',c5:4,c3:2},   SalI:{s:'GTCGAC',c5:1,c3:5},
  ScaI:{s:'AGTACT',c5:3,c3:3},    SmaI:{s:'CCCGGG',c5:3,c3:3},
  SpeI:{s:'ACTAGT',c5:1,c3:5},    SphI:{s:'GCATGC',c5:5,c3:1},
  TaqI:{s:'TCGA',c5:1,c3:3},      XbaI:{s:'TCTAGA',c5:1,c3:5},
  XhoI:{s:'CTCGAG',c5:1,c3:5},    XmaI:{s:'CCCGGG',c5:1,c3:5},
  BsaI:{s:'GGTCTC',c5:7,c3:11,IIS:true},
  BbsI:{s:'GAAGAC',c5:8,c3:12,IIS:true},
  BsmBI:{s:'CGTCTC',c5:7,c3:11,IIS:true}
};

/* All cut positions for one enzyme. Returns [{top, bot, enz}] in top-strand
   coordinates, where a cut index means "between index-1 and index". */
function cutSites(seq, name, circular) {
  const e = ENZYMES[name], L = seq.length, SL = e.s.length, out = [];
  const pad = circular ? Math.max(SL, 20) : 0;
  const hay = seq + seq.slice(0, pad);
  const push = (top, bot) => {
    if (!circular && (top < 0 || bot < 0 || top > L || bot > L)) return;
    out.push({ top: ((top % L) + L) % L, bot: ((bot % L) + L) % L, enz: name });
  };
  // Lookahead matches are zero-width, so lastIndex must be advanced by hand
  // or exec() loops forever on the same position.
  const scan = (pattern, fn) => {
    const re = toRe(pattern);
    let m;
    while ((m = re.exec(hay)) !== null) {
      if (m.index < L) fn(m.index);
      re.lastIndex = m.index + 1;
      if (re.lastIndex > hay.length) break;
    }
  };
  scan(e.s, i => push(i + e.c5, i + e.c3));
  const r = rc(e.s);
  if (r !== e.s) scan(r, i => push(i + SL - e.c3, i + SL - e.c5));
  const seen = new Set();
  return out.filter(c => { const k = c.top + ':' + c.bot; if (seen.has(k)) return false; seen.add(k); return true; })
            .sort((a, b) => a.top - b.top);
}

/* End descriptor produced by a cut. `ovh` is the top-strand sequence
   lying in the gap between the two strand cuts. */
function endsOf(seq, cut) {
  const L = seq.length, t = cut.top, b = cut.bot;
  if (t === b) return { type: 'blunt', ovh: '', enz: cut.enz };
  const lo = Math.min(t, b), hi = Math.max(t, b);
  let ovh = hi - lo <= L ? seq.slice(lo, hi) : '';
  if (hi > L) ovh = (seq + seq).slice(lo, hi);
  return { type: t < b ? "5'" : "3'", ovh, enz: cut.enz };
}
const compatible = (a, b) => a.type === b.type && (a.type === 'blunt' || a.ovh === b.ovh);
const endLabel = e => e.type === 'blunt' ? 'blunt' : e.type + ' ' + e.ovh;
/* The same physical end, described from the other strand: what a fragment's
   end becomes once the fragment is flipped round.

   `ovh` is always the TOP-strand sequence of the single-stranded gap, so
   reverse-complementing the fragment reverse-complements the overhang too. The
   overhang stays on the same strand end (a 5' overhang is still a 5' overhang),
   only its sequence is read the other way, and a dephosphorylated end stays
   dephosphorylated.

   Leaving this out is invisible for every Type II enzyme here, because AATT,
   AGCT, GATC, CTAG, TCGA, GTAC and CATG are all palindromes. It is wrong for
   Type IIS enzymes, whose overhangs are arbitrary: without it, two CCCC ends
   are judged to anneal head-to-head (they cannot) while a CCCC end and a GGGG
   end are rejected (they do). */
const flipEnd = e => ({ type: e.type, ovh: rc(e.ovh || ''), enz: e.enz, noP: e.noP });

/* ---------- digestion ---------- */
function digest(dna, enzNames, partial) {
  const seq = dna.seq, L = seq.length, circ = dna.topology === 'circular';
  let cuts = [];
  enzNames.forEach(n => cuts = cuts.concat(cutSites(seq, n, circ)));
  cuts.sort((a, b) => a.top - b.top);
  cuts = cuts.filter((c, i) => i === 0 || c.top !== cuts[i - 1].top);
  if (!cuts.length) return { frags: null, cuts: [] };

  const span = (from, to) => {
    let s = to > from ? seq.slice(from, to) : (seq.slice(from) + seq.slice(0, to));
    return s;
  };
  const frags = [];

  if (circ) {
    if (cuts.length === 1) {
      const c = cuts[0], e = endsOf(seq, c);
      frags.push({ seq: span(c.top, c.top) || seq, len: L,
                   l: e, r: e, note: 'linearized by ' + c.enz });
    } else {
      for (let i = 0; i < cuts.length; i++) {
        const a = cuts[i], b = cuts[(i + 1) % cuts.length];
        const len = ((b.top - a.top) % L + L) % L || L;
        frags.push({ seq: span(a.top, b.top), len, l: endsOf(seq, a), r: endsOf(seq, b),
                     note: a.enz + ' → ' + b.enz });
      }
      if (partial) addPartials(frags, cuts, seq, L, span, true);
    }
  } else {
    // The outermost ends belong to the substrate, not to this reaction: a
    // plasmid already linearized by EcoRI still carries AATT overhangs.
    const ownL = dna.l || { type: 'blunt', ovh: '', enz: 'end' };
    const ownR = dna.r || { type: 'blunt', ovh: '', enz: 'end' };
    const pts = [{ top: 0, bot: 0, enz: 'end' }].concat(cuts, [{ top: L, bot: L, enz: 'end' }]);
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      if (b.top - a.top <= 0) continue;
      frags.push({ seq: seq.slice(a.top, b.top), len: b.top - a.top,
                   l: a.enz === 'end' ? ownL : endsOf(seq, a),
                   r: b.enz === 'end' ? ownR : endsOf(seq, b),
                   note: (a.enz === 'end' ? ownL.enz : a.enz) + ' → ' + (b.enz === 'end' ? ownR.enz : b.enz) });
    }
    if (partial) addPartials(frags, pts, seq, L, span, false, ownL, ownR);
  }
  frags.forEach(f => { if (f.abund === undefined) f.abund = 1; });
  return { frags, cuts };
}

/* Partial digests: products spanning two or more complete fragments,
   falling off in abundance with each site left uncut. */
function addPartials(frags, pts, seq, L, span, circ, ownL, ownR) {
  const n = circ ? pts.length : pts.length - 1;
  if (n > 9) return;
  const extra = [];
  // k is how many complete fragments the product spans, so it runs up to and
  // INCLUDING n: that is the product with only one site cut, which for a circle
  // is the full-length linear and for a linear substrate is the uncut molecule.
  // Stopping at n-1 drops it, and a circle with exactly two sites then yields no
  // partial products at all even though its one-cut linear is the band you
  // actually look for.
  for (let i = 0; i < n; i++) {
    for (let k = 2; k <= n; k++) {
      const a = pts[i], b = pts[circ ? (i + k) % pts.length : i + k];
      if (!b) continue;
      const len = circ ? (((b.top - a.top) % L + L) % L || L) : b.top - a.top;
      if (len <= 0 || len > L) continue;
      extra.push({ seq: span(a.top, b.top), len,
                   l: a.enz === 'end' ? (ownL || { type: 'blunt', ovh: '', enz: 'end' }) : endsOf(seq, a),
                   r: b.enz === 'end' ? (ownR || { type: 'blunt', ovh: '', enz: 'end' }) : endsOf(seq, b),
                   note: 'partial (' + (k - 1) + ' site' + (k > 2 ? 's' : '') + ' uncut)',
                   partial: true, abund: Math.pow(0.4, k - 1) });
    }
  }
  frags.forEach(f => f.abund = 1);
  extra.forEach(f => frags.push(f));
}

/* ---------- primer thermodynamics (SantaLucia 1998 unified NN) ---------- */
const NN_H = {AA:-7.9,TT:-7.9,AT:-7.2,TA:-7.2,CA:-8.5,TG:-8.5,GT:-8.4,AC:-8.4,
              CT:-7.8,AG:-7.8,GA:-8.2,TC:-8.2,CG:-10.6,GC:-9.8,GG:-8.0,CC:-8.0};
const NN_S = {AA:-22.2,TT:-22.2,AT:-20.4,TA:-21.3,CA:-22.7,TG:-22.7,GT:-22.4,AC:-22.4,
              CT:-21.0,AG:-21.0,GA:-22.2,TC:-22.2,CG:-27.2,GC:-24.4,GG:-19.9,CC:-19.9};
function tm(p, naM = 0.05, primerM = 2.5e-7) {
  if (p.length < 8) return null;
  let H = 0, S = 0;
  for (let i = 0; i < p.length - 1; i++) {
    const d = p.slice(i, i + 2);
    if (!(d in NN_H)) return null;
    H += NN_H[d]; S += NN_S[d];
  }
  const init = c => (c === 'G' || c === 'C') ? [0.1, -2.8] : [2.3, 4.1];
  const i1 = init(p[0]), i2 = init(p[p.length - 1]);
  H += i1[0] + i2[0]; S += i1[1] + i2[1];
  S += 0.368 * (p.length - 1) * Math.log(naM);
  return (H * 1000) / (S + 1.987 * Math.log(primerM / 4)) - 273.15;
}
const gc = p => p.length ? 100 * (p.match(/[GC]/g) || []).length / p.length : 0;

/* ---------- PCR ---------- */
function pcr(dna, fwd, rev) {
  const seq = clean(dna.seq), L = seq.length, circ = dna.topology === 'circular';
  fwd = clean(fwd); rev = clean(rev);
  const hay = circ ? seq + seq : seq;
  /* 3' anchor. A primer may carry a 5' tail that is not in the template at
     all, which is the whole point of adding a restriction site by PCR. A
     fixed-length window taken from the 3' end therefore picks up tail bases
     and matches nothing, so the anchor shrinks until only template-matching
     bases are left. ANCHOR_MIN keeps it long enough to stay specific. */
  const ANCHOR_MAX = 18, ANCHOR_MIN = 12;
  const anchor = (p, present) => {
    const top = Math.min(p.length, ANCHOR_MAX);
    for (let n = top; n >= Math.min(ANCHOR_MIN, p.length); n--) {
      const a = p.slice(-n);
      if (present(a)) return a;
    }
    return p.slice(-top);
  };
  const findAll = (needle) => {
    const out = []; let i = hay.indexOf(needle);
    while (i !== -1 && i < L) { out.push(i); i = hay.indexOf(needle, i + 1); }
    return out;
  };
  const fa = anchor(fwd, a => hay.indexOf(a) !== -1);
  const ra = anchor(rev, a => hay.indexOf(rc(a)) !== -1);
  const fHits = findAll(fa), rHits = findAll(rc(ra));
  const products = [];
  fHits.forEach(p => {
    const fEnd = p + fa.length;                               // just past fwd 3' end
    rHits.forEach(s => {
      let gap = s - fEnd;
      if (circ && gap < 0) gap += L;
      if (gap < 0) return;
      const len = fwd.length + gap + rev.length;
      if (len > 20000 || len < fwd.length + rev.length) return;
      const mid = gap > 0 ? hay.slice(fEnd, fEnd + gap) : '';
      products.push({ seq: fwd + mid + rc(rev), len,
                      l: { type: 'blunt', ovh: '', enz: 'PCR' },
                      r: { type: 'blunt', ovh: '', enz: 'PCR' },
                      note: 'amplicon ' + (p + 1) + '–' + ((s + ra.length) % L + 1), abund: 1 });
    });
  });
  products.sort((a, b) => a.len - b.len);
  return { products, fHits, rHits };
}

/* ---------- CRISPR ---------- */
const PAMS = { spcas9: { pam: 'NGG', name: 'SpCas9', blunt: 3 },
               sacas9: { pam: 'NNGRRT', name: 'SaCas9', blunt: 3 } };
function matchPam(s, pam) {
  if (s.length !== pam.length) return false;
  for (let i = 0; i < pam.length; i++) {
    const p = pam[i];
    if (p === 'N') continue;
    if (p === 'R') { if (s[i] !== 'A' && s[i] !== 'G') return false; continue; }
    if (s[i] !== p) return false;
  }
  return true;
}
function crispr(dna, guide, nucKey) {
  const nuc = PAMS[nucKey], seq = clean(dna.seq);
  guide = clean(guide);
  const L = seq.length, g = guide.length;
  const circ = dna.topology === 'circular';
  const hay = circ ? seq + seq.slice(0, g + nuc.pam.length) : seq;
  const hits = [];
  const scan = (strand) => {
    const target = strand === '+' ? hay : rc(hay);
    const tl = target.length;
    for (let i = 0; i + g + nuc.pam.length <= tl; i++) {
      const proto = target.slice(i, i + g);
      if (!matchPam(target.slice(i + g, i + g + nuc.pam.length), nuc.pam)) continue;
      let mm = 0;
      for (let k = 0; k < g; k++) if (proto[k] !== guide[k]) mm++;
      if (mm > 3) continue;
      // cut site, in top-strand coordinates
      let cutTop;
      if (strand === '+') cutTop = (i + g - nuc.blunt) % L;
      else cutTop = (hay.length - (i + g - nuc.blunt)) % L;
      if (strand === '+' && i >= L) continue;
      hits.push({ mm, strand, proto, cut: ((cutTop % L) + L) % L,
                  pam: target.slice(i + g, i + g + nuc.pam.length) });
    }
  };
  scan('+'); scan('-');
  const seen = new Set();
  const uniq = hits.filter(h => { const k = h.cut + h.strand; if (seen.has(k)) return false; seen.add(k); return true; })
                   .sort((a, b) => a.mm - b.mm || a.cut - b.cut);
  const onTarget = uniq.filter(h => h.mm === 0);
  const cuts = onTarget.map(h => ({ top: h.cut, bot: h.cut, enz: nuc.name }));
  return { hits: uniq, onTarget, cuts, nuc };
}

/* Apply a set of blunt cuts (CRISPR) and return fragments. */
function fragmentsFromCuts(dna, cuts) {
  const seq = dna.seq, L = seq.length, circ = dna.topology === 'circular';
  const cs = cuts.slice().sort((a, b) => a.top - b.top);
  const blunt = e => ({ type: 'blunt', ovh: '', enz: e });
  const frags = [];
  if (circ) {
    if (cs.length === 1) {
      frags.push({ seq, len: L, l: blunt(cs[0].enz), r: blunt(cs[0].enz),
                   note: 'linearized by ' + cs[0].enz, abund: 1 });
    } else {
      for (let i = 0; i < cs.length; i++) {
        const a = cs[i], b = cs[(i + 1) % cs.length];
        const len = ((b.top - a.top) % L + L) % L || L;
        const s = b.top > a.top ? seq.slice(a.top, b.top) : seq.slice(a.top) + seq.slice(0, b.top);
        frags.push({ seq: s, len, l: blunt(a.enz), r: blunt(b.enz), note: 'cut product', abund: 1 });
      }
    }
  } else {
    const pts = [0].concat(cs.map(c => c.top), [L]);
    for (let i = 0; i < pts.length - 1; i++) {
      if (pts[i + 1] - pts[i] <= 0) continue;
      frags.push({ seq: seq.slice(pts[i], pts[i + 1]), len: pts[i + 1] - pts[i],
                   l: blunt('end'), r: blunt('end'), note: 'cut product', abund: 1 });
    }
  }
  return frags;
}

/* ---------- ligation ---------- */
function ligate(a, b) {
  if (!b) {
    if (!compatible(a.r, a.l)) return { error: 'The two ends of this fragment are not compatible (' + endLabel(a.r) + ' and ' + endLabel(a.l) + '), so it cannot self-circularize.' };
    return { seq: a.seq, len: a.seq.length, topology: 'circular',
             note: 'self-ligated through ' + endLabel(a.r) + ' ends' };
  }
  // The reversed insert is the flipped molecule: its ends swap sides AND have
  // their overhangs reverse-complemented (see flipEnd).
  const bRev = { seq: rc(b.seq), l: flipEnd(b.r), r: flipEnd(b.l) };
  const tries = [
    { s: a.seq + b.seq,    ins: b,    d: 'insert forward' },
    { s: a.seq + bRev.seq, ins: bRev, d: 'insert reversed' }
  ];
  for (const t of tries) {
    const jA = [a.r, t.ins.l];
    const jB = [t.ins.r, a.l];
    if (compatible(jA[0], jA[1]) && compatible(jB[0], jB[1])) {
      return { seq: t.s, len: t.s.length, topology: 'circular',
               note: t.d + '; junctions ' + endLabel(jA[0]) + ' / ' + endLabel(jB[0]) };
    }
  }
  return { error: 'No compatible orientation. Backbone ends are ' + endLabel(a.l) + ' and ' + endLabel(a.r) +
                  '; insert ends are ' + endLabel(b.l) + ' and ' + endLabel(b.r) + '.' };
}

/* ============================================================
   Feature annotation
   Three independent sources, strongest first:
     1. a GenBank FEATURES table, when the uploaded file has one
     2. open reading frames, named by their N-terminal peptide
     3. a library of diagnostic motifs for standard elements
   Nothing here is hard-coded to a particular plasmid, so an
   uploaded construct gets the same treatment as a preset.
   ============================================================ */

const CODONS = (() => {
  const b = 'TCAG', aa = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
  const t = {}; let i = 0;
  for (const x of b) for (const y of b) for (const z of b) t[x+y+z] = aa[i++];
  return t;
})();
const translate = s => { let o = ''; for (let i = 0; i + 3 <= s.length; i += 3) o += (CODONS[s.slice(i,i+3)] || 'X'); return o; };

/* N-terminal signatures for common cassettes, each with the length of the
   intact product.

   The N-terminus alone is NOT enough to call a gene intact, and getting this
   wrong is not cosmetic. An insert dropped into the MCS sits DOWNSTREAM of
   lacZ-alpha's start codon, so the start codon and its first residues survive
   untouched; translation simply runs on into the insert until it meets a stop.
   Matching on the N-terminus alone therefore still finds "lacZ-alpha" in a
   disrupted construct, and blue/white screening silently inverts: an insert of
   4.7 kb was reported as an intact 1626-residue lacZ-alpha and scored blue.

   So a signature match also has to land near the right LENGTH. `aa` is the
   residue count of the intact product and `tol` the slack allowed for allele
   variation, which keeps a real variant recognisable while rejecting a
   readthrough that is twice the length it should be. */
const PROTEIN_SIGS = [
  { name:'AmpR (bla)',  nterm:'MSIQHFRVALIPFFAAFCLPVFA', kind:'resistance', aa:286, tol:29 },
  { name:'KanR (nptII)',nterm:'MIEQDGLHAGSPAAWVERLFGYDWAQ', kind:'resistance', aa:264, tol:27 },
  { name:'CmR (cat)',   nterm:'MEKKITGYTTVDISQWHRKEHFEAFQSVAQCTYNQT', kind:'resistance', aa:219, tol:22 },
  { name:'GFP',         nterm:'MVSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATY', kind:'reporter', aa:238, tol:24 },
  { name:'lacZα',  nterm:'MTMIT', kind:'reporter', aa:107, tol:15 }
];
/* Does this ORF match a signature in both sequence and length? */
function matchSig(prot) {
  return PROTEIN_SIGS.find(s => {
    if (!prot.startsWith(s.nterm.slice(0, Math.min(s.nterm.length, 24)))) return false;
    if (s.aa === undefined) return true;
    return Math.abs(prot.length - s.aa) <= (s.tol === undefined ? 15 : s.tol);
  });
}

/* Short, diagnostic elements. Each was checked against a real sequence
   before being put here; `span` extends the annotation past the motif
   where the element is known to be longer than its signature. */
const MOTIF_SIGS = [
  { name:'lac operator',   seq:'TTGTGAGCGGATAACAATT', kind:'regulatory' },
  { name:'lac promoter',   seq:'TTTACACTTTATGCTTCCGGCTCGTATGTTG', kind:'promoter' },
  { name:'CAP binding site',seq:'GCGCAACGCAATTAATGTGAGTTAGCTCACTCATT', kind:'regulatory' },
  { name:'M13 fwd primer', seq:'GTAAAACGACGGCCAGT', kind:'primer' },
  { name:'M13 rev primer', seq:'CAGGAAACAGCTATGAC', kind:'primer' },
  { name:'T7 promoter',    seq:'TAATACGACTCACTATAG', kind:'promoter' },
  { name:'SP6 promoter',   seq:'ATTTAGGTGACACTATAG', kind:'promoter' },
  { name:'T3 promoter',    seq:'AATTAACCCTCACTAAAGG', kind:'promoter' },
  { name:'T7 terminator',  seq:'CTAGCATAACCCCTTGGGGCCTCTAAACGGGTCTTGAGGGG', kind:'terminator' },
  { name:'ori (ColE1/pMB1)', seq:'AAAGGCCAGCAAAAGGCCAGGAACCGTAAAAAGGCCGCGTTGCTGG',
    kind:'origin', span:715 }
];

const KIND_COLOR = {
  resistance:'#d9534f', reporter:'#2f9e68', promoter:'#2f7ad9', regulatory:'#8a6bd1',
  origin:'#c9881f', primer:'#17a2a2', mcs:'#b5407a', cds:'#4a7a35', misc:'#6d7f82'
};

/* ---- 1. GenBank FEATURES ---- */
function parseGenBankFeatures(text, seqLen) {
  const o = text.indexOf('FEATURES'), e = text.indexOf('ORIGIN');
  if (o === -1 || e === -1 || e < o) return [];
  const body = text.slice(o, e).split('\n').slice(1);
  const out = []; let cur = null;
  const flush = () => {
    if (!cur || !cur.loc) return;
    if (cur.type === 'source') { cur = null; return; }
    const comp = /complement/.test(cur.loc);
    const nums = cur.loc.match(/\d+/g);
    if (!nums || nums.length < 2) { cur = null; return; }
    const s = +nums[0] - 1, t = +nums[nums.length - 1];
    if (s < 0 || t > seqLen || t <= s) { cur = null; return; }
    // GenBank marks a feature running off the end of the record with "<" before
    // the start or ">" after the stop, which is exactly what efetch returns for
    // every gene straddling the edge of a slice. Dropping those markers presents
    // a 261 bp stub of a 601 bp gene as a whole gene, which is the one place a
    // "check the Features tab" tool must not be silent, so carry them through.
    const partial5 = /<\s*\d/.test(cur.loc), partial3 = />\s*\d/.test(cur.loc);
    let nm = cur.q.label || cur.q.gene || cur.q.product || cur.q.note || cur.type;
    if (partial5 || partial3) nm = nm.slice(0, 28) + ' (partial)';
    out.push({ name: nm.slice(0,40), start:s, end:t, strand: comp ? -1 : 1,
               kind: guessKind(cur.type, nm), src:'GenBank', type:cur.type,
               partial5, partial3, truncated: partial5 || partial3 });
    cur = null;
  };
  body.forEach(line => {
    const m = line.match(/^ {5}(\S+)\s+(.+)$/);
    if (m) { flush(); cur = { type:m[1], loc:m[2].trim(), q:{} }; return; }
    if (!cur) return;
    const q = line.match(/^\s{10,}\/(\w+)=\"?([^"]*)\"?/);
    if (q) cur.q[q[1]] = q[2].trim();
    else if (/^\s{10,}[\d<>.,()complent]+$/.test(line)) cur.loc += line.trim();
  });
  flush();
  return out;
}
function guessKind(type, name) {
  const n = (name || '').toLowerCase();
  if (/promoter/.test(type) || /promoter/.test(n)) return 'promoter';
  if (/terminator/.test(type) || /termin/.test(n)) return 'terminator';
  if (/rep_origin/.test(type) || /\bori\b/.test(n)) return 'origin';
  if (/primer/.test(type) || /primer/.test(n)) return 'primer';
  if (/protein_bind|misc_bind|regulatory/.test(type)) return 'regulatory';
  if (/resist|\bbla\b|ampr|kanr|cmr|tetr|puro|neo/.test(n)) return 'resistance';
  if (/gfp|rfp|mcherry|lacz|luc/.test(n)) return 'reporter';
  if (/cds|gene/i.test(type)) return 'cds';
  return 'misc';
}

/* ---- 2. ORFs ---- */
function findORFs(seq, circular, minBp = 300) {
  const L = seq.length, dbl = circular ? seq + seq : seq, out = [];
  const scan = (tpl, strand) => {
    for (let f = 0; f < 3; f++) {
      for (let j = f; j + 3 <= tpl.length && j < L + 3; j += 3) {
        if (tpl.slice(j, j+3) !== 'ATG') continue;
        for (let k = j; k + 3 <= tpl.length; k += 3) {
          if (CODONS[tpl.slice(k, k+3)] === '*') {
            const n = k + 3 - j;
            if (n >= minBp && n <= L) {
              const prot = translate(tpl.slice(j, k));
              const start = strand === 1 ? j % L : (L - ((j % L) + n) % L) % L;
              out.push({ len:n, strand, start, end:(start + n) % L || L, prot });
            }
            break;
          }
        }
      }
    }
  };
  scan(dbl, 1); scan(rc(dbl), -1);
  out.sort((a,b) => b.len - a.len);
  // Every in-frame ATG upstream of a stop codon opens a reading frame, so one
  // real gene yields a nest of shorter ORFs that all end together. The shared
  // stop is what makes them one gene, so they are grouped by it and the longest
  // kept, which is the reading a ribosome takes from the first start. Grouping
  // by start position instead deletes real genes: bacterial neighbours
  // routinely begin within a few bases of one another.
  const kept = [], seen = new Set();
  out.forEach(o => {
    const stop = o.strand === 1 ? (o.start + o.len) % seq.length : o.start;
    const key = o.strand + ':' + stop;
    if (seen.has(key)) return;
    seen.add(key); kept.push(o);
  });
  // A 118-codon ORF turns up by chance several times in a 2.7 kb sequence,
  // so an unnamed ORF has to clear 150 aa before it is worth drawing.
  return kept.map(o => {
    const sig = matchSig(o.prot);
    if (!sig && o.len < 453) return null;
    return { name: sig ? sig.name : 'ORF (' + Math.round(o.len/3 - 1) + ' aa, predicted)',
             start:o.start, end:(o.start + o.len) % (seq.length) || seq.length,
             len:o.len, strand:o.strand, kind: sig ? sig.kind : 'cds',
             src:'ORF', prot:o.prot, type:'CDS' };
  }).filter(Boolean);
}

/* ---- 3. motifs ---- */
function findMotifs(seq, circular) {
  const L = seq.length, hay = circular ? seq + seq.slice(0, 80) : seq, out = [];
  MOTIF_SIGS.forEach(sig => {
    [[sig.seq, 1], [rc(sig.seq), -1]].forEach(([needle, strand]) => {
      if (strand === -1 && needle === sig.seq) return;
      let i = hay.indexOf(needle);
      while (i !== -1 && i < L) {
        const len = sig.span || needle.length;
        out.push({ name:sig.name, start:i, end:(i + len) % L || L, len,
                   strand, kind:sig.kind, src:'motif', type:'misc_feature' });
        i = hay.indexOf(needle, i + 1);
      }
    });
  });
  return out;
}

/* ---- 4. multiple cloning site, inferred from the restriction map ---- */
function findMCS(seq, circular) {
  const L = seq.length, pts = [];
  Object.keys(ENZYMES).forEach(n => {
    if (ENZYMES[n].IIS || ENZYMES[n].s.length < 6) return;
    const h = cutSites(seq, n, circular);
    if (h.length === 1) pts.push({ pos:h[0].top, enz:n });
  });
  if (pts.length < 4) return [];
  pts.sort((a,b) => a.pos - b.pos);
  let best = null, run = [pts[0]];
  for (let i = 1; i <= pts.length; i++) {
    if (i < pts.length && pts[i].pos - run[run.length-1].pos <= 30) { run.push(pts[i]); continue; }
    if (run.length >= 4 && (!best || run.length > best.length)) best = run;
    run = [pts[i]];
  }
  if (!best) return [];
  const s = best[0].pos - 6, e = best[best.length-1].pos + 8;
  return [{ name:'MCS (' + best.length + ' unique sites)', start:Math.max(0,s),
            end:Math.min(L,e), len:e-s, strand:1, kind:'mcs', src:'restriction map',
            type:'misc_feature', enzymes:best.map(b=>b.enz) }];
}

/* ---- assemble ---- */
function annotate(dna) {
  const circ = dna.topology === 'circular', seq = dna.seq;
  let feats = [];
  if (dna.gbText) feats = parseGenBankFeatures(dna.gbText, seq.length);
  const haveGB = feats.length > 0;
  if (!haveGB) feats = feats.concat(findORFs(seq, circ));
  feats = feats.concat(findMotifs(seq, circ), findMCS(seq, circ));
  // drop duplicates covering the same ground with the same name
  const out = [];
  feats.forEach(f => {
    if (out.some(g => g.name === f.name && Math.abs(g.start - f.start) < 20)) return;
    f.len = f.len || ((f.end - f.start + seq.length) % seq.length || seq.length);
    f.color = KIND_COLOR[f.kind] || KIND_COLOR.misc;
    out.push(f);
  });
  return out.sort((a,b) => a.start - b.start || b.len - a.len);
}

/* Census of a GenBank FEATURES table by key, including the keys the feature
   parser deliberately ignores. A record that lists nothing but "source" has
   no annotation to inherit, which is worth saying out loud rather than
   leaving the user to wonder why no gene has a name. */
function featureKeys(text) {
  const o = text.indexOf('FEATURES'), e = text.indexOf('ORIGIN');
  if (o === -1 || e === -1 || e < o) return [];
  const out = [];
  text.slice(o, e).split('\n').slice(1).forEach(line => {
    const m = line.match(/^ {5}(\S+)\s+\S/);
    if (m && m[1] !== 'source') out.push(m[1]);
  });
  return out;
}

/* ============================================================
   Electrophoresis physics

   Migration is built from d = mu * E * t rather than from a
   log-linear curve fitted to a picture of a gel. What is derived
   and what is fitted is marked on every term, because two of the
   three DNA conformations are physics and the third is not.

   Sources for the measured constants:
     - Free-solution mobility plateaus at 3.17e-4 cm^2/Vs above
       ~400 bp in 40 mM Tris-acetate-EDTA, 20 C.  Stellwagen,
       Electrophoresis 2009 (PMC2757927).
     - Pore radius is NOT taken from a measurement. Reported values
       scatter by well over 2-fold between methods, and the ones in
       that review (~100 nm at 1%) do not reproduce the published
       resolving ranges. The pore prefactor is fitted along with the
       two sieving constants instead; see the note on PHYS below.
     - Apparent persistence length 46 nm, statistically identical
       for linear and open-circular plasmid isoforms; supercoiled
       Rg follows a linear-DNA model with a reduced effective
       contour length.  Latulippe & Zydney, Biotechnol Bioeng 2010
       (PMID 20506212).
     - Plectoneme normalized length 2L/l = 0.85 +/- 0.05 at
       superhelical density sigma ~ -0.03, measured on pUC18
       (2686 bp). L is the projected length on the superhelical
       axis, so the axial extent is 0.425 of the contour length.
       Reported constant over -0.12 < sigma < -0.02.  "Dimensions
       of plectonemically supercoiled DNA", Biophys J 2002
       (PMID 12124290).

   Open-circular DNA is deliberately NOT modelled. Its Rg is smaller
   than linear DNA of the same length, so sieving predicts it should
   run FASTER, and it does not. The real mechanism is the circle
   impaling itself on gel fibres, for which no closed-form model
   exists. Rather than paper over that with a fitted penalty, nicked
   DNA is left out of the gel entirely.
   ============================================================ */

const PHYS = {
  mu0:        3.17e-4,   // cm^2/(V*s), free-solution plateau   [measured]
  persist:    46,        // nm, apparent persistence length     [measured]
  rise:       0.34,      // nm per bp, B-form                   [measured]
  poreAt1pct: 205,       // nm at 1% agarose                    [FITTED, see note]
  sieveA:     1.96,      // Ogston retardation amplitude        [FITTED, see note]
  sieveB:     1.49,      // Ogston retardation exponent         [FITTED, see note]
  scFraction: 0.425,     // supercoiled axial extent / contour  [measured, 2L/l=0.85]
  diffD0:     2.0e-8     // cm^2/s reference diffusion          [order-of-magnitude]
};
/* How the sieving term is written, and why it is written this way.

   Retardation depends on ONE dimensionless group: u = Rg / poreRadius, how
   well the coil fits the hole it has to get through. The Ogston branch is
   mu/mu0 = exp(-A u^B), and the reptation branch above the crossover is
   mu ~ 1/N matched to that value at u = 1.

   Writing it in u is not cosmetic. The earlier form was
   exp(-k (Rg + fibreR)^2 * pct), evaluated at Rg = poreRadius to join the
   reptation branch. Since poreRadius goes as 1/pct, that exponent goes as
   (1/pct)^2 * pct = 1/pct, so the mobility AT THE CROSSOVER fell as the gel
   got looser. A looser gel retarding MORE is backwards, and it was what
   crushed large DNA at low percentages: a 0.5% gel could not resolve past
   11 kb when a real one goes to 30-50 kb. In u, the crossover value is
   exp(-A) at every percentage, which is what it should be.

   A, B and poreAt1pct were fitted together by least squares on log size
   against the published resolving ranges for 0.5 / 0.7 / 1.0 / 1.2 / 1.5 /
   2.0 % gels (openwetware NanoBio, miniPCR), twelve endpoints in all, with
   each gel run until the dye front reached 3/4 of its length, which is how
   people actually run one. The fit puts every endpoint within 1.53x and
   most within 1.3x, against 1.79x typical error before. B landing near 1.5
   has no theory behind it that I know of; treat all three as calibration.

   What this still does not do, and what the recalibration made WORSE:

   There is no field dependence beyond d = mu E t, so no band inversion and no
   mobility saturation. Nothing in the model puts a ceiling on large-DNA
   resolution; the only thing that stops two big fragments separating is their
   bands crowding together near the well. Raising the fitted length scale from
   100 to 205 nm raised every mobility, so large DNA now travels further before
   it crowds, and the model overreaches in two measurable ways it did not
   before: on a 1% gel it calls 20 kb against 40 kb resolved where it used to
   merge them, past the 8-10 kb that gel can really do, and given a long enough
   run it will claim to resolve 100 kb from 200 kb, which needs pulsed fields.
   A biased-reptation term with a saturation plateau is what would fix both,
   and it is the one piece of physics this model is still missing.

   Also note the trade that was made here. The old exp(-k (Rg + fibreR)^2 pct)
   was Ogston-Rodbard: retardation proportional to fibre volume fraction times
   the squared sum of coil and fibre radii, a form with a derivation behind it.
   exp(-A u^B) has none. It fits the published ranges better inside 0.5-2%
   agarose and should be trusted less outside that window, since no theory is
   carrying it there. The constants are also conditioned on one particular
   definition of "resolved" (1.25x size ratio, two sigma, band at least 0.25 cm
   off the well, dye front at 3/4 of the gel); a different criterion would fit
   different constants, so the agreement is not as independent as it looks. */

/* Radius of gyration of a worm-like chain (Benoit-Doty).
   Reduces to the rigid-rod limit L/sqrt(12) when L << P and to the
   Gaussian coil sqrt(LP/3) when L >> P, so it covers 50 bp to 50 kb
   with one expression. */
function wlcRg(bp) {
  const L = Math.max(1e-6, bp * PHYS.rise), P = PHYS.persist;
  const x = L / P;
  const rg2 = (L*P/3) - P*P + (2*P*P*P/L) * (1 - (P/L)*(1 - Math.exp(-x)));
  return Math.sqrt(Math.max(rg2, 1e-9));
}

/* Median pore radius, taken to fall as 1/[agarose]. The 1/pct form is what
   makes the crossover size shift by about 16x across a 4x change in
   percentage, which is roughly the shift the published resolving ranges show;
   a 1/sqrt(pct) law, which is what random-fibre-network theory gives, moves it
   only 4x and cannot reach 30 kb at 0.5%. So this exponent is empirical too,
   and poreAt1pct was fitted along with the sieving constants rather than
   measured. Reported AFM pore sizes for agarose scatter widely, so do not read
   205 nm as a measurement. */
const poreRadius = pct => PHYS.poreAt1pct / Math.max(0.1, pct);

/* Effective Rg by conformation. Supercoiling enters as a shorter effective
   contour length, the axial extent of the plectoneme, which is how the
   light-scattering work models it and what the cryo-EM measurement gives. */
function effectiveRg(bp, form) {
  if (form === 'sc') return wlcRg(bp * PHYS.scFraction);
  return wlcRg(bp);
}

/* Size at which Rg equals the pore radius: the Ogston/reptation boundary. */
function crossoverBp(pct) {
  const target = poreRadius(pct);
  let lo = 10, hi = 5e6;
  for (let i = 0; i < 60; i++) {
    const mid = Math.sqrt(lo*hi);
    if (wlcRg(mid) < target) lo = mid; else hi = mid;
  }
  return Math.sqrt(lo*hi);
}

/* Mobility in cm^2/(V*s).
   Below the crossover: Ogston sieving, mu = mu0 * exp(-A u^B) with
   u = Rg/poreRadius.
   Above it: reptation, mu ~ 1/N, matched to the Ogston value at u = 1 so
   the curve is continuous. */
const sieveFactor = u => Math.exp(-PHYS.sieveA * Math.pow(Math.max(0, u), PHYS.sieveB));
function mobility(bp, form, pct) {
  const rg = effectiveRg(bp, form);
  const rPore = poreRadius(pct);
  let mu, regime;
  if (rg <= rPore) { mu = PHYS.mu0 * sieveFactor(rg / rPore); regime = 'Ogston'; }
  else {
    const nc = crossoverBp(pct) * (form === 'sc' ? 1/PHYS.scFraction : 1);
    mu = PHYS.mu0 * sieveFactor(1) * (nc / bp);
    regime = 'reptation';
  }
  return { mu, regime, rg, rPore };
}

/* Migration distance in cm. This is the whole model: d = mu * E * t. */
function migrate(bp, form, run) {
  const m = mobility(bp, form, run.pct);
  const E = run.volts / Math.max(0.5, run.gapCm);          // V/cm
  const d = m.mu * E * (run.minutes * 60);
  const D = PHYS.diffD0 * (m.mu / PHYS.mu0);
  const sigma = Math.sqrt(2 * D * run.minutes * 60 + Math.pow(run.loadCm || 0.12, 2));
  return { d, E, sigma, ...m, off: d > run.gelCm };
}

/* Bromophenol blue is a dye, not DNA, so it has no Rg and the sieving model
   says nothing about it. What is well known is the DNA size it co-migrates
   with, which shifts with gel percentage: roughly 300 bp in a 1% gel and
   smaller in denser gels. Rather than invent a mobility, treat the dye as
   that equivalent fragment and run it through the same model, which keeps it
   consistent with the bands around it at any condition. */
const bpbEquivalentBp = pct => 300 / Math.max(0.3, pct);
function dyeFront(run) {
  return migrate(bpbEquivalentBp(run.pct), 'lin', run).d;
}

/* ============================================================
   Ligation as a reaction, not a choice

   Mixing two tubes with ligase gives a product distribution. Which
   products dominate is a competition between a molecule finding its
   own other end (circularization) and finding a different molecule
   (concatemerization).

   The first is governed by the j-factor: the effective molar
   concentration of one end of a chain in the neighbourhood of its
   other end. For an ideal chain,

       j = (3 / (2*pi*<r^2>))^(3/2),  <r^2> = 2*P*L

   with P the persistence length and L the contour length. Converted
   to molar units this lands in the tens of nanomolar for a few-kb
   fragment, which is the right order.

   j competes directly against the concentration of everything else
   in the tube, so the same model explains why dilute ligations
   circularize and concentrated ones form concatemers.
   ============================================================ */

const DA_PER_BP = 650;          // average molecular weight of a base pair
const AVOGADRO  = 6.02214076e23;

/* Effective end-to-end concentration, in nM. */
function jFactor(bp) {
  const L = bp * PHYS.rise, P = PHYS.persist;
  const r2 = 2 * P * L;                                  // nm^2, ideal chain
  const perNm3 = Math.pow(3 / (2 * Math.PI * r2), 1.5);  // molecules per nm^3
  const molar = perNm3 * 1e24 / AVOGADRO;                // nm^-3 -> mol/L
  let nM = molar * 1e9;
  // Below roughly three persistence lengths a duplex cannot bend into a
  // circle, and the ideal-chain formula wrongly predicts a huge j. The
  // suppression below is empirical, not derived.
  const stiffLimit = 3 * P / PHYS.rise;                  // ~400 bp
  if (bp < stiffLimit) nM *= Math.pow(bp / stiffLimit, 6);
  return nM;
}

/* nM concentration of a species from its mass concentration in ng/uL.
   1 ng/uL = 1 mg/L = 1e-3 g/L, so  M = 1e-3 * (ng/uL) / (bp * 650 g/mol)
   and nM is that times 1e9.  Check: 2.5 ng/uL of 2686 bp -> 1.43 nM. */
const molarity = (ngPerUL, bp) => (ngPerUL * 1e-3) / (bp * DA_PER_BP) * 1e9;

/* Can these two ends be joined? A dephosphorylated end can still be
   joined if its PARTNER carries a phosphate; two dephosphorylated ends
   cannot join at all. That is exactly why CIP treatment of a vector
   suppresses self-ligation without blocking insert ligation. */
function canJoin(e1, e2) {
  if (!compatible(e1, e2)) return false;
  return !(e1.noP && e2.noP);
}

/* How fast do two pieces find each other, relative to two average ones?

   A bimolecular join needs the two ends to collide, so its rate goes with how
   fast the pieces diffuse, not with concentration alone. DNA translational
   diffusion falls off with length roughly as N^-0.57 in free solution, and the
   collision rate goes with the SUM of the two diffusion constants, so a short
   fragment is a far more reactive partner than a long one.

   This is what decides between the two products of religating a double digest
   without gel-purifying the stuffer. Both candidates need one bimolecular join
   and then a closure, and both partners are equimolar, so on concentration
   alone the parent plasmid and the backbone dimer come out nearly even, at
   2.7:1. The 51 bp stuffer diffuses about 9x faster than the 2635 bp backbone,
   which lifts that to roughly 14:1 and drops the dimer to a few percent, where
   it belongs.

   The scale is relative, so a tube of same-length pieces behaves as before. */
const DIFF_EXP = 0.57;
const diffusion = bp => Math.pow(Math.max(1, bp), -DIFF_EXP);
const collisionRate = (bpA, bpB) => diffusion(bpA) + diffusion(bpB);

/* Enumerate what comes out of the tube. */
function ligationProducts(species) {
  species.forEach(s => { s.conc = molarity(s.ngPerUL, s.len); });
  const totalConc = species.reduce((a, s) => a + s.conc, 0) || 1;
  const out = [];

  species.forEach(a => {
    const weights = [];
    // a) close on itself
    if (canJoin(a.r, a.l)) weights.push({ kind:'circle', parts:[a], w: jFactor(a.len) });
    // b) join to any partner, in either orientation
    species.forEach(b => {
      // The flipped copy must carry everything the original had, concentration
      // included, or its weight silently evaluates to NaN. Its ends swap sides
      // AND have their overhangs reverse-complemented (see flipEnd), without
      // which non-palindromic Type IIS overhangs are matched wrongly.
      const flip = { l: flipEnd(b.r), r: flipEnd(b.l), seq: rc(b.seq), len: b.len,
                     name: b.name, conc: b.conc, ng: b.ng, tube: b.tube };
      [[b, 'forward'], [flip, 'reverse']].forEach(([p, dir]) => {
        if (!canJoin(a.r, p.l)) return;
        const joined = { len: a.len + p.len, l: a.l, r: p.r };
        // Rate of finding this partner: how much of it there is, times how
        // fast the two diffuse into each other. The collision term is scaled
        // against a partner the same length as `a`, which keeps it
        // dimensionless and leaves a tube of equal-length pieces unchanged.
        const reactivity = collisionRate(a.len, p.len) / collisionRate(a.len, a.len);
        const w = p.conc * reactivity;
        if (canJoin(joined.r, joined.l)) {
          // The dimer can now close on itself or stay linear and keep
          // extending. Which one wins is j against everything else present,
          // the same competition that governs a single fragment.
          const jc = jFactor(joined.len);
          const pClose = jc / (jc + totalConc);
          weights.push({ kind:'circle', parts:[a, p], dir, w: w * pClose });
          weights.push({ kind:'linear', parts:[a, p], dir, w: w * (1 - pClose) });
        } else {
          weights.push({ kind:'linear', parts:[a, p], dir, w });
        }
      });
    });
    const sum = weights.reduce((x, y) => x + y.w, 0);
    const unligatedW = totalConc;                       // nothing found in time
    const denom = sum + unligatedW;
    weights.forEach(x => out.push({ ...x, amount: a.conc * x.w / denom, from: a }));
    out.push({ kind:'unligated', parts:[a], amount: a.conc * unligatedW / denom, from: a, w: unligatedW });
  });

  // merge equivalent products
  const key = p => p.kind + ':' + p.parts.map(x => x.name).sort().join('+') + ':' + (p.dir || '');
  const merged = new Map();
  out.forEach(p => {
    const k = key(p);
    if (merged.has(k)) merged.get(k).amount += p.amount;
    else merged.set(k, { ...p });
  });
  return [...merged.values()]
    .filter(p => p.amount > 1e-4)
    .sort((a, b) => b.amount - a.amount);
}

/* ============================================================
   Transformation and plate selection

   This is where a ligation mixture stops being a table and starts
   having consequences. Three filters act in order:

     1. Uptake. Circular DNA transforms; linear DNA is chewed up by
        host exonucleases (RecBCD in E. coli) and transforms orders
        of magnitude worse. This alone removes most concatemers.
     2. Selection. A colony only grows if its plasmid carries a
        working resistance gene for the plate's antibiotic. That is
        read from the sequence by the same ORF annotation used for
        maps, not from a flag set when the product was made.
     3. Screening. Blue or white is decided by whether lacZ-alpha
        still translates in the product. An insert in the MCS breaks
        the reading frame, the ORF disappears, and the colony is
        white. Again read from the sequence.

   Efficiencies are typical published ranges for E. coli, not
   measurements, and the linear penalty is approximate.
   ============================================================ */

const STRAINS = {
  dh5a_chem:  { name:'DH5α, chemically competent',  eff:1e8,  lacZdM15:true },
  dh5a_high:  { name:'DH5α, high efficiency',       eff:1e9,  lacZdM15:true },
  dh5a_electro:{name:'DH5α, electrocompetent',      eff:1e10, lacZdM15:true },
  homemade:   { name:'Homemade CaCl₂ cells',        eff:1e6,  lacZdM15:true },
  top10:      { name:'TOP10',                            eff:1e9,  lacZdM15:true },
  bl21:       { name:'BL21(DE3), expression strain',     eff:1e7,  lacZdM15:false }
};
/* Linear DNA does not give colonies. Two reasons, both decisive: host
   exonucleases (RecBCD) degrade free ends, and a linear molecule has no way
   to replicate as a plasmid even if it survives. Recombination into the
   chromosome happens at a vanishing rate and not at all in the recA- strains
   used for cloning. So this is zero, not merely small. */
const LINEAR_PENALTY = 0;
/* Quoted efficiencies (cfu/ug) are measured with supercoiled control plasmid.
   A freshly ligated circle is relaxed and nicked, and transforms roughly an
   order of magnitude worse. Approximate. */
const RELAXED_PENALTY = 0.05;
/* You recover the cells in ~1 mL and plate ~100 uL of it. Without this the
   arithmetic reports the whole transformation rather than one plate. */
const PLATED_FRACTION = 0.1;
/* Size of the control plasmid a quoted efficiency was measured with. Suppliers
   quote cfu/ug using a ~3 kb supercoiled control, pUC19 or similar. */
const REF_PLASMID_BP = 3000;
/* A colony comes from one MOLECULE getting in, but efficiency is quoted per
   MICROGRAM, and a microgram of a big plasmid is fewer molecules than a
   microgram of a small one. So the same mass of a 5 kb construct carries half
   the molecules of a 2.5 kb one and gives half the colonies, before any
   size-dependent competence is considered. Scoring colonies on mass alone
   inverts this and rewards the bigger product, which is how a religation
   control came to report 45% of its colonies as the backbone dimer: the dimer
   is twice the length, so it was handed twice the DNA.

   On top of the molecule count, per-molecule competence also falls with size.
   That part is empirical rather than derived, and this exponent is a round
   number chosen to put a 24 kb construct about 20x below a 3 kb one, which is
   the right order for what people report. Treat it as a teaching
   approximation, not a measurement. */
const SIZE_COMPETENCE_EXP = 0.5;
function uptakeForSize(bp) {
  if (!(bp > 0)) return 1;
  const molecules = REF_PLASMID_BP / bp;             // exact, from the unit
  const competence = bp > REF_PLASMID_BP             // empirical, see above
    ? Math.pow(REF_PLASMID_BP / bp, SIZE_COMPETENCE_EXP) : 1;
  return molecules * competence;
}

const ANTIBIOTICS = {
  none: { name:'No antibiotic', gene:null },
  amp:  { name:'Ampicillin',    gene:/ampr|bla/i },
  kan:  { name:'Kanamycin',     gene:/kanr|nptii/i },
  cm:   { name:'Chloramphenicol', gene:/cmr|cat/i }
};

/* What a candidate plasmid carries, read from its own sequence. */
function plasmidTraits(seq, circular) {
  const feats = annotate({ seq, topology: circular ? 'circular' : 'linear' });
  const resistance = feats.filter(f => f.kind === 'resistance').map(f => f.name);
  const lacZ = feats.some(f => /lacZ/i.test(f.name));
  return { feats, resistance, lacZ };
}
const survives = (traits, abx) => {
  const a = ANTIBIOTICS[abx];
  if (!a || !a.gene) return true;                     // no selection
  return traits.resistance.some(r => a.gene.test(r));
};

/* Plate out a tube. */
function transform(sample, opts) {
  const strain = STRAINS[opts.strain] || STRAINS.dh5a_chem;
  const abx = opts.antibiotic || 'none';
  const ngTotal = Math.max(0, opts.ng || 0);
  const species = mainFrags(sample);
  const massTotal = species.reduce((a, f) => a + f.len * (f.abund === undefined ? 1 : f.abund), 0) || 1;

  const rows = species.map(f => {
    const share = f.len * (f.abund === undefined ? 1 : f.abund) / massTotal;
    const ng = ngTotal * share;
    const traits = plasmidTraits(f.seq, !!f.circular);
    const uptake = (f.circular ? 1 : LINEAR_PENALTY) *
                   (f.circular && opts.relaxed ? RELAXED_PENALTY : 1) *
                   uptakeForSize(f.len);
    const grows = f.circular && survives(traits, abx);
    // cfu on the plate = ug of DNA * efficiency * uptake * fraction plated,
    // where uptake carries the size terms (see uptakeForSize).
    const colonies = grows ? (ng / 1000) * strain.eff * uptake * PLATED_FRACTION : 0;
    // Blue needs an intact lacZ-alpha AND a host that supplies the omega
    // fragment. Without alpha-complementation every colony is white.
    const blue = opts.xgal && strain.lacZdM15 && traits.lacZ;
    return { frag:f, ng, share, traits, colonies: Math.round(colonies),
             blue, grows, circular: !!f.circular };
  }).filter(r => r.colonies > 0);

  const total = rows.reduce((a, r) => a + r.colonies, 0);
  return { rows, total, strain, abx, xgal: !!opts.xgal,
           blue: rows.filter(r => r.blue).reduce((a,r) => a + r.colonies, 0),
           white: rows.filter(r => !r.blue).reduce((a,r) => a + r.colonies, 0) };
}

/* Pick one colony at random, weighted by how many of each there are. */
function pickColony(plate, want) {
  const pool = plate.rows.filter(r => want === 'any' || (want === 'blue') === !!r.blue);
  const n = pool.reduce((a, r) => a + r.colonies, 0);
  if (!n) return null;
  let x = Math.random() * n;
  for (const r of pool) { x -= r.colonies; if (x <= 0) return r; }
  return pool[pool.length - 1];
}

/* ============================================================
   NCBI import

   Three things make this practical rather than a toy:

     1. esearch finds records by free text, so you never hunt for
        an accession by hand.
     2. esummary reports each hit's LENGTH before you download it,
        which is what separates a 10 kb gene cluster from a 5 Mb
        genome. Picking by length is the whole game.
     3. efetch accepts seq_start and seq_stop, so a gene sitting
        inside a huge contig can be pulled out on its own, with
        whatever upstream promoter region you ask for. Nothing
        large is ever downloaded.

   Whether a browser is allowed to call NCBI directly is not
   documented, so this probes once and says plainly what happened.
   If the call is blocked, the same URL is offered to open by hand,
   which always works.
   ============================================================ */

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
const NCBI_TOOL = 'smart-turtle-dna';

function eutilsURL(prog, params) {
  const q = Object.assign({ tool: NCBI_TOOL }, params);
  return EUTILS + prog + '.fcgi?' +
    Object.keys(q).filter(k => q[k] !== undefined && q[k] !== '')
      .map(k => k + '=' + encodeURIComponent(q[k])).join('&');
}

async function ncbiGet(url) {
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error('NCBI returned ' + res.status + '.');
  return res.text();
}

/* Search, then ask for each hit's length and title in one call. */
async function ncbiSearch(term, retmax) {
  const ids = JSON.parse(await ncbiGet(eutilsURL('esearch', {
    db:'nuccore', term, retmax: retmax || 20, retmode:'json', sort:'relevance'
  })));
  const list = (ids.esearchresult && ids.esearchresult.idlist) || [];
  if (!list.length) return [];
  const sum = JSON.parse(await ncbiGet(eutilsURL('esummary', {
    db:'nuccore', id:list.join(','), retmode:'json'
  })));
  const r = sum.result || {};
  return (r.uids || []).map(u => ({
    uid: u,
    accession: r[u].accessionversion || r[u].caption || u,
    title: r[u].title || '',
    length: +(r[u].slen || 0),
    organism: r[u].organism || ''
  }));
}

/* Fetch a record, or just a slice of one. */
async function ncbiFetch(accession, opts) {
  const o = opts || {};
  const p = { db:'nuccore', id:accession, rettype: o.rettype || 'gb', retmode:'text' };
  if (o.start) p.seq_start = o.start;
  if (o.stop)  p.seq_stop  = o.stop;
  const text = await ncbiGet(eutilsURL('efetch', p));
  if (/^\s*$/.test(text)) throw new Error('NCBI returned an empty record for ' + accession + '.');
  if (/Failed to understand id/i.test(text))
    throw new Error('NCBI does not recognise "' + accession + '".');
  if (/^LOCUS/m.test(text) && !/^ORIGIN/m.test(text))
    throw new Error(accession + ' is a project placeholder with no sequence in it. ' +
      'Whole-genome-shotgun master records (accessions ending in zeros) list contigs rather than bases.');
  return text;
}

/* Find a named gene inside a fetched GenBank record and return its
   coordinates, optionally widened to take in an upstream promoter. */
function locateGene(gbText, name, upstream, downstream) {
  const want = String(name).toLowerCase();
  const feats = parseGenBankFeatures(gbText, Infinity);
  const hit = feats.find(f => (f.name || '').toLowerCase() === want) ||
              feats.find(f => (f.name || '').toLowerCase().includes(want));
  if (!hit) return null;
  const up = upstream === undefined ? 0 : +upstream;
  const down = downstream === undefined ? 0 : +downstream;
  // Upstream means 5' of the gene, which flips with strand.
  const start = hit.strand === -1 ? hit.start + 1 - down : hit.start + 1 - up;
  const stop  = hit.strand === -1 ? hit.end + up : hit.end + down;
  return { name: hit.name, start: Math.max(1, start), stop,
           strand: hit.strand, length: stop - start + 1 };
}

/* Span from the first to the last of a list of genes: a cluster.
   `upstream` is 5' of the cluster, the same meaning it has for a single gene. */
function locateCluster(gbText, names, upstream, downstream) {
  const found = names.map(n => locateGene(gbText, n, 0, 0)).filter(Boolean);
  if (!found.length) return null;
  const up = upstream === undefined ? 0 : +upstream;
  const down = downstream === undefined ? 0 : +downstream;
  const lo = Math.min(...found.map(f => f.start));
  const hi = Math.max(...found.map(f => f.stop));
  // 5' of a cluster is whichever end its first gene is transcribed from, so the
  // upstream region belongs on one side only. nifHDK in X13303 sits on the minus
  // strand, which puts its promoter at the HIGH-coordinate end: padding both
  // ends equally therefore misses the promoter's side of the question and drags
  // a slice of the neighbouring gene in at the other end. A list whose genes do
  // not share a strand has no single 5' end, so that case still pads both ways.
  const strands = [...new Set(found.map(f => f.strand))];
  const dir = strands.length === 1 ? strands[0] : 0;
  const start = dir === -1 ? lo - down : dir === 1 ? lo - up : lo - Math.max(up, down);
  const stop  = dir === -1 ? hi + up   : dir === 1 ? hi + down : hi + Math.max(up, down);
  return { genes: found.map(f => f.name), strand: dir,
           start: Math.max(1, start), stop, length: stop - Math.max(1, start) + 1,
           missing: names.filter(n => !found.some(f => f.name.toLowerCase().includes(String(n).toLowerCase()))) };
}

/* ============================================================
   Protocol runner

   A protocol is a short list of instructions, written the way you
   would say them out loud. Each line does one thing and names what
   it made, so the next line can refer to it. Run the protocol and
   read the result off the gel.
   ============================================================ */

/* ---- the language ----
   One instruction per line. "#" starts a comment. Whatever follows
   "as" is the name of the tube that line produced.

     import puc19 as vector
     digest vector with EcoRI, HindIII as cut
     pcr vector with GTAAAACGACGGCCAGT, CAGGAAACAGCTATGAC as amplicon
     cut vector with GGCGTAATCATGGTCATAGC as edited     # a 20-mer means CRISPR
     ligate cut as product
     ligate backbone with insert as product
     transform product on ampicillin as plate
     pick white from plate as clone
     run cut, amplicon on gel

   Extra settings are plain words dropped anywhere on the line:
   "with cip", "partial", "3:1", "2%", "100V", "30min", "10ng".
*/

const VERBS = {
  import:'load', load:'load', use:'load',
  digest:'digest', cut:'digest',          // "cut X with <20-mer>" means CRISPR
  pcr:'pcr', amplify:'pcr',
  ligate:'ligate', join:'ligate',
  transform:'transform', plate:'transform',
  pick:'pick',
  run:'gel', gel:'gel'
};
const ANTIBIOTIC_WORDS = {
  ampicillin:'amp', amp:'amp', carbenicillin:'amp',
  kanamycin:'kan', kan:'kan',
  chloramphenicol:'cm', cam:'cm', cm:'cm',
  none:'none', nothing:'none'
};

/* Plain-word settings, recognised wherever they appear on a line. */
/* Returns true when the word WAS a setting, so a caller reading a list of
   names can drop it instead of mistaking it for one. */
function applyOption(step, word) {
  const w = String(word).trim().toLowerCase();
  if (!w) return true;
  if (/^(cip|dephosphorylated|dephos)$/.test(w)) { step.cip = true; return true; }
  if (/^partial(?:ly)?$/.test(w)) { step.partial = true; return true; }
  if (/^(\d+(?:\.\d+)?):1$/.test(w)) { step.ratio = parseFloat(w); return true; }
  if (/^(\d+(?:\.\d+)?)\s*%$/.test(w)) { step.agarose = parseFloat(w); return true; }
  if (/^(\d+)\s*ng$/.test(w)) { step.ng = parseFloat(w); return true; }
  if (/^(\d+)\s*v$/.test(w)) { step.volts = parseFloat(w); return true; }
  if (/^(\d+)\s*min/.test(w)) { step.minutes = parseFloat(w); return true; }
  if (ANTIBIOTIC_WORDS[w]) { step.antibiotic = ANTIBIOTIC_WORDS[w]; return true; }
  if (STRAINS[w]) { step.strain = w; return true; }
  if (/^(xgal|x-gal)$/.test(w)) { step.xgal = true; return true; }
  return false;
}
/* Pull the settings out of a comma-separated list and return what is left.
   Settings are documented as plain words that may sit anywhere on the line, so
   "EcoRI, HindIII partial" has to yield two enzyme names and partial:true
   rather than an enzyme called "HindIII partial". Items are therefore split on
   whitespace as well as commas, and every token a setting claims is removed. */
function splitOptions(step, items) {
  const kept = [];
  items.forEach(item => String(item).split(/\s+/).forEach(tok => {
    if (tok && !applyOption(step, tok)) kept.push(tok);
  }));
  return kept;
}

function parseProtocolText(text) {
  const steps = [];
  const listOf = v => String(v).split(/\s*,\s*|\s+and\s+/).map(x => x.trim()).filter(Boolean);

  text.split('\n').forEach((raw, i) => {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) return;
    const ln = i + 1;

    let body = line, as = null;
    const asM = body.match(/\s+as\s+([A-Za-z0-9_.-]+)\s*$/i);
    if (asM) { as = asM[1]; body = body.slice(0, asM.index); }

    const words = body.trim().split(/\s+/);
    const verb = (words.shift() || '').toLowerCase();
    if (!VERBS[verb]) throw new Error('Line ' + ln + ': I do not know how to "' + verb +
      '". Try: ' + [...new Set(Object.keys(VERBS))].slice(0,8).join(', ') + '.');
    const step = { step: VERBS[verb], as, _line: ln, _src: line };
    let rest = words.join(' ');

    const grab = kw => {
      const m = rest.match(new RegExp('(?:^|\\s)' + kw + '\\s+(.*)$', 'i'));
      if (!m) return null;
      rest = rest.slice(0, m.index).trim();
      return m[1].trim();
    };

    if (step.step === 'load') {
      const up = rest.match(/\s+upstream\s+(\d+)/i);
      if (up) { step.upstream = +up[1]; rest = rest.replace(up[0], ''); }
      const gm = rest.match(/(?:^|\s)(?:genes?|only)\s+(.*)$/i);
      if (gm) { step.genes = listOf(gm[1]); rest = rest.slice(0, gm.index).trim(); }
      step.what = rest.trim().replace(/^["']|["']$/g, '');
      if (!step.what) throw new Error('Line ' + ln + ': import what? Try "import puc19 as vector".');

    } else if (step.step === 'digest') {
      const withPart = grab('with');
      step.from = rest.trim();
      if (!step.from) throw new Error('Line ' + ln + ': ' + verb + ' which tube?');
      if (!withPart) throw new Error('Line ' + ln + ': "' + verb + ' ' + step.from +
        ' with ..." needs enzyme names, or a 20-base guide for CRISPR.');
      const items = splitOptions(step, listOf(withPart));
      const guide = items.find(x => /^[ACGTacgt]{20}$/.test(x));
      if (guide) { step.step = 'crispr'; step.guide = guide; }
      else {
        step.enzymes = items;
        if (!step.enzymes.length) throw new Error('Line ' + ln + ': "' + verb + ' ' + step.from +
          ' with ..." needs at least one enzyme name, or a 20-base guide for CRISPR.');
      }

    } else if (step.step === 'pcr') {
      const withPart = grab('with');
      step.from = rest.trim();
      if (!step.from) throw new Error('Line ' + ln + ': PCR from which tube?');
      if (!withPart) throw new Error('Line ' + ln + ': PCR needs two primers, "with FORWARD, REVERSE".');
      const pr = listOf(withPart);
      if (pr.length < 2) throw new Error('Line ' + ln + ': PCR needs two primers separated by a comma.');
      step.fwd = pr[0]; step.rev = pr[1];

    } else if (step.step === 'ligate') {
      const withPart = grab('with');
      step.backbone = rest.trim();
      if (!step.backbone) throw new Error('Line ' + ln + ': ligate which tube?');
      if (withPart) {
        // Whatever is left once the settings are taken out is the insert tube,
        // so "with cip" on its own is a self-ligation and names no insert.
        const parts = splitOptions(step, listOf(withPart));
        if (parts.length) step.insert = parts[0];
      }

    } else if (step.step === 'transform') {
      const onPart = grab('on') || grab('into');
      step.from = rest.trim();
      if (!step.from) throw new Error('Line ' + ln + ': transform which tube?');
      if (onPart) splitOptions(step, listOf(onPart));

    } else if (step.step === 'pick') {
      const fromPart = grab('from');
      step.colour = (rest.trim() || 'any').toLowerCase().replace(/\bcolou?r\b/, '').trim() || 'any';
      step.from = fromPart;
      if (!step.from) throw new Error('Line ' + ln + ': pick from which plate?');

    } else if (step.step === 'gel') {
      // Strip "on a gel" and any settings first, so only lane names are left.
      rest = rest.replace(/\bon\s+(?:a\s+)?gel\b/i, ' ')
                 .replace(/\d+(?:\.\d+)?\s*%/g, ' ')
                 .replace(/\d+\s*(?:v|volts?)\b/ig, ' ')
                 .replace(/\d+\s*(?:min|minutes?)\b/ig, ' ')
                 .replace(/\bfor\b|\bat\b/ig, ' ')
                 .trim();
      step.lanes = listOf(rest.replace(/\s+/g, ' '));
    }

    // Settings are plain words and may sit anywhere, so scan the whole line.
    // "partial" must be the whole word: a tube called partial_check is a lane
    // name, not a setting. Underscore is a word character, so the \b after
    // "partial" does not match inside "partial_check", which is the point.
    (line.match(/(?:\d+(?:\.\d+)?\s*%|\d+(?:\.\d+)?:1|\d+\s*ng\b|\d+\s*[vV]\b|\d+\s*min\w*\b|\bcip\b|\bdephosphorylated\b|\bpartial(?:ly)?\b)/gi) || [])
      .forEach(o => applyOption(step, o));

    steps.push(step);
  });
  if (!steps.length) throw new Error('That protocol has no instructions.');
  return { steps };
}

function parseProtocol(text) {
  const t = text.trim();
  if (t.startsWith('{') || t.startsWith('[')) {
    const j = JSON.parse(t);
    const p = Array.isArray(j) ? { steps: j } : j;
    if (!Array.isArray(p.steps)) throw new Error('Protocol JSON needs a "steps" array.');
    return p;
  }
  return parseProtocolText(t);
}

/* ---- executor ----
   Runs against the real engine, not a parallel implementation, so a
   protocol exercises exactly the code the interactive tool uses. */
async function runProtocol(proto) {
  const tubes = {};                 // name -> sample object
  const report = [];
  let failed = 0;

  const need = (step, key) => {
    const v = step[key];
    if (v === undefined || v === '') throw new Error('"' + step.step + '" needs ' + key + '.');
    return v;
  };
  const tube = (step, key) => {
    const n = need(step, key);
    if (!tubes[n]) throw new Error('No tube named "' + n + '". Earlier steps made: ' +
      (Object.keys(tubes).join(', ') || 'nothing') + '.');
    return tubes[n];
  };
  const asList = v => Array.isArray(v) ? v : String(v).split(',').map(x => x.trim());
  const molsOf = s => s.kind === 'intact'
    ? [{ name:s.name, seq:s.seq, topology:s.topology }]
    : mainFrags(s).map(f => ({ name:fmtBp(f.len), seq:f.seq,
        topology: f.circular ? 'circular' : 'linear', l:f.l, r:f.r }));

  for (let i = 0; i < proto.steps.length; i++) {
    const step = proto.steps[i];
    const rec = { n: i + 1, step: step.step, as: step.as || null,
                  line: step._line, src: step._src || '' };
    try {
      if (step.step === 'load') {
        let s;
        const what = step.what || step.preset || step.seq || '';
        const pre = PRESETS.find(p => p.key === String(what).toLowerCase() ||
                                      p.name.toLowerCase() === String(what).toLowerCase());
        if (pre) {
          s = { kind:'intact', name: step.as || pre.name, seq: pre.seq, topology: pre.topology };
        } else if (/^[A-Z]{1,4}_?\d{5,8}(\.\d+)?$/i.test(String(what).trim())) {
          // Looks like an NCBI accession, so fetch it. If genes were named,
          // fetch only that slice rather than the whole record.
          const acc = String(what).trim();
          let text = await ncbiFetch(acc, { rettype:'gb' });
          if (step.genes && step.genes.length) {
            const loc = step.genes.length > 1
              ? locateCluster(text, step.genes, step.upstream || 0)
              : locateGene(text, step.genes[0], step.upstream || 0, 0);
            if (!loc) throw new Error('Could not find ' + step.genes.join(', ') + ' in ' + acc +
              '. It lists: ' + (parseGenBankFeatures(text, Infinity).map(f=>f.name).slice(0,12).join(', ') || 'no features') + '.');
            text = await ncbiFetch(acc, { rettype:'gb', start: loc.start, stop: loc.stop });
            rec.slice = (loc.genes ? loc.genes.join('+') : loc.name) + ' ' +
                        loc.start.toLocaleString() + '-' + loc.stop.toLocaleString();
          }
          const parsed = parseSequence(text, acc);
          // Carry the flatfile through: the record's own FEATURES table names
          // the genes, which no amount of ORF finding can recover.
          s = { kind:'intact', name: step.as || acc, seq: parsed.seq,
                topology: parsed.topology, gbText: parsed.gbText, desc: parsed.desc };
        } else {
          // Letters like N, S and M are legal IUPAC codes, so a typo such as
          // "nonsenseplasmid" would otherwise survive cleaning and be taken
          // for a sequence. Require something that actually looks like DNA.
          const raw = String(what).replace(/\s+/g, '');
          const acgt = (raw.match(/[ACGTacgt]/g) || []).length;
          const looksLikeDNA = raw.length >= 12 && acgt / raw.length > 0.9;
          const seq = looksLikeDNA ? clean(raw) : '';
          if (!seq) throw new Error('I do not know "' + what + '". Try one of: ' +
            PRESETS.map(p => p.key).join(', ') + ' \u2014 or paste a DNA sequence.');
          s = { kind:'intact', name: step.as || 'construct', seq,
                topology: step.topology === 'circular' ? 'circular' : 'linear' };
        }
        s.feats = annotate(s);
        tubes[step.as || s.name] = s;
        rec.result = s.seq.length.toLocaleString() + ' bp ' + s.topology +
                     (rec.slice ? '   [' + rec.slice + ']' : '');
        // Whether the features below are the submitter's or our own guesses
        // changes what they are worth, so the log says which. An old record
        // may carry nothing but a source line, and then every gene shown is
        // predicted from reading frames alone and none of them has a name.
        if (s.desc) rec.about = s.desc;
        if (s.gbText) {
          const census = {};
          featureKeys(s.gbText).forEach(k => census[k] = (census[k] || 0) + 1);
          const keys = Object.keys(census);
          rec.annot = keys.length
            ? 'record lists ' + keys.map(k => census[k] + ' ' + k).join(', ')
            : 'record has no feature table, so every gene below is predicted ' +
              'from open reading frames and is unnamed';
        }

      } else if (step.step === 'digest') {
        const src = tube(step, 'from');
        const enz = asList(need(step, 'enzymes'));
        enz.forEach(e => { if (!ENZYMES[e]) throw new Error('Unknown enzyme "' + e + '".'); });
        let frags = [], cuts = 0;
        molsOf(src).forEach(m => {
          const r = digest(m, enz, step.partial === 'true' || step.partial === true);
          if (r.frags) { frags = frags.concat(r.frags); cuts += r.cuts.length; }
          else frags.push({ seq:m.seq, len:m.seq.length, l:m.l||BLUNT_END('end'),
                            r:m.r||BLUNT_END('end'), circular:m.topology==='circular',
                            note:'uncut (no site)' });
        });
        if (!cuts) throw new Error('None of ' + enz.join(', ') + ' cut "' + step.from + '".');
        const s = { kind:'fragments', name: step.as || (src.name+'/'+enz.join('+')), frags };
        tubes[step.as || s.name] = s;
        const main = mainFrags(s);
        rec.result = main.length + (main.length === 1 ? ' fragment: ' : ' fragments: ') +
          main.map(f => f.len).sort((a,b)=>b-a).join(', ') + ' bp' +
          (main.length === 1 && !main[0].circular && cuts === 1 &&
           molsOf(src).some(m => m.topology === 'circular')
            ? '   (one cut in a circle gives one linear band, not two)' : '');

      } else if (step.step === 'pcr') {
        const src = tube(step, 'from');
        const f = clean(need(step,'fwd')), r = clean(need(step,'rev'));
        let products = [];
        molsOf(src).forEach(m => { products = products.concat(pcr(m, f, r).products); });
        if (!products.length) throw new Error('No amplicon from these primers on "' + step.from + '".');
        const s = { kind:'fragments', name: step.as || 'pcr', frags: products };
        tubes[step.as || s.name] = s;
        rec.result = products.length + ' product(s): ' + products.map(p=>p.len).join(', ') + ' bp';

      } else if (step.step === 'crispr') {
        const src = tube(step, 'from');
        const g = clean(need(step,'guide'));
        if (g.length !== 20) throw new Error('Guide must be 20 nt, got ' + g.length + '.');
        let frags = [], on = 0;
        molsOf(src).forEach(m => {
          const r = crispr(m, g, step.nuclease || 'spcas9');
          on += r.onTarget.length;
          frags = frags.concat(r.cuts.length ? fragmentsFromCuts(m, r.cuts)
                                             : [{ seq:m.seq, len:m.seq.length, l:BLUNT_END('end'),
                                                  r:BLUNT_END('end'), note:'uncut' }]);
        });
        if (!on) throw new Error('Guide has no on-target site with a PAM in "' + step.from + '".');
        const s = { kind:'fragments', name: step.as || 'crispr', frags };
        tubes[step.as || s.name] = s;
        rec.result = on + ' cut(s): ' + mainFrags(s).map(f=>f.len).sort((a,b)=>b-a).join(', ') + ' bp';

      } else if (step.step === 'ligate') {
        const A0 = tube(step, 'backbone');
        const conc = step.conc !== undefined ? +step.conc : 2.5;
        const cip = step.cip === 'true' || step.cip === true;
        // A tube may hold digest fragments or a whole molecule imported
        // straight from a file or NCBI. Both are ligatable; an intact linear
        // molecule simply has blunt ends unless a digest gave it others.
        const mk = (s, ng, dephos) => {
          const fr = s.kind === 'intact'
            ? [{ len:s.seq.length, seq:s.seq,
                 l: s.l || BLUNT_END('end'), r: s.r || BLUNT_END('end'),
                 circular: s.topology === 'circular' }]
            : mainFrags(s);
          const usable = fr.filter(f => !f.circular);
          if (!usable.length) throw new Error('"' + s.name + '" has nothing with free ends to ligate. ' +
            'A circular molecule has to be cut open first.');
          const tot = usable.reduce((a,f)=>a+f.len,0) || 1;
          return usable.map(f => ({ name:fmtBp(f.len), len:f.len, seq:f.seq,
            l: dephos ? Object.assign({},f.l,{noP:true}) : f.l,
            r: dephos ? Object.assign({},f.r,{noP:true}) : f.r,
            ngPerUL: ng * f.len / tot, tube:s.name }));
        };
        const A = mk(A0, conc, cip);
        let B = [];
        if (step.insert) {
          const B0 = tube(step, 'insert');
          const ratio = step.ratio !== undefined ? +step.ratio : 3;
          B = mk(B0, 1, false);
          const rA = refSpecies(A), rB = refSpecies(B);
          const k = (ratio * molarity(rA.ngPerUL, rA.len)) / molarity(rB.ngPerUL, rB.len);
          B.forEach(x => x.ngPerUL *= k);
        }
        const prods = ligationProducts(A.concat(B));
        const total = prods.reduce((a,p)=>a+p.amount,0) || 1;
        const frags = prods.map(p => {
          const seq = p.parts.map(x=>x.seq).join('');
          const circ = p.kind === 'circle';
          return { seq, len:seq.length, circular:circ,
                   l: circ ? BLUNT_END('ligated') : p.parts[0].l,
                   r: circ ? BLUNT_END('ligated') : p.parts[p.parts.length-1].r,
                   note: p.kind==='unligated' ? 'unligated '+p.parts[0].name
                       : circ ? (p.parts.length===1 ? 'self-circle' : 'circle: '+p.parts.map(x=>x.name).join(' + ')+(p.dir==='reverse'?', reversed':''))
                       : 'linear dimer: '+p.parts.map(x=>x.name).join(' + '),
                   abund: p.amount/total };
        });
        const s = { kind:'fragments', name: step.as || 'ligation', frags, ligation:true };
        tubes[step.as || s.name] = s;
        const circles = frags.filter(f => f.circular);
        rec.result = frags.length + ' products, top: ' + frags[0].note + ' (' + (100*frags[0].abund).toFixed(1) + '%)';

      } else if (step.step === 'transform') {
        const src = tube(step, 'from');
        const sample = src.kind === 'intact'
          ? { name:src.name, frags:[{ seq:src.seq, len:src.seq.length,
              circular: src.topology==='circular', abund:1, note:src.name }], ligation:false }
          : src;
        const plate = transform(sample, {
          strain: step.strain || 'dh5a_chem',
          antibiotic: step.antibiotic || 'amp',
          xgal: step.xgal === undefined ? true : (step.xgal === 'true' || step.xgal === true),
          relaxed: !!sample.ligation,
          ng: step.ng !== undefined ? +step.ng : 5
        });
        tubes[step.as || 'plate'] = Object.assign({ kind:'plate' }, plate, { name: step.as || 'plate' });
        rec.plate = tubes[step.as || 'plate'];       // so the plate can be drawn
        rec.result = plate.total.toLocaleString() + ' colonies' +
          (plate.xgal && plate.total ? ' (' + plate.blue.toLocaleString() + ' blue, ' +
            plate.white.toLocaleString() + ' white)' : '');

      } else if (step.step === 'pick') {
        const p = tube(step, 'from');
        if (p.kind !== 'plate') throw new Error('"pick" needs a plate, but "' + step.from + '" is not one.');
        const want = step.colour || step.color || 'any';
        const r = pickColony(p, want);
        if (!r) throw new Error('No ' + want + ' colonies on "' + step.from + '" to pick.');
        const s = { kind:'intact', name: step.as || 'colony', seq: r.frag.seq, topology:'circular' };
        s.feats = annotate(s);
        tubes[step.as || s.name] = s;
        rec.result = want + ' colony, ' + s.seq.length.toLocaleString() + ' bp: ' + r.frag.note;

      } else if (step.step === 'gel') {
        const lanes = asList(step.lanes && step.lanes.length ? step.lanes : Object.keys(tubes).join(','));
        const run = { volts:+(step.volts||100), gapCm:18, gelCm:10,
                      pct:+(step.agarose||1), minutes:+(step.minutes||60), loadCm:0.12 };
        // Hand these back so the displayed gel matches what the protocol asked
        // for, instead of whatever the gel controls happened to be set to.
        rec.gelRun = run;
        rec.gelLanes = lanes.filter(n => tubes[n] && tubes[n].kind !== 'plate');
        const out = [];
        lanes.forEach(n => {
          const s = tubes[n];
          if (!s || s.kind === 'plate') return;
          molsOf(s).forEach(m => {
            const form = m.topology === 'circular' ? 'sc' : 'lin';
            const mig = migrate(m.seq.length, form, run);
            out.push({ lane:n, bp:m.seq.length, form, cm:+mig.d.toFixed(2), off:mig.off });
          });
        });
        rec.result = out.map(b => b.lane + ': ' + b.bp + ' bp at ' + b.cm + ' cm' + (b.off?' (off gel)':'')).join('; ');
        rec.bands = out;

      } else {
        throw new Error('Unknown step "' + step.step + '".');
      }

      rec.ok = true;
    } catch (err) {
      rec.ok = false; rec.error = err.message; failed++;
    }
    report.push(rec);
  }

  return { report, tubes, failed, passed: report.every(r => r.ok) };
}

/* ============================================================
   Sample vials
   One vial per sample, filled with that sample's colour, used
   anywhere a sample needs identifying: the bench, the gel lanes,
   the legend and the pickers. Geometry is the hand-drawn vial;
   only the liquid fill changes.
   The clip path is load-bearing: without it the body outline
   runs past the cap and leaves stray diagonals.
   ============================================================ */
const VIAL = {
  box: '90.418 76.971322 5.7210331 12.901598',
  w: 5.7210331, h: 12.901598,
  liquid: 'm 90.678186,80.145496 v 1.882055 l 2.600358,7.711674 2.611727,-7.745263 h 0.01602 v -0.04754 l 0.0041,-0.0124 -0.0041,-0.0124 v -1.776119 z',
  body:   'm 93.23337,74.128809 -1.335835,3.960998 h -1.281576 v 3.801318 l -0.01447,0.04289 0.01447,0.04289 v 0.01705 h 0.0057 l 2.611727,7.745263 2.611727,-7.745263 h 0.01602 v -0.04754 l 0.0041,-0.0124 -0.0041,-0.0124 v -3.831808 h -1.291911 z'
};
let vialUid = 0;
const VIAL_RATIO = VIAL.w / VIAL.h;

/* Inner markup, minus the <svg> wrapper, so it can be nested with a transform. */
function vialInner(color, uid) {
  return `<defs><clipPath id="vc${uid}" clipPathUnits="userSpaceOnUse">` +
    `<rect width="6.8875871" height="12.585952" x="89.984596" y="78.067589"/></clipPath></defs>` +
    `<path fill="${color}" stroke="#020202" stroke-width="0.0854378" stroke-linecap="square" d="${VIAL.liquid}"/>` +
    `<rect fill="none" stroke="#020202" stroke-width="0.105833" stroke-linecap="square" width="5.6152" height="1.0614097" x="90.470917" y="77.024239"/>` +
    `<rect fill="none" stroke="#020202" stroke-width="0.125029" stroke-linecap="square" width="1.3710675" height="0.08119835" x="90.69632" y="79.444832"/>` +
    `<rect fill="none" stroke="#020202" stroke-width="0.125029" stroke-linecap="square" width="1.3710675" height="0.08119835" x="90.69632" y="81.018387"/>` +
    `<path clip-path="url(#vc${uid})" fill="none" stroke="#020202" stroke-width="0.086" stroke-linecap="square" d="${VIAL.body}" transform="translate(0.03929109,-0.03332695)"/>`;
}
function vialSVG(color, h = 22, cls = 'vial') {
  const uid = ++vialUid;
  return `<svg class="${cls}" viewBox="${VIAL.box}" width="${(h*VIAL_RATIO).toFixed(1)}" height="${h}" ` +
         `xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${vialInner(color, uid)}</svg>`;
}

/* Rasterised copies for the canvas gel, one per colour. */
const VIAL_IMG = {};
function vialImage(color, onReady) {
  if (VIAL_IMG[color]) return VIAL_IMG[color];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIAL.box}" width="${VIAL.w*20}" height="${VIAL.h*20}">${vialInner(color, ++vialUid)}</svg>`;
  const img = new Image();
  img.onload = () => { img._ready = true; if (onReady) onReady(); };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  VIAL_IMG[color] = img;
  return img;
}

/* ---------- gel model ----------
   Migration is log-linear in fragment size over the resolving range of
   the chosen agarose percentage. Conformation changes apparent size:
   supercoiled plasmid runs ahead of linear, open-circular runs behind. */
const FORM = { sc:{label:'supercoiled'}, lin:{label:'linear'} };
const LADDERS = {
  '1kb':  { name:'1 kb ladder',  bands:[10000,8000,6000,5000,4000,3000,2000,1500,1000,500], bright:[3000,1000] },
  '100bp':{ name:'100 bp ladder',bands:[1500,1000,900,800,700,600,500,400,300,200,100],      bright:[500] }
};

/* White gel: the inverted look of a scanned gel in a paper figure, with
   dark bands on a pale background. Flip these six values to go back to a
   dark transilluminator look. */
const GEL_THEME = {
  bg:        '#ffffff',
  wellFill:  '#e4ebea',
  wellEdge:  '#9fb2b0',
  ladderInk: '42,56,58',
  ladderTxt: '#5c6b6d',
  bandTxt:   'rgba(32,44,46,.78)',
  footTxt:   '#8a9a9b'
};

/* Run conditions. These are what the physics model consumes. */
const RUN = { volts:100, gapCm:20, gelCm:10, pct:1, minutes:60, loadCm:0.12 };

/* Turn a bench sample into gel bands. */
function bandsFor(sample) {
  const out = [];
  if (sample.kind === 'intact') {
    if (sample.topology === 'circular') {
      // Supercoiled only. A real prep also carries nicked open-circular DNA,
      // but its mobility has no predictive model (see engine physics note),
      // so it is not drawn rather than guessed at.
      out.push({ bp:sample.seq.length, form:'sc', mass:sample.ng, note:'supercoiled' });
    } else {
      out.push({ bp:sample.seq.length, form:'lin', mass:sample.ng, note:'linear' });
    }
    return out;
  }
  const tot = sample.frags.reduce((s,f) => s + f.len*(f.abund===undefined?1:f.abund), 0) || 1;
  sample.frags.forEach(f => {
    // A relaxed circle from a ligation has no predictive mobility model, so
    // it is reported in the log rather than placed on the gel.
    if (f.circular) { out.push({ circularOnly:true }); return; }
    const a = f.abund === undefined ? 1 : f.abund;
    // An uncut molecule carried through a reaction keeps its conformation.
    out.push({ bp:f.len, form:f.form || 'lin', mass:sample.ng * f.len * a / tot, note:f.note });
  });
  return out;
}

/* Co-migrating bands stack: merge anything within 2% in size. */
function mergeBands(bands) {
  const sorted = bands.filter(b => !b.circularOnly).sort((a,b) => b.bp - a.bp), out = [];
  const nCirc = bands.filter(b => b.circularOnly).length;
  if (nCirc) out.circular = nCirc;
  sorted.forEach(b => {
    const prev = out[out.length-1];
    if (prev && prev.form === b.form && Math.abs(prev.bp - b.bp) / prev.bp < 0.02) {
      prev.mass += b.mass; prev.n = (prev.n||1) + 1;
    } else out.push(Object.assign({}, b));
  });
  return out;
}

/* ---------- a tiny canvas-compatible SVG recorder (for Save SVG) ---------- */
function recorder() {
  let o=[],path=[],W,H,stack=[];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const fs = () => parseFloat((c.font.match(/(\d+(\.\d+)?)px/)||[0,12])[1]);
  const bold = () => /^(700|bold)/.test(c.font);
  const al = () => c.globalAlpha < 1 ? ` opacity="${c.globalAlpha.toFixed(3)}"` : '';
  const c = {
    fillStyle:'#000', strokeStyle:'#000', lineWidth:1, font:'12px Arial',
    textAlign:'start', globalAlpha:1,
    init(w,h){W=w;H=h;o=[];return c}, setTransform(){}, setLineDash(){},
    save(){stack.push([c.fillStyle,c.strokeStyle,c.lineWidth,c.font,c.textAlign,c.globalAlpha])},
    restore(){const s=stack.pop();if(s)[c.fillStyle,c.strokeStyle,c.lineWidth,c.font,c.textAlign,c.globalAlpha]=s},
    beginPath(){path=[]}, moveTo(x,y){path.push(`M${x.toFixed(1)} ${y.toFixed(1)}`)},
    lineTo(x,y){path.push(`L${x.toFixed(1)} ${y.toFixed(1)}`)},
    stroke(){o.push(`<path d="${path.join('')}" fill="none" stroke="${c.strokeStyle}" stroke-width="${c.lineWidth}"${al()}/>`)},
    fillRect(x,y,w,h){o.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(0,w).toFixed(1)}" height="${Math.max(0,h).toFixed(1)}" fill="${c.fillStyle}"${al()}/>`)},
    strokeRect(x,y,w,h){o.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(0,w).toFixed(1)}" height="${Math.max(0,h).toFixed(1)}" fill="none" stroke="${c.strokeStyle}" stroke-width="${c.lineWidth}"${al()}/>`)},
    measureText(t){return {width:String(t).length*fs()*(bold()?.62:.56)}},
    vial(color,x,y,w,h){const k=h/12.901598;
      o.push(`<g transform="translate(${(x-90.418*k).toFixed(2)} ${(y-76.971322*k).toFixed(2)}) scale(${k.toFixed(4)})">${vialInner(color,++vialUid)}</g>`)},
    fillText(t,x,y){const a={left:'start',start:'start',center:'middle',right:'end',end:'end'}[c.textAlign]||'start';
      o.push(`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" fill="${c.fillStyle}" font-family="Arial,sans-serif" font-size="${fs()}" text-anchor="${a}"${bold()?' font-weight="700"':''}${al()}>${esc(t)}</text>`)},
    svg(){return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${o.join('')}</svg>`}
  };
  return c;
}

/* ---------- draw the gel ---------- */
function drawGel(rec) {
  const cv = $('gel'), r = cv.getBoundingClientRect();
  const w = Math.max(340, r.width|0), h = Math.max(300, r.height|0);
  const d = Math.min(devicePixelRatio||1, 2);
  const c = rec ? rec.init(w,h) : cv.getContext('2d');
  if (!rec) { cv.width = w*d; cv.height = h*d; c.setTransform(d,0,0,d,0,0); }
  const T = GEL_THEME;

  const run = RUN, pct = run.pct;
  const E = run.volts / Math.max(0.5, run.gapCm);
  const lanes = [];
  const ladKey = $('ladder').value;
  if (ladKey !== 'none') {
    const L = LADDERS[ladKey];
    lanes.push({ name:L.name, ladder:true, color:'#cfd8d4',
                 bands: L.bands.map(bp => ({ bp, form:'lin',
                   mass: L.bright.indexOf(bp) >= 0 ? 90 : 38, note:'' })) });
  }
  SAMPLES.filter(s => s.on).forEach(s =>
    lanes.push({ name:s.name, color:s.color, bands: mergeBands(bandsFor(s)) }));

  c.fillStyle = T.bg; c.fillRect(0,0,w,h);
  if (!lanes.length) return;

  const m = { l:40, r:14, t:78, b:30 };
  const gw = w - m.l - m.r, gh = h - m.t - m.b;
  const lw = gw / lanes.length;
  const wellY = m.t, runH = gh - 12;
  const yOf = cm => wellY + (cm / run.gelCm) * runH;   // cm of gel -> pixels

  // distance scale down the left edge
  c.font = '9px Arial'; c.textAlign = 'right';
  const stepCm = run.gelCm > 14 ? 5 : run.gelCm > 6 ? 2 : 1;
  for (let cm = 0; cm <= run.gelCm + 1e-9; cm += stepCm) {
    const y = yOf(cm);
    c.strokeStyle = '#eef3f3'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(m.l - 6, y); c.lineTo(w - m.r, y); c.stroke();
    c.fillStyle = '#b9c6c6';
    c.fillText(cm + (cm === 0 ? ' cm' : ''), m.l - 9, y + 3);
  }

  // lane header: the sample's vial, its name, then the well
  c.font = '700 11px Arial'; c.textAlign = 'center';
  lanes.forEach((ln, i) => {
    const cx = m.l + lw*(i+0.5);
    if (!ln.ladder) {
      const vh = 30, vw = vh * (5.7210331/12.901598);
      if (c.vial) c.vial(ln.color, cx - vw/2, m.t - 74, vw, vh);
      else {
        const img = vialImage(ln.color, () => drawGel());
        if (img._ready) c.drawImage(img, cx - vw/2, m.t - 74, vw, vh);
      }
    }
    c.fillStyle = ln.ladder ? T.ladderTxt : ln.color;
    let nm = ln.name;
    const maxc = Math.max(6, Math.floor(lw/6.2));
    if (nm.length > maxc) nm = nm.slice(0, maxc-1) + '\u2026';
    c.fillText(nm, cx, m.t - 24);
    c.fillStyle = T.wellFill;
    c.fillRect(cx - lw*0.33, wellY - 9, lw*0.66, 7);
    c.strokeStyle = T.wellEdge; c.lineWidth = 1;
    c.strokeRect(cx - lw*0.33, wellY - 9, lw*0.66, 7);
  });

  // dye front
  const dye = dyeFront(run);
  if (dye > 0 && dye < run.gelCm) {
    const y = yOf(dye);
    c.strokeStyle = '#6c7fd6'; c.lineWidth = 1; c.setLineDash([5,4]);
    c.beginPath(); c.moveTo(m.l, y); c.lineTo(w - m.r, y); c.stroke();
    c.setLineDash([]);
    c.font = '9px Arial'; c.textAlign = 'left'; c.fillStyle = '#6c7fd6';
    c.fillText('dye front', m.l + 3, y - 3);
  }

  // bands, placed by d = mu * E * t
  const maxMass = Math.max(10, ...lanes.flatMap(l => l.bands.map(b => b.mass)));
  const offLanes = [];
  lanes.forEach((ln, i) => {
    const cx = m.l + lw*(i+0.5), bw = lw*0.66;
    ln.bands.forEach(b => {
      const mig = migrate(b.bp, b.form, run);
      b._mig = mig;
      if (mig.off) { offLanes.push(i); return; }       // ran off the end
      const y = yOf(mig.d);
      const rel = Math.min(1, b.mass / maxMass);
      // A band that has diffused wider is also fainter: same mass, more area.
      const spread = Math.min(3.2, mig.sigma / (run.loadCm || 0.12));
      const alpha = (0.22 + 0.78 * Math.pow(rel, 0.45)) / spread;
      const th = (2.4 + 2.6 * Math.pow(rel, 0.5)) * spread;
      const col = ln.ladder ? T.ladderInk : hexToRgb(ln.color);
      for (let k = 2; k >= 0; k--) {
        c.fillStyle = `rgb(${col})`;
        c.globalAlpha = Math.min(1, alpha * [1, 0.34, 0.14][k]);
        const t = th * [1, 1.9, 3.0][k];
        c.fillRect(cx - bw/2, y - t/2, bw, t);
      }
      c.globalAlpha = 1;
    });
    if (ln.bands.circular) {
      c.font = '9px Arial'; c.textAlign = 'center'; c.fillStyle = '#8a9a9b';
      c.fillText('+' + ln.bands.circular + ' circular', cx, h - m.b + 16);
    }
    if (offLanes.indexOf(i) >= 0) {
      c.font = '9px Arial'; c.textAlign = 'center'; c.fillStyle = '#b5604f';
      c.fillText('\u2193 off gel', cx, h - m.b + 16);
    }
  });

  // band size labels
  if ($('showSizes').checked) {
    c.font = '10px Arial';
    lanes.forEach((ln, i) => {
      const cx = m.l + lw*(i+0.5), bw = lw*0.66;
      const placed = [];
      ln.bands.forEach(b => {
        if (!b._mig || b._mig.off) return;
        const y = yOf(b._mig.d);
        if (placed.some(p => Math.abs(p - y) < 9)) return;
        placed.push(y);
        // All labels sit to the right of their lane: the left margin now
        // carries the distance scale.
        c.fillStyle = ln.ladder ? T.ladderTxt : T.bandTxt;
        c.textAlign = 'left';
        const x = cx + bw/2 + 3;
        const suffix = (b.form === 'sc') ? ' sc' : '';
        if (x > 2 && x < w - 2) c.fillText(fmtBp(b.bp) + suffix, x, y + 3.5);
      });
    });
  }

  // footer: the actual run conditions
  c.font = '10px Arial'; c.textAlign = 'left'; c.fillStyle = T.footTxt;
  c.fillText(`${pct.toFixed(1)}% agarose \u00b7 ${E.toFixed(1)} V/cm \u00b7 ${run.minutes} min`, m.l, h - 9);
  c.textAlign = 'right';
  c.fillText('migration \u2193', w - m.r, h - 9);
}
const fmtBp = bp => bp >= 1000 ? (bp/1000).toFixed(bp % 1000 === 0 ? 0 : 1) + ' kb' : bp + ' bp';
function hexToRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n>>16)&255, (n>>8)&255, n&255].join(',');
}

/* ============================================================
   Viewer: plasmid/linear map (SVG) and annotated sequence (HTML)
   ============================================================ */

let VIEW = 'map', SHOW_TRANS = false, SITE_MODE = 'unique';

/* which enzymes to mark on the map and sequence */
function viewerSites(dna) {
  const circ = dna.topology === 'circular', out = [];
  Object.keys(ENZYMES).forEach(n => {
    if (ENZYMES[n].IIS) return;
    const h = cutSites(dna.seq, n, circ);
    if (!h.length) return;
    if (SITE_MODE === 'unique' && h.length !== 1) return;
    if (SITE_MODE === 'selected' && !chosenEnz.has(n)) return;
    if (SITE_MODE === 'unique' && ENZYMES[n].s.length < 6) return;
    h.forEach(c => out.push({ enz:n, pos:c.top }));
  });
  return out.sort((a,b) => a.pos - b.pos);
}

/* ---------- circular / linear map ---------- */
function mapSVG(dna, feats, w, h) {
  const L = dna.seq.length, circ = dna.topology === 'circular';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const sites = viewerSites(dna);
  const o = [];

  if (circ) {
    const cx = w/2, cy = h/2, R = Math.min(w, h)/2 - 112;
    const ang = p => (p / L) * 2*Math.PI - Math.PI/2;
    const pt = (p, r) => [cx + r*Math.cos(ang(p)), cy + r*Math.sin(ang(p))];
    const arc = (s, e, r) => {
      let span = ((e - s) % L + L) % L || L;
      const [x1,y1] = pt(s, r), [x2,y2] = pt(e, r);
      return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${span > L/2 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    };
    o.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#cbd8d8" stroke-width="2"/>`);

    // quarter-position scale marks, kept subordinate to everything else
    for (let q = 0; q < 4; q++) {
      const p = Math.round(L*q/4);
      const [x1,y1] = pt(p, R-5), [x2,y2] = pt(p, R+5);
      o.push(`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="#c3d0d0" stroke-width="1"/>`);
    }

    // feature arcs, stacked so overlapping features stay readable
    const rings = [];
    feats.forEach(f => {
      let lvl = 0;
      while (rings[lvl] && rings[lvl].some(g => overlaps(g, f, L))) lvl++;
      (rings[lvl] = rings[lvl] || []).push(f);
      f._lvl = lvl;
    });
    const colItems = [];
    feats.forEach(f => {
      const r = R - 10 - f._lvl*11;
      o.push(`<path d="${arc(f.start, f.end, r)}" fill="none" stroke="${f.color}" stroke-width="8" stroke-linecap="butt" opacity=".9"/>`);
      const tipP = f.strand === -1 ? f.start : f.end;
      const [ax,ay] = pt(tipP, r);
      const a0 = ang(tipP) + (f.strand === -1 ? Math.PI : 0), d = 7;
      const p1 = [ax + d*Math.cos(a0+Math.PI/2+0.45), ay + d*Math.sin(a0+Math.PI/2+0.45)];
      const p2 = [ax + d*Math.cos(a0+Math.PI/2-0.45), ay + d*Math.sin(a0+Math.PI/2-0.45)];
      o.push(`<path d="M${ax.toFixed(1)} ${ay.toFixed(1)}L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}Z" fill="${f.color}"/>`);

      const span = (((f.end - f.start) % L + L) % L) || L;
      const mid = (f.start + span/2) % L;
      // Every feature labels into the outer columns, large ones included. A
      // label floating inside the circle has to be matched to its arc by eye,
      // and on a crowded map that is guesswork; a leader line removes it.
      colItems.push({ pos:mid, text:f.name, color:f.color, bold:true, r });
    });

    // Short features and cut sites share two outer label columns with leader
    // lines. A multiple cloning site packs a dozen enzymes into a couple of
    // degrees, so radial labels are unreadable; a column is not.
    sites.forEach(s => colItems.push({ pos:s.pos, text:s.enz + ' (' + (s.pos+1) + ')',
                                       color:'#43565c', bold:false, r:R }));
    const cols = { L:[], R:[] };
    colItems.forEach(it => {
      it.a = ang(it.pos);
      it.idealY = cy + (R + 6) * Math.sin(it.a);
      (Math.cos(it.a) >= 0 ? cols.R : cols.L).push(it);
    });
    const GAP = 13.5, top = 14, bot = h - 14;
    Object.keys(cols).forEach(side => {
      const list = cols[side].sort((a,b) => a.idealY - b.idealY);
      let y = top;
      list.forEach(it => { it.y = Math.max(it.idealY, y); y = it.y + GAP; });
      const over = y - GAP - bot;
      if (over > 0) {                      // ran off the bottom: pull the stack up
        let shift = Math.min(over, list.length ? list[0].y - top : 0);
        for (let i = list.length - 1, floor = bot; i >= 0; i--) {
          list[i].y = Math.min(list[i].y, floor); floor = list[i].y - GAP;
        }
        if (shift > 0) list.forEach(it => it.y -= 0);
      }
      const rightSide = side === 'R';
      const elbowX = cx + (rightSide ? 1 : -1) * (R + 16);
      const labelX = cx + (rightSide ? 1 : -1) * (R + 24);
      list.forEach(it => {
        const [tx,ty] = [cx + (it.r + 2)*Math.cos(it.a), cy + (it.r + 2)*Math.sin(it.a)];
        const [ex,ey] = [cx + (R + 7)*Math.cos(it.a), cy + (R + 7)*Math.sin(it.a)];
        o.push(`<path d="M${tx.toFixed(1)} ${ty.toFixed(1)}L${ex.toFixed(1)} ${ey.toFixed(1)}L${elbowX.toFixed(1)} ${it.y.toFixed(1)}L${labelX.toFixed(1)} ${it.y.toFixed(1)}" fill="none" stroke="${it.bold?it.color:'#b9c6c6'}" stroke-width="${it.bold?1.1:0.9}" opacity="${it.bold?0.75:0.65}"/>`);
        o.push(`<text x="${(labelX + (rightSide?3:-3)).toFixed(1)}" y="${it.y.toFixed(1)}" font-size="9.5"${it.bold?` font-weight="700"`:''} fill="${it.color}" text-anchor="${rightSide?'start':'end'}" dominant-baseline="middle" font-family="Arial">${esc(it.text)}</text>`);
      });
    });

    o.push(`<text x="${cx}" y="${cy-7}" font-size="17" font-weight="700" fill="#263335" text-anchor="middle" font-family="Arial">${esc(dna.name)}</text>`);
    o.push(`<text x="${cx}" y="${cy+13}" font-size="12" fill="#6d7f82" text-anchor="middle" font-family="Arial">${L.toLocaleString()} bp \u00b7 circular</text>`);
  } else {
    const x0 = 56, x1 = w - 56, y = h/2;
    const px = p => x0 + (p/L)*(x1-x0);
    o.push(`<path d="M${x0} ${y}L${x1} ${y}" stroke="#cbd8d8" stroke-width="3"/>`);
    const rings = [];
    feats.forEach(f => { let lvl=0; while(rings[lvl]&&rings[lvl].some(g=>overlaps(g,f,L))) lvl++;
                         (rings[lvl]=rings[lvl]||[]).push(f); f._lvl=lvl; });
    feats.forEach(f => {
      const yy = y - 16 - f._lvl*15, a = px(f.start), b = px(f.end);
      o.push(`<rect x="${Math.min(a,b).toFixed(1)}" y="${(yy-6).toFixed(1)}" width="${Math.max(3,Math.abs(b-a)).toFixed(1)}" height="12" rx="2" fill="${f.color}" opacity=".9"/>`);
      o.push(`<text x="${((a+b)/2).toFixed(1)}" y="${(yy-12).toFixed(1)}" font-size="10.5" font-weight="700" fill="${f.color}" text-anchor="middle" font-family="Arial">${esc(f.name)}</text>`);
    });
    const used = [];
    sites.forEach(s => {
      const x = px(s.pos);
      o.push(`<path d="M${x.toFixed(1)} ${y-4}L${x.toFixed(1)} ${y+10}" stroke="#53646a" stroke-width="1.3"/>`);
      let lvl = 0; while (used.some(q => Math.abs(q.x - x) < 46 && q.lvl === lvl)) lvl++;
      used.push({x, lvl});
      o.push(`<text x="${x.toFixed(1)}" y="${(y+22+lvl*12).toFixed(1)}" font-size="9.5" fill="#43565c" text-anchor="middle" font-family="Arial">${esc(s.enz)} (${s.pos+1})</text>`);
    });
    o.push(`<text x="${x0}" y="${y+h/2-24}" font-size="12" fill="#6d7f82" font-family="Arial">${esc(dna.name)} · ${L.toLocaleString()} bp · linear</text>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%">${o.join('')}</svg>`;
}
function overlaps(a, b, L) {
  const inRange = (p, f) => { const s=f.start, e=f.end; return e>s ? (p>=s&&p<e) : (p>=s||p<e); };
  return inRange(a.start,b)||inRange(b.start,a)||inRange((a.end-1+L)%L,b)||inRange((b.end-1+L)%L,a);
}

/* ---------- annotated sequence ---------- */
function sequenceHTML(dna, feats) {
  const seq = dna.seq, L = seq.length, W = 60;
  const sites = viewerSites(dna);
  const esc = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  // per-base feature colour (topmost = narrowest feature wins)
  const paint = new Array(L).fill(null);
  feats.slice().sort((a,b) => b.len - a.len).forEach(f => {
    for (let k = 0; k < f.len; k++) paint[(f.start + k) % L] = f;
  });
  const cutAt = {}; sites.forEach(s => { (cutAt[s.pos] = cutAt[s.pos] || []).push(s.enz); });

  const rows = [];
  for (let start = 0; start < L; start += W) {
    const end = Math.min(start + W, L);
    // Enzyme names, stacked onto as many rows as it takes. A cloning site puts
    // several cutters within a few bases, and a tick with no name against it is
    // worse than an extra row.
    const nameRows = [];
    for (let p = start; p < end; p++) {
      if (!cutAt[p]) continue;
      const label = cutAt[p].join('/');
      let at = p - start;
      if (at + label.length > W) at = Math.max(0, W - label.length);
      for (let row = 0; row <= 9; row++) {
        if (!nameRows[row]) nameRows[row] = new Array(W).fill(' ');
        const r = nameRows[row];
        let free = true;
        for (let k = -1; k <= label.length; k++) {
          const j = at + k;
          if (j >= 0 && j < W && r[j] !== ' ') { free = false; break; }
        }
        if (free) { for (let k = 0; k < label.length; k++) r[at+k] = label[k]; break; }
      }
    }
    const tickRow = new Array(W).fill(' ');
    for (let p = start; p < end; p++) if (cutAt[p]) tickRow[p-start] = '↓';

    // top strand with feature tints
    let top = '', cur = null, buf = '';
    const flush = () => {
      if (!buf) return;
      top += cur ? `<span class="ft" style="background:${cur.color}26;border-bottom:2px solid ${cur.color}" title="${esc(cur.name)}">${buf}</span>` : buf;
      buf = '';
    };
    for (let p = start; p < end; p++) {
      const f = paint[p];
      if (f !== cur) { flush(); cur = f; }
      buf += seq[p];
    }
    flush();
    const bot = seq.slice(start, end).split('').map(c => COMP[c] || 'N').join('');

    let tr = '';
    if (SHOW_TRANS) {
      const row = new Array(end-start).fill(' ');
      feats.filter(f => f.type === 'CDS' && f.prot).forEach(f => {
        for (let i = 0; i < f.prot.length; i++) {
          const codonStart = f.strand === 1 ? (f.start + i*3) % L : (f.start + f.len - 3 - i*3 + L) % L;
          const mid = (codonStart + 1) % L;
          if (mid >= start && mid < end) row[mid-start] = f.prot[i];
        }
      });
      tr = `<div class="sq-tr">${esc(row.join(''))}</div>`;
    }
    rows.push(
      `<div class="sq-blk">` +
      (nameRows.length ? nameRows.slice().reverse().map(r => `<div class="sq-enz">${esc(r.join(''))}</div>`).join('') +
                         `<div class="sq-tick">${tickRow.join('')}</div>` : '') +
      `<div class="sq-line"><span class="sq-n">${(start+1).toLocaleString()}</span><span class="sq-bases">${top}</span><span class="sq-n2">${end.toLocaleString()}</span></div>` +
      `<div class="sq-line sq-rev"><span class="sq-n"></span><span class="sq-bases">${esc(bot)}</span></div>` +
      tr + `</div>`);
  }
  return rows.join('');
}

/* ---------- feature table ---------- */
function featureTableHTML(feats, L) {
  if (!feats.length) return '<p class="note">No standard features detected in this sequence.</p>';
  return `<table class="ftab"><thead><tr><th></th><th>Feature</th><th>Position</th><th>Size</th><th>Source</th></tr></thead><tbody>` +
    feats.map(f => `<tr><td><span class="dot" style="background:${f.color}"></span></td>
      <td>${escHtml(f.name)}</td>
      <td>${(f.start+1).toLocaleString()}–${f.end.toLocaleString()}${f.strand===-1?' (c)':''}</td>
      <td>${f.len.toLocaleString()} bp${f.type==='CDS'?' / '+Math.round(f.len/3-1)+' aa':''}</td>
      <td>${escHtml(f.src)}</td></tr>`).join('') + '</tbody></table>';
}

/* ============================================================
   Sticky-end rendering

   A fragment's stored sequence is its TOP strand, spanning the two
   top-strand cut positions. The bottom strand is cut elsewhere, so the
   two strands start and stop at different places and the duplex ends
   are ragged. Which strand protrudes depends on the overhang type:

     left end   5' overhang -> top protrudes      3' overhang -> bottom protrudes
     right end  5' overhang -> bottom protrudes   3' overhang -> top protrudes

   Blunt ends have zero-length overhangs and fall out of the same code.
   ============================================================ */
function duplexOf(frag) {
  const l = frag.l, r = frag.r;
  const lOv = l.ovh || '', rOv = r.ovh || '';
  const leftIs5 = l.type === "5'", rightIs5 = r.type === "5'";

  // Full span in top-strand coordinates, including any stretch that exists
  // on the bottom strand only.
  const full = (!leftIs5 && lOv ? lOv : '') + frag.seq + (rightIs5 && rOv ? rOv : '');
  const seqStart = (!leftIs5 && lOv) ? lOv.length : 0;
  const topStart = seqStart, topEnd = seqStart + frag.seq.length;
  const botStart = leftIs5 ? topStart + lOv.length : 0;
  const botEnd   = rightIs5 ? topEnd + rOv.length : topEnd - rOv.length;

  const top = [], bot = [];
  for (let i = 0; i < full.length; i++) {
    top.push(i >= topStart && i < topEnd ? full[i] : ' ');
    bot.push(i >= botStart && i < botEnd ? (COMP[full[i]] || 'N') : ' ');
  }
  return { top: top.join(''), bot: bot.join(''), len: full.length };
}

/* Render a fragment as two staggered strands. Long fragments show both
   ends with the middle elided, since the ends are the point. */
function stickyHTML(frag, maxFull = 90, flank = 28) {
  const d = duplexOf(frag);
  const esc = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const rows = (t, b, lead, tail) =>
    `<div class="dx"><div><span class="dxl">5'</span>${lead}${esc(t)}${tail}<span class="dxl">3'</span></div>` +
    `<div><span class="dxl">3'</span>${lead}${esc(b)}${tail}<span class="dxl">5'</span></div></div>`;
  if (d.len <= maxFull) return rows(d.top, d.bot, '', '');
  return rows(d.top.slice(0, flank), d.bot.slice(0, flank), '', '<span class="dxe">…</span>') +
         `<div class="dxgap">${(frag.len - flank*2).toLocaleString()} bp</div>` +
         rows(d.top.slice(-flank), d.bot.slice(-flank), '<span class="dxe">…</span>', '');
}

/* The whole fragment panel for a digest / PCR / CRISPR sample. */
function fragmentsHTML(sample) {
  const main = sample.frags.filter(f => !f.partial).slice().sort((a,b) => b.len - a.len);
  const extra = sample.frags.length - main.length;
  return main.map(f => {
    return `<div class="frag">
      <div class="fh"><b>${fmtBp(f.len)}</b>
        <span class="fe">${escHtml(endLabel(f.l))}</span>
        <span class="fa">↔</span>
        <span class="fe">${escHtml(endLabel(f.r))}</span>
        <span class="fn">${escHtml(f.note || '')}</span></div>
      ${stickyHTML(f)}
    </div>`;
  }).join('') + (extra ? `<p class="note">${extra} partial-digest product${extra===1?'':'s'} not shown.</p>` : '');
}


/* A fragment's annotated sequence: same layout as the whole-molecule view,
   but drawn over the ragged duplex so the overhangs appear at the ends.
   Numbering runs over the fragment's own top strand. */
function fragmentSequenceHTML(frag, feats) {
  const d = duplexOf(frag), L = d.len, W = 60;
  const lOv = frag.l.ovh || '';
  const leftIs5 = frag.l.type === "5'";
  const seqStart = (!leftIs5 && lOv) ? lOv.length : 0;
  const esc = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

  const paint = new Array(L).fill(null);
  feats.slice().sort((a,b) => b.len - a.len).forEach(f => {
    for (let k = 0; k < f.len; k++) {
      const i = seqStart + f.start + k;
      if (i >= 0 && i < L) paint[i] = f;
    }
  });
  const sites = viewerSites({ seq: frag.seq, topology: 'linear' });
  const cutAt = {};
  sites.forEach(s => { const i = seqStart + s.pos; (cutAt[i] = cutAt[i] || []).push(s.enz); });

  const rows = [];
  for (let start = 0; start < L; start += W) {
    const end = Math.min(start + W, L);
    const nameRows = [];
    for (let p = start; p < end; p++) {
      if (!cutAt[p]) continue;
      const label = cutAt[p].join('/');
      let at = p - start;
      if (at + label.length > W) at = Math.max(0, W - label.length);
      for (let row = 0; row <= 9; row++) {
        if (!nameRows[row]) nameRows[row] = new Array(W).fill(' ');
        const r = nameRows[row];
        let free = true;
        for (let k = -1; k <= label.length; k++) {
          const j = at + k;
          if (j >= 0 && j < W && r[j] !== ' ') { free = false; break; }
        }
        if (free) { for (let k = 0; k < label.length; k++) r[at+k] = label[k]; break; }
      }
    }
    const tickRow = new Array(W).fill(' ');
    for (let p = start; p < end; p++) if (cutAt[p]) tickRow[p-start] = '\u2193';

    let top = '', cur = null, buf = '';
    const flush = () => {
      if (!buf) return;
      top += cur ? `<span class="ft" style="background:${cur.color}26;border-bottom:2px solid ${cur.color}" title="${esc(cur.name)}">${buf}</span>` : buf;
      buf = '';
    };
    for (let p = start; p < end; p++) {
      const f = paint[p];
      if (f !== cur) { flush(); cur = f; }
      buf += d.top[p] === ' ' ? ' ' : d.top[p];
    }
    flush();
    const nFrom = Math.max(1, start - seqStart + 1);
    const nTo   = Math.min(frag.seq.length, end - seqStart);
    rows.push(
      `<div class="sq-blk">` +
      (nameRows.length ? nameRows.slice().reverse().map(r => `<div class="sq-enz">${esc(r.join(''))}</div>`).join('') +
                         `<div class="sq-tick">${tickRow.join('')}</div>` : '') +
      `<div class="sq-line"><span class="sq-n">${nFrom.toLocaleString()}</span><span class="sq-bases">${top}</span><span class="sq-n2">${nTo > 0 ? nTo.toLocaleString() : ''}</span></div>` +
      `<div class="sq-line sq-rev"><span class="sq-n"></span><span class="sq-bases">${esc(d.bot.slice(start, end))}</span></div>` +
      `</div>`);
  }
  const ends = `<div class="fnote">5' end: <b>${escHtml(endLabel(frag.l))}</b> \u00b7 3' end: <b>${escHtml(endLabel(frag.r))}</b>. Single-stranded overhangs are shown as gaps on the opposite strand.</div>`;
  return ends + rows.join('');
}

/* ---------- FASTA / GenBank parsing (all local, nothing leaves the page) ---------- */
function parseSequence(text, fallbackName) {
  const t = text.trim();
  if (/^LOCUS\s/m.test(t)) {
    const name = (t.match(/^LOCUS\s+(\S+)/m) || [,fallbackName])[1];
    const circ = /^LOCUS\s.*\bcircular\b/mi.test(t);
    const o = t.indexOf('ORIGIN');
    if (o === -1) throw new Error('That GenBank record has no ORIGIN block, so there is no sequence to read.');
    const seq = clean(t.slice(o + 6).replace(/^\/\/$/m, '').replace(/[0-9]/g, ''));
    if (!seq) throw new Error('No sequence found under ORIGIN.');
    const def = (t.match(/^DEFINITION\s+([\s\S]*?)\n(?=[A-Z]{2,}|\s{0,2}\S)/m) || [,''])[1].trim().replace(/\s+/g,' ');
    return { name, seq, topology: circ ? 'circular' : 'linear', desc: def.slice(0,120), gbText: t };
  }
  if (t.startsWith('>')) {
    const nl = t.indexOf('\n');
    const header = t.slice(1, nl === -1 ? undefined : nl).trim();
    const seq = clean(nl === -1 ? '' : t.slice(nl));
    if (!seq) throw new Error('That FASTA record has a header but no sequence.');
    return { name: header.split(/\s+/)[0] || fallbackName, seq,
             topology: 'linear', desc: header.slice(0,120) };
  }
  const seq = clean(t);
  if (!seq) throw new Error('No usable bases found. Expected A, C, G and T.');
  return { name: fallbackName, seq, topology: 'linear', desc: '' };
}

/* ---------- bench state ---------- */
const SAMPLES = [];
let uid = 0, logLines = [], ACTIVE = null, SEG = 0;
const newColor = () => COLORS[SAMPLES.length % COLORS.length];

function addSample(s) {
  s.id = ++uid; s.on = true; s.color = s.color || newColor();
  // Loading amount is relative only: band intensity is normalised against the
  // brightest band, so absolute mass would change nothing on the gel.
  s.ng = s.ng || 100;
  SAMPLES.push(s);
  setActive(s);
  renderBench(); refreshPickers(); redraw();
  return s;
}
function setActive(s) {
  if (s !== ACTIVE) SEG = 0;
  ACTIVE = s || null;
  if (ACTIVE && ACTIVE.kind === 'intact' && !ACTIVE.feats) ACTIVE.feats = annotate(ACTIVE);
  renderViewer(); renderBench();
}
function sampleLabel(s) {
  if (s.kind === 'intact') return s.seq.length.toLocaleString() + ' bp ' + s.topology;
  const n = mainFrags(s).length;
  return n + (s.ligation ? ' products' : ' fragment' + (n===1?'':'s'));
}
function renderBench() {
  const box = $('samples');
  if (!SAMPLES.length) { box.innerHTML = '<p class="note">Nothing on the bench yet.</p>'; return; }
  box.innerHTML = SAMPLES.map(s => `<div class="sample${s===ACTIVE?' active':''}" data-id="${s.id}">
    <input type="checkbox" ${s.on?'checked':''} aria-label="show on gel">
    ${vialSVG(s.color, 26)}
    <span class="nm"><b>${escHtml(s.name)}</b><span>${escHtml(sampleLabel(s))}</span></span>
    <button type="button" class="kill" aria-label="remove">×</button></div>`).join('');
  box.querySelectorAll('.sample').forEach(el => {
    const id = +el.dataset.id, s = SAMPLES.find(x => x.id === id);
    el.querySelector('input').onchange = e => { s.on = e.target.checked; redraw(); };
    el.onclick = e => {
      if (e.target.closest('input, .kill')) return;   // checkbox and delete do their own thing
      setActive(s);
    };
    el.querySelector('.kill').onclick = () => {
      SAMPLES.splice(SAMPLES.indexOf(s), 1);
      if (ACTIVE === s) setActive(SAMPLES[SAMPLES.length-1] || null);
      renderBench(); refreshPickers(); redraw();
    };
  });
}
const escHtml = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function refreshPickers() {
  // Reactions are run on whole tubes, the way they are at a bench. Individual
  // bands are not offered as substrates: isolating one would mean a gel
  // extraction, which is a separate step this tool does not model.
  const dnaOpts = SAMPLES.map(s => {
    if (s.kind === 'intact')
      return `<option value="i:${s.id}" data-color="${s.color}">${escHtml(s.name)} (${s.seq.length.toLocaleString()} bp)</option>`;
    const fr = mainFrags(s), word = s.ligation ? 'product' : 'fragment';
    return `<option value="m:${s.id}" data-color="${s.color}">${escHtml(s.name)} (${fr.length} ${word}${fr.length===1?'':'s'})</option>`;
  }).join('');
  ['cutDna','pcrDna','crDna','xfDna'].forEach(id => {
    const el = $(id), cur = el.value;
    el.innerHTML = dnaOpts || '<option value="">Load a sequence first</option>';
    if (cur) el.value = cur;
  });
  // Ligation happens between tubes. Everything in a tube takes part.
  const tubeOpts = SAMPLES.filter(s =>
      s.kind === 'fragments' || (s.kind === 'intact' && s.topology === 'linear'))
    .map(s => {
      if (s.kind === 'intact')
        return `<option value="${s.id}" data-color="${s.color}">${escHtml(s.name)} (linear, ${fmtBp(s.seq.length)})</option>`;
      const n = mainFrags(s).length, word = s.ligation ? 'product' : 'fragment';
      return `<option value="${s.id}" data-color="${s.color}">${escHtml(s.name)} (${n} ${word}${n===1?'':'s'})</option>`;
    }).join('');
  const keepA = $('ligA').value, keepB = $('ligB').value;
  $('ligA').innerHTML = tubeOpts || '<option value="">Run a digest first</option>';
  $('ligB').innerHTML = '<option value="" data-color="">None (backbone alone)</option>' + tubeOpts;
  if (keepA) $('ligA').value = keepA;
  if (keepB) $('ligB').value = keepB;
  buildEnzPicker();
  VIAL_SELECTS.forEach(syncVsel);
}
/* What is actually in the selected tube. An enzyme acts on everything
   present, so reactions iterate over this list. */
function selMolecules(selId) {
  const v = $(selId).value;
  if (!v) return null;
  if (v.startsWith('f:')) {
    const [, sid, fi] = v.split(':');
    const s = SAMPLES.find(x => x.id === +sid), f = s && s.frags[+fi];
    if (!f) return null;
    return { name: s.name + ' \u2014 ' + fmtBp(f.len), color: s.color,
             mols: [{ name: fmtBp(f.len), seq: f.seq,
                      topology: f.circular ? 'circular' : 'linear', l: f.l, r: f.r }] };
  }
  const s = SAMPLES.find(x => x.id === +v.slice(2));
  if (!s) return null;
  if (s.kind === 'intact')
    return { name: s.name, color: s.color,
             mols: [{ name: s.name, seq: s.seq, topology: s.topology }] };
  return { name: s.name, color: s.color,
           // A ligation can produce circles as well as linears, and the two
           // behave completely differently under an enzyme: n cuts give n
           // fragments in a circle and n+1 in a linear.
           mols: mainFrags(s).map(f => ({ name: fmtBp(f.len), seq: f.seq,
                                          topology: f.circular ? 'circular' : 'linear',
                                          l: f.l, r: f.r })) };
}
const BLUNT_END = e => ({ type: 'blunt', ovh: '', enz: e });
/* The contents of a tube chosen for ligation.
   Concentration is given for the tube as a whole (ng/uL); each fragment's
   share of that mass follows its length, which is what you get when you
   pipette from a digest. Molar concentration then follows from length. */
function ligSpecies(selId, ngPerUL, dephos) {
  const v = $(selId).value; if (!v) return [];
  const s = SAMPLES.find(x => x.id === +v);
  if (!s) return [];
  // An intact linear molecule is ligatable too: imported fragments arrive
  // that way, with blunt ends, and need no digest first.
  const all = s.kind === 'intact'
    ? [{ len:s.seq.length, seq:s.seq, l: s.l || BLUNT_END('end'),
         r: s.r || BLUNT_END('end'), circular: s.topology === 'circular' }]
    : mainFrags(s);
  const fr = all.filter(f => !f.circular);
  if (!fr.length) return [];
  const total = fr.reduce((a, f) => a + f.len, 0) || 1;
  return fr.map(f => ({
    name: fmtBp(f.len), len: f.len, seq: f.seq,
    l: dephos ? Object.assign({}, f.l, { noP: true }) : f.l,
    r: dephos ? Object.assign({}, f.r, { noP: true }) : f.r,
    ngPerUL: ngPerUL * f.len / total, color: s.color, tube: s.name
  }));
}
/* The reference molecule of a tube is its largest fragment: the backbone in
   a vector prep, the insert in an insert prep. Ratios are quoted against it. */
const refSpecies = list => list.slice().sort((a,b) => b.len - a.len)[0];

/* ---------- sample pickers ----------
   A native <option> cannot hold an SVG, so these selects keep the real
   <select> as the source of truth (hidden) and draw a matching list of
   buttons over it, each with its sample's vial. Every change is pushed
   back through the select so the rest of the code is unchanged. */
const VIAL_SELECTS = ['cutDna','pcrDna','crDna','ligA','ligB','xfDna'];
function syncVsel(id) {
  const sel = $(id);
  if (!sel) return;
  let box = sel.nextElementSibling;
  if (!box || !box.classList || !box.classList.contains('vsel')) {
    box = document.createElement('div');
    box.className = 'vsel';
    sel.after(box);
    sel.classList.add('vsel-native');
  }
  const opts = [...sel.options];
  const cur = opts.find(o => o.value === sel.value) || opts[0];
  const chip = o => (o && o.dataset.color ? vialSVG(o.dataset.color, 20) : '') +
                    `<span>${escHtml(o ? o.textContent : 'Nothing available')}</span>`;
  box.innerHTML =
    `<button type="button" class="vsel-btn"${opts.length && opts[0].value ? '' : ' disabled'}>${chip(cur)}<i>\u25be</i></button>` +
    `<div class="vsel-list" hidden>` +
      opts.filter(o => o.value).map(o =>
        `<button type="button" class="vsel-opt${o.value===sel.value?' on':''}" data-v="${escHtml(o.value)}">${chip(o)}</button>`).join('') +
    `</div>`;
  const btn = box.querySelector('.vsel-btn'), list = box.querySelector('.vsel-list');
  btn.onclick = e => {
    e.stopPropagation();
    document.querySelectorAll('.vsel-list').forEach(l => { if (l !== list) l.hidden = true; });
    list.hidden = !list.hidden;
  };
  box.querySelectorAll('.vsel-opt').forEach(b => b.onclick = e => {
    e.stopPropagation();
    sel.value = b.dataset.v;
    list.hidden = true;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    syncVsel(id);
  });
}
document.addEventListener('click', () =>
  document.querySelectorAll('.vsel-list').forEach(l => l.hidden = true));

/* ---------- enzyme picker, annotated with site counts for the chosen DNA ---------- */
let chosenEnz = new Set(['EcoRI','HindIII']);
function buildEnzPicker() {
  const sel = selMolecules('cutDna'), box = $('enzPicker');
  const names = Object.keys(ENZYMES).sort();
  const counts = {};
  names.forEach(n => counts[n] = sel
    ? sel.mols.reduce((a, m) => a + cutSites(m.seq, n, m.topology === 'circular').length, 0)
    : null);
  const rank = n => counts[n] === null ? 2 : counts[n] === 0 ? 1 : 0;
  names.sort((a,b) => rank(a)-rank(b) || (counts[a]||99)-(counts[b]||99) || a.localeCompare(b));
  box.innerHTML = names.map(n => {
    const c = counts[n], e = ENZYMES[n];
    const lbl = c === null ? '' : c === 0 ? 'none' : c + (c===1?' site':' sites');
    return `<label class="enz${c===0?' none':''}"><input type="checkbox" value="${n}" ${chosenEnz.has(n)?'checked':''}>
      <b>${n}</b><code>${e.s}${e.IIS?' (IIS)':''}</code><span class="n">${lbl}</span></label>`;
  }).join('');
  box.querySelectorAll('input').forEach(i => i.onchange = () => {
    i.checked ? chosenEnz.add(i.value) : chosenEnz.delete(i.value);
    $('cutCount').textContent = chosenEnz.size + ' selected';
  });
  $('cutCount').textContent = chosenEnz.size + ' selected';
}

/* ---------- logging ---------- */
function log(title, lines) {
  logLines = ['── ' + title + ' ──'].concat(lines, '');
  $('output').textContent = logLines.join('\n');
}
function say(html, color) {
  const r = $('readout'); r.innerHTML = html; r.style.color = color || '#1c6872'; r.hidden = false;
}

/* ---------- viewer ---------- */
function renderViewer() {
  const has = !!ACTIVE;
  $('viewEmpty').hidden = has;
  $('saveMap').disabled = !has;
  // The CSV and sequence exports describe the subject itself, not the drawn
  // map, so they stay available on every tab once something is loaded.
  $('saveCsv').disabled = !has;
  $('saveSeq').disabled = !has;
  // Blank the inactive views as well as hiding them, so stale markup from a
  // previous subject cannot be queried or clicked.
  ['mapBox','seqBox','featBox'].forEach(id => { $(id).hidden = true; $(id).innerHTML = ''; });
  if (!has) { $('viewTitle').innerHTML = 'Sequence map';
              $('status').textContent = 'Load a sequence to see its map and features.'; return; }
  if (ACTIVE.kind === 'fragments') return renderFragmentView();
  const f = ACTIVE.feats || (ACTIVE.feats = annotate(ACTIVE));
  $('viewTitle').innerHTML = vialSVG(ACTIVE.color, 28) + '<span>' + escHtml(ACTIVE.name) + '</span>';
  $('status').textContent = ACTIVE.seq.length.toLocaleString() + ' bp ' + ACTIVE.topology +
    ' \u00b7 ' + f.length + ' feature' + (f.length===1?'':'s') +
    ' \u00b7 GC ' + gc(ACTIVE.seq).toFixed(1) + '%';
  if (VIEW === 'map') {
    const box = $('mapBox'); box.hidden = false;
    const w = Math.max(520, box.clientWidth || 700);
    const h = ACTIVE.topology === 'circular' ? 560 : 320;
    box.style.height = h + 'px';
    box.innerHTML = mapSVG(ACTIVE, f, w, h);
  } else if (VIEW === 'seq') {
    const box = $('seqBox'); box.hidden = false;
    box.innerHTML = sequenceHTML(ACTIVE, f);
  } else {
    const box = $('featBox'); box.hidden = false;
    box.innerHTML = featureTableHTML(f, ACTIVE.seq.length);
  }
}
/* Digest / PCR / CRISPR products: no single map, so show the fragments
   themselves with their ragged duplex ends. */
/* The real species in a tube. `partial` marks incomplete-digest byproducts,
   which are shown faintly on the gel but are not substrates in their own
   right. Abundance cannot be used for this test: ligation products are all
   genuine species with fractional shares. */
function mainFrags(s) {
  return s.frags.filter(f => !f.partial).slice().sort((a,b) => b.len - a.len);
}
/* Each fragment is its own linear molecule, so it gets annotated in its own
   right. Cached on the fragment, since annotation is not free. */
function fragDna(s, f, i) {
  if (!f._dna) {
    f._dna = { name: s.name + ' \u2014 ' + fmtBp(f.len), seq: f.seq,
               topology: f.circular ? 'circular' : 'linear' };
    f._feats = annotate(f._dna);
  }
  return f;
}
function renderFragmentView() {
  const s = ACTIVE, main = mainFrags(s);
  if (SEG >= main.length) SEG = 0;
  const f = main[SEG];
  fragDna(s, f, SEG);

  $('viewTitle').innerHTML = vialSVG(s.color, 28) + '<span>' + escHtml(s.name) + '</span>';
  $('status').textContent = main.length + ' fragment' + (main.length===1?'':'s') +
    ' \u00b7 showing ' + fmtBp(f.len);

  const tabs = `<div class="segtabs">` + main.map((x,i) =>
      `<button type="button" class="seg${i===SEG?' on':''}" data-i="${i}">${fmtBp(x.len)}</button>`).join('') +
    `</div>`;

  if (VIEW === 'map') {
    const box = $('mapBox'); box.hidden = false;
    box.style.height = '340px';
    const w = Math.max(520, box.clientWidth || 700);
    box.innerHTML = tabs + mapSVG(f._dna, f._feats, w, 290);
    $('saveMap').disabled = false;
  } else if (VIEW === 'seq') {
    const box = $('seqBox'); box.hidden = false;
    box.innerHTML = tabs + fragmentSequenceHTML(f, f._feats);
    $('saveMap').disabled = true;
  } else {
    const box = $('featBox'); box.hidden = false;
    box.innerHTML = tabs +
      `<p class="note">Features found in the ${fmtBp(f.len)} fragment, numbered from its own 5' end.</p>` +
      featureTableHTML(f._feats, f.seq.length);
    $('saveMap').disabled = true;
  }
  document.querySelectorAll('.segtabs .seg').forEach(b =>
    b.onclick = () => { SEG = +b.dataset.i; renderViewer(); });
}

function saveMapSvg() {
  if (!ACTIVE) return;
  let subject = ACTIVE, feats;
  if (ACTIVE.kind === 'fragments') {
    const fr = mainFrags(ACTIVE)[SEG]; if (!fr) return;
    fragDna(ACTIVE, fr, SEG); subject = fr._dna; feats = fr._feats;
  } else feats = ACTIVE.feats || annotate(ACTIVE);
  const h = subject.topology === 'circular' ? 620 : 340;
  const svg = mapSVG(subject, feats, 760, h).replace('width="100%" height="100%"', 'width="760" height="'+h+'"');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['<?xml version="1.0"?>' + svg], {type:'image/svg+xml'}));
  a.download = subject.name.replace(/[^\w.-]+/g,'_') + '_map.svg';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ---------- redraw ---------- */
function redraw() {
  const any = SAMPLES.some(s => s.on);
  $('empty').hidden = any;
  $('reset').disabled = $('saveSvg').disabled = !SAMPLES.length;
  $('legend').innerHTML = SAMPLES.filter(s => s.on)
    .map(s => `<span class="leg">${vialSVG(s.color, 20)} ${escHtml(s.name)}</span>`).join('');
  drawGel();
}
function saveSvg() {
  const rec = recorder(); drawGel(rec);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([rec.svg()], {type:'image/svg+xml'}));
  a.download = 'gel.svg';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ---------- presets ---------- */
const PRESETS = [{
  key:'puc19', name:'pUC19', topology:'circular', seq:PUC19,
  desc:'Classic high-copy cloning vector. AmpR, lacZα with the MCS at 391–455; 11 of its 13 classic cutters are in this enzyme table. NCBI L09137.2, 2686 bp.'
}];
function fillPresets() {
  $('preset').innerHTML = PRESETS.map(p => `<option value="${p.key}">${p.name} (${p.seq.length.toLocaleString()} bp)</option>`).join('');
  presetNote();
}
function presetNote() {
  const p = PRESETS.find(x => x.key === $('preset').value) || PRESETS[0];
  $('presetNote').textContent = p ? p.desc : '';
}

/* ---------- tabs ---------- */
const TABS = [['loadTab','loadForm'],['cutTab','cutForm'],['pcrTab','pcrForm'],
              ['crisprTab','crisprForm'],['ligTab','ligForm'],['xfTab','xfForm'],
              ['protoTab','protoForm']];
function tab(which) {
  TABS.forEach(([b,f]) => {
    $(b).classList.toggle('active', b === which);
    $(f).hidden = b !== which;
  });
  if (which === 'cutTab') buildEnzPicker();
}

/* ---------- handlers ---------- */
function errOn(id, msg) { const e = $(id); e.textContent = msg; e.hidden = false; }
function errOff(id) { $(id).hidden = true; }

$('loadForm').onsubmit = e => {
  e.preventDefault();
  try {
    errOff('loadError');
    const pasted = $('paste').value.trim();
    if (pasted) {
      const p = parseSequence(pasted, $('pasteName').value.trim() || 'Pasted sequence');
      const topo = /^LOCUS\s/m.test(pasted) || pasted.startsWith('>') ? p.topology : $('pasteTopo').value;
      addSample({ kind:'intact', name:p.name, seq:p.seq, topology:topo });
      log('Loaded ' + p.name, [
        'Length: ' + p.seq.length.toLocaleString() + ' bp',
        'Topology: ' + topo,
        p.desc ? 'Description: ' + p.desc : '',
        'GC content: ' + gc(p.seq).toFixed(1) + '%'
      ].filter(Boolean));
      $('paste').value = '';
      return;
    }
    const pre = PRESETS.find(x => x.key === $('preset').value);
    if (!pre) throw new Error('Pick a preset, upload a file, or paste a sequence.');
    addSample({ kind:'intact', name:pre.name, seq:pre.seq, topology:pre.topology });
    log('Loaded ' + pre.name, [
      'Length: ' + pre.seq.length.toLocaleString() + ' bp',
      'Topology: ' + pre.topology,
      'GC content: ' + gc(pre.seq).toFixed(1) + '%',
      pre.desc
    ]);
  } catch (x) { errOn('loadError', x.message); }
};

$('file').onchange = ev => {
  const f = ev.target.files && ev.target.files[0];
  if (!f) return;
  const fr = new FileReader();
  fr.onload = () => {
    try {
      errOff('loadError');
      const p = parseSequence(String(fr.result), f.name.replace(/\.[^.]+$/, ''));
      addSample({ kind:'intact', name:p.name, seq:p.seq, topology:p.topology });
      log('Loaded ' + p.name + ' from file', [
        'File: ' + f.name,
        'Length: ' + p.seq.length.toLocaleString() + ' bp',
        'Topology: ' + p.topology + (p.topology === 'linear' ? '  (set it to circular by pasting instead, if this is a plasmid)' : ''),
        p.desc ? 'Description: ' + p.desc : '',
        'GC content: ' + gc(p.seq).toFixed(1) + '%'
      ].filter(Boolean));
    } catch (x) { errOn('loadError', x.message); }
    ev.target.value = '';
  };
  fr.onerror = () => errOn('loadError', 'Could not read that file.');
  fr.readAsText(f);
};

$('cutForm').onsubmit = e => {
  e.preventDefault();
  try {
    errOff('cutError');
    const sel = selMolecules('cutDna');
    if (!sel) throw new Error('Load a sequence first.');
    if (!chosenEnz.size) throw new Error('Select at least one enzyme.');
    const partial = $('cutPartial').value === 'partial';
    const enz = [...chosenEnz];

    // Every molecule in the tube sees the enzyme. Anything without a site
    // survives the reaction unchanged and still shows up on the gel.
    let frags = [], nCuts = 0, nUncut = 0;
    sel.mols.forEach(m => {
      const r = digest(m, enz, partial);
      if (r.frags) { frags = frags.concat(r.frags); nCuts += r.cuts.length; }
      else {
        nUncut++;
        frags.push({ seq:m.seq, len:m.seq.length,
                     l: m.l || BLUNT_END('end'), r: m.r || BLUNT_END('end'),
                     form: m.topology === 'circular' ? 'sc' : 'lin',
                     note: 'uncut (no site)', abund: 1 });
      }
    });
    const used = enz.filter(n => sel.mols.some(m => cutSites(m.seq, n, m.topology==='circular').length));
    const unused = enz.filter(n => used.indexOf(n) === -1);
    if (!used.length) throw new Error('None of the selected enzymes cut ' + sel.name + '. Nothing in the tube is changed.');

    const main = frags.filter(f => (f.abund===undefined?1:f.abund) === 1);
    const name = sel.name + ' / ' + used.join('+') + (partial ? ' partial' : '');
    addSample({ kind:'fragments', name, frags, source:sel.name });

    const lines = [
      'Substrate: ' + sel.name + ', ' + sel.mols.length + ' molecule' + (sel.mols.length===1?'':'s') +
        ' (' + sel.mols.map(m => m.seq.length.toLocaleString() + ' bp ' + m.topology).join(', ') + ')',
      'Enzymes:   ' + used.join(', ') + (unused.length ? '   (no sites: ' + unused.join(', ') + ')' : ''),
      'Cuts:      ' + nCuts + (nUncut ? '   (' + nUncut + ' molecule' + (nUncut===1?'':'s') + ' left uncut)' : ''),
      '',
      'Size (bp)   Ends                          From'
    ];
    main.slice().sort((a,b) => b.len - a.len).forEach(f =>
      lines.push(String(f.len).padStart(9) + '   ' +
        (endLabel(f.l) + ' / ' + endLabel(f.r)).padEnd(30) + f.note));
    lines.push('', 'Total: ' + main.reduce((s,f)=>s+f.len,0).toLocaleString() + ' bp in ' + main.length + ' fragment' + (main.length===1?'':'s'));
    if (sel.mols.length === 1 && sel.mols[0].topology === 'circular' && nCuts === 1)
      lines.push('', 'One cut in a circle gives one linear band, not two.');
    if (partial) lines.push('Partial digest: ' + (frags.length - main.length) + ' additional incomplete products shown faintly.');
    log('Digest', lines);
    say('<strong>' + used.join(' + ') + '</strong> on ' + escHtml(sel.name) + ': <strong>' + main.length +
        '</strong> fragment' + (main.length===1?'':'s') + ' — ' +
        main.slice().sort((a,b)=>b.len-a.len).map(f=>fmtBp(f.len)).join(', '),
        SAMPLES[SAMPLES.length-1].color);
  } catch (x) { errOn('cutError', x.message); }
};

$('pcrForm').onsubmit = e => {
  e.preventDefault();
  try {
    errOff('pcrError');
    const sel = selMolecules('pcrDna');
    if (!sel) throw new Error('Load a template first.');
    const dna = sel.mols[0];
    const f = clean($('fwd').value), r = clean($('rev').value);
    if (f.length < 10 || r.length < 10) throw new Error('Both primers need to be at least 10 nt.');
    // Pool products from every template molecule present.
    const res = { products: [], fHits: [], rHits: [] };
    sel.mols.forEach(m => {
      const one = pcr(m, f, r);
      res.products = res.products.concat(one.products);
      res.fHits = res.fHits.concat(one.fHits);
      res.rHits = res.rHits.concat(one.rHits);
    });
    res.products.sort((a,b) => a.len - b.len);
    const tf = tm(f), tr = tm(r);
    const lines = [
      'Template: ' + sel.name + ' (' + sel.mols.length + ' molecule' + (sel.mols.length===1?'':'s') + ')',
      '',
      'Forward  ' + f.length + ' nt   GC ' + gc(f).toFixed(0) + '%   Tm ' + (tf?tf.toFixed(1)+' °C':'n/a') + '   binding sites: ' + res.fHits.length,
      'Reverse  ' + r.length + ' nt   GC ' + gc(r).toFixed(0) + '%   Tm ' + (tr?tr.toFixed(1)+' °C':'n/a') + '   binding sites: ' + res.rHits.length,
      tf && tr ? 'Tm difference: ' + Math.abs(tf-tr).toFixed(1) + ' °C' + (Math.abs(tf-tr) > 5 ? '   (over 5 °C apart, which often costs you specificity)' : '') : '',
      ''
    ].filter(Boolean);
    if (!res.products.length) {
      lines.push(!res.fHits.length && !res.rHits.length ? 'Neither primer binds this template. No product.'
        : !res.fHits.length ? 'The forward primer does not bind. No product.'
        : !res.rHits.length ? 'The reverse primer does not bind. No product.'
        : 'Both primers bind, but not in an orientation that gives a product. Check that they point toward each other.');
      log('PCR', lines);
      say('No amplicon from these primers.', '#963c32');
      return;
    }
    lines.push('Products:');
    res.products.forEach(p => lines.push('  ' + String(p.len).padStart(6) + ' bp   ' + p.note));
    if (res.products.length > 1) lines.push('', 'More than one product: these primers are not specific on this template.');
    const name = sel.name + ' PCR ' + fmtBp(res.products[0].len);
    addSample({ kind:'fragments', name, frags:res.products });
    log('PCR', lines);
    say('Amplicon: <strong>' + res.products.map(p=>fmtBp(p.len)).join(', ') + '</strong>' +
        (res.products.length>1 ? ' — multiple products' : ''), SAMPLES[SAMPLES.length-1].color);
  } catch (x) { errOn('pcrError', x.message); }
};

$('crisprForm').onsubmit = e => {
  e.preventDefault();
  try {
    errOff('crError');
    const sel = selMolecules('crDna');
    if (!sel) throw new Error('Load a target first.');
    const g = clean($('guide').value);
    if (g.length !== 20) throw new Error('Guide must be exactly 20 nt (the protospacer, without the PAM). You gave ' + g.length + '.');
    const per = sel.mols.map(m => ({ m, r: crispr(m, g, $('nuclease').value) }));
    const res = { nuc: per[0].r.nuc,
                  onTarget: per.flatMap(x => x.r.onTarget),
                  hits: per.flatMap(x => x.r.hits) };
    const lines = [
      'Target:   ' + sel.name + ' (' + sel.mols.length + ' molecule' + (sel.mols.length===1?'':'s') + ')',
      'Nuclease: ' + res.nuc.name + ', PAM ' + res.nuc.pam,
      'Guide:    ' + g + '   GC ' + gc(g).toFixed(0) + '%',
      ''
    ];
    if (!res.onTarget.length) {
      lines.push('No perfect match with an adjacent PAM. No cut.');
      const near = res.hits.filter(h => h.mm > 0).slice(0, 6);
      if (near.length) {
        lines.push('', 'Closest near-matches:');
        near.forEach(h => lines.push('  ' + h.mm + ' mismatch' + (h.mm===1?'':'es') + '  ' + h.proto + '  PAM ' + h.pam + '  strand ' + h.strand));
      }
      log('CRISPR', lines);
      say('No on-target cut for this guide.', '#963c32');
      return;
    }
    lines.push('On-target cuts: ' + res.onTarget.length);
    res.onTarget.forEach(h => lines.push('  blunt cut at ' + (h.cut+1) + '   strand ' + h.strand + '   PAM ' + h.pam));
    const off = res.hits.filter(h => h.mm > 0);
    lines.push('', off.length ? 'Off-target sites within 3 mismatches: ' + off.length : 'No off-target sites within 3 mismatches on this sequence.');
    off.slice(0, 8).forEach(h => {
      const seed = h.proto.slice(-8) !== g.slice(-8);
      lines.push('  ' + h.mm + 'mm  ' + h.proto + '  PAM ' + h.pam + '  @' + (h.cut+1) + (seed ? '' : '   seed-matched, higher risk'));
    });
    let frags = [];
    per.forEach(x => {
      if (x.r.cuts.length) frags = frags.concat(fragmentsFromCuts(x.m, x.r.cuts));
      else frags.push({ seq:x.m.seq, len:x.m.seq.length,
                        l: x.m.l || BLUNT_END('end'), r: x.m.r || BLUNT_END('end'),
                        form: x.m.topology === 'circular' ? 'sc' : 'lin',
                        note:'uncut (no on-target site)', abund:1 });
    });
    const name = sel.name + ' / ' + res.nuc.name;
    addSample({ kind:'fragments', name, frags });
    lines.push('', 'Fragments: ' + frags.map(f => fmtBp(f.len)).join(', ') + '   (blunt ends)');
    if (sel.mols.length === 1 && sel.mols[0].topology === 'circular' && res.onTarget.length === 1)
      lines.push('A single cut in a plasmid linearizes it: one band, same size as the supercoiled starting material but running as linear.');
    log('CRISPR', lines);
    say('<strong>' + res.onTarget.length + '</strong> on-target cut' + (res.onTarget.length===1?'':'s') +
        (off.length ? ', <strong>' + off.length + '</strong> off-target site' + (off.length===1?'':'s') : ', no off-targets'),
        SAMPLES[SAMPLES.length-1].color);
  } catch (x) { errOn('crError', x.message); }
};

$('ligForm').onsubmit = e => {
  e.preventDefault();
  try {
    errOff('ligError');
    const cip   = $('ligCIP').checked;
    const ratio = Math.max(0, +$('ligRatioIn').value);
    const conc  = Math.max(0.01, +$('ligConc').value || 2.5);
    const A = ligSpecies('ligA', conc, cip);
    if (!A.length) throw new Error('Pick a backbone tube. Run a digest first if there is nothing to pick.');

    // Insert mass is set so the molar ratio against the backbone is as asked.
    let B = ligSpecies('ligB', 1, false);
    if (B.length && ratio > 0) {
      const refA = refSpecies(A), refB = refSpecies(B);
      const wantB = ratio * molarity(refA.ngPerUL, refA.len);          // nM
      const haveB = molarity(refB.ngPerUL, refB.len);
      const k = wantB / haveB;
      B.forEach(x => x.ngPerUL *= k);
    } else B = [];

    const species = A.concat(B);
    const prods = ligationProducts(species);
    if (!prods.length) throw new Error('Nothing ligated. Check that the ends in these tubes are compatible.');

    const totalAmt = prods.reduce((a,p) => a + p.amount, 0) || 1;
    const frags = prods.map(p => {
      const parts = p.parts;
      const seq = parts.map(x => x.seq).join('');
      const circular = p.kind === 'circle';
      const label = p.kind === 'unligated' ? 'unligated ' + parts[0].name
        : circular ? (parts.length === 1 ? 'self-circle, ' + parts[0].name
                     : 'circle: ' + parts.map(x=>x.name).join(' + ') + (p.dir === 'reverse' ? ', reversed' : ''))
        : 'linear dimer: ' + parts.map(x=>x.name).join(' + ');
      return { seq, len: seq.length, circular,
               l: circular ? BLUNT_END('ligated') : p.parts[0].l,
               r: circular ? BLUNT_END('ligated') : p.parts[p.parts.length-1].r,
               form: circular ? 'circ' : 'lin',
               note: label, abund: p.amount / totalAmt };
    });

    const name = (B.length ? 'Ligation ' + ratio + ':1' : 'Self-ligation') + (cip ? ' +CIP' : '');
    addSample({ kind:'fragments', name, frags, ligation:true });

    const lines = [
      'Backbone: ' + A[0].tube + '   ' + conc.toFixed(2) + ' ng/\u00b5L',
      'Insert:   ' + (B.length ? B[0].tube + '   ' + ratio + ':1 molar vs backbone'
                                : 'none \u2014 the backbone is ligating with itself (religation control)'),
      cip ? 'Backbone dephosphorylated (CIP/rSAP)' : 'Backbone not dephosphorylated',
      '',
      'Species in the tube:'
    ];
    species.forEach(x => lines.push('  ' + x.name.padStart(8) + '  ' + x.conc.toFixed(2).padStart(7) +
      ' nM   j = ' + jFactor(x.len).toFixed(1).padStart(7) + ' nM   ends ' + endLabel(x.l) + ' / ' + endLabel(x.r)));
    lines.push('', 'A fragment closes on itself when its own j beats the concentration of',
                   'everything else present. Dilute favours circles, concentrated favours concatemers.',
               '', 'Products:', '  share   size      product');
    frags.forEach(f => lines.push('  ' + (100*f.abund).toFixed(1).padStart(5) + '%  ' +
      fmtBp(f.len).padStart(8) + '   ' + f.note + (f.circular ? '  [circular]' : '')));
    const wanted = frags.filter(f => f.circular && f.note.includes('+'));
    const selfLig = frags.filter(f => f.note.startsWith('self-circle'));
    if (selfLig.length && !cip)
      lines.push('', 'Backbone self-ligation is ' + (100*selfLig.reduce((a,f)=>a+f.abund,0)).toFixed(1) +
                     '% of products. Dephosphorylating the backbone suppresses it.');
    lines.push('', 'Circular products are listed but not drawn on the gel: a relaxed circle\u2019s',
                   'mobility has no predictive model here, the same reason nicked DNA is left out.');
    log('Ligation', lines);
    say('<strong>' + frags.length + '</strong> products' +
        (wanted.length ? ' \u00b7 desired circle <strong>' + (100*wanted[0].abund).toFixed(1) + '%</strong>' : '') +
        (selfLig.length ? ' \u00b7 self-ligation ' + (100*selfLig.reduce((a,f)=>a+f.abund,0)).toFixed(1) + '%' : ''),
        SAMPLES[SAMPLES.length-1].color);
  } catch (x) { errOn('ligError', x.message); }
};

/* live readout of what the two numbers actually mean */
function ligRatio() {
  const conc  = Math.max(0.01, +$('ligConc').value || 2.5);
  const ratio = Math.max(0, +$('ligRatioIn').value);
  const A = ligSpecies('ligA', conc, false), B = ligSpecies('ligB', 1, false);
  if (!A.length) { $('ligRatio').textContent = ''; return; }
  const refA = refSpecies(A);
  const cA = molarity(refA.ngPerUL, refA.len);
  $('ligRatio').innerHTML = `Backbone <b>${cA.toFixed(2)} nM</b>` +
    (B.length && ratio > 0 ? ` \u00b7 insert <b>${(cA*ratio).toFixed(2)} nM</b>` : '') +
    ` \u00b7 backbone j = <b>${jFactor(refA.len).toFixed(1)} nM</b>` +
    ` \u00b7 ${jFactor(refA.len) > cA*3 ? 'j dominates, expect circles' : 'concentration competes with j, expect concatemers'}`;
}

/* ---------- transformation ---------- */
let PLATE = null;

$('xfStrain').innerHTML = Object.keys(STRAINS)
  .map(k => `<option value="${k}"${k==='dh5a_chem'?' selected':''}>${STRAINS[k].name} (${STRAINS[k].eff.toExponential(0)} cfu/\u00b5g)</option>`).join('');

$('xfForm').onsubmit = e => {
  e.preventDefault();
  try {
    errOff('xfError');
    const v = $('xfDna').value;
    if (!v) throw new Error('Pick a tube to transform.');
    let sample;
    if (v.startsWith('i:')) {
      const s0 = SAMPLES.find(x => x.id === +v.slice(2));
      // An intact plasmid behaves as a one-species tube.
      sample = { name:s0.name, frags:[{ seq:s0.seq, len:s0.seq.length,
                 circular: s0.topology === 'circular', abund:1,
                 l:BLUNT_END('-'), r:BLUNT_END('-'), note:s0.name }], ligation:false };
    } else {
      sample = SAMPLES.find(x => x.id === +v.slice(2));
    }
    if (!sample) throw new Error('Pick a tube to transform.');

    PLATE = transform(sample, {
      strain: $('xfStrain').value,
      antibiotic: $('xfAbx').value,
      xgal: $('xfXgal').checked,
      relaxed: !!sample.ligation,        // ligation products are relaxed circles
      ng: Math.max(0.1, +$('xfNg').value || 5)
    });
    PLATE.sourceName = sample.name;
    renderPlate();

    const lines = [
      'Tube:     ' + sample.name,
      'Cells:    ' + PLATE.strain.name + '   ' + PLATE.strain.eff.toExponential(0) + ' cfu/\u00b5g',
      'Plate:    ' + ANTIBIOTICS[PLATE.abx].name + (PLATE.xgal ? ' + X-gal/IPTG' : ''),
      'DNA:      ' + (+$('xfNg').value) + ' ng',
      '',
      'Colonies: ' + PLATE.total.toLocaleString() +
        (PLATE.xgal ? '   (' + PLATE.blue.toLocaleString() + ' blue, ' + PLATE.white.toLocaleString() + ' white)' : ''),
      '',
      'colonies   colour   product'
    ];
    PLATE.rows.forEach(r => lines.push('  ' + String(r.colonies).padStart(7) + '   ' +
      (PLATE.xgal ? (r.blue ? 'blue ' : 'white') : '  -  ') + '    ' + r.frag.note +
      '   [' + (r.traits.resistance.join(', ') || 'no resistance gene') + (r.traits.lacZ ? ', lacZ\u03b1 intact' : ', lacZ\u03b1 disrupted') + ']'));
    if (!PLATE.total) lines.push('', 'Nothing grew. Either no product carries resistance to ' +
      ANTIBIOTICS[PLATE.abx].name + ', or only linear DNA was present.');
    if (PLATE.abx === 'none') lines.push('', 'Without selection every cell grows, so a real plate would be a lawn and you could not pick anything.');
    lines.push('', 'Only circular DNA gives colonies. Linear products are degraded by host',
                   'exonucleases and cannot replicate as plasmids, so they are absent from the plate',
                   'however much of them is in the tube.');
    if (sample.ligation) lines.push('Freshly ligated circles are relaxed, so they transform about ' +
      Math.round(1/RELAXED_PENALTY) + '-fold worse than the supercoiled DNA used to quote cell efficiency.');
    lines.push('Counts are for one plate: ' + (100*PLATED_FRACTION) + '% of the recovery was plated.');
    log('Transformation', lines);
    say(PLATE.total ? '<strong>' + PLATE.total.toLocaleString() + '</strong> colonies' +
         (PLATE.xgal ? ' \u00b7 ' + PLATE.blue.toLocaleString() + ' blue, <strong>' + PLATE.white.toLocaleString() + '</strong> white' : '')
       : 'No colonies.', PLATE.total ? '#1c6872' : '#963c32');
  } catch (x) { errOn('xfError', x.message); }
};

function renderPlate() {
  const card = $('plateCard');
  if (!PLATE) { card.hidden = true; return; }
  card.hidden = false;
  $('plateInfo').textContent = PLATE.sourceName + ' \u00b7 ' + PLATE.strain.name +
    ' \u00b7 ' + ANTIBIOTICS[PLATE.abx].name + (PLATE.xgal ? ' + X-gal' : '');
  if (!PLATE.total) {
    $('plateBox').innerHTML = '<div class="lawn">No colonies. Nothing in this tube both survives ' +
      escHtml(ANTIBIOTICS[PLATE.abx].name) + ' and gets taken up efficiently.</div>';
    return;
  }
  if (PLATE.abx === 'none') {
    $('plateBox').innerHTML = '<div class="lawn">No antibiotic: every cell grows, so the plate is a lawn. ' +
      'Nothing can be picked. Selection is what makes a colony mean something.</div>';
    return;
  }
  // No dish drawing. Where colonies sit on a plate is random, and a picture of
  // random dots looks like data without being any. What IS derived is the
  // count per product: the ligation model gives each product's share, that
  // share sets its mass, mass times the strain's measured efficiency gives
  // colony-forming units, and the circularity and resistance filters remove
  // what cannot grow. So the table is the result; the dish was decoration.
  const pct = n => (100 * n / PLATE.total).toFixed(1) + '%';
  const wanted = PLATE.rows.filter(r => /\+/.test(r.frag.note) && r.circular);
  const wantedN = wanted.reduce((a, r) => a + r.colonies, 0);

  $('plateBox').innerHTML =
    `<div class="plate-sum">` +
      `<span>Colonies <b>${PLATE.total.toLocaleString()}</b></span>` +
      (PLATE.xgal ? `<span>Blue <b>${PLATE.blue.toLocaleString()}</b></span>` +
                    `<span>White <b>${PLATE.white.toLocaleString()}</b></span>` +
                    `<span>White <b>${pct(PLATE.white)}</b></span>` : '') +
      (wantedN ? `<span class="good-hit">Carrying an insert <b>${wantedN.toLocaleString()}</b> (${pct(wantedN)})</span>` : '') +
    `</div>` +
    `<table class="ptab"><thead><tr>` +
      (PLATE.xgal ? '<th>Colour</th>' : '') +
      `<th>Product</th><th>Markers</th><th class="n">Colonies</th><th class="n">Share</th>` +
    `</tr></thead><tbody>` +
    PLATE.rows.map(r => `<tr${/\+/.test(r.frag.note) && r.circular ? ' class="want"' : ''}>` +
      (PLATE.xgal ? `<td>${r.blue ? 'blue' : 'white'}</td>` : '') +
      `<td>${escHtml(r.frag.note)}</td>
       <td>${escHtml(r.traits.resistance.join(', ') || 'none')}${r.traits.lacZ ? ', lacZ\u03b1' : ''}</td>
       <td class="n">${r.colonies.toLocaleString()}</td>
       <td class="n">${pct(r.colonies)}</td></tr>`).join('') +
    '</tbody></table>' +
    `<p class="note">Counts follow from each product\u2019s share of the ligation, the mass of DNA plated, ` +
    `and the strain\u2019s efficiency (${PLATE.strain.eff.toExponential(0)} cfu/\u00b5g, a measured value). ` +
    `Only circular DNA carrying ${escHtml(ANTIBIOTICS[PLATE.abx].name)} resistance is counted.</p>`;
}

function pick(which) {
  if (!PLATE || !PLATE.total) return;
  const r = pickColony(PLATE, which);
  if (!r) { say('No ' + which + ' colonies on this plate to pick.', '#963c32'); return; }
  const name = (which === 'blue' ? 'Blue' : 'White') + ' colony, ' + fmtBp(r.frag.len);
  // Only circular DNA can be a colony, so anything picked is a plasmid.
  addSample({ kind:'intact', name, seq:r.frag.seq, topology:'circular' });
  log('Colony picked', [
    'Picked a ' + which + ' colony from ' + PLATE.sourceName + '.',
    '',
    'It carries: ' + r.frag.note,
    'Size:       ' + r.frag.len.toLocaleString() + ' bp circular',
    'Markers:    ' + (r.traits.resistance.join(', ') || 'none') + (r.traits.lacZ ? ', lacZ\u03b1 intact' : ', lacZ\u03b1 disrupted'),
    '',
    'There were ' + r.colonies.toLocaleString() + ' colonies of this kind on the plate, ' +
      (100*r.colonies/PLATE.total).toFixed(1) + '% of the total.',
    'It is now on the bench as a plasmid. Digest it to check you picked what you wanted.'
  ]);
  say('Picked a ' + which + ' colony: <strong>' + escHtml(r.frag.note) + '</strong>',
      SAMPLES[SAMPLES.length-1].color);
}
$('pickBlue').onclick  = () => pick('blue');
$('pickWhite').onclick = () => pick('white');

/* ---------- protocol runner ---------- */
let PROTO_RESULT = null;

const PROTO_EXAMPLE = `# Cut a plasmid, put it back together, and check what you got.
# Each line names what it made; the next line uses that name.

import puc19 as vector

digest vector with EcoRI, HindIII as cut
pcr vector with GTAAAACGACGGCCAGT, CAGGAAACAGCTATGAC as amplicon

ligate cut as rejoined
transform rejoined on ampicillin as plate
pick blue from plate as clone
digest clone with EcoRI, PvuII as check

run cut, amplicon, check on gel`;

$('protoExample').onclick = () => { $('protoText').value = PROTO_EXAMPLE; errOff('protoError'); };

$('protoFile').onchange = ev => {
  const f = ev.target.files && ev.target.files[0];
  if (!f) return;
  const fr = new FileReader();
  fr.onload = () => { $('protoText').value = String(fr.result); errOff('protoError'); runProto(); };
  fr.onerror = () => errOn('protoError', 'Could not read that file.');
  fr.readAsText(f);
  ev.target.value = '';
};

async function runProto() {
  try {
    errOff('protoError');
    const text = $('protoText').value.trim();
    if (!text) throw new Error('Paste a protocol or load the example.');
    const proto = parseProtocol(text);
    if (!proto.steps.length) throw new Error('That protocol has no steps.');
    $('protoSummary').textContent = 'running\u2026';
    PROTO_RESULT = await runProtocol(proto);
    renderProto();
    const r = PROTO_RESULT;
    applyProtoTubes();
    applyProtoGel(r);
    applyProtoPlate(r);
    say(r.passed ? 'Protocol ran: <strong>' + r.report.length + '</strong> steps, all fine.'
                 : '<strong>' + r.failed + '</strong> step' + (r.failed===1?'':'s') + ' could not run.',
        r.passed ? '#2f5a22' : '#963c32');
    log('Protocol', [
      proto.steps.length + ' steps' + (r.failed ? ', ' + r.failed + ' could not run.' : ', all ran.'),
      '',
      ...r.report.map(x => (x.ok ? '  ' : '  ! ') + String(x.n).padStart(2) + '. ' +
        (x.src || x.step) + (x.ok && x.result ? '\n        ' + x.result
                                              : x.error ? '\n        ' + x.error : '') +
        stepNotes(x).map(n => '\n        ' + n).join('')),
      '',
      'Every tube is on the bench. Tick one to run it on the gel, or click its',
      'name to see the map, sequence and features.'
    ]);
  } catch (x) { errOn('protoError', x.message); }
}
$('protoForm').onsubmit = e => { e.preventDefault(); runProto(); };

/* A load step can carry context about the record it pulled: what the
   submitter called it, and whether it came with a feature table at all. */
function stepNotes(x) {
  const out = [];
  if (x.about) out.push(x.about);
  if (x.annot) out.push(x.annot);
  return out;
}

function renderProto() {
  const card = $('protoCard');
  if (!PROTO_RESULT) { card.hidden = true; return; }
  card.hidden = false;
  const r = PROTO_RESULT;
  $('protoSummary').textContent = r.report.length + ' steps';
  const head = r.failed
    ? `<div class="psum bad"><b>${r.failed} step${r.failed===1?'':'s'} could not run</b><span>the rest completed</span></div>`
    : `<div class="psum good"><b>All ${r.report.length} steps ran</b><span>every tube is on the bench</span></div>`;
  $('protoBox').innerHTML = head + r.report.map(x =>
    `<div class="pstep ${x.ok?'good':'bad'}">
      <div class="ph"><span class="pn">${x.n}</span><code class="psrc">${escHtml(x.src || x.step)}</code></div>` +
      (x.ok ? (x.result ? `<div class="pres">${escHtml(x.result)}</div>` : '')
            : `<div class="pres pfail">${escHtml(x.error)}</div>`) +
      stepNotes(x).map(n => `<div class="pnote">${escHtml(n)}</div>`).join('') +
    `</div>`).join('');
}

/* A protocol that plates something should show that plate, the same as the
   Transform tab does. The last plate made is the one on the bench. */
function applyProtoPlate(r) {
  const p = r.report.slice().reverse().find(x => x.ok && x.plate);
  if (!p) return;
  PLATE = p.plate;
  PLATE.sourceName = PLATE.sourceName || p.src || 'protocol';
  renderPlate();
}

/* A "run ... on gel" line is an instruction about the gel, so carry its
   settings and its lane choice onto the real gel rather than ignoring them. */
function applyProtoGel(r) {
  const g = r.report.slice().reverse().find(x => x.ok && x.gelRun);
  if (!g) return;
  Object.assign(RUN, g.gelRun);
  $('agarose').value = RUN.pct;
  $('volts').value   = RUN.volts;
  $('minutes').value = RUN.minutes;
  $('rig').value     = 'custom';
  applyRig();
  // Only the lanes the protocol named are loaded.
  const want = new Set(g.gelLanes || []);
  if (want.size) SAMPLES.forEach(s => { s.on = want.has(s.name); });
  renderBench(); redraw();
}

/* Tubes go onto the bench automatically: the point of running a protocol is
   to look at what came out. */
function applyProtoTubes() {
  if (!PROTO_RESULT) return;
  Object.keys(PROTO_RESULT.tubes).forEach(name => {
    const t = PROTO_RESULT.tubes[name];
    if (t.kind === 'plate') return;
    if (SAMPLES.some(s => s.name === name)) return;
    addSample(t.kind === 'intact'
      ? { kind:'intact', name, seq:t.seq, topology:t.topology }
      : { kind:'fragments', name, frags:t.frags, ligation:!!t.ligation });
  });
}

$('protoSave').onclick = () => {
  if (!PROTO_RESULT) return;
  const r = PROTO_RESULT;
  const lines = ['Smart Turtle protocol', r.report.length + ' steps', ''];
  r.report.forEach(x => {
    lines.push((x.ok ? '  ' : '! ') + x.n + '. ' + (x.src || x.step));
    if (x.result) lines.push('       ' + x.result);
    if (x.error)  lines.push('       ' + x.error);
    stepNotes(x).forEach(n => lines.push('       ' + n));
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines.join('\n')], {type:'text/plain'}));
  a.download = 'protocol-report.txt';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

/* ---------- NCBI search and import ---------- */
let NCBI_HITS = [];

const fmtLen = n => n >= 1e6 ? (n/1e6).toFixed(1) + ' Mb'
                  : n >= 1000 ? (n/1000).toFixed(n >= 1e5 ? 0 : 1) + ' kb'
                  : n + ' bp';

/* Flag records by whether their size suits cloning. A megabase hit is a
   genome, and taking one whole is almost never what someone means. */
function sizeClass(n) {
  if (!n) return '';
  if (n > 300000) return 'big';
  if (n >= 500 && n <= 60000) return 'right';
  return '';
}

$('ncbiGo').onclick = async () => {
  const q = $('ncbiQ').value.trim();
  if (!q) { $('ncbiStatus').textContent = 'Type something to search for.'; return; }
  $('ncbiStatus').textContent = 'Searching NCBI\u2026';
  $('ncbiHits').innerHTML = '';
  try {
    NCBI_HITS = await ncbiSearch(q, 20);
    if (!NCBI_HITS.length) { $('ncbiStatus').textContent = 'Nothing found for "' + q + '".'; return; }
    NCBI_HITS.sort((a,b) => (sizeClass(b.length)==='right') - (sizeClass(a.length)==='right'));
    $('ncbiStatus').innerHTML = NCBI_HITS.length + ' results. Green lengths are a sensible size to clone; ' +
      'red ones are whole genomes \u2014 open the slice option below to take only the part you want.';
    $('ncbiHits').innerHTML = NCBI_HITS.map((h,i) =>
      `<div class="hit ${sizeClass(h.length)}" data-i="${i}" title="${escHtml(h.title)}">
        <span class="acc">${escHtml(h.accession)}</span>
        <span class="ttl">${escHtml(h.title)}</span>
        <span class="len">${fmtLen(h.length)}</span></div>`).join('');
    $('ncbiHits').querySelectorAll('.hit').forEach(el =>
      el.onclick = () => importHit(NCBI_HITS[+el.dataset.i]));
  } catch (err) {
    ncbiBlocked(err, eutilsURL('esearch', { db:'nuccore', term:q, retmax:20, retmode:'json' }));
  }
};
$('ncbiQ').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); $('ncbiGo').click(); } };

async function importHit(hit) {
  const geneTxt = $('ncbiGene').value.trim();
  const up = Math.max(0, +$('ncbiUp').value || 0);
  $('ncbiStatus').textContent = 'Fetching ' + hit.accession + '\u2026';
  try {
    let text, note = '';
    if (geneTxt) {
      // Fetch the record's annotation first, then pull out only what was asked
      // for. A big record is fetched again as a slice, so nothing large is kept.
      const whole = await ncbiFetch(hit.accession, { rettype:'gb' });
      const names = geneTxt.split(/[\s,]+/).filter(Boolean);
      const loc = names.length > 1 ? locateCluster(whole, names, up)
                                   : locateGene(whole, names[0], up, 0);
      if (!loc) throw new Error('Could not find ' + names.join(', ') + ' in ' + hit.accession +
        '. Its feature table lists: ' + (parseGenBankFeatures(whole, Infinity).map(f=>f.name).slice(0,12).join(', ') || 'nothing') + '.');
      text = await ncbiFetch(hit.accession, { rettype:'gb', start: loc.start, stop: loc.stop });
      note = (loc.genes ? loc.genes.join(' + ') : loc.name) + ', ' +
             loc.start.toLocaleString() + '\u2013' + loc.stop.toLocaleString() +
             (up ? ' including ' + up + ' bp upstream' : '');
      if (loc.missing && loc.missing.length) note += '   (not found: ' + loc.missing.join(', ') + ')';
    } else {
      if (hit.length > 300000 && !confirm(hit.accession + ' is ' + fmtLen(hit.length) +
          '. That is a genome, not a gene. Import all of it anyway?')) {
        $('ncbiStatus').textContent = 'Cancelled. Name a gene in the slice option to take only part of it.';
        return;
      }
      text = await ncbiFetch(hit.accession, { rettype:'gb' });
    }
    const p = parseSequence(text, hit.accession);
    addSample({ kind:'intact', name: p.name || hit.accession, seq:p.seq,
                topology:p.topology, gbText: p.gbText, desc: p.desc });
    const feats = SAMPLES[SAMPLES.length-1].feats || [];
    $('ncbiStatus').innerHTML = 'Imported <b>' + escHtml(hit.accession) + '</b>, ' +
      p.seq.length.toLocaleString() + ' bp' + (note ? ' \u2014 ' + escHtml(note) : '') + '.';
    log('Imported from NCBI', [
      'Accession: ' + hit.accession,
      'Title:     ' + hit.title,
      note ? 'Region:    ' + note : 'Region:    whole record',
      'Length:    ' + p.seq.length.toLocaleString() + ' bp ' + p.topology,
      '',
      'Features found: ' + (feats.length ? feats.map(f => f.name).join(', ') : 'none'),
      '',
      'NCBI places no restrictions on redistributing GenBank data, though individual',
      'submitters may claim rights in what they deposited.'
    ]);
  } catch (err) {
    ncbiBlocked(err, eutilsURL('efetch', { db:'nuccore', id:hit.accession, rettype:'gb', retmode:'text' }));
  }
}

/* A browser may refuse the cross-origin call; NCBI does not document whether
   it allows one. Rather than guess, say what happened and hand over the URL,
   which always works when opened directly. */
function ncbiBlocked(err, url) {
  const looksLikeCORS = err instanceof TypeError || /fetch|network|cors/i.test(err.message || '');
  $('ncbiStatus').innerHTML = escHtml(looksLikeCORS
    ? 'Your browser would not let this page call NCBI directly.'
    : err.message);
  $('ncbiHits').innerHTML = `<div class="ncbi-manual">` +
    (looksLikeCORS ? 'Open this link, save the file, then use the upload box below. It is the same request.'
                   : 'You can also fetch it by hand:') +
    `<br><a href="${escHtml(url)}" target="_blank" rel="noopener">${escHtml(url)}</a></div>`;
}

/* ---------- exports ----------
   A record you pulled from NCBI is worth keeping outside the tool: the
   feature table as CSV for a spreadsheet, the sequence as FASTA text for
   anything else. Both are built from the same data the viewer shows. */
function download(name, text, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: mime || 'text/plain' }));
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
const safeName = s => String(s).replace(/[^\w.-]+/g, '_').replace(/^_+|_+$/g, '') || 'sequence';

/* What the viewer is currently showing: a whole molecule, or one fragment. */
function viewerSubject() {
  if (!ACTIVE) return null;
  if (ACTIVE.kind === 'intact')
    return { name: ACTIVE.name, seq: ACTIVE.seq, topology: ACTIVE.topology,
             feats: ACTIVE.feats || (ACTIVE.feats = annotate(ACTIVE)) };
  const fr = mainFrags(ACTIVE)[SEG];
  if (!fr) return null;
  fragDna(ACTIVE, fr, SEG);
  return { name: fr._dna.name, seq: fr.seq, topology: fr._dna.topology,
           feats: fr._feats, frag: fr };
}

/* A fragment's ends are part of what it IS, so both exports carry them. A
   circular molecule has none, and an intact linear one keeps whatever ends
   it was loaded or built with. */
function endNote(s) {
  if (s.topology === 'circular' || !s.frag) return '';
  return ", 5' end " + endLabel(s.frag.l) + ", 3' end " + endLabel(s.frag.r);
}

const csvCell = v => {
  const t = String(v === undefined || v === null ? '' : v);
  return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
};

$('saveCsv').onclick = () => {
  const s = viewerSubject(); if (!s) return;
  const rows = [['name','type','kind','start','end','length_bp','strand','source','protein_aa']];
  s.feats.forEach(f => rows.push([
    f.name, f.type || '', f.kind || '', f.start + 1, f.end, f.len,
    f.strand === -1 ? 'complement' : 'forward', f.src || '',
    f.prot ? f.prot.length : ''
  ]));
  // A header line keeps the file self-describing once it leaves the tool.
  const head = '# ' + s.name + ', ' + s.seq.length + ' bp ' + s.topology +
               endNote(s) + ', ' + s.feats.length + ' features, GC ' +
               gc(s.seq).toFixed(1) + '%\n';
  download(safeName(s.name) + '_features.csv',
           head + rows.map(r => r.map(csvCell).join(',')).join('\n') + '\n', 'text/csv');
  say('Saved <strong>' + s.feats.length + '</strong> features as CSV.', '#1c6872');
};

$('saveSeq').onclick = () => {
  const s = viewerSubject(); if (!s) return;
  const wrapped = s.seq.replace(/(.{60})/g, '$1\n').replace(/\n$/, '');
  // FASTA splits the header at the first space: the ID cannot contain one,
  // but everything after it is free text, so the readable name goes there
  // rather than being mangled into the ID.
  const id = safeName(s.name);
  const desc = id === s.name ? '' : s.name + ', ';
  const text = '>' + id + ' ' + desc + s.seq.length + ' bp ' + s.topology +
               endNote(s) + '\n' + wrapped + '\n';
  download(safeName(s.name) + '.txt', text, 'text/plain');
  say('Saved <strong>' + s.seq.length.toLocaleString() + ' bp</strong> as FASTA text.', '#1c6872');
};

/* ---------- wiring ---------- */
TABS.forEach(([b]) => $(b).onclick = () => tab(b));
$('preset').onchange = presetNote;
$('cutDna').onchange = buildEnzPicker;
/* Rigs. Gel length is the run direction of the tray, the dimension the
   manufacturer lists second. Electrode gap is NOT published by either
   manufacturer, so the Wide Mini-Sub value is back-calculated from
   Bio-Rad's own figure for that cell, bromophenol blue at ~4.5 cm/hr at
   75 V, which this model reproduces with an 18.0 cm gap. The Mini-Sub
   gap has no equivalent published datum and is an estimate. */
const RIGS = {
  wide10: { gapCm:18, gelCm:10, est:false },
  wide7:  { gapCm:18, gelCm:7,  est:false },
  mini10: { gapCm:15, gelCm:10, est:true  },
  mini7:  { gapCm:15, gelCm:7,  est:true  }
};
function applyRig() {
  const key = $('rig').value, custom = key === 'custom';
  $('gapWrap').hidden = !custom;
  $('gelWrap').hidden = !custom;
  if (!custom) { $('gapCm').value = RIGS[key].gapCm; $('gelCm').value = RIGS[key].gelCm; }
  syncRun();
}

/* Run conditions feed the physics model, so any change re-derives every band. */
const RUN_FIELDS = { agarose:'pct', volts:'volts', gapCm:'gapCm', gelCm:'gelCm', minutes:'minutes' };
function syncRun() {
  Object.keys(RUN_FIELDS).forEach(id => {
    const v = parseFloat($(id).value);
    if (isFinite(v) && v > 0) RUN[RUN_FIELDS[id]] = v;
  });
  const E = RUN.volts / Math.max(0.5, RUN.gapCm);
  const xo = crossoverBp(RUN.pct);
  const dye = dyeFront(RUN);
  const rig = RIGS[$('rig').value];
  const warn = (E > 8 ? '  \u00b7 above ~8 V/cm real gels lose resolution and heat; this model does not capture that'
              : E < 1 ? '  \u00b7 very low field, expect a long run' : '')
             + (rig && rig.est ? '  \u00b7 this rig\u2019s electrode gap is estimated, not published' : '');
  $('runInfo').innerHTML =
    // Deliberately NOT called "pore radius": poreAt1pct is a fitted scale
    // constant, not a measured pore size, and printing it as nanometres of
    // real gel structure would be inventing a measurement for the reader.
    `<b>${E.toFixed(1)} V/cm</b> \u00b7 sieving scale ${poreRadius(RUN.pct).toFixed(0)} nm ` +
    `<span title="Fitted length scale that sets where sieving gives way to reptation. Calibrated against published resolving ranges, not a measured pore size.">(fitted)</span> ` +
    `\u00b7 Ogston\u2192reptation crossover near <b>${Math.round(xo).toLocaleString()} bp</b> ` +
    `\u00b7 dye front ${dye > RUN.gelCm ? 'off gel' : dye.toFixed(1) + ' cm'}${warn}`;
  redraw();
}
Object.keys(RUN_FIELDS).forEach(id => { $(id).oninput = syncRun; $(id).onchange = syncRun; });
$('rig').onchange = applyRig;
['ladder','showSizes'].forEach(id => $(id).onchange = redraw);
$('saveSvg').onclick = saveSvg;
$('reset').onclick = () => {
  SAMPLES.length = 0; uid = 0; ACTIVE = null;
  $('output').textContent = 'No reactions yet.';
  $('readout').hidden = true;
  renderBench(); refreshPickers(); renderViewer(); redraw();
};
$('mapView').onclick  = () => { VIEW='map';  viewTabs(); };
$('seqView').onclick  = () => { VIEW='seq';  viewTabs(); };
$('featView').onclick = () => { VIEW='feat'; viewTabs(); };
function viewTabs() {
  $('mapView').classList.toggle('active', VIEW==='map');
  $('seqView').classList.toggle('active', VIEW==='seq');
  $('featView').classList.toggle('active', VIEW==='feat');
  renderViewer();
}
['ligA','ligB','ligRatioIn','ligConc'].forEach(i => { $(i).oninput = ligRatio; $(i).onchange = ligRatio; });
$('siteMode').onchange = e => { SITE_MODE = e.target.value; renderViewer(); };
$('transToggle').onchange = e => { SHOW_TRANS = e.target.checked; renderViewer(); };
$('saveMap').onclick = saveMapSvg;
window.addEventListener('resize', () => { redraw(); if (VIEW==='map') renderViewer(); });

fillPresets(); renderBench(); refreshPickers(); renderViewer(); applyRig(); ligRatio();

/* expose the engine for testing and for the companion tools */
window.SmartTurtleDNA = { ENZYMES, cutSites, digest, pcr, crispr, ligate, tm, gc,
                          rc, clean, parseSequence, mobility, fragmentsFromCuts,
                          endsOf, compatible, flipEnd, matchSig, PROTEIN_SIGS,
                          collisionRate, uptakeForSize, REF_PLASMID_BP,
                          annotate, findORFs, findMotifs,
                          findMCS, translate, mapSVG, PUC19,
                          PHYS, wlcRg, poreRadius, crossoverBp, mobility, migrate, sieveFactor,
                          dyeFront, RUN, duplexOf, stickyHTML, fragmentsHTML,
                          endLabel, jFactor, molarity, ligationProducts, ligSpecies,
                          canJoin, SAMPLES, selMolecules, refSpecies,
                          ncbiSearch, ncbiFetch, eutilsURL, locateGene, locateCluster,
                          parseGenBankFeatures, featureKeys, sizeClass,
                          parseProtocol, parseProtocolText, runProtocol,
                          PROTO_EXAMPLE, PRESETS, VERBS,
                          STRAINS, ANTIBIOTICS, transform, plasmidTraits,
                          pickColony, LINEAR_PENALTY, RELAXED_PENALTY,
                          PLATED_FRACTION, getPlate: () => PLATE };
})();
