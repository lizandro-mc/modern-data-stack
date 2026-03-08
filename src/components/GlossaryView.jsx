import { useState, useMemo } from 'react'
import { glossary } from '../data/glossary'

// ── Tipos SCD para la sección educativa ──────────────────────────────────────
const SCD_TYPES = [
  {
    tipo: 'SCD 0',
    nombre: 'Fija',
    color: '#6b7280',
    bg: '#f9fafb',
    border: '#d1d5db',
    comportamiento: 'No se actualiza jamás.',
    cuando: 'Datos inmutables por definición.',
    ejemplo: 'País de nacimiento, fecha de registro original.',
  },
  {
    tipo: 'SCD 1',
    nombre: 'Sobreescribir',
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fcd34d',
    comportamiento: 'Reemplaza el valor antiguo. Sin historial.',
    cuando: 'El pasado no importa o fue un error.',
    ejemplo: 'Corrección de typos en nombre o email.',
  },
  {
    tipo: 'SCD 2',
    nombre: 'Historial completo ⭐',
    color: '#1d4ed8',
    bg: '#eff6ff',
    border: '#93c5fd',
    comportamiento: 'Nueva fila por cada cambio, con valid_from / valid_to.',
    cuando: 'Necesitas historial completo para análisis temporal.',
    ejemplo: 'Segmento de cliente, región de ventas, precio de producto.',
  },
  {
    tipo: 'SCD 3',
    nombre: 'Valor anterior',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#c4b5fd',
    comportamiento: 'Columna extra con el valor previo. Sin historial completo.',
    cuando: 'Solo interesa el cambio más reciente.',
    ejemplo: 'Dirección actual vs. dirección anterior.',
  },
  {
    tipo: 'SCD 4',
    nombre: 'Tabla historial',
    color: '#065f46',
    bg: '#ecfdf5',
    border: '#6ee7b7',
    comportamiento: 'Tabla principal con estado actual + tabla aparte con historial.',
    cuando: 'Dimensión enorme con pocos cambios.',
    ejemplo: 'Historial de precios en catálogos masivos.',
  },
  {
    tipo: 'SCD 6',
    nombre: 'Híbrido (1+2+3)',
    color: '#9a3412',
    bg: '#fff7ed',
    border: '#fdba74',
    comportamiento: 'Combina tipos 1, 2 y 3 en una sola fila.',
    cuando: 'Necesitas historial Y acceso conveniente al valor actual.',
    ejemplo: 'Análisis de cohortes con estado histórico y actual.',
  },
]

// ── Código de ejemplo SCD 2 con dbt ──────────────────────────────────────────
const SCD2_SNAPSHOT = `-- snapshots/snp_clientes.sql
{% snapshot snp_clientes %}
  {{
    config(
      target_schema = 'snapshots',
      unique_key    = 'cliente_id',
      strategy      = 'timestamp',
      updated_at    = 'updated_at',
      invalidate_hard_deletes = true,
    )
  }}
  SELECT * FROM {{ source('crm', 'clientes') }}
{% endsnapshot %}`

const SCD2_DIM = `-- models/gold/dimensions/dim_cliente.sql
SELECT
    -- surrogate key única por versión (no por cliente)
    {{ dbt_utils.generate_surrogate_key(
        ['cliente_id', 'dbt_valid_from']
    ) }}                          AS sk_cliente,
    cliente_id,
    nombre,
    segmento,
    region,
    dbt_valid_from                AS valid_from,
    dbt_valid_to                  AS valid_to,
    (dbt_valid_to IS NULL)        AS is_current   -- TRUE = versión vigente
FROM {{ ref('snp_clientes') }}`

