import { ROADMAP, partsConfig, TOTAL_DIAS } from '../data/partsConfig'
import { useLanguage } from '../i18n/LanguageContext'

// Solo datos estructurales — todo el texto viene de t.roadmap
const PARTS_INFO = [
  { id: 'part1', partKey: 'part1', color: '#1d4ed8', pct: 20, dias: '30–45', capas: ['EXTRAER','CARGAR','ALMACENAR','GOBERNAR'] },
  { id: 'part2', partKey: 'part2', color: '#0f3460', pct: 40, dias: '45–60', capas: ['TRANSFORMAR','OBSERVABILIDAD'] },
  { id: 'part3', partKey: 'part3', color: '#533483', pct: 60, dias: '30–45', capas: ['SEMÁNTICA'] },
  { id: 'part4', partKey: 'part4', color: '#2d6a4f', pct: 80, dias: '30–45', capas: ['APROVECHAR'] },
  { id: 'part5', partKey: 'part5', color: '#1b4332', pct: 100, dias: '20–30', capas: ['ORQUESTADOR'] },
]

const PROGRESS_WIDTHS = [5, 15, 25, 20, 20, 15]

export default function RoadmapView() {
  const { t } = useLanguage()
  const tr = t.roadmap

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div
        data-print="card"
        style={{
          background: 'linear-gradient(135deg, #1e3a5f, #7c3aed)',
          borderRadius: 16, padding: '22px 26px', marginBottom: 24, color: '#fff',
        }}
      >
        <div style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 900, letterSpacing: -0.5 }}>{tr.title}</div>
        <div style={{ fontSize: 13, opacity: 0.88, marginTop: 6 }}>{tr.start}</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
          {[
            { label: tr.duration, value: `${TOTAL_DIAS} ${tr.days}` },
            { label: tr.delivery, value: tr.deliveryVal },
            { label: tr.phases,   value: tr.phasesVal },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 16px' }}>
              <div style={{ fontSize: 10, opacity: 0.8 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 14, padding: '10px 14px',
          background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.4)',
          borderRadius: 10, fontSize: 12, lineHeight: 1.6,
        }}>
          {tr.warning} <strong>{tr.warningText}</strong>
        </div>
      </div>

      {/* Timeline visual */}
      <div
        data-print="card"
        data-print-extra="roadmap-header"
        style={{ background: '#fff', borderRadius: 14, padding: 20, marginBottom: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}
      >
        <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 16 }}>{tr.timeline}</div>
        {ROADMAP.map((h, i) => (
          <div key={i} data-print="roadmap-phase" style={{ display: 'flex', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: h.pct === 100 ? '#10b981' : h.color,
                border: '3px solid #fff',
                boxShadow: `0 0 0 2px ${h.pct === 100 ? '#10b981' : h.color}`,
                flexShrink: 0, zIndex: 1,
              }} />
              {i < ROADMAP.length - 1 && (
                <div style={{ width: 2, flex: 1, background: '#e2e8f0', minHeight: 28 }} />
              )}
            </div>
            <div style={{ paddingBottom: i < ROADMAP.length - 1 ? 20 : 0, flex: 1 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>{h.fecha}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{h.hito}</span>
                {h.pct > 0 && (
                  <span style={{ background: h.color, color: '#fff', borderRadius: 99, padding: '1px 8px', fontSize: 10, fontWeight: 700 }}>
                    {h.pct}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de progreso total */}
      <div data-print="card" style={{ background: '#fff', borderRadius: 14, padding: 20, marginBottom: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 14 }}>{tr.progressBar}</div>
        <div style={{ display: 'flex', gap: 4, height: 32, borderRadius: 10, overflow: 'hidden' }}>
          {tr.progressSegments.map((label, i) => (
            <div key={i} style={{
              flex: PROGRESS_WIDTHS[i],
              background: ['#64748b','#1d4ed8','#0f3460','#533483','#2d6a4f','#1b4332'][i],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 9, color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', padding: '0 4px' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          {PROGRESS_WIDTHS.map((w, i) => (
            <div key={i} style={{ flex: w, fontSize: 9, color: '#94a3b8', textAlign: 'center' }}>{w}%</div>
          ))}
        </div>
      </div>

      {/* Fases detalladas */}
      <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 14 }}>{tr.detail}</div>
      {PARTS_INFO.map(p => {
        const entregables = tr.parts[p.partKey]?.entregables ?? []
        return (
          <div
            key={p.id}
            data-print="roadmap-phase"
            style={{
              background: '#fff', borderRadius: 14, padding: 20,
              marginBottom: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${p.color}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#1e293b' }}>{t.parts[p.partKey]}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  {p.capas.map(c => (
                    <span key={c} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 600, color: '#475569' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: p.color }}>{p.pct}%</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>⏱ {p.dias} {tr.days}</div>
              </div>
            </div>

            <div style={{ background: '#f1f5f9', borderRadius: 99, height: 6, marginBottom: 14, overflow: 'hidden' }}>
              <div style={{ width: `${p.pct}%`, background: p.color, height: '100%', borderRadius: 99 }} />
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {tr.deliverables}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 6 }}>
                {entregables.map((e, j) => (
                  <div key={j} style={{ display: 'flex', gap: 8, fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
                    <span style={{ color: p.color, flexShrink: 0 }}>◆</span>
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}