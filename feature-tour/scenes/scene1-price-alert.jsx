// Scene 1 — Price Alert Notifications
// Concept: a product's price line ticks along calmly, suddenly spikes,
// tripping the user's threshold. An alert card flies in.

function Scene1_PriceAlert({ start, duration, index, total }) {
  return (
    <Sprite start={start} end={start + duration}>
      <SceneChrome
        index={index} total={total}
        eyebrow="Feature 01 · Price Alerts"
        title={<>The moment a vendor <em style={{ fontStyle: 'italic', color: RW.red }}>raises prices</em>, you know.</>}
        subtitle="Set a threshold from 1%–10%. RetailWatcher watches every invoice line and pings you the instant a vendor drifts."
      />
      <Scene1Inner />
    </Sprite>
  );
}

function Scene1Inner() {
  const { localTime } = useSprite();

  // Chart geometry
  const chartX = 180, chartY = 540, chartW = 900, chartH = 300;
  const threshold = 13.60; // alert fires above this

  // Price series (weeks). Calm, then spike at index 7.
  const series = [12.80, 12.85, 12.90, 12.88, 12.95, 12.99, 13.05, 14.08, 14.12, 14.20];
  const minP = 12.5, maxP = 14.5;

  // Reveal points progressively over 0 → 3.5s
  const revealEnd = 3.5;
  const revealed = Math.floor(clamp(localTime / revealEnd, 0, 1) * series.length);
  const shownCount = Math.min(series.length, revealed + 1);

  const xAt = (i) => chartX + (i / (series.length - 1)) * chartW;
  const yAt = (p) => chartY + chartH - ((p - minP) / (maxP - minP)) * chartH;
  const yThreshold = yAt(threshold);

  // Build SVG path (line) for currently revealed points
  const pts = series.slice(0, shownCount).map((p, i) => `${xAt(i)},${yAt(p)}`);
  const linePath = pts.length > 1 ? `M ${pts.join(' L ')}` : '';

  // Spike detection triggers at index 7 → t ≈ 3.5 * 7/9 ≈ 2.7s
  const spikeTriggerT = revealEnd * (7 / (series.length - 1));
  const alertPhase = clamp((localTime - spikeTriggerT) / 0.6, 0, 1);
  const alertIn = Easing.easeOutBack(alertPhase);

  // Threshold line draws in 0 → 1s
  const thresholdDraw = Easing.easeOutCubic(clamp(localTime / 1.2, 0, 1));

  return (
    <>
      {/* Axis baseline */}
      <div style={{
        position: 'absolute', left: chartX, top: chartY + chartH,
        width: chartW, height: 1, background: RW.line,
      }}/>

      {/* Y labels */}
      {[12.5, 13.0, 13.5, 14.0, 14.5].map((v) => (
        <div key={v} style={{
          position: 'absolute', left: chartX - 70, top: yAt(v) - 9,
          fontFamily: RW.mono, fontSize: 14, color: RW.inkMute,
          fontVariantNumeric: 'tabular-nums',
        }}>
          ${v.toFixed(2)}
        </div>
      ))}

      {/* X labels — weeks */}
      {series.map((_, i) => i % 2 === 0 && (
        <div key={i} style={{
          position: 'absolute', left: xAt(i) - 20, top: chartY + chartH + 12,
          fontFamily: RW.mono, fontSize: 12, color: RW.inkMute,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Wk {i + 1}
        </div>
      ))}

      {/* Threshold line (dashed) */}
      <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none' }}>
        <line
          x1={chartX} y1={yThreshold}
          x2={chartX + chartW * thresholdDraw} y2={yThreshold}
          stroke={RW.red} strokeWidth="2" strokeDasharray="8 6" opacity="0.7"
        />
      </svg>
      <div style={{
        position: 'absolute', left: chartX + chartW * thresholdDraw + 8,
        top: yThreshold - 12, opacity: thresholdDraw,
        fontFamily: RW.mono, fontSize: 13, color: RW.red,
        letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
      }}>
        Threshold +5%
      </div>

      {/* Price line */}
      <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none' }}>
        {linePath && (
          <path d={linePath} stroke={RW.ink} strokeWidth="3" fill="none"
            strokeLinecap="round" strokeLinejoin="round"/>
        )}
      </svg>

      {/* Dots */}
      {series.slice(0, shownCount).map((p, i) => {
        const spike = i === 7;
        const since = localTime - (revealEnd * i / (series.length - 1));
        const pop = Easing.easeOutBack(clamp(since / 0.3, 0, 1));
        return (
          <div key={i} style={{
            position: 'absolute',
            left: xAt(i) - 7, top: yAt(p) - 7,
            width: 14, height: 14, borderRadius: 7,
            background: spike ? RW.red : RW.ink,
            transform: `scale(${pop})`,
            boxShadow: spike ? `0 0 0 ${6 + Math.sin(localTime * 8) * 2}px ${RW.redSoft}` : 'none',
          }}/>
        );
      })}

      {/* Label on spike */}
      {alertPhase > 0 && (
        <div style={{
          position: 'absolute', left: xAt(7) - 50, top: yAt(series[7]) - 54,
          fontFamily: RW.mono, fontSize: 14, fontWeight: 700, color: RW.red,
          opacity: alertPhase,
          letterSpacing: '0.05em',
        }}>
          +8.4% ▲
        </div>
      )}

      {/* Product label on the line */}
      <div style={{
        position: 'absolute', left: chartX, top: chartY - 48,
        fontFamily: RW.sans, fontSize: 18, color: RW.inkSoft,
      }}>
        <span style={{ fontFamily: RW.mono, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: RW.inkMute, marginRight: 12 }}>Tracking</span>
        <span style={{ fontWeight: 600, color: RW.ink }}>Oxtail · Dreamland Foods</span>
      </div>

      {/* Alert card sliding in from right */}
      <div style={{
        position: 'absolute',
        right: 120,
        top: 470,
        width: 460,
        background: RW.ink,
        color: RW.paper,
        padding: '28px 32px',
        borderRadius: 4,
        transform: `translateX(${(1 - alertIn) * 520}px)`,
        opacity: alertPhase,
        boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: RW.mono, fontSize: 12, letterSpacing: '0.2em',
          color: RW.red, textTransform: 'uppercase', marginBottom: 16,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: 4, background: RW.red,
            boxShadow: `0 0 0 ${4 + Math.sin(localTime * 10) * 2}px ${RW.red}40`,
          }}/>
          Price Alert · Just Now
        </div>
        <div style={{ fontFamily: RW.serif, fontSize: 38, lineHeight: 1, marginBottom: 14, letterSpacing: '-0.01em' }}>
          Oxtail is up 8.4%
        </div>
        <div style={{ fontFamily: RW.sans, fontSize: 16, color: 'rgba(245,241,234,0.7)', marginBottom: 20, lineHeight: 1.4 }}>
          Dreamland Foods raised from $12.99 → $14.08 per unit on invoice #DR-2094.
        </div>
        <div style={{ display: 'flex', gap: 24, fontFamily: RW.mono, fontSize: 13 }}>
          <div>
            <div style={{ color: 'rgba(245,241,234,0.5)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Was</div>
            <div style={{ fontVariantNumeric: 'tabular-nums', fontSize: 18 }}>$12.99</div>
          </div>
          <div>
            <div style={{ color: 'rgba(245,241,234,0.5)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Now</div>
            <div style={{ fontVariantNumeric: 'tabular-nums', fontSize: 18, color: RW.red }}>$14.08</div>
          </div>
          <div>
            <div style={{ color: 'rgba(245,241,234,0.5)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Delta</div>
            <div style={{ fontVariantNumeric: 'tabular-nums', fontSize: 18, color: RW.red }}>+$1.09</div>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Scene1_PriceAlert });