// ── Recursos de aprendizaje ───────────────────────────────────────────────────
const RECURSOS = [
  {
    categoria: '🟡 dbt',
    items: [
      { label: 'dbt Learn — cursos oficiales gratuitos', url: 'https://learn.getdbt.com/' },
      { label: 'dbt Best Practices (estructura, Medallion, naming)', url: 'https://docs.getdbt.com/best-practices' },
      { label: 'dbt Snapshots — SCD 2 nativo', url: 'https://docs.getdbt.com/docs/build/snapshots' },
      { label: 'dbt MetricFlow — motor de métricas semánticas', url: 'https://docs.getdbt.com/docs/build/about-metricflow' },
      { label: 'dbt Discourse — comunidad y foro', url: 'https://discourse.getdbt.com/' },
    ],
  },
  {
    categoria: '🟣 Microsoft Fabric',
    items: [
      { label: 'Fabric Learn — módulos oficiales gratuitos', url: 'https://learn.microsoft.com/es-es/training/browse/?products=fabric' },
      { label: 'Lakehouse vs. Warehouse en Fabric', url: 'https://learn.microsoft.com/es-es/fabric/data-engineering/lakehouse-vs-data-warehouse' },
      { label: 'Fabric Capacity Planning (F-SKUs)', url: 'https://learn.microsoft.com/es-es/fabric/enterprise/plan-capacity' },
      { label: 'Fabric Git Integration (CI/CD nativo)', url: 'https://learn.microsoft.com/es-es/fabric/cicd/git-integration/intro-to-git-integration' },
      { label: 'Fabric Community — foro oficial', url: 'https://community.fabric.microsoft.com/' },
    ],
  },
  {
    categoria: '🏗️ Fundamentos del Stack',
    items: [
      { label: 'Data Mesh Principles — Martin Fowler', url: 'https://martinfowler.com/articles/data-mesh-principles.html' },
      { label: 'The Analytics Engineering Guide — dbt Labs', url: 'https://www.getdbt.com/analytics-engineering/' },
      { label: 'Azure Data Architecture Guide', url: 'https://learn.microsoft.com/es-es/azure/architecture/data-guide/' },
      { label: 'Azure Well-Architected Framework', url: 'https://learn.microsoft.com/es-es/azure/well-architected/' },
      { label: 'Monte Carlo — Qué es la observabilidad de datos', url: 'https://www.montecarlodata.com/blog-what-is-data-observability/' },
    ],
  },
  {
    categoria: '📐 Modelado Dimensional & SCD',
    items: [
      { label: 'Kimball Group — SCD Techniques (referencia original)', url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/slowly-changing-dimensions/' },
      { label: 'dbt_utils — generate_surrogate_key', url: 'https://github.com/dbt-labs/dbt-utils#generate_surrogate_key-source' },
      { label: 'Star Schema vs. Data Vault', url: 'https://www.databricks.com/glossary/data-vault' },
      { label: 'Microsoft Purview — Gobernanza y linaje', url: 'https://learn.microsoft.com/es-es/purview/purview' },
      { label: 'Great Expectations — validación de calidad OSS', url: 'https://docs.greatexpectations.io/' },
    ],
  },
]

// ── Componente principal ──────────────────────────────────────────────────────
export default function GlossaryView() {
  const [search, setSearch] = useState('')
  const [activeSection, setActiveSection] = useState('glosario') // 'glosario' | 'scd' | 'recursos'
  const [expandedScd, setExpandedScd] = useState(null)

  const filtered = useMemo(() =>
    glossary.filter(g =>
      g.term.toLowerCase().includes(search.toLowerCase()) ||
      g.full.toLowerCase().includes(search.toLowerCase()) ||
      g.desc.toLowerCase().includes(search.toLowerCase())
    ), [search])

  // ── estilos compartidos ───────────────────────────────────────────────────
  const tabStyle = (id) => ({
    padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
    fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
    background: activeSection === id ? '#1e3a5f' : '#f1f5f9',
    color: activeSection === id ? '#fff' : '#475569',
  })

  const cardBase = {
    background: '#fff', borderRadius: 12, padding: '14px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1.5px solid #e2e8f0',
    transition: 'all 0.15s',
  }

  return (
    <div>
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e40af)',
        borderRadius: 16, padding: '20px 24px', marginBottom: 16, color: '#fff',
      }}>
        <div style={{ fontSize: 'clamp(17px,3vw,22px)', fontWeight: 900 }}>
          📖 Glosario · SCD · Recursos
        </div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
          Siglas, tipos de dimensiones y referencias de aprendizaje del stack.
        </div>
        <div style={{ marginTop: 10, fontSize: 11, opacity: 0.65 }}>
          {glossary.length} términos · 6 tipos SCD · 4 categorías de recursos
        </div>
      </div>

      {/* ── Tabs de sección ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        <button style={tabStyle('glosario')} onClick={() => setActiveSection('glosario')}>
          📖 Glosario ({glossary.length})
        </button>
        <button style={tabStyle('scd')} onClick={() => setActiveSection('scd')}>
          🔄 Tipos SCD
        </button>
        <button style={tabStyle('recursos')} onClick={() => setActiveSection('recursos')}>
          🎓 Recursos
        </button>
      </div>

      {/* ════════════════════════════════════════
          SECCIÓN: GLOSARIO
      ════════════════════════════════════════ */}
      {activeSection === 'glosario' && (
        <>
          <div style={{ marginBottom: 14 }}>
            <input
              type="text"
              placeholder="🔍  Buscar término, sigla o descripción..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 16px', borderRadius: 10,
                border: '2px solid #e2e8f0', fontSize: 13, outline: 'none',
                fontFamily: 'inherit', background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            {search && (
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 6, paddingLeft: 4 }}>
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "{search}"
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40, fontSize: 13 }}>
              No se encontraron términos para "{search}"
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
              {filtered.map((g, i) => (
                <a key={i} href={g.url} target="_blank" rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}>
                  <div
                    style={{ ...cardBase, height: '100%', cursor: 'pointer' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#3b82f6'
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(59,130,246,0.15)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e2e8f0'
                      e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)'
                      e.currentTarget.style.transform = 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{
                        background: '#1e40af', color: '#fff', borderRadius: 6,
                        padding: '2px 8px', fontSize: 11, fontWeight: 800, flexShrink: 0,
                      }}>{g.term}</span>
                      <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600, lineHeight: 1.3 }}>
                        {g.full}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.65 }}>
                      {g.desc}
                    </div>
                    <div style={{ marginTop: 10, fontSize: 10, color: '#3b82f6', fontWeight: 600 }}>
                      📖 {g.url.replace('https://', '').split('/').slice(0, 3).join('/')} →
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════
          SECCIÓN: SCD
      ════════════════════════════════════════ */}
      {activeSection === 'scd' && (
        <div>
          {/* Intro */}
          <div style={{
            background: '#eff6ff', border: '1.5px solid #bfdbfe',
            borderRadius: 12, padding: '14px 18px', marginBottom: 16, fontSize: 13, color: '#1e40af', lineHeight: 1.7,
          }}>
            <strong>¿Qué es una SCD?</strong> Una <em>Slowly Changing Dimension</em> (Dimensión que Cambia Lentamente)
            es el patrón para manejar cambios históricos en tablas de dimensiones (clientes, productos, empleados).
            Elegir el tipo correcto define cómo tu Warehouse preserva o sobreescribe el historial.
            <span style={{ display: 'block', marginTop: 6, color: '#2563eb' }}>
              👇 Haz clic en cada tipo para ver detalles y código.
            </span>
          </div>

          {/* Árbol de decisión */}
          <div style={{
            background: '#f8fafc', border: '1.5px solid #e2e8f0',
            borderRadius: 12, padding: '14px 18px', marginBottom: 16, fontSize: 12, color: '#334155',
          }}>
            <div style={{ fontWeight: 800, marginBottom: 8, fontSize: 13 }}>🌳 Árbol de decisión</div>
            <pre style={{ margin: 0, fontFamily: 'monospace', lineHeight: 1.8, fontSize: 11, color: '#1e293b' }}>
{`¿Necesitas historial?
  ├── NO  → SCD 1 (sobreescribir)
  └── SÍ → ¿El dato es inmutable?
              ├── SÍ → SCD 0 (fija)
              └── NO → ¿Cuánto historial?
                         ├── Solo el valor anterior → SCD 3
                         ├── Historial completo     → SCD 2 ⭐ (el más común)
                         └── Tabla enorme           → SCD 4 (tabla aparte)`}
            </pre>
          </div>

          {/* Cards de tipos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 10, marginBottom: 20 }}>
            {SCD_TYPES.map((scd, i) => (
              <div key={i}
                onClick={() => setExpandedScd(expandedScd === i ? null : i)}
                style={{
                  background: scd.bg, border: `2px solid ${expandedScd === i ? scd.color : scd.border}`,
                  borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s',
                  boxShadow: expandedScd === i ? `0 4px 14px ${scd.color}22` : '0 1px 4px rgba(0,0,0,0.06)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = scd.color}
                onMouseLeave={e => { if (expandedScd !== i) e.currentTarget.style.borderColor = scd.border }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{
                    background: scd.color, color: '#fff', borderRadius: 6,
                    padding: '2px 9px', fontSize: 11, fontWeight: 800,
                  }}>{scd.tipo}</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: scd.color }}>{scd.nombre}</span>
                </div>
                <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 4 }}>
                  {scd.comportamiento}
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  <span style={{ fontWeight: 600 }}>Cuándo:</span> {scd.cuando}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                  <span style={{ fontWeight: 600 }}>Ej:</span> {scd.ejemplo}
                </div>
                <div style={{ fontSize: 10, color: scd.color, marginTop: 8, fontWeight: 600 }}>
                  {expandedScd === i ? '▲ Ocultar código' : '▼ Ver implementación en dbt'}
                </div>
              </div>
            ))}
          </div>

          {/* Panel expandido — código SCD 2 */}
          {expandedScd !== null && (
            <div style={{
              background: '#0f172a', borderRadius: 14, padding: '20px 24px',
              marginBottom: 16, border: `2px solid ${SCD_TYPES[expandedScd].color}`,
            }}>
              {expandedScd === 1 /* SCD 1 */ && (
                <>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 12 }}>
                    SCD 1 con dbt — el modelo simplemente selecciona el estado actual. No requiere snapshot.
                  </div>
                  <pre style={{ margin: 0, color: '#e2e8f0', fontSize: 12, lineHeight: 1.7, fontFamily: 'monospace', overflowX: 'auto' }}>
{`-- models/gold/dimensions/dim_producto.sql
-- SCD 1: siempre refleja el estado actual, sin historial
SELECT
    producto_id,
    nombre,
    categoria,        -- si cambia, simplemente se actualiza
    precio_actual     -- idem
FROM {{ ref('slv_productos') }}`}
                  </pre>
                </>
              )}
              {expandedScd === 2 /* SCD 2 */ && (
                <>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 12 }}>
                    SCD 2 con dbt Snapshots — columnas clave:{' '}
                    <code style={{ color: '#7dd3fc' }}>valid_from</code> ·{' '}
                    <code style={{ color: '#7dd3fc' }}>valid_to</code> ·{' '}
                    <code style={{ color: '#7dd3fc' }}>is_current</code>
                  </div>
                  <div style={{ color: '#64748b', fontSize: 11, marginBottom: 6 }}>① Snapshot (genera el historial)</div>
                  <pre style={{ margin: '0 0 16px', color: '#e2e8f0', fontSize: 11, lineHeight: 1.7, fontFamily: 'monospace', overflowX: 'auto' }}>
                    {SCD2_SNAPSHOT}
                  </pre>
                  <div style={{ color: '#64748b', fontSize: 11, marginBottom: 6 }}>② Dimensión (consume el snapshot)</div>
                  <pre style={{ margin: 0, color: '#e2e8f0', fontSize: 11, lineHeight: 1.7, fontFamily: 'monospace', overflowX: 'auto' }}>
                    {SCD2_DIM}
                  </pre>
                </>
              )}
              {(expandedScd === 0 || expandedScd >= 3) && (
                <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>
                  <div style={{ color: SCD_TYPES[expandedScd].color, fontWeight: 700, marginBottom: 8 }}>
                    {SCD_TYPES[expandedScd].tipo} — {SCD_TYPES[expandedScd].nombre}
                  </div>
                  {expandedScd === 0 && 'SCD 0: columnas marcadas como inmutables. No se incluyen en la lógica de actualización del snapshot. Documentar en schema.yml con description: "valor inmutable — no actualizar".'}
                  {expandedScd === 3 && 'SCD 3: agregar columnas prev_{campo} en la dimensión. Ej: prev_segmento VARCHAR. Se actualiza con cada cambio: el nuevo valor va a segmento, el anterior a prev_segmento. Limita el historial a un solo cambio previo.'}
                  {expandedScd === 4 && 'SCD 4: tabla principal dim_producto con estado actual + tabla dim_producto_history con todo el historial. Útil cuando la dimensión tiene millones de filas y pocos atributos cambian con frecuencia.'}
                  {expandedScd === 5 && 'SCD 6 (híbrido 1+2+3): combina una columna con el valor actual (tipo 1), filas históricas con valid_from/valid_to (tipo 2) y una columna con el valor anterior (tipo 3). Máxima flexibilidad, máxima complejidad. Usar solo si realmente lo necesitas.'}
                </div>
              )}

              <a href="https://docs.getdbt.com/docs/build/snapshots" target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-block', marginTop: 16, fontSize: 11, color: '#7dd3fc',
                  textDecoration: 'none', fontWeight: 600,
                }}>
                📖 dbt Snapshots — documentación oficial →
              </a>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════
          SECCIÓN: RECURSOS
      ════════════════════════════════════════ */}
      {activeSection === 'recursos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {RECURSOS.map((cat, ci) => (
            <div key={ci} style={{ ...cardBase }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 10 }}>
                {cat.categoria}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cat.items.map((item, ii) => (
                  <a key={ii} href={item.url} target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        background: '#f8fafc', borderRadius: 8, padding: '9px 12px',
                        border: '1px solid #e2e8f0', fontSize: 12, color: '#1e40af',
                        fontWeight: 600, transition: 'all 0.12s', lineHeight: 1.4,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#eff6ff'
                        e.currentTarget.style.borderColor = '#93c5fd'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = '#f8fafc'
                        e.currentTarget.style.borderColor = '#e2e8f0'
                      }}
                    >
                      {item.label} <span style={{ color: '#94a3b8', fontWeight: 400 }}>→</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}