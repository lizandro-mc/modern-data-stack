import { useState, useMemo, useEffect } from 'react'
import { glossary } from '../data/glossary'
import { useLanguage } from '../i18n/LanguageContext'

// Solo datos estructurales (colores + código SQL inmutable)
const SCD_STRUCTURE = [
  { tipo: 'SCD 0', color: '#6b7280', bg: '#f9fafb', border: '#d1d5db',
    codigo: `-- SCD 0: columnas marcadas como inmutables en schema.yml
-- No se incluyen en la lógica de actualización del snapshot.
-- description: "Valor inmutable — no actualizar nunca"` },
  { tipo: 'SCD 1', color: '#b45309', bg: '#fffbeb', border: '#fcd34d',
    codigo: `-- SCD 1 con dbt — el modelo refleja siempre el estado actual
SELECT
    producto_id,
    nombre,
    categoria,        -- si cambia → se sobreescribe, sin historial
    precio_vigente
FROM {{ ref('slv_productos') }}` },
  { tipo: 'SCD 2', color: '#1d4ed8', bg: '#eff6ff', border: '#93c5fd',
    codigo: `{% snapshot snp_cliente_bancario %}
  {{ config(
      target_schema = 'snapshots',
      unique_key    = 'cliente_id',
      strategy      = 'timestamp',
      updated_at    = 'updated_at',
  ) }}
  SELECT * FROM {{ source('core_bancario', 'clientes') }}
{% endsnapshot %}

-- dim_cliente_bancario.sql
SELECT
    cliente_id, nombre, segmento, staging_ifrs9,
    dbt_valid_from AS valid_from,
    dbt_valid_to   AS valid_to,
    (dbt_valid_to IS NULL) AS is_current
FROM {{ ref('snp_cliente_bancario') }}` },
  { tipo: 'SCD 3', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd',
    codigo: `SELECT
    cliente_id,
    direccion_actual,
    direccion_anterior,   -- columna extra con el valor previo
    fecha_cambio_direccion
FROM {{ ref('slv_clientes') }}` },
  { tipo: 'SCD 4', color: '#065f46', bg: '#ecfdf5', border: '#6ee7b7',
    codigo: `-- Tabla principal: solo estado actual
SELECT tasa_id, nombre, valor_actual, moneda
FROM {{ ref('slv_tasas') }} WHERE is_current = true

-- Tabla historial: todo el historial
SELECT tasa_id, nombre, valor, moneda, valid_from, valid_to
FROM {{ ref('snp_tasas_referencia') }}` },
  { tipo: 'SCD 6', color: '#9a3412', bg: '#fff7ed', border: '#fdba74',
    codigo: `SELECT
    cliente_id,
    segmento                       AS segmento_historico,  -- SCD 2
    LAST_VALUE(segmento) OVER (
        PARTITION BY cliente_id ORDER BY dbt_valid_from
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    )                              AS segmento_actual,     -- SCD 1
    LAG(segmento) OVER (
        PARTITION BY cliente_id ORDER BY dbt_valid_from
    )                              AS segmento_anterior,   -- SCD 3
    dbt_valid_from AS valid_from,
    dbt_valid_to   AS valid_to,
    (dbt_valid_to IS NULL) AS is_current
FROM {{ ref('snp_cliente_bancario') }}` },
]

