// Problem Scene B — Hidden Price Creep
// Multiple vendor products drift up silently over months. A "you" character
// (eye icon) watches only 2; the rest creep up in the dark.
// Cumulative damage counter ticks — "$2,184 of profit walked out the door."

function SceneP2_PriceCreep({ start, duration, index, total }) {
  return (
    <Sprite start={start} end={start + duration}>
      <SceneChrome
        index={index} total={total}
        eyebrow="Problem 02 · The Silent Drift"
        title={<>Your vendor raised prices <em style={{ fontStyle: 'italic', color: RW.red }}>8% last month.</em></>}
        subtitle="You didn't catch it. That's profit walking out the door — silently — invoice after invoice."
      />
      <SceneP2Inner />
    </Sprite>
  );
}

function SceneP2Inner() {
  const { localTime } = useSprite();

  // 6 product lines drift up. Only 1-2 are "watched" (higher contrast);
  // rest are ghosted — the point: you can't see them.
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const chartX = 140, chartY = 510, chartW = 940, chartH = 380;
  const monthW = chartW / (months.length - 1);

  // Each product: series of 6 normalized prices (0..1, relative to its own range)
  // We draw as stacked lines with y offsets so they don't overlap.
  const products = [
    { name: 'Oxtail',          vendor: 'Dreamland',  watched: true,  series: [1.00, 1.00, 1.01, 1.00, 1.02, 1.08], delay: 0.2, color: RW.ink,     startPrice: 12.00, endPrice: 12.96, totalLoss: 576 },
    { name: 'Palm Oil 1L',     vendor: 'Import',     watched: false, series: [1.00, 1.02, 1.04, 1.05, 1.07, 1.11], delay: 0.4, color: RW.inkMute, startPrice:  7.99, endPrice:  8.87, totalLoss: 422 },
    { name: 'Goat Meat',       vendor: 'Dreamland',  watched: false, series: [1.00, 1.01, 1.03, 1.06, 1.09, 1.12], delay: 0.6, color: RW.inkMute, startPrice:  4.50, endPrice:  5.04, totalLoss: 324 },
    { name: 'Fish Powder',     vendor: 'ILham',      watched: true,  series: [1.00, 1.00, 1.00, 1.01, 1.01, 1.01], delay: 0.8, color: RW.ink,     startPrice: 12.00, endPrice: 12.12, totalLoss:  72 },
    { name: 'Evap. Milk',      vendor: 'Res Depot',  watched: false, series: [1.00, 1.02, 1.03, 1.05, 1.08, 1.14], delay: 1.0, color: RW.inkMute, startPrice:  1.89, endPrice:  2.15, totalLoss: 468 },
    { name: 'Frozen Tilapia',  vendor: 'Star Ocean', watched: false, series: [1.00, 1.01, 1.04, 1.07, 1.10, 1.13], delay: 1.2, color: RW.inkMute, startPrice:  6.99, endPrice:  7.90, totalLoss: 322 },
  ];

  // Global reveal — draws month by month
  const revealT = clamp((localTime - 0.4) / 4.0, 0, 1);
  const monthsShown = revealT * (months.length - 1); // 0..5

  // Per-product Y band. Watched products draw at the top band (emphasis);
  // unwatched products shade in a lower, ghost-lit band.
  // We actually lay them out vertically spaced as 6 separate thin lines.
  const laneH = chartH / products.length;

  // "Hidden" veil: darkening overlay over unwatched lines, which thins
  // as the "you finally noticed" phase arrives at 4.0s.
  const revealShock = clamp((localTime - 4.2) / 0.8, 0, 1);

  // Total damage counter
  const totalLoss = products.reduce((s, p) => s + p.totalLoss, 0); // 2184
  const counterStart = 4.5, counterEnd = 5.6;

  // Eye icon that "scans" — moves across watched items only (represents your attention span)
  return (
    <>
      {/* Chart frame */}
      <div style={{
        position: 'absolute', left: chartX, top: chartY - 34,
        fontFamily: RW.mono, fontSize: 11, letterSpacing: '0.22em',
        color: RW.inkMute, textTransform: 'uppercase',
        display: 'flex', justifyContent: 'space-between', width: chartW,
      }}>
        <span>Vendor Prices · 6 months</span>
        <span>what you saw vs. what happened</span>
      </div>

      {/* Month axis */}
      <div style={{
        position: 'absolute', left: chartX, top: chartY + chartH + 14,
        width: chartW, display: 'flex', justifyContent: 'space-between',
        fontFamily: RW.mono, fontSize: 12, letterSpacing: '0.12em',
        color: RW.inkMute, textTransform: 'uppercase',
      }}>
        {months.map(m => <span key={m}>{m}</span>)}
      </div>

      {/* Per-product lane lines */}
      <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none' }}>
        {products.map((p, pi) => {
          // Lane Y center
          const laneYCenter = chartY + laneH * (pi + 0.5);
          // Within lane, the creep amount (p.series[i] - 1) drives vertical shift
          // Stretch creep: amplitude ~ (laneH * 0.8) across 0..15% creep
          const amp = laneH * 4.8;
          const pts = p.series.map((v, i) => {
            const x = chartX + i * monthW;
            const y = laneYCenter - (v - 1) * amp; // lines drift UP as price rises
            return { x, y };
          });

          // Only show the portion up to monthsShown
          const cut = monthsShown - (p.delay - 0.2) / 0.2 * 0; // all start at same time; we just animate draw
          const visiblePts = pts.filter((_, i) => i <= monthsShown);
          if (visiblePts.length < 2 && monthsShown < 0.1) return null;

          // Interpolate the last partial segment
          let path = '';
          if (visiblePts.length >= 1) {
            path = `M ${visiblePts[0].x},${visiblePts[0].y}`;
            for (let i = 1; i < visiblePts.length; i++) {
              path += ` L ${visiblePts[i].x},${visiblePts[i].y}`;
            }
            // Partial segment to next point
            const nextIdx = visiblePts.length;
            if (nextIdx < pts.length) {
              const frac = monthsShown - (nextIdx - 1);
              if (frac > 0) {
                const a = pts[nextIdx - 1], b = pts[nextIdx];
                const ix = a.x + (b.x - a.x) * frac;
                const iy = a.y + (b.y - a.y) * frac;
                path += ` L ${ix},${iy}`;
              }
            }
          }

          const watched = p.watched;
          const opacity = watched ? 1 : (0.55 + revealShock * 0.45);
          const strokeW = watched ? 3 : 2;

          return (
            <g key={p.name}>
              {/* Lane baseline */}
              <line
                x1={chartX} y1={laneYCenter}
                x2={chartX + chartW} y2={laneYCenter}
                stroke={RW.line} strokeWidth="1" strokeDasharray="2 6"
              />
              <path d={path}
                stroke={watched ? RW.ink : RW.red}
                strokeWidth={strokeW}
                fill="none"
                strokeLinecap="round" strokeLinejoin="round"
                opacity={opacity}
              />
            </g>
          );
        })}
      </svg>

      {/* Lane labels on left, price badges on right */}
      {products.map((p, pi) => {
        const laneYCenter = chartY + laneH * (pi + 0.5);
        const watched = p.watched;
        const opacity = watched ? 1 : (0.7 + revealShock * 0.3);
        return (
          <React.Fragment key={p.name}>
            {/* Left label */}
            <div style={{
              position: 'absolute',
              left: chartX - 200, top: laneYCenter - 14,
              width: 180, textAlign: 'right',
              fontFamily: RW.sans, fontSize: 15, color: RW.ink,
              opacity,
            }}>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontFamily: RW.mono, fontSize: 10, color: RW.inkMute, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
                {p.vendor}
                {watched && <span style={{ color: RW.green, marginLeft: 8 }}>● watched</span>}
              </div>
            </div>
            {/* Right — starting / ending price */}
            <div style={{
              position: 'absolute',
              left: chartX + chartW + 20, top: laneYCenter - 14,
              width: 200,
              fontFamily: RW.mono, fontSize: 13,
              fontVariantNumeric: 'tabular-nums',
              opacity,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ color: RW.inkMute }}>${p.startPrice.toFixed(2)}</span>
              <span style={{ color: RW.inkMute }}>→</span>
              <span style={{ color: watched ? RW.ink : RW.red, fontWeight: 700 }}>
                ${p.endPrice.toFixed(2)}
              </span>
              <span style={{
                fontSize: 11, marginLeft: 6,
                color: watched ? RW.inkMute : RW.red,
                opacity: revealShock,
                fontWeight: 700,
              }}>
                ▲{((p.endPrice / p.startPrice - 1) * 100).toFixed(0)}%
              </span>
            </div>
          </React.Fragment>
        );
      })}

      {/* Dark veil over unwatched region — subtle, lifts at reveal */}
      <div style={{
        position: 'absolute',
        left: chartX, top: chartY,
        width: chartW, height: chartH,
        background: `repeating-linear-gradient(-45deg, rgba(26,24,20,0.02) 0 8px, transparent 8px 16px)`,
        opacity: 1 - revealShock * 0.8,
        pointerEvents: 'none',
      }}/>

      {/* Spotlight — follows watched lanes (showing where attention was) */}
      {products.map((p, pi) => {
        if (!p.watched) return null;
        const laneYCenter = chartY + laneH * (pi + 0.5);
        const sweep = (Math.sin(localTime * 1.3 + pi * 2) * 0.5 + 0.5);
        const sx = chartX + sweep * chartW;
        return (
          <div key={'spot-' + pi} style={{
            position: 'absolute',
            left: sx - 80, top: laneYCenter - 40,
            width: 160, height: 80,
            background: `radial-gradient(ellipse at center, rgba(98, 165, 98, 0.14) 0%, transparent 70%)`,
            pointerEvents: 'none',
            opacity: revealShock > 0.7 ? 0.3 : 1,
          }}/>
        );
      })}

      {/* Reveal flash when shock hits */}
      {revealShock > 0 && revealShock < 0.5 && (
        <div style={{
          position: 'absolute',
          left: chartX, top: chartY,
          width: chartW, height: chartH,
          background: RW.red,
          opacity: (0.5 - revealShock) * 0.15,
          pointerEvents: 'none',
        }}/>
      )}

      {/* Bottom-left caption */}
      <div style={{
        position: 'absolute',
        left: chartX, top: chartY + chartH + 60,
        fontFamily: RW.serif, fontSize: 36, color: RW.ink,
        letterSpacing: '-0.01em', lineHeight: 1.15,
        maxWidth: 920,
        opacity: clamp((localTime - 4.5) / 0.6, 0, 1),
        transform: `translateY(${(1 - clamp((localTime - 4.5) / 0.6, 0, 1)) * 12}px)`,
      }}>
        Six months of invisible increases across{' '}
        <em style={{ fontStyle: 'italic', color: RW.red }}>four vendors</em>.
      </div>

      {/* Right side — cumulative damage */}
      <div style={{
        position: 'absolute',
        right: 80, top: chartY - 40,
        width: 300,
        textAlign: 'right',
      }}>
        <div style={{
          fontFamily: RW.mono, fontSize: 11, letterSpacing: '0.22em',
          color: RW.inkMute, textTransform: 'uppercase',
          marginBottom: 12,
          opacity: clamp((localTime - 4.2) / 0.4, 0, 1),
        }}>
          Silent bleed · YTD
        </div>
        <div style={{
          fontFamily: RW.serif, fontSize: 128, lineHeight: 0.88,
          letterSpacing: '-0.04em', color: RW.red,
          fontVariantNumeric: 'tabular-nums',
          opacity: clamp((localTime - 4.3) / 0.5, 0, 1),
        }}>
          $<Counter from={0} to={totalLoss} start={counterStart} end={counterEnd} decimals={0}
            style={{ fontFamily: RW.serif, fontVariantNumeric: 'tabular-nums' }}/>
        </div>
        <div style={{
          fontFamily: RW.sans, fontSize: 18, color: RW.inkSoft,
          marginTop: 14, lineHeight: 1.35,
          opacity: clamp((localTime - 4.8) / 0.5, 0, 1),
        }}>
          of profit walked out the door — quietly, one invoice at a time.
        </div>
      </div>
    </>
  );
}

Object.assign(window, { SceneP2_PriceCreep });
