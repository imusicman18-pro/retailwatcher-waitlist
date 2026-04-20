// Scene 5 — Invoice Vault + PDF OCR
// A PDF invoice sits on the left. A scan line sweeps it.
// Extracted rows jump to a structured data table on the right.

function Scene5_InvoiceOCR({ start, duration, index, total }) {
  return (
    <Sprite start={start} end={start + duration}>
      <SceneChrome
        index={index} total={total}
        eyebrow="Feature 05 · Invoice Vault + PDF OCR"
        title={<>Drop a PDF. <em style={{ fontStyle: 'italic', color: RW.brand }}>Watcher reads it.</em></>}
        subtitle="Upload vendor invoices — AI extracts products, quantities, and prices. Stored securely in the cloud forever."
      />
      <Scene5Inner />
    </Sprite>
  );
}

function Scene5Inner() {
  const { localTime } = useSprite();

  // Invoice
  const pdfX = 140, pdfY = 470, pdfW = 620, pdfH = 500;

  const rows = [
    { name: 'Oxtail',           qty: 12,  price: 12.99, ly: 0.22 },
    { name: 'Goat Meat',        qty: 10,  price:  5.00, ly: 0.32 },
    { name: 'Palm Oil 1L',      qty: 24,  price:  8.49, ly: 0.42 },
    { name: 'Fish Powder 200g', qty: 30,  price: 12.00, ly: 0.52 },
    { name: 'Scotch Bonnet',    qty:  6,  price:  4.25, ly: 0.62 },
  ];

  // Scan phase: 0.5 → 2.8s
  const scanStart = 0.5, scanEnd = 2.8;
  const scanT = clamp((localTime - scanStart) / (scanEnd - scanStart), 0, 1);
  const scanY = pdfY + pdfH * scanT;

  // Invoice drop-in 0 → 0.5
  const dropT = Easing.easeOutCubic(clamp(localTime / 0.5, 0, 1));

  // Table shell appears at 0.8
  const tableT = clamp((localTime - 0.8) / 0.4, 0, 1);

  return (
    <>
      {/* PDF sheet */}
      <div style={{
        position: 'absolute', left: pdfX, top: pdfY,
        width: pdfW, height: pdfH,
        background: '#fff',
        border: `1px solid ${RW.line}`,
        boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
        opacity: dropT,
        transform: `translateY(${(1 - dropT) * 20}px)`,
        padding: '34px 40px',
        fontFamily: RW.sans,
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: RW.serif, fontSize: 30, color: RW.ink, letterSpacing: '-0.01em' }}>
              Dreamland Foods Wholesale
            </div>
            <div style={{ fontFamily: RW.mono, fontSize: 11, color: RW.inkMute, letterSpacing: '0.1em', marginTop: 4 }}>
              INVOICE #DR-2094 · APR 14, 2026
            </div>
          </div>
          <div style={{
            fontFamily: RW.mono, fontSize: 10, letterSpacing: '0.2em',
            color: RW.inkMute, textTransform: 'uppercase',
            border: `1px solid ${RW.line}`, padding: '4px 10px',
          }}>PDF</div>
        </div>
        <div style={{ height: 1, background: RW.line, marginBottom: 18 }}/>

        {/* Invoice rows */}
        <div style={{ display: 'flex', fontFamily: RW.mono, fontSize: 11, color: RW.inkMute, letterSpacing: '0.15em', textTransform: 'uppercase', paddingBottom: 10 }}>
          <div style={{ flex: 2 }}>Product</div>
          <div style={{ flex: 1, textAlign: 'right' }}>Qty</div>
          <div style={{ flex: 1, textAlign: 'right' }}>Unit</div>
          <div style={{ flex: 1, textAlign: 'right' }}>Line</div>
        </div>
        {rows.map((r, i) => {
          // When scan line passes this row, briefly highlight
          const rowTop = 140 + i * 46;
          const rowHit = scanY > pdfY + rowTop && scanY < pdfY + rowTop + 80;
          return (
            <div key={r.name} style={{
              display: 'flex', fontFamily: RW.sans, fontSize: 18,
              padding: '14px 0', color: RW.ink,
              borderBottom: `1px solid ${RW.line}`,
              background: rowHit ? RW.amberSoft : 'transparent',
              transition: 'background 100ms',
            }}>
              <div style={{ flex: 2 }}>{r.name}</div>
              <div style={{ flex: 1, textAlign: 'right', fontFamily: RW.mono, fontVariantNumeric: 'tabular-nums' }}>{r.qty}</div>
              <div style={{ flex: 1, textAlign: 'right', fontFamily: RW.mono, fontVariantNumeric: 'tabular-nums' }}>${r.price.toFixed(2)}</div>
              <div style={{ flex: 1, textAlign: 'right', fontFamily: RW.mono, fontVariantNumeric: 'tabular-nums' }}>${(r.qty * r.price).toFixed(2)}</div>
            </div>
          );
        })}
      </div>

      {/* Scan line */}
      {scanT > 0 && scanT < 1 && (
        <>
          <div style={{
            position: 'absolute', left: pdfX, top: scanY - 1,
            width: pdfW, height: 2, background: RW.brand,
            boxShadow: `0 0 24px 4px ${RW.brand}`,
          }}/>
          <div style={{
            position: 'absolute', left: pdfX, top: pdfY,
            width: pdfW, height: scanY - pdfY,
            background: `linear-gradient(to bottom, transparent 60%, ${RW.brandSoft} 100%)`,
            pointerEvents: 'none',
          }}/>
        </>
      )}

      {/* Processing badge on top of PDF */}
      {scanT > 0 && scanT < 1 && (
        <div style={{
          position: 'absolute', left: pdfX + 20, top: pdfY + 20,
          background: RW.brand, color: '#fff',
          padding: '6px 12px', fontFamily: RW.mono, fontSize: 11,
          letterSpacing: '0.2em', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: 4, background: '#fff',
            opacity: 0.5 + Math.abs(Math.sin(localTime * 8)) * 0.5,
          }}/>
          SCANNING
        </div>
      )}

      {/* Extracted data table — right */}
      <div style={{
        position: 'absolute', right: 140, top: pdfY,
        width: 560, height: pdfH,
        background: RW.ink, color: RW.paper,
        opacity: tableT,
        transform: `translateX(${(1 - tableT) * 40}px)`,
        padding: '34px 36px',
      }}>
        <div style={{
          fontFamily: RW.mono, fontSize: 11, letterSpacing: '0.25em',
          color: RW.green, textTransform: 'uppercase', marginBottom: 6,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: RW.green }}/>
          Structured Data · Extracted
        </div>
        <div style={{
          fontFamily: RW.serif, fontSize: 34, lineHeight: 1,
          letterSpacing: '-0.01em', marginBottom: 24,
        }}>
          5 products captured.
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', fontFamily: RW.mono, fontSize: 10,
          color: 'rgba(245,241,234,0.5)', letterSpacing: '0.15em',
          textTransform: 'uppercase', paddingBottom: 10,
          borderBottom: '1px solid rgba(245,241,234,0.15)',
        }}>
          <div style={{ flex: 2 }}>Product</div>
          <div style={{ flex: 1, textAlign: 'right' }}>Qty</div>
          <div style={{ flex: 1, textAlign: 'right' }}>Price</div>
        </div>

        {rows.map((r, i) => {
          const appear = clamp((localTime - (scanStart + r.ly)) / 0.3, 0, 1);
          return (
            <div key={r.name} style={{
              display: 'flex', padding: '12px 0',
              borderBottom: '1px solid rgba(245,241,234,0.08)',
              fontFamily: RW.sans, fontSize: 16, color: RW.paper,
              opacity: appear,
              transform: `translateX(${(1 - appear) * -20}px)`,
            }}>
              <div style={{ flex: 2 }}>{r.name}</div>
              <div style={{ flex: 1, textAlign: 'right', fontFamily: RW.mono, fontVariantNumeric: 'tabular-nums' }}>{r.qty}</div>
              <div style={{ flex: 1, textAlign: 'right', fontFamily: RW.mono, fontVariantNumeric: 'tabular-nums' }}>${r.price.toFixed(2)}</div>
            </div>
          );
        })}

        {/* Footer note */}
        <div style={{
          position: 'absolute', bottom: 28, left: 36, right: 36,
          fontFamily: RW.mono, fontSize: 12, color: 'rgba(245,241,234,0.55)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between',
          paddingTop: 14, borderTop: '1px solid rgba(245,241,234,0.15)',
        }}>
          <span>No typing. No errors.</span>
          <span>~2.8s</span>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Scene5_InvoiceOCR });
