// Scene 4 — Shrinkage & Loss Tracking
// Products tumble into categorized loss bins. A monthly receipt assembles,
// getting a "tax deduction" stamp at the end.

function Scene4_Shrinkage({ start, duration, index, total }) {
  return (
    <Sprite start={start} end={start + duration}>
      <SceneChrome
        index={index} total={total}
        eyebrow="Feature 04 · Shrinkage & Loss"
        title={<>Every loss is a <em style={{ fontStyle: 'italic', color: RW.green }}>tax deduction.</em></>}
        subtitle="Log spoiled, expired, damaged, and stolen inventory. Monthly tax write-off PDF ready for your accountant."
      />
      <Scene4Inner />
    </Sprite>
  );
}

function Scene4Inner() {
  const { localTime } = useSprite();

  // Four bins
  const bins = [
    { label: 'Spoiled',  icon: '🌱', color: RW.amber,  count: 7, dollars: 42.30 },
    { label: 'Expired',  icon: '⏱',  color: RW.red,    count: 4, dollars: 58.75 },
    { label: 'Damaged',  icon: '✕',  color: RW.inkSoft,count: 3, dollars: 18.00 },
    { label: 'Theft',    icon: '!',  color: RW.ink,    count: 2, dollars: 24.50 },
  ];

  // Falling items feeding the bins
  const items = [
    { bin: 0, name: 'Tomatoes',        t: 0.2, v: 6.50 },
    { bin: 1, name: 'Beef Liver',      t: 0.5, v: 22.50 },
    { bin: 0, name: 'Lettuce',         t: 0.8, v: 4.20 },
    { bin: 2, name: 'Rice Bag 20lb',   t: 1.1, v: 18.00 },
    { bin: 1, name: 'Milk 2%',         t: 1.4, v: 12.25 },
    { bin: 3, name: 'Canned Corn',     t: 1.7, v: 8.50 },
    { bin: 0, name: 'Bananas',         t: 2.0, v: 5.80 },
    { bin: 1, name: 'Yogurt 6pk',      t: 2.3, v: 14.00 },
    { bin: 3, name: 'Chocolate Bar',   t: 2.6, v: 16.00 },
    { bin: 0, name: 'Bread Loaf',      t: 2.9, v: 3.80 },
  ];

  const binY = 720;
  const binW = 280, binH = 200, binGap = 60;
  const binsTotalW = bins.length * binW + (bins.length - 1) * binGap;
  const binsStartX = (1920 - binsTotalW) / 2 - 200;

  // Receipt assembles on right
  const receiptT = clamp((localTime - 3.2) / 0.6, 0, 1);
  const stampT = clamp((localTime - 4.5) / 0.4, 0, 1);

  return (
    <>
      {/* Drop zone label */}
      <div style={{
        position: 'absolute', left: binsStartX, top: 470,
        fontFamily: RW.mono, fontSize: 12, letterSpacing: '0.2em',
        textTransform: 'uppercase', color: RW.inkMute,
      }}>
        Log loss → categorize automatically
      </div>

      {/* Bins */}
      {bins.map((b, i) => {
        // Count items that have arrived (arrive at item.t + 0.6)
        const arrived = items.filter(it => it.bin === i && localTime > it.t + 0.6);
        const count = arrived.length;
        const dollars = arrived.reduce((s, it) => s + it.v, 0);
        const x = binsStartX + i * (binW + binGap);

        return (
          <div key={b.label} style={{
            position: 'absolute', left: x, top: binY,
            width: binW, height: binH,
            border: `1px solid ${RW.line}`,
            borderTop: `3px solid ${b.color}`,
            background: RW.paper,
            padding: '22px 24px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                fontFamily: RW.mono, fontSize: 11, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: RW.inkMute, marginBottom: 6,
              }}>
                Reason / {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{
                fontFamily: RW.serif, fontSize: 38, lineHeight: 1,
                letterSpacing: '-0.01em', color: b.color,
              }}>
                {b.label}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontFamily: RW.mono, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: RW.inkMute }}>Items</div>
                <div style={{ fontFamily: RW.serif, fontSize: 42, color: RW.ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {count}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: RW.mono, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: RW.inkMute }}>Value</div>
                <div style={{ fontFamily: RW.mono, fontSize: 18, color: RW.ink, fontVariantNumeric: 'tabular-nums' }}>
                  ${dollars.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Falling items */}
      {items.map((it, i) => {
        const phase = localTime - it.t;
        if (phase < 0 || phase > 1.2) return null;
        const fallT = clamp(phase / 0.6, 0, 1);
        const fall = Easing.easeInQuad(fallT);
        const fadeOut = clamp((phase - 0.6) / 0.3, 0, 1);

        const targetX = binsStartX + it.bin * (binW + binGap) + binW / 2;
        const startX = targetX + (Math.sin(i * 2.3) * 100);
        const startY = 560;
        const endY = binY - 10;

        const x = startX + (targetX - startX) * fall;
        const y = startY + (endY - startY) * fall;

        return (
          <div key={i} style={{
            position: 'absolute', left: x - 70, top: y - 18,
            width: 140, padding: '6px 12px',
            background: RW.ink, color: RW.paper,
            fontFamily: RW.mono, fontSize: 12,
            textAlign: 'center',
            opacity: 1 - fadeOut,
            transform: `rotate(${Math.sin(i) * 4}deg)`,
          }}>
            {it.name}
            <div style={{ fontSize: 10, color: 'rgba(245,241,234,0.6)' }}>
              ${it.v.toFixed(2)}
            </div>
          </div>
        );
      })}

      {/* Monthly receipt — right side */}
      <div style={{
        position: 'absolute', right: 80, top: 470,
        width: 440,
        background: RW.paper,
        border: `1px solid ${RW.line}`,
        padding: '28px 30px',
        opacity: receiptT,
        transform: `translateY(${(1 - receiptT) * 20}px)`,
        boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
      }}>
        <div style={{
          fontFamily: RW.mono, fontSize: 11, letterSpacing: '0.25em',
          color: RW.inkMute, textTransform: 'uppercase', marginBottom: 16,
        }}>
          Monthly Loss Report · April 2026
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10,
          fontFamily: RW.mono, fontSize: 14, color: RW.inkSoft,
          paddingBottom: 16, borderBottom: `1px dashed ${RW.line}`,
        }}>
          {bins.map(b => (
            <div key={b.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{b.label}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>${b.dollars.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'baseline', paddingTop: 16,
        }}>
          <span style={{ fontFamily: RW.sans, fontSize: 16, color: RW.inkSoft }}>Total deductible</span>
          <span style={{
            fontFamily: RW.serif, fontSize: 44, color: RW.ink,
            fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          }}>
            $<Counter from={0} to={143.55} start={3.4} end={4.4} decimals={2}
              style={{ fontFamily: RW.serif, fontVariantNumeric: 'tabular-nums' }}/>
          </span>
        </div>

        {/* Tax stamp */}
        <div style={{
          position: 'absolute', right: 20, bottom: 20,
          transform: `rotate(-8deg) scale(${Easing.easeOutBack(stampT)})`,
          opacity: stampT,
          border: `3px solid ${RW.green}`,
          color: RW.green,
          padding: '10px 18px',
          fontFamily: RW.mono, fontSize: 16, fontWeight: 800,
          letterSpacing: '0.15em',
        }}>
          TAX WRITE-OFF
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Scene4_Shrinkage });
