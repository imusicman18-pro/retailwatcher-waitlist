// Scene 2 — Vendor Comparison
// Three vendor price tags race in, the cheapest gets crowned with savings callout.

function Scene2_VendorCompare({ start, duration, index, total }) {
  return (
    <Sprite start={start} end={start + duration}>
      <SceneChrome
        index={index} total={total}
        eyebrow="Feature 02 · Vendor Comparison"
        title={<>Same product. <em style={{ fontStyle: 'italic', color: RW.green }}>Three vendors.</em> One winner.</>}
        subtitle="Compare side-by-side in seconds. The cheapest is highlighted; your savings per unit calculated instantly."
      />
      <Scene2Inner />
    </Sprite>
  );
}

function Scene2Inner() {
  const { localTime } = useSprite();

  const vendors = [
    { name: 'Dreamland Foods', price: 12.99, winner: true,  delay: 0.4 },
    { name: 'Import Foods',    price: 13.99, winner: false, delay: 0.8 },
    { name: 'ILham Wholesale', price: 15.00, winner: false, delay: 1.2 },
  ];

  const baseX = 240;
  const cardW = 440, cardH = 520, gap = 40;
  const cardY = 500;

  // "CHEAPEST" stamp shows at 2.6s
  const stampT = clamp((localTime - 2.6) / 0.5, 0, 1);
  const stampScale = Easing.easeOutBack(stampT);

  // Savings callout shows at 3.3s
  const saveT = clamp((localTime - 3.3) / 0.6, 0, 1);

  return (
    <>
      {/* Product row label */}
      <div style={{
        position: 'absolute', left: 240, top: 440,
        fontFamily: RW.sans, fontSize: 20, color: RW.inkSoft,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <span style={{
          fontFamily: RW.mono, fontSize: 12, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: RW.inkMute,
        }}>Comparing</span>
        <span style={{ fontWeight: 600, color: RW.ink, fontSize: 22 }}>Oxtail · 1 lb</span>
      </div>

      {vendors.map((v, i) => {
        const t = clamp((localTime - v.delay) / 0.6, 0, 1);
        const eased = Easing.easeOutBack(t);
        const x = baseX + i * (cardW + gap);
        const y = cardY + (1 - eased) * 60;

        // Winner pulses subtly after stamp
        const pulse = v.winner && stampT > 0.5
          ? 1 + Math.sin(localTime * 3) * 0.008
          : 1;

        return (
          <div key={v.name} style={{
            position: 'absolute', left: x, top: y,
            width: cardW, height: cardH,
            background: v.winner ? RW.ink : RW.paper,
            border: v.winner ? `1px solid ${RW.ink}` : `1px solid ${RW.line}`,
            color: v.winner ? RW.paper : RW.ink,
            opacity: t,
            transform: `scale(${pulse})`,
            padding: '36px 36px',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: v.winner ? '0 30px 60px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
            transition: 'none',
          }}>
            {/* Top — vendor meta */}
            <div>
              <div style={{
                fontFamily: RW.mono, fontSize: 12, letterSpacing: '0.2em',
                color: v.winner ? 'rgba(245,241,234,0.55)' : RW.inkMute,
                textTransform: 'uppercase', marginBottom: 18,
              }}>
                Vendor / {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{
                fontFamily: RW.serif, fontSize: 42, lineHeight: 1,
                letterSpacing: '-0.01em',
              }}>
                {v.name}
              </div>
            </div>

            {/* Big price */}
            <div>
              <div style={{
                fontFamily: RW.mono, fontSize: 12, letterSpacing: '0.2em',
                color: v.winner ? 'rgba(245,241,234,0.55)' : RW.inkMute,
                textTransform: 'uppercase', marginBottom: 10,
              }}>
                Price per unit
              </div>
              <div style={{
                fontFamily: RW.serif, fontSize: 120, lineHeight: 0.9,
                letterSpacing: '-0.03em',
                fontVariantNumeric: 'tabular-nums',
                color: v.winner ? RW.paper : RW.ink,
              }}>
                $<Counter
                  from={0} to={v.price}
                  start={v.delay + 0.2} end={v.delay + 1.0}
                  decimals={2}
                  style={{ fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums' }}
                />
              </div>

              {/* Delta pill — non-winners show +$ amount */}
              {!v.winner && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  marginTop: 18, padding: '6px 12px',
                  border: `1px solid ${RW.line}`, borderRadius: 999,
                  fontFamily: RW.mono, fontSize: 14, color: RW.red,
                  opacity: clamp((localTime - v.delay - 1.0) / 0.4, 0, 1),
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  ▲ +${(v.price - 12.99).toFixed(2)} vs. cheapest
                </div>
              )}
              {v.winner && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  marginTop: 18, padding: '6px 12px',
                  background: RW.green, color: RW.ink,
                  fontFamily: RW.mono, fontSize: 13, letterSpacing: '0.1em',
                  textTransform: 'uppercase', fontWeight: 700,
                  opacity: stampT, transform: `scale(${stampScale})`,
                  transformOrigin: 'left center',
                }}>
                  ★ Cheapest
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Savings callout — bottom center */}
      <div style={{
        position: 'absolute', left: 240, top: cardY + cardH + 40,
        width: 1440,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        opacity: saveT,
        transform: `translateY(${(1 - saveT) * 16}px)`,
      }}>
        <div style={{
          fontFamily: RW.serif, fontSize: 36, color: RW.ink,
          letterSpacing: '-0.01em',
        }}>
          Buying 50 units from Dreamland saves you{' '}
          <span style={{ color: RW.green, fontWeight: 500 }}>
            $<Counter from={0} to={100.50} start={3.3} end={4.3} decimals={2}
              style={{ fontFamily: RW.serif, fontVariantNumeric: 'tabular-nums' }}/>
          </span>{' '}this week.
        </div>
        <div style={{
          fontFamily: RW.mono, fontSize: 13, letterSpacing: '0.18em',
          color: RW.inkMute, textTransform: 'uppercase', textAlign: 'right',
        }}>
          Math done<br/>automatically.
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Scene2_VendorCompare });
