// Scene 7 — Watcher AI
// Chat interface. User types a question, Watcher streams an answer with
// a highlighted profit number. Suggested questions float on the side.

function Scene7_Watcher({ start, duration, index, total }) {
  return (
    <Sprite start={start} end={start + duration}>
      <SceneChrome
        index={index} total={total}
        eyebrow="Feature 07 · Watcher AI"
        title={<>Ask your store <em style={{ fontStyle: 'italic', color: RW.brand }}>anything.</em></>}
        subtitle="Watcher knows your products, vendors, and real numbers. Real answers, no spreadsheet diving."
      />
      <Scene7Inner />
    </Sprite>
  );
}

function Scene7Inner() {
  const { localTime } = useSprite();

  const chatX = 180, chatY = 470, chatW = 960;

  // User question appears 0 → 0.3
  // Typewriter starts at 0.3 → ~1.6 (40 cps, ~52 chars)
  const qText = "What was my net profit this month?";

  // Watcher thinks 1.7 → 2.2, answer streams 2.2 → 4.6
  const thinkingStart = 1.7;
  const thinkingEnd = 2.2;
  const ansStart = thinkingEnd;

  const ansIntro = "Your net profit for April 2026 is ";
  const ansTail = ".\n\nRevenue $698.80 · Gross $288.80 (44.8%) · Losses $20.00";

  // Animate the dollar number counting up as it reveals
  const counterT = clamp((localTime - (ansStart + 1.4)) / 0.8, 0, 1);
  const eased = Easing.easeOutCubic(counterT);
  const netProfit = 268.80 * eased;

  // Suggested questions on right
  const suggestions = [
    "Which vendor is cheapest for oxtail?",
    "How much did I lose to spoilage this year?",
    "What products are expiring this week?",
    "Forecast next month's profit.",
  ];

  return (
    <>
      {/* Chat container */}
      <div style={{
        position: 'absolute', left: chatX, top: chatY,
        width: chatW, minHeight: 420,
        background: RW.paper,
        border: `1px solid ${RW.line}`,
        padding: '32px 36px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
      }}>
        {/* Watcher header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          paddingBottom: 20, borderBottom: `1px solid ${RW.line}`, marginBottom: 26,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 24,
            background: RW.ink, color: RW.paper,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: RW.serif, fontSize: 26, letterSpacing: '-0.02em',
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="10" stroke={RW.paper} strokeWidth="1.4" fill="none"/>
              <circle cx="11" cy="11" r="3.4" fill={RW.paper}/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: RW.serif, fontSize: 26, color: RW.ink, letterSpacing: '-0.01em', lineHeight: 1 }}>
              Watcher
            </div>
            <div style={{ fontFamily: RW.mono, fontSize: 11, letterSpacing: '0.18em', color: RW.inkMute, textTransform: 'uppercase', marginTop: 4 }}>
              Your AI Store Advisor
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: RW.green }}/>
            <span style={{ fontFamily: RW.mono, fontSize: 11, color: RW.inkMute, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Online</span>
          </div>
        </div>

        {/* User bubble */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', marginBottom: 24,
          opacity: clamp(localTime / 0.3, 0, 1),
        }}>
          <div style={{
            maxWidth: 600, background: RW.ink, color: RW.paper,
            padding: '14px 20px',
            fontFamily: RW.sans, fontSize: 20, lineHeight: 1.35,
          }}>
            <Typewriter text={qText} start={0.3} cps={36} cursor={localTime < 1.65}
              style={{ fontFamily: RW.sans }}/>
          </div>
        </div>

        {/* Watcher thinking dots */}
        {localTime >= thinkingStart && localTime < thinkingEnd && (
          <div style={{ display: 'flex', gap: 6, padding: '14px 0' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 10, height: 10, borderRadius: 5, background: RW.inkMute,
                opacity: 0.4 + 0.6 * Math.abs(Math.sin(localTime * 6 + i * 0.7)),
              }}/>
            ))}
          </div>
        )}

        {/* Watcher answer */}
        {localTime >= ansStart && (
          <div style={{
            fontFamily: RW.sans, fontSize: 22, color: RW.ink,
            lineHeight: 1.4, maxWidth: 720,
          }}>
            <Typewriter text={ansIntro} start={ansStart} cps={48} cursor={false}/>
            {localTime > ansStart + ansIntro.length / 48 && (
              <span style={{
                fontFamily: RW.serif, fontSize: 42,
                color: RW.green, letterSpacing: '-0.01em',
                fontVariantNumeric: 'tabular-nums',
                padding: '0 2px',
              }}>
                ${netProfit.toFixed(2)}
              </span>
            )}
            <div style={{ height: 12 }}/>
            <div style={{ fontFamily: RW.mono, fontSize: 15, color: RW.inkSoft, lineHeight: 1.5 }}>
              <Typewriter
                text={"Revenue $698.80  ·  Gross $288.80 (44.8%)  ·  Losses $20.00"}
                start={ansStart + 1.6} cps={42}
                cursor={localTime < ansStart + 3.0}
                style={{ fontFamily: RW.mono }}
              />
            </div>
          </div>
        )}

        {/* Input row (decorative) */}
        <div style={{
          position: 'absolute', left: 36, right: 36, bottom: 24,
          display: 'flex', alignItems: 'center', gap: 12,
          paddingTop: 20, borderTop: `1px solid ${RW.line}`,
        }}>
          <div style={{
            flex: 1, fontFamily: RW.sans, fontSize: 16, color: RW.inkMute,
            padding: '10px 14px', background: RW.paperAlt,
          }}>
            Ask Watcher anything about your store…
          </div>
          <div style={{
            width: 40, height: 40, background: RW.ink, color: RW.paper,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>↑</div>
        </div>
      </div>

      {/* Suggestions column on right */}
      <div style={{
        position: 'absolute', right: 80, top: chatY,
        width: 380,
      }}>
        <div style={{
          fontFamily: RW.mono, fontSize: 11, letterSpacing: '0.2em',
          color: RW.inkMute, textTransform: 'uppercase', marginBottom: 20,
        }}>
          Ask anything, like…
        </div>
        {suggestions.map((s, i) => {
          const t = clamp((localTime - (0.6 + i * 0.25)) / 0.4, 0, 1);
          const eased = Easing.easeOutBack(t);
          return (
            <div key={s} style={{
              fontFamily: RW.serif, fontSize: 26, color: RW.ink,
              letterSpacing: '-0.01em', lineHeight: 1.15,
              padding: '18px 0', borderBottom: `1px solid ${RW.line}`,
              opacity: t, transform: `translateX(${(1 - eased) * 24}px)`,
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <span style={{ color: RW.brand, fontSize: 20, lineHeight: 1.3, flexShrink: 0 }}>✦</span>
              <span>"{s}"</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

Object.assign(window, { Scene7_Watcher });
