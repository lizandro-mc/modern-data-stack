import { blockData } from '../data/blockData'

export default function BlockDetail({ name, onBack }) {
  const d = blockData[name]
  if (!d) return null
  const c = d.color

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: '#e2e8f0', border: 'none', borderRadius: 8,
          padding: '7px 14px', cursor: 'pointer', fontWeight: 700,
          fontSize: 12, marginBottom: 16, color: '#374151',
        }}
      >
        ← Volver al diagrama
      </button>

      {/* Hero */}
      <div style={{
        background: c.border, borderRadius: 14,
        padding: '20px 24px', marginBottom: 16, color: '#fff',
      }}>
        <div style={{ fontSize: 32 }}>{d.emoji}</div>
        <div style={{ fontWeight: 900, fontSize: 'clamp(18px, 4vw, 24px)', marginTop: 6 }}>{name}</div>
        <div style={{ fontSize: 'clamp(12px, 2vw, 14px)', opacity: 0.9, marginTop: 8, lineHeight: 1.65 }}>
          {d.desc}
        </div>
      </div>

      {/* Prácticas + Nomenclatura */}
      <div
        className="grid-2col"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}
      >
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 12 }}>
            ✅ Mejores Prácticas
          </div>
          {d.practicas.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{
                background: c.border, color: '#fff', borderRadius: '50%',
                width: 22, height: 22, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, fontWeight: 700,
                flexShrink: 0, marginTop: 1,
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.65 }}>{p}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 12 }}>
            🏷️ Estrategias de Nomenclatura
          </div>
          {d.nomenclatura.map((n, i) => (
            <div key={i} style={{
              background: '#f8fafc', borderRadius: 8, padding: '9px 12px', marginBottom: 8,
              borderLeft: `3px solid ${c.border}`,
              fontSize: 11, color: '#374151', lineHeight: 1.6, fontFamily: 'monospace',
              wordBreak: 'break-word',
            }}>
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* Herramientas */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 12 }}>
          🔧 Mejores Herramientas con Documentación
        </div>
        <div
          className="grid-auto"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}
        >
          {d.herramientas.map((h, i) => (
            <a
              key={i}
              href={h.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  border: `1.5px solid ${c.border}`, borderRadius: 10,
                  padding: '12px 14px', background: c.bg, cursor: 'pointer',
                  height: '100%', transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 14px ${c.border}44`}
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