import { useState, useEffect } from 'react'
import { colors } from '../data/blockData'

function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [breakpoint])
  return isMobile
}

function Block({ name, colKey, style, sub, activeBlocks, onBlockClick, fullWidth }) {
  const active = activeBlocks.includes(name)
  const c = active ? colors[colKey] : colors.dim
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={() => active && onBlockClick(name)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `2px solid ${c.border}`,
        borderRadius: 10,
        background: active && hover ? c.border : c.bg,
        padding: '8px 10px',
        cursor: active ? 'pointer' : 'default',
        transition: 'all 0.18s',
        boxShadow: active && hover ? `0 4px 16px ${c.border}55` : 'none',
        opacity: active ? 1 : 0.28,
        width: fullWidth ? '100%' : undefined,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{
        fontSize: 'clamp(10px, 1.4vw, 12px)',
        fontWeight: 700,
        color: active && hover ? '#fff' : c.text,
      }}>
        {name}
      </div>
      {sub && (
        <div style={{
          fontSize: 'clamp(9px, 1vw, 10px)',
          color: active && hover ? '#ffffffcc' : '#6b7280',
          marginTop: 3,
          lineHeight: 1.3,
        }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function WideBlock({ name, colKey, sub, style, activeBlocks, onBlockClick }) {
  const active = activeBlocks.includes(name)
  const c = active ? colors[colKey] : colors.dim
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={() => active && onBlockClick(name)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `2px solid ${c.border}`,
        borderRadius: 10,
        background: active && hover ? c.border : (active ? '#f9fafb' : c.bg),
        padding: '10px 14px',
        cursor: active ? 'pointer' : 'default',
        transition: 'all 0.18s',
        boxShadow: active && hover ? `0 4px 16px ${c.border}55` : 'none',
        opacity: active ? 1 : 0.28,
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{
        fontWeight: 800,
        fontSize: 'clamp(13px, 2vw, 16px)',
        color: active && hover ? '#fff' : '#1f2937',
      }}>
        {name}
      </div>
      <div style={{
        fontSize: 'clamp(9px, 1.2vw, 11px)',
        color: active && hover ? '#ffffffbb' : '#6b7280',
        marginTop: 3,
        lineHeight: 1.4,
      }}>
        {sub}
      </div>
    </div>
  )
}

export default function DiagramPart({ activeBlocks, onBlockClick }) {
  const isMobile = useIsMobile()
  const bp = { activeBlocks, onBlockClick }

  /* ── MOBILE: pila vertical simple ── */
  if (isMobile) {
    const layers = [
      { name: 'ORQUESTADOR',   colKey: 'v7', sub: 'ADF · Airflow · dbt Jobs · Logic Apps' },
      { name: 'EXTRAER',       colKey: 'v1', sub: 'Vol 1 · ADF · Event Hubs' },
      { name: 'CARGAR',        colKey: 'v2', sub: 'Vol 2 · ADF' },
      { name: 'TRANSFORMAR',   colKey: 'v3', sub: 'Vol 3 · dbt' },
      { name: 'SEMÁNTICA',     colKey: 'v4', sub: 'Vol 4 · Fabric' },
      { name: 'ALMACENAR',     colKey: 'f1', sub: 'ADLS Gen2 · Fabric Lakehouse · Delta Lake · Synapse DW' },
      { name: 'APROVECHAR',    colKey: 'v5', sub: 'Vol 5 · Power BI · ML' },
      { name: 'GOBERNAR',      colKey: 'f2', sub: 'Purview · Azure Policy · Data Contracts · dbt Tests' },
      { name: 'OBSERVABILIDAD',colKey: 'f3', sub: 'Elementary · Azure Monitor · dbt Artifacts · Linaje' },
    ]

    return (
      <div style={{ padding: 4 }}>
        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10, textAlign: 'center' }}>
          💡 Toca un bloque activo para ver detalles
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {layers.map(l => (
            <WideBlock key={l.name} name={l.name} colKey={l.colKey} sub={l.sub} {...bp} />
          ))}
        </div>
      </div>
    )
  }

  /* ── DESKTOP: layout original sin bloques Fund./Vol ── */
  return (
    <div style={{ padding: 4 }}>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10, textAlign: 'center' }}>
        💡 Haz clic en un bloque activo para ver detalles, prácticas y herramientas
      </div>

      {/* Orquestador */}
      <div style={{ marginBottom: 8 }}>
        <WideBlock
          name="ORQUESTADOR" colKey="v7"
          sub="ADF · Airflow · dbt Jobs · Logic Apps"
          {...bp}
        />
      </div>

      {/* Pipeline principal */}
      <div style={{ display: 'flex', marginBottom: 8, gap: 6 }}>
        {/* Extraer */}
        <Block
          name="EXTRAER" colKey="v1"
          style={{ minWidth: 80, flexShrink: 0 }}
          sub="Vol 1 · ADF · Event Hubs" {...bp}
        />

        {/* Columnas centrales */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <Block name="CARGAR"      colKey="v2" style={{ flex: 1, minWidth: 0 }} sub="Vol 2 · ADF" {...bp} />
            <Block name="TRANSFORMAR" colKey="v3" style={{ flex: 1, minWidth: 0 }} sub="Vol 3 · dbt" {...bp} />
            <Block name="SEMÁNTICA"   colKey="v4" style={{ flex: 1, minWidth: 0 }} sub="Vol 4 · Fabric" {...bp} />
          </div>
          <WideBlock
            name="ALMACENAR" colKey="f1"
            sub="ADLS Gen2 · Fabric Lakehouse · Delta Lake · Synapse DW"
            {...bp}
          />
        </div>

        {/* Aprovechar */}
        <Block
          name="APROVECHAR" colKey="v5"
          style={{ minWidth: 80, flexShrink: 0 }}
          sub="Vol 5 · Power BI · ML" {...bp}
        />
      </div>

      {/* Fundaciones */}
      {[
        { name: 'GOBERNAR',        col: 'f2', sub: 'Purview · Azure Policy · Data Contracts · dbt Tests' },
        { name: 'OBSERVABILIDAD',  col: 'f3', sub: 'Elementary · Azure Monitor · dbt Artifacts · Linaje' },
      ].map(r => (
        <div key={r.name} style={{ marginBottom: 8 }}>
          <WideBlock name={r.name} colKey={r.col} sub={r.sub} {...bp} />
        </div>
      ))}
    </div>
  )
}