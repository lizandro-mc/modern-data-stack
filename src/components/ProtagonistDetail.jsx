import { blockData } from '../data/blockData'

export default function ProtagonistDetail({ name, onBack }) {
  const d = blockData[name]
  if (!d) return null
  const c = d.color

  return (
    <div>
      {/* Volver — oculto en print */}
      <button
        className="print-hide"
        onClick={onBack}
        style={{
          background: '#e2e8f0', border: 'none', borderRadius: 8,
          padding: '7px 14px', cursor: 'pointer', fontWeight: 700,
          fontSize: 12, marginBottom: 16, color: '#374151',
        }}
      >← Volver</button>

      {/* Hero */}
      <div
        data-print="card"
        style={{
          background: `linear-gradient(135deg, ${c.border}, ${c.border}cc)`,
          borderRadius: 16, padding: '24px 28px', marginBottom: 20, color: '#fff',
        }}
      >
        <div style={{ fontSize: 40 }}>{d.emoji}</div>
        <div style={{ fontWeight: 900, fontSize: 'clamp(22px,4vw,30px)', marginTop: 8, letterSpacing: -0.5 }}>
          {name === 'DBT' ? 'dbt — Data Build Tool' : 'Microsoft Fabric'}
        </div>
        <div style={{ fontSize: 'clamp(12px,2vw,14px)', opacity: 0.92, marginTop: 10, lineHeight: 1.7, maxWidth: 720 }}>
          {d.desc}
        </div>
      </div>

      {/* Mejores prácticas */}
      <div data-print="card" style={{ background: '#fff', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 14 }}>✅ Mejores Prácticas Clave</div>
        <div data-print="grid-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 10 }}>
          {d.practicas.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                background: c.border, color: '#fff', borderRadius: '50%',
                width: 22, height: 22, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1,
              }}>{i + 1}</div>
              <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.65 }}>{p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Secciones temáticas */}
      {d.secciones && (
        <div
          data-print="protagonist-sections"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14, marginBottom: 16 }}
        >
          {d.secciones.map((s, i) => (
            <div key={i} data-print="card" style={{ background: '#fff', borderRadius: 14, padding: 18, boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: c.text, marginBottom: 12 }}>{s.titulo}</div>
              {s.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ color: c.border, fontSize: 12, marginTop: 2, flexShrink: 0 }}>▸</div>
                  <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>{item}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Herramientas */}
      <div data-print="card" style={{ background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 14 }}>🔧 Herramientas & Recursos</div>
        <div data-print="grid-tools" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 10 }}>
          {d.herramientas.map((h, i) => (
            <a key={i} href={h.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div
                style={{ border: `1.5px solid ${c.border}`, borderRadius: 10, padding: '12px 14px', background: c.bg, height: '100%', transition: 'box-shadow 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 16px ${c.border}44`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ fontWeight: 700, fontSize: 12, color: c.text }}>{h.name} 🔗</div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 5, lineHeight: 1.55 }}>{h.desc}</div>
                <div style={{ fontSize: 10, color: c.border, marginTop: 8, fontWeight: 600, wordBreak: 'break-all' }}>
                  {h.url.replace('https://', '')}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}