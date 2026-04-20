// Scene 6 — Restock Advisor (Enterprise flagship)
// A profit-first shopping list assembles line-by-line. Best vendor per item,
// qty, expected profit. The grand total counts up with a big "Go Shop" CTA.

function Scene6_Restock({ start, duration, index, total }) {
  return (
    <Sprite start={start} end={start + duration}>
      <SceneChrome
        index={index} total={total}
        eyebrow="Feature 06 · Restock Advisor"
        title={<>A shopping list that <em style={{ fontStyle: 'italic', color: RW.green }}>maximizes profit.</em></>}
        subtitle="Pick what you need. Watcher picks the best vendor per item and tells you exactly how much you'll make."
      />
      <Scene6Inner />
    </Sprite>
  );
}

function Scene6Inner() {
  const { localTime } = useSprite();

  const items = [
    { name: 'Fish Powder 200g',  vendor: 'ILham',      unit: 12.00, qty: 30, profit: 239.70, pct: 40.0, delay: 0.3 },
    { name: 'Goat Meat',         vendor: 'Dreamland',  unit:  5.00, qty: 10, profit:  49.10, pct: 49.5, delay: 0.8 },
    { name: 'Palm Oil 1L',       vendor: 'Import Foods',unit: 8.49, qty: 24, profit: 108.24, pct: 34.8, delay: 1.3 },
    { name: 'Oxtail',            vendor: 'Dreamland',  unit: 12.99, qty: 15, profit: 175.65, pct: 44.2, delay: 1.8 },
    { name: 'Scotch Bonnet',     vendor: 'ILham',      unit:  4.25, qty: 20, profit:  57.00, pct: 38.7, delay: 2.3 },
  ];

  const listX = 140, listY = 490, listW = 960;
  const rowH = 68;

  // Total counter animates
  const totalProfit = items.reduce((s, x) => s + x.profit, 0); // 629.69
  const counterStart = 3.0, counterEnd = 4.2;

  // CTA panel
  const ctaT = clamp((localTime - 3.4) / 0.5, 0, 1);

  return (
    <>
      {/* Panel header */}
      <div style={{
        position: 'absolute', left: listX, top: listY - 40,
        width: listW,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        fontFamily: RW.mono, fontSize: 11, letterSpacing: '0.22em',
        color: RW.inkMute, textTransform: 'uppercase',
      }}>
        <div>Profit-First Shopping List · April 18</div>
        <div>5 Items · Ready to Shop</div>
      </div>

      {/* Table header */}
      <div style={{
        position: 'absolute', left: listX, top: listY,
        width: listW,
        display: 'grid', gridTemplateColumns: '2.2fr 1.8fr 0.8fr 1fr 1fr',
        fontFamily: RW.mono, fontSize: 11, letterSpacing: '0.15em',
        color: RW.inkMute, textTransform: 'uppercase',
        paddingBottom: 14, borderBottom: `1px solid ${RW.line}`,
      }}>
        <div>Product</div>
        <div>Best Vendor</div>
        <div style={{ textAlign: 'right' }}>Qty</div>
        <div style={{ textAlign: 'right' }}>Profit</div>
        <div style={{ textAlign: 'right' }}>Margin</div>
      </div>

      {/* Rows */}
      {items.map((it, i) => {
        const t = clamp((localTime - it.delay) / 0.5, 0, 1);
        const eased = Easing.easeOutCubic(t);
        return (
          <div key={it.name} style={{
            position: 'absolute', left: listX, top: listY + 32 + i * rowH,
            width: listW,
            display: 'grid', gridTemplateColumns: '2.2fr 1.8fr 0.8fr 1fr 1fr',
            alignItems: 'center',
            padding: '16px 0', borderBottom: `1px solid ${RW.line}`,
            opacity: t, transform: `translateX(${(1 - eased) * -30}px)`,
            fontFamily: RW.sans, fontSize: 20, color: RW.ink,
          }}>
            <div style={{ fontWeight: 600 }}>{it.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: RW.inkSoft }}>
              <span style={{
                fontFamily: RW.mono, fontSize: 10, background: RW.ink, color: RW.paper,
                padding: '3px 8px', letterSpacing: '0.1em',
              }}>
                ★
              </span>
              {it.vendor}
              <span style={{ fontFamily: RW.mono, fontSize: 13, color: RW.inkMute }}>
                · ${it.unit.toFixed(2)}
              </span>
            </div>
            <div style={{ textAlign: 'right', fontFamily: RW.mono, fontVariantNumeric: 'tabular-nums', fontSize: 20 }}>
              {it.qty}
            </div>
            <div style={{
              textAlign: 'right', fontFamily: RW.serif, fontSize: 28,
              fontVariantNumeric: 'tabular-nums', color: RW.green, letterSpacing: '-0.01em',
            }}>
              +${it.profit.toFixed(2)}
            </div>
            <div style={{ textAlign: 'right', fontFamily: RW.mono, fontSize: 16, fontVariantNumeric: 'tabular-nums', color: RW.inkSoft }}>
              {it.pct.toFixed(1)}%
            </div>
          </div>
        );
      })}

      {/* Grand total row */}
      <div style={{
        position: 'absolute', left: listX, top: listY + 32 + items.length * rowH + 20,
        width: listW,
        display: 'grid', gridTemplateColumns: '2.2fr 1.8fr 0.8fr 1fr 1fr',
        alignItems: 'baseline', paddingTop: 20,
        borderTop: `3px solid ${RW.ink}`,
        opacity: clamp((localTime - 2.8) / 0.4, 0, 1),
      }}>
        <div style={{
          fontFamily: RW.serif, fontSize: 38, color: RW.ink, letterSpacing: '-0.01em',
          gridColumn: 'span 3',
        }}>
          Expected profit, this run
        </div>
        <div style={{
          textAlign: 'right', fontFamily: RW.serif, fontSize: 68,
          fontVariantNumeric: 'tabular-nums', color: RW.green, letterSpacing: '-0.02em',
          lineHeight: 1,
        }}>
          $<Counter from={0} to={totalProfit} start={counterStart} end={counterEnd} decimals={2}
            style={{ fontFamily: RW.serif, fontVariantNumeric: 'tabular-nums' }}/>
        </div>
        <div style={{
          textAlign: 'right', fontFamily: RW.mono, fontSize: 20,
          fontVariantNumeric: 'tabular-nums', color: RW.inkSoft,
        }}>
          <Counter from={0} to={41.3} start={counterStart} end={counterEnd} decimals={1}
            style={{ fontFamily: RW.mono }}/>%
        </div>
      </div>

      {/* Right side — CTA card */}
      <div style={{
        position: 'absolute', right: 140, top: 470,
        width: 360,
        background: RW.green, color: RW.ink,
        padding: '32px 34px',
        opacity: ctaT,
        transform: `translateY(${(1 - ctaT) * 16}px)`,
        boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
      }}>
        <div style={{
          fontFamily: RW.mono, fontSize: 11, letterSpacing: '0.22em',
          textTransform: 'uppercase', marginBottom: 16,
        }}>
          Export options
        </div>
        <div style={{
          fontFamily: RW.serif, fontSize: 42, lineHeight: 1,
          letterSpacing: '-0.01em', marginBottom: 26,
        }}>
          Take it shopping.
        </div>

        {[
          { label: 'PDF shopping list', meta: 'Print at the market' },
          { label: 'Email to self',     meta: 'Open on your phone' },
          { label: 'Send to team',      meta: 'Manager-approved' },
        ].map((opt, i) => (
          <div key={opt.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 0', borderTop: i === 0 ? `1px solid rgba(26,24,20,0.2)` : 'none',
            borderBottom: `1px solid rgba(26,24,20,0.2)`,
          }}>
            <div>
              <div style={{ fontFamily: RW.sans, fontSize: 18, fontWeight: 600 }}>{opt.label}</div>
              <div style={{ fontFamily: RW.mono, fontSize: 11, opacity: 0.7, letterSpacing: '0.08em' }}>{opt.meta}</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>→</div>
          </div>
        ))}
      </div>
    </>
  );
}

Object.assign(window, { Scene6_Restock });
