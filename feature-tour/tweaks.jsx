// Tweaks panel — lets the user dial in brand color, accents, and contrast.
// Announces availability to the host via __edit_mode_available AFTER
// the message listener is attached. Persists via __edit_mode_set_keys.

function TweaksPanel() {
  const [open, setOpen] = React.useState(false);
  const [available, setAvailable] = React.useState(false);
  const [tweaks, setTweaks] = React.useState(() => ({ ...window.RW_DEFAULTS, ...(window.RW_TWEAKS || {}) }));

  // Mirror tweaks onto window + trigger re-render of scenes by bumping a key
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    window.RW_TWEAKS = tweaks;
    window.dispatchEvent(new CustomEvent('rw-tweaks-changed'));
    forceUpdate();
  }, [tweaks]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setOpen(true);
      if (d.type === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    // Only announce after the listener is live
    window.parent?.postMessage({ type: '__edit_mode_available' }, '*');
    setAvailable(true);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const update = (patch) => {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    try {
      window.parent?.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
    } catch {}
  };

  if (!open) return null;

  const rowS = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 };
  const labelS = { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', fontWeight: 600 };
  const inputS = { width: 36, height: 24, border: '1px solid #333', background: 'transparent', padding: 0, cursor: 'pointer' };
  const swatchS = (c, active) => ({
    width: 28, height: 28, borderRadius: 14, background: c,
    border: active ? '2px solid #fff' : '2px solid transparent',
    boxShadow: active ? '0 0 0 1px #000' : 'none',
    cursor: 'pointer',
  });

  const brandPresets = [
    { name: 'Teal',   v: '#0D6E6E' },
    { name: 'Navy',   v: '#1E3A5F' },
    { name: 'Forest', v: '#2F5D3A' },
    { name: 'Ink',    v: '#1a1814' },
    { name: 'Plum',   v: '#5A2B4F' },
    { name: 'Rust',   v: '#A0472A' },
  ];

  const paperPresets = [
    { name: 'Paper', v: '#F4F0E7' },
    { name: 'Cream', v: '#FAF5E9' },
    { name: 'Bone',  v: '#EDE8DB' },
    { name: 'White', v: '#FFFFFF' },
    { name: 'Mist',  v: '#E8ECEB' },
  ];

  return (
    <div style={{
      position: 'fixed', right: 16, bottom: 72, width: 320, zIndex: 9999,
      background: '#0f0f0f', color: '#eee', border: '1px solid #2a2a2a',
      borderRadius: 10, padding: 16, fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 13, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>Tweaks</div>
        <div onClick={() => setOpen(false)} style={{ cursor: 'pointer', color: '#888' }}>✕</div>
      </div>

      {/* Brand primary */}
      <div style={{ marginBottom: 14 }}>
        <div style={labelS}>Brand primary</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          {brandPresets.map(p => (
            <div key={p.v} title={p.name}
              onClick={() => update({ brand: p.v })}
              style={swatchS(p.v, tweaks.brand === p.v)}/>
          ))}
          <input type="color" value={tweaks.brand}
            onChange={e => update({ brand: e.target.value })}
            style={inputS}/>
        </div>
      </div>

      {/* Paper */}
      <div style={{ marginBottom: 14 }}>
        <div style={labelS}>Background</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          {paperPresets.map(p => (
            <div key={p.v} title={p.name}
              onClick={() => update({ paper: p.v })}
              style={swatchS(p.v, tweaks.paper === p.v)}/>
          ))}
          <input type="color" value={tweaks.paper}
            onChange={e => update({ paper: e.target.value })}
            style={inputS}/>
        </div>
      </div>

      {/* Ink */}
      <div style={rowS}>
        <div style={labelS}>Text color</div>
        <input type="color" value={tweaks.ink}
          onChange={e => update({ ink: e.target.value })}
          style={inputS}/>
      </div>

      {/* Accents */}
      <div style={rowS}>
        <div style={labelS}>Alert (red)</div>
        <input type="color" value={tweaks.red}
          onChange={e => update({ red: e.target.value })}
          style={inputS}/>
      </div>
      <div style={rowS}>
        <div style={labelS}>Profit (green)</div>
        <input type="color" value={tweaks.green}
          onChange={e => update({ green: e.target.value })}
          style={inputS}/>
      </div>
      <div style={rowS}>
        <div style={labelS}>Warning (amber)</div>
        <input type="color" value={tweaks.amber}
          onChange={e => update({ amber: e.target.value })}
          style={inputS}/>
      </div>
      <div style={rowS}>
        <div style={labelS}>Info (blue)</div>
        <input type="color" value={tweaks.blue}
          onChange={e => update({ blue: e.target.value })}
          style={inputS}/>
      </div>

      {/* Contrast */}
      <div style={{ marginTop: 12, marginBottom: 6 }}>
        <div style={labelS}>Text contrast</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          {['high', 'medium'].map(v => (
            <div key={v}
              onClick={() => update({ contrast: v })}
              style={{
                padding: '6px 12px', borderRadius: 6,
                background: tweaks.contrast === v ? '#fff' : 'transparent',
                color: tweaks.contrast === v ? '#000' : '#eee',
                border: '1px solid #333',
                cursor: 'pointer', fontSize: 12, textTransform: 'capitalize',
              }}>
              {v}
            </div>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #222' }}>
        <div
          onClick={() => {
            const def = { ...window.RW_DEFAULTS };
            setTweaks(def);
            window.parent?.postMessage({ type: '__edit_mode_set_keys', edits: def }, '*');
          }}
          style={{
            padding: '8px 12px', textAlign: 'center',
            border: '1px solid #333', borderRadius: 6,
            cursor: 'pointer', fontSize: 12, color: '#aaa',
          }}>
          Reset to brand defaults
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TweaksPanel });
