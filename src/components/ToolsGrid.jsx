import Tooltip from './Tooltip'
import { blockData } from '../data/blockData'

export default function ToolsGrid({ activeBlocks }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 12, color: '#64748b', marginBottom: 8 }}>
        🔍 Vista rápida de tecnologías activas — pasa el cursor, haz clic para documentación oficial
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {Object.entries(blockData)
          .filter(([bloque]) => activeBlocks.includes(bloque))
          .map(([bloque, data]) =>
            data.herramientas.map(h => (
              <Tooltip key={`${bloque}-${h.name}`} text={`[${bloque}] ${h.desc}`} url={h.url}>
                <a href={h.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <span style={{
                    background: data.color.bg,
                    border: `1.5px solid ${data.color.border}`,
                    color: data.color.text,
                    borderRadius: 8, padding: '3px 9px',
                    fontSize: 11, fontWeight: 600,
                    display: 'inline-block', cursor: 'pointer',
                  }}>
                    {h.name} 🔗
                  </span>
                </a>
              </Tooltip>
            ))
          )}
      </div>
    </div>
  )
}