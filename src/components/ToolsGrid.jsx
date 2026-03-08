import Tooltip from './Tooltip'
import { getBlockData } from '../data/getBlockData'   // ← helper bilingüe
import { useLanguage }  from '../i18n/LanguageContext'

export default function ToolsGrid({ activeBlocks }) {
  const { t, lang } = useLanguage()                   // ← añadir lang

  // Lista plana de herramientas activas con datos en el idioma correcto
  const activeTools = activeBlocks.flatMap(bloque => {
    const data = getBlockData(bloque, lang)            // ← traducido
    if (!data) return []
    return data.herramientas.map(h => ({ bloque, h, color: data.color }))
  })

  return (
    <div style={{ marginTop: 14 }}>

      {/* ── Versión interactiva — solo en pantalla ── */}
      <div className="print-hide">
        <div style={{ fontWeight: 700, fontSize: 12, color: '#64748b', marginBottom: 8 }}>
          {t.tools.hint}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {activeTools.map(({ bloque, h, color }) => (
            <Tooltip key={`${bloque}-${h.name}`} text={`[${bloque}] ${h.desc}`} url={h.url}>
              <a href={h.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <span style={{
                  background: color.bg,
                  border: `1.5px solid ${color.border}`,
                  color: color.text,
                  borderRadius: 8, padding: '3px 9px',
                  fontSize: 11, fontWeight: 600,
                  display: 'inline-block', cursor: 'pointer',
                }}>
                  {h.name} 🔗
                </span>
              </a>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* ── Versión print — lista limpia con URLs ── */}
      <div data-print="tools-print" style={{ display: 'none' }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 10, borderBottom: '2px solid #e2e8f0', paddingBottom: 6 }}>
          🔧 {t.tools.hint.replace('🔍 ', '')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px' }}>
          {activeTools.map(({ bloque, h, color }) => (
            <div key={`print-${bloque}-${h.name}`} style={{ display: 'flex', flexDirection: 'column', padding: '5px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontWeight: 700, fontSize: 11, color: color.text }}>{h.name}</span>
              <span style={{ fontSize: 9, color: '#6b7280', marginTop: 1 }}>{h.url.replace('https://', '')}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}