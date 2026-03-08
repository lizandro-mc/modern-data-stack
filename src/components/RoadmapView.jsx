import { ROADMAP, partsConfig, TOTAL_DIAS } from '../data/partsConfig'

const PARTS_INFO = [
  {
    id: 'part1', label: 'Parte 1 · Fundación', color: '#1d4ed8', pct: 20, dias: '30–45',
    capas: ['EXTRAER', 'CARGAR', 'ALMACENAR', 'GOBERNAR'],
    entregables: [
      'Workspace Fabric dev/stage/prod configurados',
      'Lakehouse RAW por sistema fuente desplegado',
      'Pipelines ADF de ingesta para fuentes principales',
      'Metadata obligatoria (_ingested_at, _raw_hash, etc.) en todas las cargas',
      'Catálogo inicial en Microsoft Purview',
      'Data Contracts básicos por fuente',
      'RBAC definido por workspace y rol',
    ],
  },
  {
    id: 'part2', label: 'Parte 2 · Transformar', color: '#0f3460', pct: 40, dias: '45–60',
    capas: ['TRANSFORMAR', 'OBSERVABILIDAD'],
    entregables: [
      'Repositorio dbt con estructura Bronze/Silver/Gold',
      'Adaptador dbt-fabric configurado para Fabric Warehouse',
      'Tests genéricos en todos los modelos (unique, not_null, relationships)',
      'CI/CD con GitHub Actions: dbt test en cada PR',
      'dbt Docs publicados como referencia interna',
      'Elementary OSS configurado para data health',
      'Alertas en Azure Monitor para SLAs de datos',
    ],
  },
  {
    id: 'part3', label: 'Parte 3 · Semántica', color: '#533483', pct: 60, dias: '30–45',
    capas: ['SEMÁNTICA'],
    entregables: [
      'dbt Semantic Layer con métricas de negocio clave',
      'Fabric Semantic Model por dominio desplegado',
      'DirectLake configurado para Power BI sin copia de datos',
      'Diccionario de métricas documentado y versionado',
      'API REST para consumo de métricas externas',
      'Purview con linaje semántico end-to-end',
    ],
  },
  {
    id: 'part4', label: 'Parte 4 · Aprovechar', color: '#2d6a4f', pct: 80, dias: '30–45',
    capas: ['APROVECHAR'],
    entregables: [
      'Dashboards Power BI conectados al Semantic Model',
      'Azure ML Workspace con primeros experimentos',
      'Feature Store con características clave por dominio',
      'Prototipo RAG con Azure OpenAI sobre datos del Lakehouse',
      'MLflow para tracking y versionado de modelos',
    ],
  },
  {
    id: 'part5', label: 'Parte 5 · Orquestador', color: '#1b4332', pct: 100, dias: '20–30',
    capas: ['ORQUESTADOR'],
    entregables: [
      'DAGs end-to-end: ADF (ingesta) → dbt Jobs (transform) → Fabric (serve)',
      'Monitoring Hub de Fabric configurado con alertas SLA',
      'Runbooks de recuperación documentados por pipeline crítico',
      'Ambientes dev/stage/prod completamente automatizados',
      'Stack completo en producción ✅',
    ],
  },
]

export default function RoadmapView() {
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
        <div style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 900, letterSpacing: -0.5 }}>
          📅 Roadmap de Implementación
        </div>
        <div style={{ fontSize: 13, opacity: 0.88, marginTop: 6 }}>
          Inicio: <strong>9 de marzo de 2026</strong> · Equipo de 5 personas · Estimado optimista
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
          {[
            { label: 'DURACIÓN TOTAL',    value: `${TOTAL_DIAS} días` },
            { label: 'ENTREGA ESTIMADA',  value: 'Nov 2026' },
            { label: 'PARTES',            value: '5 fases' },
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
          ⚠️ <strong>Nota:</strong> Estimados optimistas asumiendo equipo a tiempo completo con experiencia en Azure y dbt.
          El tiempo real depende del <strong>levantamiento de dominios, número de fuentes, calidad de datos y disponibilidad de equipos fuente.</strong>
        </div>
      </div>

      {/* Timeline visual */}
      <div
        data-print="card"
        data-print-extra="roadmap-header"
        style={{ background: '#fff', borderRadius: 14, padding: 20, marginBottom: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}
      >
        <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 16 }}>🗓️ Línea de Tiempo</div>
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
        <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 14 }}>📊 Progreso por Fase</div>
        <div style={{ display: 'flex', gap: 4, height: 32, borderRadius: 10, overflow: 'hidden' }}>
          {[
            { label: 'Levantamiento', w: 5,  color: '#64748b' },
            { label: 'Fundación',     w: 15, color: '#1d4ed8' },
            { label: 'Transformar',   w: 25, color: '#0f3460' },
            { label: 'Semántica',     w: 20, color: '#533483' },
            { label: 'Aprovechar',    w: 20, color: '#2d6a4f' },
            { label: 'Orquestador',   w: 15, color: '#1b4332' },
          ].map((s, i) => (
            <div key={i} style={{ flex: s.w, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 9, color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', padding: '0 4px' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          {[5,15,25,20,20,15].map((w, i) => (
            <div key={i} style={{ flex: w, fontSize: 9, color: '#94a3b8', textAlign: 'center' }}>{w}%</div>
          ))}
        </div>
      </div>

      {/* Fases detalladas */}
      <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 14 }}>🏗️ Detalle por Fase</div>
      {PARTS_INFO.map((p) => (
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
              <div style={{ fontWeight: 800, fontSize: 15, color: '#1e293b' }}>{p.label}</div>
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
              <div style={{ fontSize: 11, color: '#94a3b8' }}>⏱ {p.dias} días</div>
            </div>
          </div>

          <div style={{ background: '#f1f5f9', borderRadius: 99, height: 6, marginBottom: 14, overflow: 'hidden' }}>
            <div style={{ width: `${p.pct}%`, background: p.color, height: '100%', borderRadius: 99 }} />
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              ✅ Entregables clave
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 6 }}>
              {p.entregables.map((e, j) => (
                <div key={j} style={{ display: 'flex', gap: 8, fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
                  <span style={{ color: p.color, flexShrink: 0 }}>◆</span>
                  {e}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}