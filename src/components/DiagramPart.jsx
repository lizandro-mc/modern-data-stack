import { useState } from 'react'
import { colors } from '../data/blockData'

function Block({ name, colKey, style, sub, activeBlocks, onBlockClick }) {
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
        ...style,
      }}
    >
      <div style={{
        fontSize: 'clamp(9px, 1.2vw, 11px)',
        fontWeight: 700,
        color: active && hover ? '#fff' : c.text,
      }}>
        {name}
      </div>
      {sub && (
        <div style={{
          fontSize: 'clamp(8px, 1vw, 10px)',
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
        ...style,
      }}
    >
      <div style={{
        fontWeight: 800,
        fontSize: 'clamp(12px, 2vw, 16px)',
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
  const bp = { activeBlocks, onBlockClick }

  return (
    <div style={{ padding: 4 }}>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10, textAlign: 'center' }}>
        💡 Haz clic en un bloque activo para ver detalles, prácticas y herramientas
      </div>

      {/* Orquestador */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <Block
          name="Vol 7" colKey="v7"
          style={{ minWidth: 62, flexShrink: 0 }}
          sub="Orch." {...bp}
        />
        <WideBlock
          name="ORQUESTADOR" colKey="v7"
          sub="ADF · Airflow · dbt Jobs · Logic Apps"
          style={{ flex: 1 }} {...bp}
        />
      </div>

      {/* Pipeline principal */}
      <div style={{ display: 'flex', marginBottom: 8, gap: 6 }}>
        {/* Extraer */}
        <Block
          name="EXTRAER" colKey="v1"
          style={{ minWidth: 70, flexShrink: 0 }}
          sub="Vol 1 · ADF · Event Hubs" {...bp}
        />

        {/* Columnas centrales */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <Block name="CARGAR"      colKey="v2" style={{ flex: 1, minWidth: 0 }} sub="Vol 2 · ADF" {...bp} />
            <Block name="TRANSFORMAR" colKey="v3" style={{ flex: 1, minWidth: 0 }} sub="Vol 3 · dbt" {...bp} />
            <Block name="SEMÁNTICA"   colKey="v4" style={{ flex: 1, minWidth: 0 }} sub="Vol 4 · Fabric" {...bp} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Block name="Fund.1" colKey="f1" style={{ minWidth: 62, flexShrink: 0 }} {...bp} />
            <WideBlock
              name="ALMACENAR" colKey="f1"
              sub="ADLS Gen2 · Fabric Lakehouse · Delta Lake · Synapse DW"
              style={{ flex: 1 }} {...bp}
            />
          </div>
        </div>

        {/* Aprovechar */}
        <Block
          name="APROVECHAR" colKey="v5"
          style={{ minWidth: 70, flexShrink: 0 }}
          sub="Vol 5 · Power BI · ML" {...bp}
        />
      </div>

      {/* Fundaciones */}
      {[
        { name: 'GOBERNAR',       col: 'f2', flabel: 'Fund.2', sub: 'Purview · Azure Policy · Data Contracts · dbt Tests' },
        { name: 'OBSERVABILIDAD', col: 'f3', flabel: 'Fund.3', sub: 'Elementary · Azure Monitor · dbt Artifacts · Linaje' },
      ].map(r => (
        <div key={r.name} style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <Block name={r.flabel} colKey={r.col} style={{ minWidth: 62, flexShrink: 0 }} {...bp} />
          <WideBlock name={r.name} colKey={r.col} sub={r.sub} style={{ flex: 1 }} {...bp} />
        </div>
      ))}
    </div>
  )
}