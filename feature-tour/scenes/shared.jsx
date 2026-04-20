// Shared chrome, design tokens, and small primitives for all scenes.

// Tweakable defaults — mirrored in the HTML EDITMODE-BEGIN block so Tweaks can persist.
const RW_DEFAULTS = {
  brand:   '#0D6E6E',   // RetailWatcher brand teal (primary)
  ink:     '#0F1614',   // near-black ink
  paper:   '#F4F0E7',   // warm off-white
  red:     '#C8432E',   // alert / loss
  green:   '#2F8A5A',   // profit / win
  amber:   '#C88A2E',   // warning / expiry
  blue:    '#2E6CC8',   // info / ocr
  contrast: 'high',     // 'high' | 'medium'  — bumps secondary-text darkness
  serifFont: 'Instrument Serif',
  sansFont:  'Inter',
};

// Read live tweaks off window; fall back to defaults.
function getTweaks() {
  const t = (typeof window !== 'undefined' && window.RW_TWEAKS) || {};
  return { ...RW_DEFAULTS, ...t };
}

// Derive the RW token object from current tweaks. Called inline so scenes
// always see the latest values after a Tweaks change.
function buildRW() {
  const t = getTweaks();
  const paper = t.paper;
  const ink = t.ink;
  const highContrast = t.contrast === 'high';
  return {
    paper,
    paperAlt: mixColor(paper, ink, 0.08),
    ink,
    // Softer secondary text — darker when high contrast
    inkSoft: highContrast ? mixColor(ink, paper, 0.15) : mixColor(ink, paper, 0.28),
    inkMute: highContrast ? mixColor(ink, paper, 0.38) : mixColor(ink, paper, 0.50),
    line: mixColor(paper, ink, 0.14),
    brand: t.brand,
    brandSoft: mixColor(t.brand, paper, 0.78),
    red: t.red,
    redSoft: mixColor(t.red, paper, 0.82),
    green: t.green,
    greenSoft: mixColor(t.green, paper, 0.82),
    amber: t.amber,
    amberSoft: mixColor(t.amber, paper, 0.82),
    blue: t.blue,
    serif: `"${t.serifFont}", "Cormorant Garamond", Georgia, serif`,
    sans:  `${t.sansFont}, system-ui, -apple-system, sans-serif`,
    mono:  '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
  };
}

// Tiny hex-color mix helper. a and b as '#rrggbb', pct 0..1 of b.
function mixColor(a, b, pct) {
  const pa = hexToRgb(a), pb = hexToRgb(b);
  const r = Math.round(pa.r + (pb.r - pa.r) * pct);
  const g = Math.round(pa.g + (pb.g - pa.g) * pct);
  const bl = Math.round(pa.b + (pb.b - pa.b) * pct);
  return '#' + [r, g, bl].map(x => x.toString(16).padStart(2, '0')).join('');
}
function hexToRgb(h) {
  const v = h.replace('#', '');
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}

// RW token is a getter-based proxy so scenes that destructure get fresh values
// at render time. Accessing RW.paper calls buildRW() lazily.
const RW = new Proxy({}, {
  get(_, key) {
    const live = buildRW();
    return live[key];
  },
});

// Scene chrome: eyebrow label, serif title, sans subtitle, counter top-right.
// Fades in on entry, out on exit. Lives on top of whatever the scene draws.
function SceneChrome({ index, total, eyebrow, title, subtitle }) {
  const { localTime, duration } = useSprite();
  const entryDur = 0.5;
  const exitDur = 0.5;
  const exitStart = Math.max(0, duration - exitDur);

  let op = 1, ty = 0;
  if (localTime < entryDur) {
    const t = Easing.easeOutCubic(localTime / entryDur);
    op = t; ty = (1 - t) * 12;
  } else if (localTime > exitStart) {
    const t = Easing.easeInCubic((localTime - exitStart) / exitDur);
    op = 1 - t; ty = -t * 6;
  }

  return (
    <>
      {/* Header strip */}
      <div style={{
        position: 'absolute', top: 56, left: 80, right: 80,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        opacity: op, transform: `translateY(${ty}px)`,
        pointerEvents: 'none',
      }}>
        <div>
          <div style={{
            fontFamily: RW.mono, fontSize: 13, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: RW.inkMute,
            marginBottom: 18,
          }}>
            {eyebrow}
          </div>
          <div style={{
            fontFamily: RW.serif, fontSize: 68, lineHeight: 1.15,
            color: RW.ink, letterSpacing: '-0.02em', fontWeight: 400,
            maxWidth: 1260, paddingBottom: 12,
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{
              fontFamily: RW.sans, fontSize: 22, color: RW.inkSoft,
              marginTop: 48, maxWidth: 760, lineHeight: 1.35,
            }}>
              {subtitle}
            </div>
          )}
        </div>
        <div style={{
          fontFamily: RW.mono, fontSize: 13, letterSpacing: '0.1em',
          color: RW.inkMute, textAlign: 'right', minWidth: 120,
        }}>
          <div style={{ fontSize: 48, color: RW.ink, lineHeight: 1, fontFamily: RW.serif, letterSpacing: '-0.02em' }}>
            {String(index).padStart(2, '0')}
          </div>
          <div style={{ marginTop: 8 }}>/ {String(total).padStart(2, '0')}</div>
        </div>
      </div>

      {/* Footer brand mark */}
      <div style={{
        position: 'absolute', bottom: 48, left: 80, right: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        opacity: op * 0.8, pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: RW.mono, fontSize: 12, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: RW.inkMute,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="6" stroke={RW.ink} strokeWidth="1.2" fill="none"/>
            <circle cx="7" cy="7" r="2.2" fill={RW.ink}/>
          </svg>
          RetailWatcher
        </div>
        <div style={{
          fontFamily: RW.mono, fontSize: 12, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: RW.inkMute,
        }}>
          Protect Your Profits
        </div>
      </div>
    </>
  );
}

// Thin ruled line that draws in horizontally.
function RuleLine({ x, y, width, delay = 0, duration = 0.6, color = RW.line, thickness = 1 }) {
  const { localTime } = useSprite();
  const t = Easing.easeOutCubic(clamp((localTime - delay) / duration, 0, 1));
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: width * t, height: thickness, background: color,
    }}/>
  );
}

// Counter that animates from one numeric value to another.
function Counter({ from, to, start = 0, end = 1, prefix = '', suffix = '', decimals = 0, ease = Easing.easeOutCubic, style }) {
  const { localTime } = useSprite();
  const p = clamp((localTime - start) / (end - start), 0, 1);
  const val = from + (to - from) * ease(p);
  return <span style={style}>{prefix}{val.toFixed(decimals)}{suffix}</span>;
}

// Typewriter text — reveals chars over time.
function Typewriter({ text, start = 0, cps = 40, style, cursor = true }) {
  const { localTime } = useSprite();
  const elapsed = Math.max(0, localTime - start);
  const n = Math.min(text.length, Math.floor(elapsed * cps));
  const shown = text.slice(0, n);
  const done = n >= text.length;
  const showCursor = cursor && (!done || Math.floor(elapsed * 2) % 2 === 0);
  return (
    <span style={style}>
      {shown}
      {showCursor && <span style={{ opacity: 0.6 }}>▍</span>}
    </span>
  );
}

Object.assign(window, { RW, RW_DEFAULTS, SceneChrome, RuleLine, Counter, Typewriter, getTweaks, mixColor });
