// O.ZONE — Build configurator
// Self-contained: data + state + render. No frameworks.
(() => {

  // ===== DATA =====
  // Coverage flags map a lens to which back format families it can image.
  // Backs reference these via lens.covers[backId].
  // instaxRequiresFW69 = lens shoots Instax only if body === 'fw69' (full coverage).
  const DATA = {
    bodies: [
      {
        id: 'sl45',
        name: 'SL45',
        tag: 'Flagship',
        desc: 'The newest, slimmest O.ZONE. Interchangeable lens cones unlock the full lineup.',
        img: 'SL45 image/O-Zone SL456.jpeg'
      },
      {
        id: 'fw69',
        name: 'FW69',
        tag: 'Instax specialist',
        desc: 'Optimised for Mamiya Press lenses on Instax Wide. Full coverage, no vignette.',
        img: 'FW69 image/1778079128.webp'
      },
      {
        id: 'mk8',
        name: 'Mk.8 / Mk.G',
        tag: 'Origin · Compact',
        desc: 'The smallest 6×7 / 6×9 medium format setup. 2×3 backs only. Mamiya Press lenses only.',
        img: 'MK.8 image/1778079077.webp'
      }
    ],

    cones: [
      {
        id: 'slim',
        name: 'Slim Cone',
        tag: 'Native to SL45',
        desc: 'For Rodenstock Grandagon 55 / 75 mm. The slimmest setup.'
      },
      {
        id: 'mp',
        name: 'MP Cone',
        tag: 'Mamiya / Nikkor / Grandagon 90 / Super-Angulon 90',
        desc: 'Extends flange distance for the Mamiya Press lineup, Nikkor SW 65, Rodenstock Grandagon 90 and Schneider Super-Angulon 90 variants (subject to fit).'
      }
    ],

    // mm = focal length (used for viewfinder filtering).
    // covers = which back IDs this lens can image.
    lenses: [
      // SL45 + Slim Cone
      { id: 'rg55',  name: 'Rodenstock Grandagon 55 mm',          mm: 55, tag: 'Ultra-wide · ~19 mm equiv on 6×12',
        bodies: ['sl45'], cone: 'slim',
        covers: { '6x12': true, '6x9': true, '6x7': true, '4x5': true, 'instax': false, '2x3': true } },
      { id: 'rgn75', name: 'Rodenstock Grandagon-N 75 mm f/4.5', mm: 75, tag: 'Recommended · 75 mm · ~26 mm equiv on 6×12',
        bodies: ['sl45'], cone: 'slim',
        covers: { '6x12': true, '6x9': true, '6x7': true, '4x5': true, 'instax': true,  '2x3': true } },

      // Mamiya Press (SL45 + MP Cone, FW69, Mk.8)
      // Per maker: only 75mm and 127mm cover 6×12 and 4×5 (slight vignette on 4×5).
      // Other Mamiya lenses cover up to 6×9 and Instax (full coverage on FW69 only).
      { id: 'mp50',  name: 'Mamiya Press 50 mm f/6.3',           mm: 50,  tag: 'Ultra-wide · "Street sweeper"',
        bodies: ['sl45','fw69','mk8'], cone: 'mp', instaxRequiresFW69: true,
        covers: { '6x12': false, '6x9': true, '6x7': true, '4x5': false, 'instax': true, '2x3': true } },
      { id: 'mp65',  name: 'Mamiya Press 65 mm f/6.3',           mm: 65,  tag: 'Wide · Forgiving',
        bodies: ['sl45','fw69','mk8'], cone: 'mp', instaxRequiresFW69: true,
        covers: { '6x12': false, '6x9': true, '6x7': true, '4x5': false, 'instax': true, '2x3': true } },
      { id: 'mp75',  name: 'Mamiya Press 75 mm f/5.6',           mm: 75,  tag: 'Wide-normal · Covers 6×12',
        bodies: ['sl45','fw69','mk8'], cone: 'mp',
        covers: { '6x12': true, '6x9': true, '6x7': true, '4x5': true, 'instax': true, '2x3': true } },
      { id: 'mp100', name: 'Mamiya Press 100 mm f/2.8 / 3.5',    mm: 100, tag: 'Normal · Fast',
        bodies: ['sl45','fw69','mk8'], cone: 'mp', instaxRequiresFW69: true,
        covers: { '6x12': false, '6x9': true, '6x7': true, '4x5': false, 'instax': true, '2x3': true } },
      { id: 'mp127', name: 'Mamiya Press 127 mm f/4.7',          mm: 127, tag: 'Short tele · Covers 6×12',
        bodies: ['sl45','fw69','mk8'], cone: 'mp',
        covers: { '6x12': true, '6x9': true, '6x7': true, '4x5': true, 'instax': true, '2x3': true } },
      { id: 'mp250', name: 'Mamiya Press 250 mm f/5',            mm: 250, tag: 'Telephoto',
        bodies: ['sl45','fw69','mk8'], cone: 'mp', instaxRequiresFW69: true,
        covers: { '6x12': false, '6x9': true, '6x7': true, '4x5': false, 'instax': true, '2x3': true } },

      // SL45 + MP Cone, FW69 (large format glass — no Mk.8)
      { id: 'nik65', name: 'Nikkor SW 65 mm f/4',                  mm: 65, tag: 'Recommended · 65 mm · ~22 mm equiv on 6×12',
        bodies: ['sl45','fw69'], cone: 'mp',
        covers: { '6x12': true, '6x9': true, '6x7': true, '4x5': true, 'instax': false, '2x3': true } },
      { id: 'rg90',  name: 'Rodenstock Grandagon 90 mm f/6.8',     mm: 90, tag: 'Recommended · 90 mm · ~31 mm equiv on 6×12',
        bodies: ['sl45','fw69'], cone: 'mp',
        covers: { '6x12': true, '6x9': true, '6x7': true, '4x5': true, 'instax': true,  '2x3': true } },
      { id: 'sa90',     name: 'Schneider Super-Angulon 90 mm f/5.6', mm: 90, tag: 'Classic · check fit',
        bodies: ['sl45','fw69'], cone: 'mp',
        warn: 'Rear glass diameter varies between production iterations. Confirm fit with O.ZONE before ordering — Rodenstock Grandagon 90 f/6.8 is the safer default.',
        covers: { '6x12': true, '6x9': true, '6x7': true, '4x5': true, 'instax': true,  '2x3': true } },
      { id: 'sa90xl',   name: 'Schneider Super-Angulon 90 mm f/5.6 XL', mm: 90, tag: 'XL · Lens-locked · check fit',
        bodies: ['sl45','fw69'], cone: 'mp',
        warn: 'XL designs are typically non-exchangeable — likely requires a dedicated cone (similar to the older 47 mm XL). Must be discussed with O.ZONE before ordering. Rodenstock Grandagon 90 f/6.8 is the safer default.',
        covers: { '6x12': true, '6x9': true, '6x7': true, '4x5': true, 'instax': true,  '2x3': true } },
      { id: 'sa90f8',   name: 'Schneider Super-Angulon 90 mm f/8',  mm: 90, tag: 'Compact · check fit',
        bodies: ['sl45','fw69'], cone: 'mp',
        warn: 'Rear glass diameter varies between production iterations. Confirm fit with O.ZONE before ordering — Rodenstock Grandagon 90 f/6.8 is the safer default.',
        covers: { '6x12': true, '6x9': true, '6x7': true, '4x5': true, 'instax': true,  '2x3': true } }
    ],

    backs: [
      { id: '6x12',      name: 'Horseman 6×12 Roll Film Back',     tag: 'Our pick · 6×12',
        desc: '120 film · 56 × 112 mm panoramic · 6 frames per roll · 4×5 mount.',
        supports: ['sl45','fw69'] },
      { id: '6x9',       name: 'Horseman 6×9 Roll Film Back',
        desc: '120 film · 56 × 84 mm · 8 frames per roll · 4×5 mount.',
        supports: ['sl45','fw69'] },
      { id: '6x7',       name: 'Horseman 6×7 Roll Film Back',
        desc: '120 film · 56 × 72 mm · 10 frames per roll · 4×5 mount.',
        supports: ['sl45','fw69'] },
      { id: 'instax',    name: 'LomoGraflok 4×5 Instant Back',
        desc: 'Fuji Instax Wide · 99 × 62 mm prints · battery powered.',
        supports: ['sl45','fw69'] },
      { id: '4x5',       name: '4×5 Sheet Film Holder',
        desc: 'Standard double dark slides · 2 sheets per holder.',
        supports: ['sl45','fw69'] },
      { id: 'grafmatic', name: '4×5 Grafmatic',                     tag: 'Rapid load',
        desc: 'Holds six 4×5 sheet films in one back. Faster shot-to-shot than swapping double dark slides.',
        coverageKey: '4x5',
        supports: ['sl45','fw69'] },
      { id: '2x3',       name: '2×3 Roll Back (RB67 / Graflex / Horseman MF)',
        desc: '120 film · 6×7 / 6×9 negatives via 2×3 mount.',
        supports: ['sl45','fw69','mk8'] }
    ],

    viewfinders: [
      { id: 'leica',     name: 'Leica Universal Finder + O.ZONE mask',
        desc: 'The "Frankenfinder". Native 16–28 mm framelines plus the O.ZONE 65 / 75 mm mask for 6×7 and 6×12.',
        focalRange: { min: 0, max: 75 } },
      { id: 'linhof',    name: 'Linhof Multifocus Finder',
        desc: '75 mm – 300+ mm · 4×5-native · ships with Linhof masks plus O.ZONE-specific masks.',
        focalRange: { min: 75, max: 9999 } },
      { id: 'horseman',  name: 'Horseman SW612 Finder',
        desc: 'Panoramic-native finder built around the 6×12 frame.' },
      { id: 'ttartisan', name: 'TTArtisan 35 mm finder',
        desc: 'Budget brightline finder. DIY tape mask for your aspect ratio.' },
      { id: 'phone',     name: 'Phone via MagSafe + cold-shoe adapter',
        desc: 'Use any camera app with a focal-length overlay.' }
    ],

    meters: [
      { id: 'ld30',  name: 'L.D. Meter — 30°',                  desc: 'Designed by CHi · general scene metering · EV direct readout. The default.' },
      { id: 'ld7',   name: 'L.D. Meter — 7° (spot)',             desc: 'Designed by CHi · spot metering · for landscape and zone work.' },
      { id: 'reflx', name: 'Reflx Lab Distance / Light Meter',    desc: 'Combined distance + light readout · newer generation.' },
      { id: 'other', name: 'Other shoe-mount or handheld meter',   desc: 'Hedeco · Sekonic · Keks · any meter that gives raw EV.' }
    ],

    flashes: [
      { id: 'godox', name: 'Godox iA32',           desc: 'Compact · GN32 · 2× AA · auto-thyristor.' },
      { id: 'sb800', name: 'Nikon SB-800',          desc: 'Powerhouse · GN38 · 4× AA · multi-stop thyristor.' },
      { id: 'other', name: 'Other thyristor flash', desc: 'Vivitar 283/285 · Metz mecablitz · vintage Sunpak — anything with an "A" mode + face sensor.' },
      { id: 'none',  name: 'None — natural light only', desc: 'Skip the flash entirely. Many O.ZONE shooters never use one.' }
    ],

    extras: [
      { id: 'pcsync',     name: 'Hot-shoe → PC sync adapter',          desc: 'Required to use any modern flash with the Copal lens shutter.' },
      { id: 'nd8',        name: 'ND8 (3-stop) filter',                  desc: 'Mandatory for shooting Instax outdoors — Copal caps at 1/500s.' },
      { id: 'stepup',     name: '67→82 mm step-up + 82 mm WA hood',     desc: 'Anti-flare for the Nikkor SW 65 and other 67 mm lenses.' },
      { id: 'centernd',   name: 'Center ND filter',                     desc: 'Corrects edge falloff on ultra-wide large format lenses (Grandagon 55, etc.).' },
      { id: 'laser',      name: 'Laser rangefinder',                    desc: 'Pocket measure (Bosch / Mileseey) — the most-used focus tool.' },
      { id: 'hyperfocal', name: 'Hyperfocal cards',                     desc: 'Per-lens DOF cards for zone focusing.' }
    ],

    // 3D-printed viewfinder masks. Multi-select; finder filters availability.
    // Format strings use × (multiplication sign) to display nicely.
    masks: [
      // Leica Universal Finder — 65/75 × (6×7, 6×12, Instax)
      { id: 'leica-65-6x7',    finder: 'leica',    focal: 65, format: '6×7' },
      { id: 'leica-65-6x12',   finder: 'leica',    focal: 65, format: '6×12' },
      { id: 'leica-65-instax', finder: 'leica',    focal: 65, format: 'Instax' },
      { id: 'leica-75-6x7',    finder: 'leica',    focal: 75, format: '6×7' },
      { id: 'leica-75-6x12',   finder: 'leica',    focal: 75, format: '6×12' },
      { id: 'leica-75-instax', finder: 'leica',    focal: 75, format: 'Instax' },

      // Linhof Multifocus — 75/90/127 × (6×7, 6×9, 6×12, 4×5, Instax)
      { id: 'linhof-75-6x7',    finder: 'linhof', focal: 75,  format: '6×7' },
      { id: 'linhof-75-6x9',    finder: 'linhof', focal: 75,  format: '6×9' },
      { id: 'linhof-75-6x12',   finder: 'linhof', focal: 75,  format: '6×12' },
      { id: 'linhof-75-4x5',    finder: 'linhof', focal: 75,  format: '4×5' },
      { id: 'linhof-75-instax', finder: 'linhof', focal: 75,  format: 'Instax' },
      { id: 'linhof-90-6x7',    finder: 'linhof', focal: 90,  format: '6×7' },
      { id: 'linhof-90-6x9',    finder: 'linhof', focal: 90,  format: '6×9' },
      { id: 'linhof-90-6x12',   finder: 'linhof', focal: 90,  format: '6×12' },
      { id: 'linhof-90-4x5',    finder: 'linhof', focal: 90,  format: '4×5' },
      { id: 'linhof-90-instax', finder: 'linhof', focal: 90,  format: 'Instax' },
      { id: 'linhof-127-6x7',    finder: 'linhof', focal: 127, format: '6×7' },
      { id: 'linhof-127-6x9',    finder: 'linhof', focal: 127, format: '6×9' },
      { id: 'linhof-127-6x12',   finder: 'linhof', focal: 127, format: '6×12' },
      { id: 'linhof-127-4x5',    finder: 'linhof', focal: 127, format: '4×5' },
      { id: 'linhof-127-instax', finder: 'linhof', focal: 127, format: 'Instax' },

      // Horseman SW612 — 55/65/75 × 6×12 only
      { id: 'sw612-55-6x12', finder: 'horseman', focal: 55, format: '6×12' },
      { id: 'sw612-65-6x12', finder: 'horseman', focal: 65, format: '6×12' },
      { id: 'sw612-75-6x12', finder: 'horseman', focal: 75, format: '6×12' }
    ]
  };

  // Finders that have a mask system. Others (TTArtisan, Phone) skip the masks step.
  const FINDERS_WITH_MASKS = ['leica', 'linhof', 'horseman'];

  // ===== STATE =====
  const state = {
    body: null,
    cone: null,
    lens: null,
    back: null,           // primary back
    secondaryBack: null,  // optional second back
    viewfinder: null,
    masks: new Set(),     // selected native mask IDs (multi-select)
    customMasks: [],      // [{ focal: '50', aspect: '6×7' }, ...]
    meter: null,
    flash: null,
    extras: new Set()
  };

  const STEPS = ['body','cone','lens','back','secondaryBack','viewfinder','masks','meter','flash','extras'];

  // ===== HELPERS =====
  const find = (cat, id) => DATA[cat].find(x => x.id === id);

  function backIsAvailable(back, slot = 'primary') {
    if (!state.body) return false;
    if (!back.supports.includes(state.body)) return false;
    // Mk.8 only supports 2×3 backs
    if (state.body === 'mk8' && back.id !== '2x3') return false;
    // Don't show the same back as both primary and secondary
    if (slot === 'secondary' && back.id === state.back) return false;

    const lens = state.lens && find('lenses', state.lens);
    const coverKey = back.coverageKey || back.id;
    if (lens && lens.covers && lens.covers[coverKey] === false) return false;

    // Instax with Mamiya wider than 75 — full coverage requires FW69
    if (back.id === 'instax' && lens && lens.instaxRequiresFW69 && state.body !== 'fw69') return false;

    return true;
  }

  function backWarning(back) {
    const lens = state.lens && find('lenses', state.lens);
    if (!lens) return null;
    const coverKey = back.coverageKey || back.id;

    if (lens.covers && lens.covers[coverKey] === false) {
      return `${lens.name} doesn't cover this back format.`;
    }
    if (back.id === 'instax' && lens.instaxRequiresFW69 && state.body !== 'fw69') {
      return `Full Instax coverage with this lens requires the FW69 body.`;
    }
    // Mamiya 75 / 127 on any 4×5 back — slight vignette
    if ((back.id === '4x5' || back.id === 'grafmatic') && (lens.id === 'mp75' || lens.id === 'mp127')) {
      return 'Slight vignetting on 4×5.';
    }
    // 2×3 needs adapter on 4×5 bodies
    if (back.id === '2x3' && state.body !== 'mk8') {
      return 'Requires 2×3 back adapter.';
    }
    return null;
  }

  // Map a mask format string ('6×12', '4×5', etc.) to the back ID(s) it represents.
  // 4×5 masks match both '4x5' and 'grafmatic' backs.
  function maskMatchesBackId(format, backId) {
    if (backId === 'grafmatic') return format === '4×5';
    const m = { '6×7': '6x7', '6×9': '6x9', '6×12': '6x12', '4×5': '4x5', 'Instax': 'instax' };
    return m[format] === backId;
  }

  function isRecommendedMask(mask) {
    const lens = state.lens && find('lenses', state.lens);
    if (!lens || lens.mm !== mask.focal) return false;
    if (state.back && maskMatchesBackId(mask.format, state.back)) return true;
    if (state.secondaryBack && state.secondaryBack !== 'none'
        && maskMatchesBackId(mask.format, state.secondaryBack)) return true;
    return false;
  }

  function viewfinderIsAvailable(vf) {
    if (!state.lens) return true;
    const lens = find('lenses', state.lens);
    if (!lens || !lens.mm || !vf.focalRange) return true;
    return lens.mm >= vf.focalRange.min && lens.mm <= vf.focalRange.max;
  }

  function viewfinderWarning(vf) {
    if (!state.lens) return null;
    const lens = find('lenses', state.lens);
    if (!lens || !lens.mm || !vf.focalRange) return null;
    if (lens.mm < vf.focalRange.min) return `Too long — finder doesn't go below ${vf.focalRange.min} mm.`;
    if (lens.mm > vf.focalRange.max) return `Too wide — finder doesn't cover beyond ${vf.focalRange.max} mm.`;
    return null;
  }

  function isStepLocked(step) {
    switch (step) {
      case 'body':          return false;
      case 'cone':          return state.body !== 'sl45';
      case 'lens':          return state.body === 'sl45' ? !state.cone : !state.body;
      case 'back':          return !state.lens;
      case 'secondaryBack': return !state.back;
      case 'viewfinder':    return !state.back;
      case 'masks':         return !state.viewfinder;
      // Optional kit (third-party) — all peer-unlock once the build's viewfinder is set.
      case 'meter':         return !state.viewfinder;
      case 'flash':         return !state.viewfinder;
      case 'extras':        return !state.viewfinder;
      default: return true;
    }
  }

  function isStepHidden(step) {
    if (step === 'cone' && state.body && state.body !== 'sl45') return true;
    // Masks step is hidden for finders without a mask system (TTArtisan, Phone)
    if (step === 'masks' && state.viewfinder && !FINDERS_WITH_MASKS.includes(state.viewfinder)) return true;
    return false;
  }

  function requiredStepsComplete() {
    // The build is complete when the items O.ZONE produces or scopes are set.
    // Meter / flash / extras are third-party — not part of the build.
    if (!state.body || !state.lens || !state.back) return false;
    if (state.body === 'sl45' && !state.cone) return false;
    if (!state.viewfinder) return false;
    return true;
  }

  function buildSelectionsCount() {
    // Count of completed *build* steps (excludes optional kit).
    let n = 0;
    if (state.body) n++;
    if (state.body === 'sl45' && state.cone) n++;
    if (state.lens) n++;
    if (state.back) n++;
    if (state.viewfinder) n++;
    return n;
  }

  function buildSelectionsTotal() {
    return state.body === 'sl45' ? 5 : 4;
  }

  // ===== RENDERING =====
  function renderOptions(stepKey, items, opts = {}) {
    const { multi = false, stateKey = stepKey } = opts;
    const container = document.querySelector(`[data-options="${stepKey}"]`);
    if (!container) return;

    container.innerHTML = items.map(it => {
      const selected = multi
        ? state.extras.has(it.id)
        : state[stateKey] === it.id;
      const disabled = it._disabled;
      const img = it.img ? `<div class="opt-img" style="background-image:url('${it.img}')"></div>` : '';
      const tag = it.tag ? `<span class="opt-tag">${it.tag}</span>` : '';
      const warn = it.warn ? `<p class="opt-warn">${it.warn}</p>` : '';
      const desc = it.desc ? `<p class="opt-desc">${it.desc}</p>` : '';
      return `
        <button class="config-option${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}"
                data-step="${stepKey}" data-value="${it.id}" ${disabled ? 'disabled' : ''}>
          ${img}${tag}<h4>${it.name}</h4>${desc}${warn}
        </button>`;
    }).join('');
  }

  function renderBody()  { renderOptions('body', DATA.bodies); }
  function renderCone()  { renderOptions('cone', DATA.cones); }

  function renderLens() {
    const items = DATA.lenses
      .filter(l => state.body && l.bodies.includes(state.body))
      .filter(l => state.body !== 'sl45' || l.cone === state.cone)
      .map(l => ({ ...l }));
    renderOptions('lens', items);
  }

  function buildBackItems(slot) {
    return DATA.backs
      .filter(b => state.body && b.supports.includes(state.body))
      .map(b => {
        const item = { ...b };
        if (!backIsAvailable(b, slot)) item._disabled = true;
        const w = backWarning(b);
        if (w) item.warn = w;
        return item;
      });
  }

  function renderBack() {
    renderOptions('back', buildBackItems('primary'));
  }

  function renderSecondaryBack() {
    // Add a "None" option at the start
    const items = [
      { id: 'none', name: 'No secondary back', desc: 'Use only your primary back.', tag: 'Skip' },
      ...buildBackItems('secondary')
    ];
    renderOptions('secondaryBack', items);
  }

  function renderViewfinder() {
    const items = DATA.viewfinders.map(vf => {
      const item = { ...vf };
      if (!viewfinderIsAvailable(vf)) item._disabled = true;
      const w = viewfinderWarning(vf);
      if (w) item.warn = w;
      return item;
    });
    renderOptions('viewfinder', items);
  }

  function renderMeter()  { renderOptions('meter', DATA.meters); }
  function renderFlash()  { renderOptions('flash', DATA.flashes); }
  function renderExtras() { renderOptions('extras', DATA.extras, { multi: true }); }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, ch => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
    ));
  }

  function renderMasks() {
    const container = document.querySelector('[data-options="masks"]');
    if (!container) return;

    const finder = state.viewfinder;
    if (!finder || !FINDERS_WITH_MASKS.includes(finder)) {
      container.innerHTML = '';
      return;
    }

    // Group native masks by focal length for the chosen finder.
    const finderMasks = DATA.masks.filter(m => m.finder === finder);
    const groups = {};
    finderMasks.forEach(m => {
      if (!groups[m.focal]) groups[m.focal] = [];
      groups[m.focal].push(m);
    });
    const focals = Object.keys(groups).map(Number).sort((a, b) => a - b);

    let html = '';

    focals.forEach(focal => {
      html += `<div class="mask-group">
        <div class="mask-group-head">${focal} mm masks</div>
        <div class="mask-options">${
          groups[focal].map(m => {
            const selected = state.masks.has(m.id);
            const recommended = isRecommendedMask(m);
            const tag = recommended ? '<span class="opt-tag">Recommended</span>' : '';
            return `<button class="config-option mask${selected ? ' selected' : ''}${recommended ? ' recommended' : ''}"
                            data-step="masks" data-value="${m.id}">
              ${tag}<h4>${m.format}</h4>
              <p class="opt-desc">${focal} mm · ${m.format}</p>
            </button>`;
          }).join('')
        }</div>
      </div>`;
    });

    // Custom order block
    html += `<div class="custom-order-block">
      <div class="mask-group-head">Custom order</div>
      <div class="custom-order-card">
        <p class="custom-intro">Need a mask outside the stock set? Specify a focal length and aspect ratio — we'll cut it to your spec.</p>
        <div class="custom-order-form">
          <label><input type="number" id="custom-focal" placeholder="65" min="20" max="500" /><span>mm</span></label>
          <label><input type="text" id="custom-aspect" placeholder="6×7 / 1:1 / 16:9" /></label>
          <button type="button" class="btn btn-primary" id="custom-add">Add custom mask</button>
        </div>
        ${state.customMasks.length > 0 ? `
          <ul class="custom-order-list">${
            state.customMasks.map((m, i) => `<li>
              <span><span class="custom-tag">Custom</span>${escapeHtml(m.focal)} mm · ${escapeHtml(m.aspect)}</span>
              <button type="button" class="custom-remove" data-index="${i}" aria-label="Remove">×</button>
            </li>`).join('')
          }</ul>
        ` : ''}
      </div>
    </div>`;

    container.innerHTML = html;
  }

  function renderSummary() {
    const setItem = (key, value, isEmpty = false) => {
      const el = document.querySelector(`[data-summary="${key}"]`);
      if (!el) return;
      const valueEl = el.querySelector('.value');
      valueEl.classList.toggle('empty', isEmpty);
      valueEl.innerHTML = value;
    };

    // Body
    if (state.body) {
      const b = find('bodies', state.body);
      setItem('body', b.name);
    } else {
      setItem('body', '—', true);
    }

    // Cone — only for SL45
    const coneRow = document.querySelector('[data-summary="cone"]');
    if (state.body === 'sl45') {
      coneRow.classList.remove('hidden');
      if (state.cone) {
        const c = find('cones', state.cone);
        setItem('cone', c.name);
      } else {
        setItem('cone', '—', true);
      }
    } else {
      coneRow.classList.add('hidden');
    }

    // Lens
    if (state.lens) setItem('lens', find('lenses', state.lens).name);
    else            setItem('lens', '—', true);

    // Primary back
    if (state.back) setItem('back', find('backs', state.back).name);
    else            setItem('back', '—', true);

    // Secondary back
    if (state.secondaryBack && state.secondaryBack !== 'none') {
      setItem('secondaryBack', find('backs', state.secondaryBack).name);
    } else if (state.secondaryBack === 'none') {
      setItem('secondaryBack', 'None', true);
    } else {
      setItem('secondaryBack', '—', true);
    }

    // Other singles
    [['viewfinder','viewfinders'], ['meter','meters'], ['flash','flashes']].forEach(([key, cat]) => {
      if (state[key]) setItem(key, find(cat, state[key]).name);
      else            setItem(key, '—', true);
    });

    // Masks (multi + custom)
    const masksRow = document.querySelector('[data-summary="masks"]');
    if (masksRow) {
      const finderHasMasks = state.viewfinder && FINDERS_WITH_MASKS.includes(state.viewfinder);
      if (!finderHasMasks) {
        masksRow.classList.add('hidden');
      } else {
        masksRow.classList.remove('hidden');
        const native = [...state.masks].map(id => {
          const m = DATA.masks.find(x => x.id === id);
          return m ? `${m.focal} mm · ${m.format}` : null;
        }).filter(Boolean);
        const custom = state.customMasks.map(m => `${m.focal} mm · ${m.aspect} (custom)`);
        const all = [...native, ...custom];
        if (all.length === 0) {
          setItem('masks', 'None selected', true);
        } else {
          setItem('masks', `<ul>${all.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`);
        }
      }
    }

    // Extras (multi)
    if (state.extras.size > 0) {
      const items = [...state.extras].map(id => find('extras', id).name);
      setItem('extras', `<ul>${items.map(n => `<li>${n}</li>`).join('')}</ul>`);
    } else {
      setItem('extras', 'None selected', true);
    }

    // Progress — counts only the build steps (body / cone / lens / back / viewfinder)
    const built = buildSelectionsCount();
    const total = buildSelectionsTotal();
    const progressEl = document.getElementById('progress');
    progressEl.textContent = built === total
      ? 'Build ready · review your selections'
      : `${built} / ${total} build steps complete`;

    // Finish button
    document.getElementById('btn-finish').disabled = !requiredStepsComplete();
  }

  function renderStepLocks() {
    STEPS.forEach(step => {
      const el = document.getElementById(`step-${step}`);
      if (!el) return;
      el.classList.toggle('locked', isStepLocked(step));
      el.classList.toggle('hidden', isStepHidden(step));
    });
  }

  function render() {
    renderBody();
    renderCone();
    renderLens();
    renderBack();
    renderSecondaryBack();
    renderViewfinder();
    renderMasks();
    renderMeter();
    renderFlash();
    renderExtras();
    renderSummary();
    renderStepLocks();
  }

  // ===== ACTIONS =====
  function select(step, value) {
    if (step === 'extras') {
      if (state.extras.has(value)) state.extras.delete(value);
      else state.extras.add(value);
      render();
      return;
    }
    if (step === 'masks') {
      if (state.masks.has(value)) state.masks.delete(value);
      else state.masks.add(value);
      render();
      return;
    }

    state[step] = value;

    // Cascade resets so downstream selections stay valid
    if (step === 'body') {
      state.cone = null;
      state.lens = null;
      state.back = null;
      state.secondaryBack = null;
      state.viewfinder = null;
      state.masks.clear();
    } else if (step === 'cone') {
      state.lens = null;
      state.back = null;
      state.secondaryBack = null;
      state.viewfinder = null;
      state.masks.clear();
    } else if (step === 'lens') {
      // Re-validate primary + secondary back, viewfinder
      const primary = state.back && find('backs', state.back);
      if (primary && !backIsAvailable(primary, 'primary')) state.back = null;
      const secondary = state.secondaryBack && state.secondaryBack !== 'none' && find('backs', state.secondaryBack);
      if (secondary && !backIsAvailable(secondary, 'secondary')) state.secondaryBack = null;
      const vf = state.viewfinder && find('viewfinders', state.viewfinder);
      if (vf && !viewfinderIsAvailable(vf)) {
        state.viewfinder = null;
        state.masks.clear();
      }
    } else if (step === 'back') {
      // If secondary back equals new primary, clear secondary
      if (state.secondaryBack === value) state.secondaryBack = null;
    } else if (step === 'viewfinder') {
      // Mask set is finder-specific — clear when finder changes
      state.masks.clear();
    }

    render();
    scrollToNextOpenStep(step);
  }

  function addCustomMask() {
    const focalEl = document.getElementById('custom-focal');
    const aspectEl = document.getElementById('custom-aspect');
    if (!focalEl || !aspectEl) return;
    const focal = focalEl.value.trim();
    const aspect = aspectEl.value.trim();
    if (!focal || !aspect) return;
    state.customMasks.push({ focal, aspect });
    render();
  }

  function removeCustomMask(idx) {
    state.customMasks.splice(idx, 1);
    render();
  }

  function scrollToNextOpenStep(currentStep) {
    const idx = STEPS.indexOf(currentStep);
    for (let i = idx + 1; i < STEPS.length; i++) {
      const next = STEPS[i];
      if (isStepHidden(next)) continue;
      if (isStepLocked(next)) continue;
      const el = document.getElementById(`step-${next}`);
      if (el) {
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          if (rect.top < 100 || rect.top > window.innerHeight * 0.5) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 80);
        break;
      }
    }
  }

  function reset() {
    state.body = null;
    state.cone = null;
    state.lens = null;
    state.back = null;
    state.secondaryBack = null;
    state.viewfinder = null;
    state.masks = new Set();
    state.customMasks = [];
    state.meter = null;
    state.flash = null;
    state.extras = new Set();
    document.getElementById('review').classList.remove('visible-review');
    render();
    document.getElementById('step-body').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===== REVIEW =====
  function helicoidLabel() {
    if (!state.lens || !state.back) return null;
    const lens = find('lenses', state.lens);
    const back = find('backs', state.back);
    let label = `Custom-calibrated for ${lens.name} on ${back.name}`;
    // Instax has a 19mm rearward film plane vs other 4×5 backs.
    if (state.secondaryBack && state.secondaryBack !== 'none') {
      const sec = find('backs', state.secondaryBack);
      const primaryIsInstax   = back.id === 'instax';
      const secondaryIsInstax = sec.id === 'instax';
      if (primaryIsInstax !== secondaryIsInstax) {
        label += ` · 19 mm Instax spacer (or second helicoid) for ${sec.name}`;
      }
    }
    return label;
  }

  function buildReviewText() {
    const lines = [];
    const b  = state.body          && find('bodies', state.body);
    const c  = state.cone          && find('cones', state.cone);
    const l  = state.lens          && find('lenses', state.lens);
    const bk = state.back          && find('backs', state.back);
    const bk2 = (state.secondaryBack && state.secondaryBack !== 'none') && find('backs', state.secondaryBack);
    const vf = state.viewfinder    && find('viewfinders', state.viewfinder);
    const m  = state.meter         && find('meters', state.meter);
    const f  = state.flash         && find('flashes', state.flash);
    const helicoid = helicoidLabel();

    lines.push("Hi — I'd like to inquire about the following O.ZONE build:");
    lines.push('');
    lines.push('— Build (made or scoped by O.ZONE) —');
    lines.push(`Body:           ${b ? b.name : '—'}`);
    if (state.body === 'sl45') lines.push(`Cone:           ${c ? c.name : '—'}`);
    lines.push(`Lens:           ${l ? l.name : '—'}`);
    if (helicoid) lines.push(`Helicoid:       ${helicoid}`);
    lines.push(`Primary back:   ${bk ? bk.name : '—'}`);
    if (bk2) lines.push(`Secondary back: ${bk2.name}`);
    lines.push(`Finder:         ${vf ? vf.name : '—'}`);
    if (state.masks.size > 0 || state.customMasks.length > 0) {
      lines.push('Finder masks:');
      [...state.masks].forEach(id => {
        const mk = DATA.masks.find(x => x.id === id);
        if (mk) lines.push(`  · ${mk.focal} mm · ${mk.format}`);
      });
      state.customMasks.forEach(m => lines.push(`  · ${m.focal} mm · ${m.aspect} (custom order)`));
    }

    // Optional kit — separately, since these are third-party and not part of the build.
    const hasKit = m || f || state.extras.size > 0;
    if (hasKit) {
      lines.push('');
      lines.push('— Kit I plan to pair with this build (third-party · not from O.ZONE) —');
      if (m) lines.push(`Meter:  ${m.name}`);
      if (f) lines.push(`Flash:  ${f.name}`);
      if (state.extras.size > 0) {
        lines.push('Extras:');
        [...state.extras].forEach(id => {
          const ex = find('extras', id);
          if (ex) lines.push(`  · ${ex.name}`);
        });
      }
    }
    lines.push('');
    lines.push('Thanks!');
    return lines.join('\n');
  }

  function renderReview() {
    if (!requiredStepsComplete()) return;
    const review = document.getElementById('review');
    const list   = document.getElementById('review-list');
    const sub    = document.getElementById('review-sub');
    const title  = document.getElementById('review-title');

    const b  = find('bodies', state.body);
    const c  = state.cone ? find('cones', state.cone) : null;
    const l  = find('lenses', state.lens);
    const bk = find('backs', state.back);
    const bk2 = (state.secondaryBack && state.secondaryBack !== 'none') ? find('backs', state.secondaryBack) : null;
    const vf = find('viewfinders', state.viewfinder);
    const m  = find('meters', state.meter);
    const f  = find('flashes', state.flash);

    title.textContent = c
      ? `${b.name} (${c.name}) + ${l.name}`
      : `${b.name} + ${l.name}`;
    sub.textContent = bk2
      ? `Configured for ${bk.name.toLowerCase()} and ${bk2.name.toLowerCase()}.`
      : `Configured for ${bk.name.toLowerCase()}.`;

    // Build rows (what O.ZONE makes or scopes)
    const buildRows = [];
    buildRows.push({ label: 'Body',           value: b.name,  desc: b.desc });
    if (c)  buildRows.push({ label: 'Cone',   value: c.name,  desc: c.desc });
    buildRows.push({ label: 'Lens',           value: l.name,  desc: l.tag });
    const helicoid = helicoidLabel();
    if (helicoid) buildRows.push({ label: 'Helicoid', value: 'Custom helicoid', desc: helicoid });
    buildRows.push({ label: 'Primary back',   value: bk.name, desc: bk.desc });
    if (bk2) buildRows.push({ label: 'Secondary back', value: bk2.name, desc: bk2.desc });
    buildRows.push({ label: 'Finder',         value: vf.name, desc: vf.desc });
    if (state.masks.size > 0 || state.customMasks.length > 0) {
      const native = [...state.masks].map(id => {
        const mk = DATA.masks.find(x => x.id === id);
        return mk ? `${mk.focal} mm · ${mk.format}` : null;
      }).filter(Boolean);
      const custom = state.customMasks.map(m => `${m.focal} mm · ${m.aspect} (custom)`);
      buildRows.push({ label: 'Masks', value: [...native, ...custom].join(', ') });
    }

    // Optional kit rows (third-party — not part of the build)
    const kitRows = [];
    if (m) kitRows.push({ label: 'Meter', value: m.name, desc: m.desc });
    if (f) kitRows.push({ label: 'Flash', value: f.name, desc: f.desc });
    if (state.extras.size > 0) {
      const extraNames = [...state.extras].map(id => find('extras', id).name).join(', ');
      kitRows.push({ label: 'Extras', value: extraNames });
    }

    const renderRow = r => `
      <div class="review-item">
        <div class="label">${r.label}</div>
        <div>
          <span class="value">${r.value}</span>
          ${r.desc ? `<span class="value-desc">${r.desc}</span>` : ''}
        </div>
      </div>`;

    let html = '<div class="review-section-head" style="font-size:11.5px;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent-ink);font-weight:600;margin:24px 0 4px;">Build · made or scoped by O.ZONE</div>';
    html += buildRows.map(renderRow).join('');
    if (kitRows.length > 0) {
      html += '<div class="review-section-head" style="font-size:11.5px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ink-mute);font-weight:600;margin:36px 0 4px;">Optional kit · third-party · not from O.ZONE</div>';
      html += kitRows.map(renderRow).join('');
    }
    list.innerHTML = html;

    const inquire = document.getElementById('btn-inquire');
    inquire.href = `mailto:?subject=${encodeURIComponent('O.ZONE build inquiry')}&body=${encodeURIComponent(buildReviewText())}`;

    review.classList.add('visible-review');
    setTimeout(() => review.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }

  // ===== EVENT WIRING =====
  function init() {
    render();

    document.addEventListener('click', (e) => {
      // Custom mask: add
      if (e.target.id === 'custom-add' || e.target.closest('#custom-add')) {
        e.preventDefault();
        addCustomMask();
        return;
      }
      // Custom mask: remove
      const removeBtn = e.target.closest('.custom-remove');
      if (removeBtn) {
        e.preventDefault();
        removeCustomMask(parseInt(removeBtn.dataset.index, 10));
        return;
      }
      // Standard option click
      const opt = e.target.closest('.config-option');
      if (!opt || opt.classList.contains('disabled')) return;
      select(opt.dataset.step, opt.dataset.value);
    });

    // Allow Enter to submit the custom-mask form
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      if (e.target && (e.target.id === 'custom-focal' || e.target.id === 'custom-aspect')) {
        e.preventDefault();
        addCustomMask();
      }
    });

    document.getElementById('btn-finish').addEventListener('click', renderReview);
    document.getElementById('btn-reset').addEventListener('click', reset);
    document.getElementById('btn-print').addEventListener('click', () => window.print());
    document.getElementById('btn-copy').addEventListener('click', async () => {
      const text = buildReviewText();
      try {
        await navigator.clipboard.writeText(text);
        const btn = document.getElementById('btn-copy');
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => (btn.textContent = original), 1600);
      } catch (err) {
        alert(text);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
