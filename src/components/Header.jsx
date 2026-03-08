export default function Header({ objOpen, setObjOpen, objectives }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3a5f, #0ea5e9)',
      borderRadius: 16,
      padding: '20px 24px',
      marginBottom: 14,
      color: '#fff',
    }}>
      <div style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 900, letterSpacing: -0.5 }}>
        🏗️ The Modern Data Stack · Azure DaaP
      </div>
      <div style={{ fontSize: 'clamp(11px, 2vw, 13px)', opacity: 0.85, marginTop: 4 }}>
        Arquitectura completa · dbt · Fabric · Purview · Observabilidad · ELT
      </div>

      <button
        onClick={() => setObjOpen(!objOpen)}
        style={{
          marginTop: 10,
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.4)',
          color: '#fff',
          borderRadius: 8,
          padding: '6px 14px',
          fontSize: 12,
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        {objOpen ? '▲ Ocultar' : '▼ Ver'} Objetivos y Principios DaaP
      </button>

      {objOpen && (
        <div
          className="grid-2col"
          style={{
            marginTop: 12,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
          }}
        >
          {objectives.map(o => (
            <div
              key={o.label}
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 8,
                padding: '8px 10px',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700 }}>{o.icon} {o.label}</div>
              <div style={{ fontSize: 11, opacity: 0.82, marginTop: 2 }}>{o.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}