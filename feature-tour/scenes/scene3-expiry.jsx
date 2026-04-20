// Scene 3 — Expiry Tracker
// A calendar strip. "Today" marker sweeps across. Products expiring soon
// light up with alerts, then a Shelf Pull List assembles on the right.

function Scene3_Expiry({ start, duration, index, total }) {
  return (
    <Sprite start={start} end={start + duration}>
      <SceneChrome
        index={index} total={total}
        eyebrow="Feature 03 · Expiry Tracker"
        title={<>Nothing expires <em style={{ fontStyle: 'italic', color: RW.amber }}>on the shelf</em> unnoticed.</>}
        subtitle="Track manufacturer and custom expiry dates. 7-day and 3-day alerts before products turn into dead stock."
      />
      <Scene3Inner />
    </Sprite>
  );
}

function Scene3Inner() {
  const { localTime } = useSprite();

  // Calendar — 21 days starting Apr 11
  const days = Array.from({ length: 21 }, (_, i) => 11 + i);
  const calX = 140, calY = 520, dayW = 56, dayH = 84;
  const calW = days.length * dayW;

  // "Today" indicator sweeps from Apr 11 → Apr 18 over 0 → 3.5s
  const sweepT = Easing.easeInOutCubic(clamp(localTime / 3.5, 0, 1));
  const todayIdx = sweepT * 7;
  const todayX = calX + todayIdx * dayW + dayW / 2;

  // Products pinned to dates
  const products = [
    { name: 'Beef Liver',       qty: '4.5 lbs',  vendor: 'Dreamland',  day: 14, value: 22.50 },
    { name: 'Frozen Tilapia',   qty: '8 lbs',    vendor: 'Star Ocean', day: 18, value: 64.00 },
    { name: 'Palm Oil 1L',      qty: '6 bottles',vendor: 'Import Foods', day: 22, value: 42.00 },
    { name: 'Evaporated Milk',  qty: '12 pcs',   vendor: 'Res Depot',  day: 25, value: 28.00 },
  ];

  // Alert list (right side) — each product appears when today reaches day-7
  return (
    <>
      {/* Calendar track */}
      <div style={{
        position: 'absolute', left: calX, top: calY - 28,
        fontFamily: RW.mono, fontSize: 12, letterSpacing: '0.2em',
        textTransform: 'uppercase', color: RW.inkMute,
      }}>
        April 2026 · Expiry Timeline
      </div>

      {/* Day cells */}
      {days.map((d, i) => {
        const x = calX + i * dayW;
        const isToday = Math.round(todayIdx) + 11 === d;
        return (
          <div key={d} style={{
            position: 'absolute', left: x, top: calY,
            width: dayW, height: dayH,
            borderLeft: `1px solid ${RW.line}`,
            borderTop: `1px solid ${RW.line}`,
            borderBottom: `1px solid ${RW.line}`,
            borderRight: i === days.length - 1 ? `1px solid ${RW.line}` : 'none',
            background: isToday ? RW.paperAlt : 'transparent',
            padding: '10px 8px',
            fontFamily: RW.mono, fontSize: 11, color: RW.inkMute,
            letterSpacing: '0.1em',
          }}>
            APR {d}
          </div>
        );
      })}

      {/* "Today" indicator — vertical line with label */}
      <div style={{
        position: 'absolute',
        left: todayX - 1, top: calY - 14,
        width: 2, height: dayH + 28,
        background: RW.ink,
      }}/>
      <div style={{
        position: 'absolute',
        left: todayX - 34, top: calY - 38,
        background: RW.ink, color: RW.paper,
        fontFamily: RW.mono, fontSize: 11, padding: '4px 10px',
        letterSpacing: '0.15em', fontWeight: 600,
      }}>
        TODAY
      </div>

      {/* Product pins on calendar */}
      {products.map((p, i) => {
        const pinX = calX + (p.day - 11) * dayW + dayW / 2;
        const daysUntil = p.day - (Math.round(todayIdx) + 11);
        const urgent = daysUntil <= 3 && daysUntil >= 0;
        const warn = daysUntil > 3 && daysUntil <= 7;
        const color = urgent ? RW.red : warn ? RW.amber : RW.inkMute;
        const appearT = clamp((localTime - 0.3 - i * 0.15) / 0.5, 0, 1);
        const pop = Easing.easeOutBack(appearT);

        return (
          <React.Fragment key={p.name}>
            {/* Line from cell down to card */}
            <div style={{
              position: 'absolute', left: pinX - 0.5, top: calY + dayH,
              width: 1, height: 30, background: color, opacity: appearT,
            }}/>
            {/* Dot */}
            <div style={{
              position: 'absolute', left: pinX - 7, top: calY + dayH + 28,
              width: 14, height: 14, borderRadius: 7, background: color,
              opacity: appearT, transform: `scale(${pop})`,
              boxShadow: urgent
                ? `0 0 0 ${5 + Math.sin(localTime * 6) * 3}px ${RW.redSoft}`
                : 'none',
            }}/>
            {/* Card below */}
            <div style={{
              position: 'absolute',
              left: pinX - 100, top: calY + dayH + 56,
              width: 200,
              opacity: appearT,
              transform: `translateY(${(1 - pop) * 10}px)`,
            }}>
              <div style={{
                fontFamily: RW.sans, fontSize: 17, fontWeight: 600,
                color: RW.ink, marginBottom: 2, lineHeight: 1.15,
              }}>{p.name}</div>
              <div style={{
                fontFamily: RW.mono, fontSize: 11, color: RW.inkMute,
                letterSpacing: '0.08em',
              }}>{p.qty} · {p.vendor}</div>
              <div style={{
                marginTop: 8, fontFamily: RW.mono, fontSize: 11,
                color, letterSpacing: '0.1em', fontWeight: 700,
                textTransform: 'uppercase',
              }}>
                {daysUntil < 0 ? 'EXPIRED' : daysUntil === 0 ? 'TODAY' : `${daysUntil}d LEFT`}
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Alert panel — right side */}
      <div style={{
        position: 'absolute', right: 140, top: 470,
        width: 420,
        background: RW.ink, color: RW.paper,
        padding: '28px 30px',
        opacity: clamp((localTime - 3.2) / 0.5, 0, 1),
        transform: `translateY(${(1 - clamp((localTime - 3.2) / 0.5, 0, 1)) * 24}px)`,
        boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          fontFamily: RW.mono, fontSize: 11, letterSpacing: '0.2em',
          color: RW.amber, textTransform: 'uppercase', marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: 4, background: RW.amber,
          }}/>
          Shelf Pull List · Ready
        </div>
        <div style={{
          fontFamily: RW.serif, fontSize: 34, lineHeight: 1.05,
          letterSpacing: '-0.01em', marginBottom: 22,
        }}>
          2 items expire this week.
        </div>
        <div style={{ fontFamily: RW.sans, fontSize: 15, color: 'rgba(245,241,234,0.7)', lineHeight: 1.4, marginBottom: 24 }}>
          Pull Beef Liver today, Tilapia by Saturday.
          Run a markdown or write off.
        </div>
        <div style={{
          borderTop: '1px solid rgba(245,241,234,0.15)',
          paddingTop: 18,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: RW.mono, fontSize: 13,
        }}>
          <div>
            <div style={{ color: 'rgba(245,241,234,0.5)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
              Value at risk
            </div>
            <div style={{ fontFamily: RW.serif, fontSize: 32, color: RW.paper, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              $<Counter from={0} to={86.50} start={3.5} end={4.5} decimals={2}
                style={{ fontFamily: RW.serif, fontVariantNumeric: 'tabular-nums' }}/>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'rgba(245,241,234,0.5)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
              Export
            </div>
            <div style={{ fontSize: 14, color: RW.paper, marginTop: 6 }}>PDF / Email</div>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Scene3_Expiry });
