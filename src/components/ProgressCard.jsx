function ProgressBar({ pct, color }) {
  return (
    <div style={{
      background: '#e2e8f0', borderRadius: 99,
      height: 10, width: '100%', overflow: 'hidden',
    }}>
      <div style={{
        width: `${pct}%`,
        background: color,
        height: '100%',
        borderRadius: 99,
        transition: 'width 0.6s ease',
      }} />
    </div>
  )
}

export default function ProgressCard({ part, totalDias, partsConfig }) {
  const onlyParts = partsConfig.filter(p => p.id !== 'overview')
  const activeIdx = partsConfig.findIndex(p => p.id === part.id)

  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      padding: '16px 20px',
      marginBottom: 14,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    }}>
      {/* Título + % */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 'clamp(13px, 2vw, 16px)', color: '#1e293b' }}>
            {part.label}
          </div>
          <div style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>
            {part.desc}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 900, color: part.color, lineHeight: 1 }}>
            {part.pct}%
          </div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
            de arquitectura completa
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <ProgressBar pct={part.pct} color={part.color} />

      {/* Segmentos */}
      <div style={{ display: 'flex', gap: 3, marginTop: 8 }}>
        {onlyParts.map(p => {
          const myIdx = partsConfig.findIndex(x => x.id === p.id)
          return (
            <div key={p.id} style={{
              flex: 1, height: 6, borderRadius: 99,
              background: myIdx <= activeIdx ? p.color : '#e2e8f0',
              transition: 'background 0.3s',
            }} />
          )
        })}
      </div>
      <div className="hide-mobile" style={{ display: 'flex', gap: 3, marginTop: 3 }}>
        {onlyParts.map(p => (
          <div key={p.id} style={{ flex: 1, fontSize: 9, color: '#94a3b8', textAlign: 'center' }}>
            {p.pct}%
          </div>
        ))}
      </div>

      {/* Cards de estimados */}
      <div
        className="progress-cards"
        style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}
      >
        <div style={{
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: 10, padding: '10px 14px', flex: '1 1 140px',
        }}>
          <div style={{ fontSize: 10, color: '#15803d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            ⏱ Estimado esta parte
          </div>
          <div style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 900, color: '#166534', marginTop: 4 }}>
            {part.dias} días
          </div>
          <div style={{ fontSize: 10, color: '#4ade80', marginTop: 2 }}>
            Equipo 5 personas · Optimista
          </div>
        </div>

        <div style={{
          background: '#eff6ff', border: '1px solid #bfdbfe',
          borderRadius: 10, padding: '10px 14px', flex: '1 1 140px',
        }}>
          <div style={{ fontSize: 10, color: '#1d4ed8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            📅 Total del proyecto
          </div>
          <div style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 900, color: '#1e40af', marginTop: 4 }}>
            {totalDias} días
          </div>
          <div style={{ fontSize: 10, color: '#60a5fa', marginTop: 2 }}>
            Todas las partes · Optimista
          </div>
        </div>

        <div style={{
          background: '#fefce8', border: '1px solid #fde68a',
          borderRadius: 10, padding: '10px 14px', flex: '2 1 200px',
        }}>
          <div style={{ fontSize: 10, color: '#92400e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            ⚠️ Nota importante
          </div>
          <div style={{ fontSize: 11, color: '#78350f', marginTop: 4, lineHeight: 1.6 }}>
            Estimado <strong>optimista</strong> asumiendo equipo a tiempo completo con experiencia en Azure.
            El tiempo real depende significativamente del{' '}
            <strong>levantamiento de dominios y fuentes de datos</strong>: número de fuentes,
            calidad, complejidad de reglas de negocio y disponibilidad de equipos fuente.
          </div>
        </div>
      </div>
    </div>
  )
}