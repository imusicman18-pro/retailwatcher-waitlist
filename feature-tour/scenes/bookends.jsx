// Intro + Outro bookends

function SceneIntro({ start, duration }) {
  return (
    <Sprite start={start} end={start + duration}>
      <SceneIntroInner />
    </Sprite>
  );
}

function SceneIntroInner() {
  const { localTime, duration } = useSprite();

  // Word-by-word reveal of headline
  const words = [
    { t: 'Protect',  d: 0.0 },
    { t: 'your',     d: 0.25 },
    { t: 'profits.', d: 0.5 },
  ];

  // Eyebrow appears first
  const eyeT = Easing.easeOutCubic(clamp(localTime / 0.5, 0, 1));

  // Subtitle after headline
  const subT = Easing.easeOutCubic(clamp((localTime - 1.4) / 0.6, 0, 1));

  // Feature chips bottom
  const chips = [
    'Price Alerts', 'Vendor Compare', 'Expiry Tracker',
    'Loss & Shrink', 'Invoice OCR', 'Restock Advisor', 'Watcher AI',
  ];

  // Ambient moving marks
  return (
    <>
      {/* Subtle vignette in corners */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.06) 100%)`,
        pointerEvents: 'none',
      }}/>

      {/* Top eyebrow */}
      <div style={{
        position: 'absolute', left: 80, top: 80,
        fontFamily: RW.mono, fontSize: 13, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: RW.inkMute,
        opacity: eyeT,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="6" stroke={RW.ink} strokeWidth="1.2" fill="none"/>
          <circle cx="7" cy="7" r="2.2" fill={RW.ink}/>
        </svg>
        RetailWatcher
      </div>
      <div style={{
        position: 'absolute', right: 80, top: 80,
        fontFamily: RW.mono, fontSize: 13, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: RW.inkMute,
        opacity: eyeT, textAlign: 'right',
      }}>
        Inventory intelligence<br/>for store owners
      </div>

      {/* Center headline */}
      <div style={{
        position: 'absolute', left: 80, right: 80, top: 340,
        fontFamily: RW.serif, fontSize: 240, lineHeight: 0.92,
        letterSpacing: '-0.035em', color: RW.ink,
      }}>
        {words.map((w, i) => {
          const t = clamp((localTime - w.d) / 0.6, 0, 1);
          const eased = Easing.easeOutCubic(t);
          return (
            <span key={i} style={{
              display: 'inline-block',
              opacity: eased,
              transform: `translateY(${(1 - eased) * 40}px)`,
              marginRight: 28,
              color: i === 2 ? RW.ink : RW.ink,
            }}>
              {i === 2 ? (
                <em style={{ fontStyle: 'italic' }}>{w.t}</em>
              ) : w.t}
            </span>
          );
        })}
      </div>

      {/* Subtitle */}
      <div style={{
        position: 'absolute', left: 80, top: 620,
        fontFamily: RW.sans, fontSize: 28, color: RW.inkSoft,
        opacity: subT, maxWidth: 900, lineHeight: 1.3,
        transform: `translateY(${(1 - subT) * 12}px)`,
      }}>
        Inventory intelligence for store owners. Every price, every expiry,
        every loss — watched.
      </div>

      {/* Feature chips */}
      <div style={{
        position: 'absolute', left: 80, right: 80, bottom: 120,
        display: 'flex', flexWrap: 'wrap', gap: 10,
      }}>
        {chips.map((c, i) => {
          const t = clamp((localTime - (2.2 + i * 0.08)) / 0.4, 0, 1);
          const eased = Easing.easeOutBack(t);
          return (
            <div key={c} style={{
              padding: '10px 18px',
              border: `1px solid ${RW.ink}`,
              fontFamily: RW.mono, fontSize: 13,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: RW.ink,
              opacity: t, transform: `scale(${eased})`,
              transformOrigin: 'center',
            }}>
              {String(i + 1).padStart(2, '0')} · {c}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', left: 80, right: 80, bottom: 60,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: RW.mono, fontSize: 12, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: RW.inkMute,
        opacity: eyeT,
      }}>
        <span>Feature Tour · 07 scenes</span>
        <span>Built by a store owner, for store owners</span>
      </div>
    </>
  );
}

function SceneOutro({ start, duration }) {
  return (
    <Sprite start={start} end={start + duration}>
      <SceneOutroInner />
    </Sprite>
  );
}

function SceneOutroInner() {
  const { localTime } = useSprite();

  const h1T = Easing.easeOutCubic(clamp(localTime / 0.7, 0, 1));
  const plansT = clamp((localTime - 0.8) / 0.6, 0, 1);
  const ctaT = clamp((localTime - 2.2) / 0.5, 0, 1);

  const plans = [
    { name: 'Starter',    price: 0,    sub: 'Free forever',             highlight: false },
    { name: 'Pro',        price: 39.99, sub: 'per month',                highlight: true  },
    { name: 'Enterprise', price: 89.99, sub: 'per month · full power',   highlight: false },
  ];

  return (
    <>
      {/* Headline */}
      <div style={{
        position: 'absolute', left: 80, right: 80, top: 160,
        fontFamily: RW.serif, fontSize: 150, lineHeight: 0.95,
        letterSpacing: '-0.03em', color: RW.ink,
        opacity: h1T, transform: `translateY(${(1 - h1T) * 24}px)`,
      }}>
        Stop guessing.<br/>
        Start <em style={{ fontStyle: 'italic', color: RW.green }}>knowing.</em>
      </div>

      {/* Plans */}
      <div style={{
        position: 'absolute', left: 80, right: 80, top: 560,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
      }}>
        {plans.map((p, i) => {
          const t = clamp((localTime - 0.8 - i * 0.15) / 0.5, 0, 1);
          const eased = Easing.easeOutCubic(t);
          return (
            <div key={p.name} style={{
              padding: '30px 32px',
              background: p.highlight ? RW.ink : RW.paper,
              color: p.highlight ? RW.paper : RW.ink,
              border: p.highlight ? `1px solid ${RW.ink}` : `1px solid ${RW.line}`,
              opacity: t, transform: `translateY(${(1 - eased) * 24}px)`,
              display: 'flex', flexDirection: 'column', gap: 10,
              minHeight: 200,
            }}>
              <div style={{
                fontFamily: RW.mono, fontSize: 11, letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: p.highlight ? 'rgba(245,241,234,0.6)' : RW.inkMute,
              }}>
                {p.highlight ? '★ Most Popular' : 'Plan'}
              </div>
              <div style={{ fontFamily: RW.serif, fontSize: 48, letterSpacing: '-0.01em', lineHeight: 1 }}>
                {p.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 'auto' }}>
                <span style={{ fontFamily: RW.serif, fontSize: 62, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  ${p.price.toFixed(p.price === 0 ? 0 : 2)}
                </span>
                <span style={{ fontFamily: RW.mono, fontSize: 13, letterSpacing: '0.1em', opacity: 0.7 }}>
                  {p.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA line */}
      <div style={{
        position: 'absolute', left: 80, right: 80, bottom: 80,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        opacity: ctaT, transform: `translateY(${(1 - ctaT) * 12}px)`,
        paddingTop: 30, borderTop: `1px solid ${RW.line}`,
      }}>
        <div style={{
          fontFamily: RW.mono, fontSize: 14, letterSpacing: '0.2em',
          color: RW.inkMute, textTransform: 'uppercase',
        }}>
          retailwatcher.app · Free forever on Starter · Setup in 2 minutes
        </div>
        <div style={{
          background: RW.ink, color: RW.paper,
          padding: '16px 28px',
          fontFamily: RW.sans, fontSize: 18, fontWeight: 600,
        }}>
          Start free — no card needed →
        </div>
      </div>
    </>
  );
}

Object.assign(window, { SceneIntro, SceneOutro });
