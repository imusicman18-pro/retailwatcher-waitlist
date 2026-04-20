// Problem Scene A — Spreadsheet Chaos
// A familiar spreadsheet grid on the left. Tabs multiply at the top.
// Cells start erroring (#REF!, #DIV/0!, #NAME?). A formula cascades into red.
// On the right: a "time spent fixing the sheet" counter ticks up.

function SceneP1_Spreadsheet({ start, duration, index, total }) {
  return (
    <Sprite start={start} end={start + duration}>
      <SceneChrome
        index={index} total={total}
        eyebrow="Problem 01 · The Spreadsheet"
        title={<>Your spreadsheet is <em style={{ fontStyle: 'italic', color: RW.red }}>costing you money.</em></>}
        subtitle="New tab every month. Formulas breaking. You spend more time fixing the sheet than running your store."
      />
      <SceneP1Inner />
    </Sprite>
  );
}

function SceneP1Inner() {
  const { localTime } = useSprite();

  const sheetX = 140, sheetY = 470, sheetW = 1040, sheetH = 520;

  // Tab row at top of the sheet — tabs multiply over time
  const tabs = [
    { name: 'Jan',    t: 0.0 },
    { name: 'Feb',    t: 0.25 },
    { name: 'Mar',    t: 0.5 },
    { name: 'Apr',    t: 0.75 },
    { name: 'Apr v2', t: 1.1 },
    { name: 'Apr v3', t: 1.45 },
    { name: 'Apr-FIX', t: 1.8 },
    { name: 'FINAL',  t: 2.15 },
    { name: 'FINAL-final', t: 2.5 },
    { name: 'use-this', t: 2.9 },
  ];

  // Column headers
  const cols = ['Product', 'Vendor', 'Qty', 'Cost', 'Sale', 'Profit'];
  const colFlex = [2.4, 1.6, 0.7, 1, 1, 1];

  // Rows. Each row has a "error at" time — cells turn red.
  // We also have a creeping formula-break cascade from bottom upward.
  const rows = [
    { product: 'Oxtail',         vendor: 'Dreamland',    qty: 12,  cost: 12.99, sale: 19.99, errAt: 3.1, errCol: 5 },
    { product: 'Palm Oil 1L',    vendor: 'Import Foods', qty: 24,  cost:  8.49, sale: 13.99, errAt: 3.4, errCol: 3 },
    { product: 'Goat Meat',      vendor: 'Dreamland',    qty: 10,  cost:  5.00, sale:  9.99, errAt: 3.7, errCol: 5 },
    { product: 'Fish Powder',    vendor: 'ILham',        qty: 30,  cost: 12.00, sale: 19.99, errAt: 4.0, errCol: 4 },
    { product: 'Scotch Bonnet',  vendor: '',             qty: 6,   cost:  4.25, sale:  7.00, errAt: 2.6, errCol: 1 },
    { product: 'Evap. Milk',     vendor: 'Res Depot',    qty: 12,  cost:  2.10, sale:  3.99, errAt: 2.8, errCol: 3 },
    { product: 'Frozen Tilapia', vendor: 'Star Ocean',   qty: 8,   cost:  7.50, sale: 12.99, errAt: 3.3, errCol: 5 },
    { product: 'Bread Loaf',     vendor: 'Local',        qty: 20,  cost:  1.80, sale:  3.50, errAt: 3.6, errCol: 4 },
  ];

  const errStrings = ['#REF!', '#DIV/0!', '#NAME?', '#VALUE!', '#ERROR!'];

  const rowH = 42;
  const headerH = 38;
  const tabH = 36;

  // Sheet shake intensity ramps with chaos
  const chaos = clamp((localTime - 2.5) / 2.5, 0, 1);
  const shake = chaos > 0.3
    ? Math.sin(localTime * 18) * chaos * 1.6
    : 0;

  // Time-wasted counter
  const counterT = clamp((localTime - 0.5) / 4.5, 0, 1);
  const hoursWasted = counterT * 14.5; // 14.5 hrs this month

  // Dollar-lost counter
  const dollarsLost = counterT * 412;

  // Formula bar "typing"
  const formulaText = "=IFERROR(VLOOKUP(A12,'Apr-FIX'!$A:$F,6,0)*(1-D12),'???')";

  return (
    <>
      {/* Spreadsheet window frame */}
      <div style={{
        position: 'absolute', left: sheetX, top: sheetY,
        width: sheetW, height: sheetH,
        background: '#fff',
        border: `1px solid ${RW.line}`,
        boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
        transform: `translate(${shake}px, ${shake * 0.6}px) rotate(${shake * 0.08}deg)`,
        overflow: 'hidden',
      }}>
        {/* Chrome: menu + formula bar */}
        <div style={{
          height: 28, borderBottom: `1px solid ${RW.line}`,
          display: 'flex', alignItems: 'center',
          padding: '0 12px',
          fontFamily: RW.sans, fontSize: 11, color: '#555',
          gap: 16, background: '#f5f4f0',
        }}>
          <span>File</span><span>Edit</span><span>View</span>
          <span>Insert</span><span>Format</span><span>Data</span>
          <span style={{ color: RW.red, fontWeight: 600, marginLeft: 'auto' }}>
            ● Unsaved changes
          </span>
        </div>
        <div style={{
          height: 28, borderBottom: `1px solid ${RW.line}`,
          display: 'flex', alignItems: 'center', padding: '0 12px',
          fontFamily: RW.mono, fontSize: 12, color: '#333',
          background: '#fcfbf7',
        }}>
          <span style={{ color: '#888', marginRight: 10 }}>fx</span>
          <Typewriter text={formulaText} start={0.5} cps={38} cursor={localTime < 2.0}
            style={{ fontFamily: RW.mono, fontSize: 12 }}/>
        </div>

        {/* Column header row */}
        <div style={{
          display: 'flex', height: headerH,
          background: '#f1efea', borderBottom: `1px solid ${RW.line}`,
          fontFamily: RW.sans, fontSize: 12, color: '#555', fontWeight: 600,
        }}>
          <div style={{ width: 36, borderRight: `1px solid ${RW.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
          {cols.map((c, i) => (
            <div key={c} style={{
              flex: colFlex[i],
              borderRight: `1px solid ${RW.line}`,
              display: 'flex', alignItems: 'center', padding: '0 10px',
            }}>
              {String.fromCharCode(65 + i)}  <span style={{ color: '#aaa', marginLeft: 6 }}>· {c}</span>
            </div>
          ))}
        </div>

        {/* Data rows */}
        {rows.map((r, rowIdx) => {
          const cellErr = localTime > r.errAt;
          const errStr = errStrings[rowIdx % errStrings.length];
          return (
            <div key={rowIdx} style={{
              display: 'flex', height: rowH,
              borderBottom: `1px solid ${RW.line}`,
              fontFamily: RW.sans, fontSize: 14,
            }}>
              <div style={{
                width: 36, borderRight: `1px solid ${RW.line}`,
                background: '#f5f4f0', color: '#777',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11,
              }}>
                {rowIdx + 2}
              </div>
              {cols.map((_, colIdx) => {
                const val = colIdx === 0 ? r.product
                          : colIdx === 1 ? r.vendor
                          : colIdx === 2 ? r.qty
                          : colIdx === 3 ? `$${r.cost.toFixed(2)}`
                          : colIdx === 4 ? `$${r.sale.toFixed(2)}`
                          : `$${((r.sale - r.cost) * r.qty).toFixed(2)}`;
                const thisErr = cellErr && colIdx === r.errCol;
                const empty = val === '' || val === '$NaN';
                return (
                  <div key={colIdx} style={{
                    flex: colFlex[colIdx],
                    borderRight: `1px solid ${RW.line}`,
                    display: 'flex', alignItems: 'center',
                    padding: '0 10px',
                    color: thisErr ? RW.red : (empty ? '#ccc' : '#222'),
                    background: thisErr ? 'rgba(228, 60, 50, 0.08)' : 'transparent',
                    fontFamily: thisErr || colIdx >= 2 ? RW.mono : RW.sans,
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: thisErr ? 700 : 400,
                  }}>
                    {thisErr ? errStr : (empty ? '—' : val)}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Tabs at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: tabH, borderTop: `1px solid ${RW.line}`,
          background: '#f1efea',
          display: 'flex', alignItems: 'stretch',
          padding: '0 8px', gap: 2,
          overflow: 'hidden',
        }}>
          {tabs.map((tab, i) => {
            const t = clamp((localTime - tab.t) / 0.35, 0, 1);
            if (t <= 0) return null;
            const isLast = i === tabs.filter(x => localTime > x.t).length - 1;
            const warn = tab.name.includes('FIX') || tab.name.includes('FINAL') || tab.name === 'use-this';
            return (
              <div key={i} style={{
                padding: '0 14px',
                borderLeft: `1px solid ${RW.line}`,
                borderRight: `1px solid ${RW.line}`,
                borderTop: `1px solid ${RW.line}`,
                background: isLast ? '#fff' : '#e9e6df',
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: RW.sans, fontSize: 12, color: warn ? RW.red : '#333',
                fontWeight: warn ? 600 : 400,
                opacity: t,
                transform: `scaleX(${t})`, transformOrigin: 'left',
                whiteSpace: 'nowrap',
              }}>
                {tab.name}
                {warn && <span style={{ color: RW.red }}>●</span>}
              </div>
            );
          })}
        </div>

        {/* Error dialog pops up */}
        {localTime > 4.3 && (
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: `translate(-50%, -50%) scale(${Easing.easeOutBack(clamp((localTime - 4.3) / 0.4, 0, 1))})`,
            width: 340, background: '#fff',
            border: `1px solid ${RW.line}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            padding: '20px 22px',
            fontFamily: RW.sans, fontSize: 14, color: '#222',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{
                width: 22, height: 22, borderRadius: 11,
                background: RW.red, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
              }}>!</span>
              <span style={{ fontWeight: 700 }}>Circular reference</span>
            </div>
            <div style={{ color: '#555', lineHeight: 1.4, marginBottom: 12, fontSize: 13 }}>
              One or more formulas contain a circular reference and may not calculate correctly.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <div style={{ padding: '6px 14px', border: `1px solid ${RW.line}`, fontSize: 12 }}>Help</div>
              <div style={{ padding: '6px 14px', background: '#222', color: '#fff', fontSize: 12 }}>OK</div>
            </div>
          </div>
        )}
      </div>

      {/* Right-side — the cost of chaos */}
      <div style={{
        position: 'absolute', right: 80, top: sheetY,
        width: 460,
      }}>
        <div style={{
          fontFamily: RW.mono, fontSize: 11, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: RW.inkMute, marginBottom: 20,
        }}>
          The real cost · this month
        </div>

        {/* Hours */}
        <div style={{
          paddingBottom: 28, borderBottom: `1px solid ${RW.line}`, marginBottom: 28,
        }}>
          <div style={{
            fontFamily: RW.serif, fontSize: 140, lineHeight: 0.9,
            color: RW.red, letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {hoursWasted.toFixed(1)}<span style={{ fontSize: 56, color: RW.inkSoft }}>hrs</span>
          </div>
          <div style={{
            fontFamily: RW.sans, fontSize: 20, color: RW.inkSoft, marginTop: 10, lineHeight: 1.35,
          }}>
            spent fixing broken formulas instead of serving customers.
          </div>
        </div>

        {/* Dollars */}
        <div style={{ paddingBottom: 28 }}>
          <div style={{
            fontFamily: RW.serif, fontSize: 96, lineHeight: 0.9,
            color: RW.ink, letterSpacing: '-0.03em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            $<Counter from={0} to={412} start={0.5} end={5.0} decimals={0}
              style={{ fontFamily: RW.serif, fontVariantNumeric: 'tabular-nums' }}/>
          </div>
          <div style={{
            fontFamily: RW.sans, fontSize: 20, color: RW.inkSoft, marginTop: 10, lineHeight: 1.35,
          }}>
            in pricing errors traced back to a bad <code style={{ fontFamily: RW.mono, fontSize: 16, background: RW.paperAlt, padding: '2px 6px' }}>VLOOKUP</code>.
          </div>
        </div>

        {/* Final verdict */}
        <div style={{
          fontFamily: RW.mono, fontSize: 12, letterSpacing: '0.18em',
          color: RW.red, textTransform: 'uppercase', fontWeight: 700,
          opacity: clamp((localTime - 4.8) / 0.5, 0, 1),
          borderTop: `1px solid ${RW.line}`, paddingTop: 20,
        }}>
          There is a better way. →
        </div>
      </div>
    </>
  );
}

Object.assign(window, { SceneP1_Spreadsheet });
