import { useState, useEffect } from 'react'
import { colors } from '../data/blockData'
import { useLanguage } from '../i18n/LanguageContext'

function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [breakpoint])
  return isMobile
}

// key = clave blockData (ES, inmutable para lookup)
// label/sub vienen de traducciones
function Block({ blockKey, colKey, style, activeBlocks, onBlockClick, t }) {
  const active = activeBlocks.includes(blockKey)
  const c = active ? colors[colKey] : colors.dim
  const [hover, setHover] = useState(false)
  const { label, sub } = t.diagram.blocks[blockKey] || { label: blockKey, sub: '' }

  return (
    <div
      onClick={() => active && onBlockClick(blockKey)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `2px solid ${c.border}`, borderRadius: 10,
        background: active && hover ? c.border : c.bg,
        padding: '8px 10px',
        cursor: active ? 'pointer' : 'default',
        transition: 'all 0.18s',
        boxShadow: active && hover ? `0 4px 16px ${c.border}55` : 'none',
        opacity: active ? 1 : 0.28,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ fontSize: 'clamp(10px, 1.4vw, 12px)', fontWeight: 700, color: active && hover ? '#fff' : c.text }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 'clamp(9px, 1vw, 10px)', color: active && hover ? '#ffffffcc' : '#6b7280', marginTop: 3, lineHeight: 1.3 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function WideBlock({ blockKey, colKey, style, activeBlocks, onBlockClick, t }) {
  const active = activeBlocks.includes(blockKey)
  const c = active ? colors[colKey] : colors.dim
  const [hover, setHover] = useState(false)
  const { label, sub } = t.diagram.blocks[blockKey] || { label: blockKey, sub: '' }

  return (
    <div
      onClick={() => active && onBlockClick(blockKey)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `2px solid ${c.border}`, borderRadius: 10,
        background: active && hover ? c.border : (active ? '#f9fafb' : c.bg),
        padding: '10px 14px',
        cursor: active ? 'pointer' : 'default',
        transition: 'all 0.18s',
        boxShadow: active && hover ? `0 4px 16px ${c.border}55` : 'none',
        opacity: active ? 1 : 0.28,
        width: '100%', boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 'clamp(13px, 2vw, 16px)', color: active && hover ? '#fff' : '#1f2937' }}>
        {label}
      </div>
      <div style={{ fontSize: 'clamp(9px, 1.2vw, 11px)', color: active && hover ? '#ffffffbb' : '#6b7280', marginTop: 3, lineHeight: 1.4 }}>
        {sub}
      </div>
    </div>
  )
}

export default function DiagramPart({ activeBlocks, onBlockClick }) {
  const isMobile = useIsMobile()
  const { t } = useLanguage()
  const bp = { activeBlocks, onBlockClick, t }

  const hint = (
    <div className="print-hide" style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10, textAlign: 'center' }}>
      {isMobile ? t.diagram.hintMobile : t.diagram.hint}
    </div>
  )

  /* ── MOBILE: pila vertical ── */
  if (isMobile) {
    const layers = ['ORQUESTADOR','EXTRAER','CARGAR','TRANSFORMAR','SEMÁNTICA','ALMACENAR','APROVECHAR','GOBERNAR','OBSERVABILIDAD']
    const colKeys = { ORQUESTADOR:'v7', EXTRAER:'v1', CARGAR:'v2', TRANSFORMAR:'v3', 'SEMÁNTICA':'v4', ALMACENAR:'f1', APROVECHAR:'v5', GOBERNAR:'f2', OBSERVABILIDAD:'f3' }
    return (
      <div data-print="diagram" style={{ padding: 4 }}>
        {hint}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {layers.map(key => (
            <WideBlock key={key} blockKey={key} colKey={colKeys[key]} {...bp} />
          ))}
        </div>
      </div>
    )
  }

  /* ── DESKTOP ── */
  return (
    <div data-print="diagram" style={{ padding: 4 }}>
      {hint}

      {/* Orquestador */}
      <div style={{ marginBottom: 8 }}>
        <WideBlock blockKey="ORQUESTADOR" colKey="v7" {...bp} />
      </div>

      {/* Pipeline principal */}
      <div style={{ display: 'flex', marginBottom: 8, gap: 6 }}>
        <Block blockKey="EXTRAER" colKey="v1" style={{ minWidth: 80, flexShrink: 0 }} {...bp} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <Block blockKey="CARGAR"      colKey="v2" style={{ flex: 1, minWidth: 0 }} {...bp} />
            <Block blockKey="TRANSFORMAR" colKey="v3" style={{ flex: 1, minWidth: 0 }} {...bp} />
            <Block blockKey="SEMÁNTICA"   colKey="v4" style={{ flex: 1, minWidth: 0 }} {...bp} />
          </div>
          <WideBlock blockKey="ALMACENAR" colKey="f1" {...bp} />
        </div>
        <Block blockKey="APROVECHAR" colKey="v5" style={{ minWidth: 80, flexShrink: 0 }} {...bp} />
      </div>

      {/* Fundaciones */}
      {['GOBERNAR', 'OBSERVABILIDAD'].map((key, i) => (
        <div key={key} style={{ marginBottom: 8 }}>
          <WideBlock blockKey={key} colKey={i === 0 ? 'f2' : 'f3'} {...bp} />
        </div>
      ))}
    </div>
  )
}