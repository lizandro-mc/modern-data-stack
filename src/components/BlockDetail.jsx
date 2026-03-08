import { useState, useEffect } from 'react'
import { getBlockData } from '../data/getBlockData'   // ← nuevo helper
import { useLanguage }  from '../i18n/LanguageContext'

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
  const { t, lang } = useLanguage()           // ← añadimos lang
  const d = getBlockData(name, lang)          // ← fusiona ES/EN según URL
  if (!d) return null
  const c = d.color
  const tb = t.block

  // — el resto del JSX es idéntico al original —

  return (
    <div>
      <button className="print-hide" onClick={onBack} style={{
        background: '#e2e8f0', border: 'none', borderRadius: 8,
        padding: '7px 14px', cursor: 'pointer', fontWeight: 700,
        fontSize: 12, marginBottom: 16, color: '#374151',
      }}>
        {tb.back}
      </button>

      {/* Hero */}
      <div data-print="card" style={{ background: c.border, borderRadius: 14, padding: '20px 24px', marginBottom: 16, color: '#fff' }}>
        <div style={{ fontSize: 32 }}>{d.emoji}</div>
        <div style={{ fontWeight: 900, fontSize: 'clamp(18px, 4vw, 24px)', marginTop: 6 }}>{name}</div>
        <div style={{ fontSize: 'clamp(12px, 2vw, 14px)', opacity: 0.9, marginTop: 8, lineHeight: 1.65 }}>{d.desc}</div>
      </div>

      {/* Prácticas + Nomenclatura */}
      <div data-print="grid-2col" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div data-print="card" style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 12 }}>{tb.practices}</div>
          {d.practicas.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ background: c.border, color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.65 }}>{p}</div>
            </div>
          ))}
        </div>

        <div data-print="card" style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 12 }}>{tb.naming}</div>
          {d.nomenclatura.map((n, i) => (
            <div key={i} style={{ background: '#f8fafc', borderRadius: 8, padding: '9px 12px', marginBottom: 8, borderLeft: `3px solid ${c.border}`, fontSize: 11, color: '#374151', lineHeight: 1.6, fontFamily: 'monospace', wordBreak: 'break-word' }}>
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* Metadata Obligatoria */}
      {d.metadataObligatoria && (
        <div data-print="card" style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 4 }}>{tb.metadata}</div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>{tb.metadataDesc}</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: c.bg }}>
                  <th style={thStyle(c)}>{tb.col.field}</th>
                  <th style={thStyle(c)}>{tb.col.type}</th>
                  <th style={thStyle(c)}>{tb.col.description}</th>
                </tr>
              </thead>
              <tbody>
                {d.metadataObligatoria.map((m, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 700, color: c.text, whiteSpace: 'nowrap' }}>{m.campo}</td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#7c3aed', whiteSpace: 'nowrap' }}>{m.tipo}</td>
                    <td style={{ ...tdStyle, color: '#374151' }}>{m.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Secciones adicionales */}
      {d.secciones && d.secciones.map((sec, si) => (
        <div key={si} data-print="card" style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 12 }}>{sec.titulo}</div>
          {sec.items.map((item, ii) => (
            <div key={ii} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 6, flexShrink: 0, borderRadius: 3, background: c.border, marginTop: 4, alignSelf: 'stretch' }} />
              <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.65 }}>{item}</div>
            </div>
          ))}
        </div>
      ))}

      {/* RBAC */}
      {d.rbac && (
        <div data-print="card" style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 4 }}>🔐 {d.rbac.titulo}</div>
          <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.65, marginBottom: 16 }}>{d.rbac.explicacion}</div>

          <div style={{ fontWeight: 700, fontSize: 12, color: '#1e293b', marginBottom: 8 }}>{tb.fabricRoles}</div>
          {d.rbac.rolesFabric.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, borderLeft: `3px solid ${c.border}` }}>
              <span style={{ fontWeight: 700, fontSize: 12, color: c.text, minWidth: 90 }}>{r.rol}</span>
              <span style={{ fontSize: 12, color: '#374151' }}>{r.permisos}</span>
            </div>
          ))}

          <div style={{ fontWeight: 700, fontSize: 12, color: '#1e293b', marginTop: 16, marginBottom: 8 }}>{tb.dataRoles}</div>
          {d.rbac.rolesDatos.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, borderLeft: `3px solid ${c.border}` }}>
              <span style={{ fontWeight: 700, fontSize: 12, color: c.text, minWidth: 110 }}>{r.rol}</span>
              <span style={{ fontSize: 12, color: '#374151' }}>{r.permisos}</span>
            </div>
          ))}

          <div style={{ fontWeight: 700, fontSize: 12, color: '#1e293b', marginTop: 16, marginBottom: 8 }}>{tb.accessMatrix}</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: c.bg }}>
                  {[tb.col.layer, tb.col.dataOwner, tb.col.dataEngineer, tb.col.dataReader, tb.col.mlEngineer].map(h => (
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
      <div data-print="card" style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 12 }}>{tb.tools}</div>
        <div data-print="grid-tools" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {d.herramientas.map((h, i) => (
            <a key={i} href={h.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div
                style={{ border: `1.5px solid ${c.border}`, borderRadius: 10, padding: '12px 14px', background: c.bg, cursor: 'pointer', height: '100%', transition: 'box-shadow 0.15s' }}
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

const thStyle = (c) => ({
  padding: '8px 12px', textAlign: 'left', fontWeight: 700,
  fontSize: 11, color: c.text, borderBottom: `2px solid ${c.border}`, whiteSpace: 'nowrap',
})
const tdStyle = { padding: '8px 12px', fontSize: 12, borderBottom: '1px solid #e2e8f0', verticalAlign: 'top' }