// URLs de recursos (orden debe coincidir con tg.recursos)
const RECURSOS_URLS = [
  [ // dbt
    'https://learn.getdbt.com/',
    'https://docs.getdbt.com/best-practices',
    'https://docs.getdbt.com/docs/build/sources#snapshotting-source-data-freshness',
    'https://docs.getdbt.com/docs/build/snapshots',
    'https://docs.getdbt.com/docs/build/about-metricflow',
    'https://discourse.getdbt.com/',
  ],
  [ // Fabric
    'https://learn.microsoft.com/es-es/training/browse/?products=fabric',
    'https://learn.microsoft.com/es-es/fabric/data-engineering/lakehouse-vs-data-warehouse',
    'https://learn.microsoft.com/es-es/fabric/enterprise/plan-capacity',
    'https://learn.microsoft.com/es-es/fabric/security/security-private-links-overview',
    'https://learn.microsoft.com/es-es/fabric/cicd/git-integration/intro-to-git-integration',
    'https://community.fabric.microsoft.com/',
  ],
  [ // Migración
    'https://learn.microsoft.com/es-es/azure/data-factory/create-self-hosted-integration-runtime',
    'https://learn.microsoft.com/es-es/azure/expressroute/expressroute-introduction',
    'https://learn.microsoft.com/es-es/azure/dms/dms-overview',
    'https://debezium.io/documentation/reference/stable/',
    'https://learn.microsoft.com/es-es/azure/key-vault/general/overview',
  ],
  [ // Banca
    'https://www.sb.gob.do/',
    'https://www.bancentral.gov.do/',
    'https://www.uaf.gob.do/',
    'https://www.uaf.gob.do/legislacion/leyes/',
    'https://www.sb.gob.do/index.php/marco-legal/leyes',
    'https://indotel.gob.do/servicios/tic/proteccion-de-datos-personales/',
    'https://www.ifrs.org/issued-standards/list-of-standards/ifrs-9-financial-instruments/',
    'https://www.bis.org/bcbs/basel3.htm',
  ],
  [ // Fundamentos
    'https://martinfowler.com/articles/data-mesh-principles.html',
    'https://www.getdbt.com/analytics-engineering/',
    'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/slowly-changing-dimensions/',
    'https://www.montecarlodata.com/blog-what-is-data-observability/',
    'https://docs.greatexpectations.io/',
  ],
]

