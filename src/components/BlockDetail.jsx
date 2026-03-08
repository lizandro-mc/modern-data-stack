import { useState, useEffect } from 'react'
import { blockData } from '../data/blockData'

function useIsMobile(bp = 600) {
  const [m, setM] = useState(() => window.innerWidth < bp)
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [bp])
  return m
}

export default function BlockDetail({ name, onBack }) {
  const isMobile = useIsMobile()
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
        style={{         display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 14 }}
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

      {/* ── Metadata Obligatoria (CARGAR y bloques que la tengan) ── */}
      {d.metadataObligatoria && (
        <div style={{
          background: '#fff', borderRadius: 12, padding: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 14,
        }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 4 }}>
            🗂️ Metadata de Auditoría Obligatoria
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>
            Cada registro cargado al Lakehouse RAW debe incluir estos campos. Sin ellos, el pipeline no debe avanzar.
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: c.bg }}>
                  <th style={thStyle(c)}>Campo</th>
                  <th style={thStyle(c)}>Tipo</th>
                  <th style={thStyle(c)}>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {d.metadataObligatoria.map((m, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 700, color: c.text, whiteSpace: 'nowrap' }}>
                      {m.campo}
                    </td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#7c3aed', whiteSpace: 'nowrap' }}>
                      {m.tipo}
                    </td>
                    <td style={{ ...tdStyle, color: '#374151' }}>{m.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Secciones adicionales (DBT, FABRIC y bloques que las tengan) ── */}
      {d.secciones && d.secciones.map((sec, si) => (
        <div key={si} style={{
          background: '#fff', borderRadius: 12, padding: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 14,
        }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 12 }}>
            {sec.titulo}
          </div>
          {sec.items.map((item, ii) => (
            <div key={ii} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 6, flexShrink: 0, borderRadius: 3,
                background: c.border, marginTop: 4, alignSelf: 'stretch',
              }} />
              <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.65 }}>{item}</div>
            </div>
          ))}
        </div>
      ))}

      {/* ── RBAC (GOBERNAR) ── */}
      {d.rbac && (
        <div style={{
          background: '#fff', borderRadius: 12, padding: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 14,
        }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 4 }}>
            🔐 {d.rbac.titulo}
          </div>
          <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.65, marginBottom: 16 }}>
            {d.rbac.explicacion}
          </div>

          {/* Roles Fabric */}
          <div style={{ fontWeight: 700, fontSize: 12, color: '#1e293b', marginBottom: 8 }}>
            Roles de Workspace (Microsoft Fabric)
          </div>
          {d.rbac.rolesFabric.map((r, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, marginBottom: 8,
              padding: '8px 12px', background: '#f8fafc', borderRadius: 8,
              borderLeft: `3px solid ${c.border}`,
            }}>
              <span style={{ fontWeight: 700, fontSize: 12, color: c.text, minWidth: 90 }}>{r.rol}</span>
              <span style={{ fontSize: 12, color: '#374151' }}>{r.permisos}</span>
            </div>
          ))}

          {/* Roles de Datos */}
          <div style={{ fontWeight: 700, fontSize: 12, color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
            Roles de Datos (por función)
          </div>
          {d.rbac.rolesDatos.map((r, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, marginBottom: 8,
              padding: '8px 12px', background: '#f8fafc', borderRadius: 8,
              borderLeft: `3px solid ${c.border}`,
            }}>
              <span style={{ fontWeight: 700, fontSize: 12, color: c.text, minWidth: 110 }}>{r.rol}</span>
              <span style={{ fontSize: 12, color: '#374151' }}>{r.permisos}</span>
            </div>
          ))}

          {/* Matriz de acceso */}
          <div style={{ fontWeight: 700, fontSize: 12, color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
            Matriz de Acceso por Capa
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: c.bg }}>
                  {['Capa', 'Data Owner', 'Data Engineer', 'Data Reader', 'ML Engineer'].map(h => (
                    <th key={h} style={thStyle(c)}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.rbac.matrizAcceso.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap' }}>{row.capa}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{row.dataOwner}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{row.dataEngineer}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{row.dataReader}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{row.mlEngineer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Herramientas */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 12 }}>
          🔧 Mejores Herramientas con Documentación
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {d.herramientas.map((h, i) => (
            <a key={i} href={h.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
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

// ── Estilos de tabla reutilizables ──
const thStyle = (c) => ({
  padding: '8px 12px', textAlign: 'left', fontWeight: 700,
  fontSize: 11, color: c.text, borderBottom: `2px solid ${c.border}`,
  whiteSpace: 'nowrap',
})

const tdStyle = {
  padding: '8px 12px', fontSize: 12,
  borderBottom: '1px solid #e2e8f0', verticalAlign: 'top',
}