export default function GlossaryView() {
  const { t } = useLanguage()
  const tg = t.glossary
  const [search, setSearch]           = useState('')
  const [section, setSection]         = useState('glosario')
  const [expandedScd, setExpandedScd] = useState(null)

  // Combina estructura con texto traducido
  const scdTypes = SCD_STRUCTURE.map((s, i) => ({ ...s, ...tg.scdTypes[i] }))

  // Combina recursos traducidos con URLs
  const recursos = tg.recursos.map((cat, ci) => ({
    ...cat,
    items: cat.items.map((item, ii) => ({ ...item, url: RECURSOS_URLS[ci][ii] })),
  }))

  useEffect(() => {
    const before = () => setSection('all')
    const after  = () => setSection('glosario')
    window.addEventListener('beforeprint', before)
    window.addEventListener('afterprint',  after)
    return () => {
      window.removeEventListener('beforeprint', before)
      window.removeEventListener('afterprint',  after)
    }
  }, [])

  const filtered = useMemo(() =>
    glossary.filter(g =>
      g?.term && g?.desc && (
        g.term.toLowerCase().includes(search.toLowerCase()) ||
        (g.full || '').toLowerCase().includes(search.toLowerCase()) ||
        g.desc.toLowerCase().includes(search.toLowerCase())
      )
    ), [search])

  const tabStyle = (id) => ({
    padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
    fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
    background: section === id ? '#1e3a5f' : '#f1f5f9',
    color: section === id ? '#fff' : '#475569',
  })

  const cardBase = {
    background: '#fff', borderRadius: 12, padding: '14px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1.5px solid #e2e8f0',
  }

  const showGlosario = section === 'glosario' || section === 'all'
  const showScd      = section === 'scd'      || section === 'all'
  const showRecursos = section === 'recursos'  || section === 'all'

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e40af)',
        borderRadius: 16, padding: '20px 24px', marginBottom: 16, color: '#fff',
      }}>
        <div style={{ fontSize: 'clamp(17px,3vw,22px)', fontWeight: 900 }}>{tg.title}</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>{tg.subtitle}</div>
        <div style={{ marginTop: 8, fontSize: 11, opacity: 0.65 }}>{tg.stats(glossary.length)}</div>
      </div>

      {/* Tabs */}
      <div className="print-hide" style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        <button style={tabStyle('glosario')} onClick={() => setSection('glosario')}>{tg.tabs.glossary(glossary.length)}</button>
        <button style={tabStyle('scd')}      onClick={() => setSection('scd')}>{tg.tabs.scd}</button>
        <button style={tabStyle('recursos')} onClick={() => setSection('recursos')}>{tg.tabs.resources}</button>
      </div>

      {/* ══ GLOSARIO ══════════════════════════════════════════════════════════ */}
      {showGlosario && (
        <div>
          <div className="print-hide" style={{ marginBottom: 14 }}>
            <input
              type="text"
              placeholder={tg.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 16px', borderRadius: 10,
                border: '2px solid #e2e8f0', fontSize: 13, outline: 'none',
                fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            {search && <div style={{ fontSize: 11, color: '#64748b', marginTop: 5 }}>{tg.results(filtered.length, search)}</div>}
          </div>

          {section === 'all' && <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 12 }}>{tg.sectionGlossary}</div>}

          <div data-print="glossary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {filtered.map((g, i) => (
              <a key={i} href={g.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div
                  data-print="glossary-item"
                  style={{ ...cardBase, height: '100%', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ background: '#1e40af', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                      {g.term}
                    </span>
                    <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600, lineHeight: 1.3 }}>{g.full}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.65 }}>{g.desc}</div>
                  <div style={{ marginTop: 10, fontSize: 10, color: '#3b82f6', fontWeight: 600 }}>
                    📖 {g.url.replace('https://', '').split('/').slice(0, 3).join('/')} →
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ══ SCD ═══════════════════════════════════════════════════════════════ */}
      {showScd && (
        <div style={{ marginTop: section === 'all' ? 32 : 0 }}>
          {section === 'all' && (
            <div data-print="page-break" style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 12 }}>
              {tg.sectionScd}
            </div>
          )}

          <div style={{
            background: '#eff6ff', border: '1.5px solid #bfdbfe',
            borderRadius: 12, padding: '14px 18px', marginBottom: 14, fontSize: 13, color: '#1e40af', lineHeight: 1.7,
          }}>
            <strong>{tg.scdWhat}</strong> {tg.scdIntro}
          </div>

          {/* Árbol de decisión */}
          <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 18px', marginBottom: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 8 }}>{tg.scdTree}</div>
            <pre style={{ margin: 0, fontFamily: 'monospace', lineHeight: 1.9, fontSize: 11, color: '#1e293b', overflowX: 'auto' }}>
              {tg.scdTreeContent}
            </pre>
          </div>

          {/* Cards SCD */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 10, marginBottom: 16 }}>
            {scdTypes.map((scd, i) => (
              <div key={i}>
                <div
                  onClick={() => setExpandedScd(expandedScd === i ? null : i)}
                  data-print="card"
                  style={{
                    background: scd.bg, border: `2px solid ${expandedScd === i ? scd.color : scd.border}`,
                    borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ background: scd.color, color: '#fff', borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 800 }}>
                      {scd.tipo}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: scd.color }}>{scd.nombre}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 4 }}>{scd.comportamiento}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}><strong>{tg.whenLabel}</strong> {scd.cuando}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}><strong>{tg.bankExLabel}</strong> {scd.ejemplo}</div>
                  <div className="print-hide" style={{ fontSize: 10, color: scd.color, marginTop: 10, fontWeight: 700 }}>
                    {expandedScd === i ? tg.scdHide : tg.scdShow}
                  </div>
                  <pre className="print-only" style={{ display: 'none', margin: '10px 0 0', fontFamily: 'monospace', fontSize: 9, color: '#1e293b', whiteSpace: 'pre-wrap' }}>
                    {scd.codigo}
                  </pre>
                </div>

                {expandedScd === i && (
                  <div className="print-hide" style={{
                    background: '#0f172a', borderRadius: 10, padding: '16px 20px',
                    marginTop: 6, border: `2px solid ${scd.color}`,
                  }}>
                    <pre style={{ margin: 0, color: '#e2e8f0', fontSize: 11.5, lineHeight: 1.75, fontFamily: 'monospace', overflowX: 'auto' }}>
                      {scd.codigo}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{
            background: '#fefce8', border: '1.5px solid #fde047',
            borderRadius: 12, padding: '13px 16px', fontSize: 12, color: '#713f12', lineHeight: 1.7,
          }}>
            {tg.scdWarning}
          </div>
        </div>
      )}

      {/* ══ RECURSOS ══════════════════════════════════════════════════════════ */}
      {showRecursos && (
        <div style={{ marginTop: section === 'all' ? 32 : 0 }}>
          {section === 'all' && (
            <div data-print="page-break" style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 12 }}>
              {tg.sectionResources}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recursos.map((cat, ci) => (
              <div key={ci} data-print="card" style={{ ...cardBase }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 10 }}>{cat.categoria}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {cat.items.map((item, ii) => (
                    <a key={ii} href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <div
                        style={{ background: '#f8fafc', borderRadius: 8, padding: '9px 12px', border: '1px solid #e2e8f0', fontSize: 12, color: '#1e40af', fontWeight: 600, transition: 'all 0.12s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#93c5fd' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0' }}
                      >
                        {item.label} <span style={{ color: '#94a3b8', fontWeight: 400 }}>→</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}