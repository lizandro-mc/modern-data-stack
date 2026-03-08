import { useState, useMemo } from 'react'
import { glossary } from '../data/glossary'

// ── Tipos SCD ─────────────────────────────────────────────────────────────────
const SCD_TYPES = [
  {
    tipo: 'SCD 0', nombre: 'Fija',
    color: '#6b7280', bg: '#f9fafb', border: '#d1d5db',
    comportamiento: 'No se actualiza jamás.',
    cuando: 'Datos inmutables por definición.',
    ejemplo: 'Fecha de apertura de cuenta, número de crédito original.',
    codigo: `-- SCD 0: columnas marcadas como inmutables en schema.yml
-- No se incluyen en la lógica de actualización del snapshot.
-- Documentar en schema.yml:
-- description: "Valor inmutable — no actualizar nunca"`,
  },
  {
    tipo: 'SCD 1', nombre: 'Sobreescribir',
    color: '#b45309', bg: '#fffbeb', border: '#fcd34d',
    comportamiento: 'Reemplaza el valor antiguo. Sin historial.',
    cuando: 'El pasado no importa o fue un error de captura.',
    ejemplo: 'Corrección de typos en nombre o email del cliente.',
    codigo: `-- SCD 1 con dbt — el modelo refleja siempre el estado actual
-- No requiere snapshot. Solo un SELECT del Silver.

-- models/gold/dimensions/dim_producto.sql
SELECT
    producto_id,
    nombre,
    categoria,        -- si cambia → se sobreescribe, sin historial
    precio_vigente
FROM {{ ref('slv_productos') }}`,
  },
  {
    tipo: 'SCD 2', nombre: 'Historial completo ⭐',
    color: '#1d4ed8', bg: '#eff6ff', border: '#93c5fd',
    comportamiento: 'Nueva fila por cada cambio, con valid_from / valid_to.',
    cuando: 'Historial completo requerido — estándar bancario.',
    ejemplo: 'Segmento de cliente, staging IFRS 9 (Stage 1/2/3), tasa de crédito.',
    codigo: `-- ① Snapshot: genera el historial automáticamente
-- snapshots/snp_cliente_bancario.sql
{% snapshot snp_cliente_bancario %}
  {{
    config(
      target_schema = 'snapshots',
      unique_key    = 'cliente_id',
      strategy      = 'timestamp',   -- o 'check' para columnas específicas
      updated_at    = 'updated_at',
      invalidate_hard_deletes = true,
    )
  }}
  SELECT * FROM {{ source('core_bancario', 'clientes') }}
{% endsnapshot %}

-- ② Dimensión: consume el snapshot con columnas de vigencia
-- models/gold/dimensions/dim_cliente_bancario.sql
SELECT
    -- surrogate key única POR VERSIÓN (no por cliente)
    {{ dbt_utils.generate_surrogate_key(
        ['cliente_id', 'dbt_valid_from']
    ) }}                        AS sk_cliente,
    cliente_id,
    nombre,
    segmento,          -- ← qué segmento tenía cuando ocurrió la transacción
    staging_ifrs9,     -- ← Stage 1/2/3 histórico: crítico para ECL
    region,
    dbt_valid_from     AS valid_from,
    dbt_valid_to       AS valid_to,
    (dbt_valid_to IS NULL) AS is_current  -- TRUE = versión activa hoy
FROM {{ ref('snp_cliente_bancario') }}`,
  },
  {
    tipo: 'SCD 3', nombre: 'Valor anterior',
    color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd',
    comportamiento: 'Columna extra con el valor previo. Sin historial completo.',
    cuando: 'Solo interesa el cambio más reciente, no el historial.',
    ejemplo: 'Dirección actual vs. dirección anterior del cliente.',
    codigo: `-- SCD 3: agregar columna prev_{campo} en la dimensión
-- Solo guarda el cambio más reciente — limita el historial a 1 cambio previo

SELECT
    cliente_id,
    direccion_actual,
    direccion_anterior,   -- ← columna extra con el valor previo
    fecha_cambio_direccion
FROM {{ ref('slv_clientes') }}

-- ⚠️ Limitación: si cambia 3 veces, solo conservas el estado actual
--    y el inmediatamente anterior. Usa SCD 2 si necesitas más historial.`,
  },
  {
    tipo: 'SCD 4', nombre: 'Tabla historial',
    color: '#065f46', bg: '#ecfdf5', border: '#6ee7b7',
    comportamiento: 'Tabla principal con estado actual + tabla separada con historial completo.',
    cuando: 'Dimensión enorme con pocos cambios frecuentes.',
    ejemplo: 'Catálogo de tasas de referencia, historial de precios masivos.',
    codigo: `-- SCD 4: dos tablas separadas
-- Tabla principal: solo estado actual (rápida para consultas)
-- dim_tasa_referencia.sql
SELECT tasa_id, nombre, valor_actual, moneda
FROM {{ ref('slv_tasas') }}
WHERE is_current = true

-- Tabla historial: todo el historial (para análisis temporal)
-- dim_tasa_referencia_history.sql
SELECT tasa_id, nombre, valor, moneda, valid_from, valid_to
FROM {{ ref('snp_tasas_referencia') }}`,
  },
  {
    tipo: 'SCD 6', nombre: 'Híbrido (1+2+3)',
    color: '#9a3412', bg: '#fff7ed', border: '#fdba74',
    comportamiento: 'Combina tipos 1, 2 y 3 en una sola fila.',
    cuando: 'Necesitas historial completo Y acceso conveniente al valor actual en la misma fila.',
    ejemplo: 'Análisis de cohortes: quiero el segmento histórico Y el segmento actual en la misma query.',
    codigo: `-- SCD 6 = SCD 2 (filas históricas) + columna de valor actual (tipo 1)
--           + columna de valor anterior (tipo 3)

SELECT
    {{ dbt_utils.generate_surrogate_key(
        ['cliente_id', 'dbt_valid_from']
    ) }}                            AS sk_cliente,
    cliente_id,
    -- Tipo 2: valor histórico en esta versión
    segmento                        AS segmento_historico,
    -- Tipo 1: valor actual (mismo en todas las filas del cliente)
    LAST_VALUE(segmento) OVER (
        PARTITION BY cliente_id
        ORDER BY dbt_valid_from
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    )                               AS segmento_actual,
    -- Tipo 3: valor inmediatamente anterior
    LAG(segmento) OVER (
        PARTITION BY cliente_id ORDER BY dbt_valid_from
    )                               AS segmento_anterior,
    dbt_valid_from                  AS valid_from,
    dbt_valid_to                    AS valid_to,
    (dbt_valid_to IS NULL)          AS is_current
FROM {{ ref('snp_cliente_bancario') }}`,
  },
]

// ── Recursos de aprendizaje ───────────────────────────────────────────────────
const RECURSOS = [
  {
    categoria: '🟡 dbt',
    items: [
      { label: 'dbt Learn — cursos oficiales gratuitos', url: 'https://learn.getdbt.com/' },
      { label: 'dbt Best Practices (estructura, Medallion, naming)', url: 'https://docs.getdbt.com/best-practices' },
      { label: 'dbt Source Freshness — validación de frescura', url: 'https://docs.getdbt.com/docs/build/sources#snapshotting-source-data-freshness' },
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
      { label: 'Fabric Private Links — seguridad para banca', url: 'https://learn.microsoft.com/es-es/fabric/security/security-private-links-overview' },
      { label: 'Fabric Git Integration (CI/CD nativo)', url: 'https://learn.microsoft.com/es-es/fabric/cicd/git-integration/intro-to-git-integration' },
      { label: 'Fabric Community — foro oficial', url: 'https://community.fabric.microsoft.com/' },
    ],
  },
  {
    categoria: '🚚 Migración On-Premise → Azure',
    items: [
      { label: 'ADF Self-Hosted IR — conectar on-prem con Azure', url: 'https://learn.microsoft.com/es-es/azure/data-factory/create-self-hosted-integration-runtime' },
      { label: 'Azure ExpressRoute — conexión privada dedicada', url: 'https://learn.microsoft.com/es-es/azure/expressroute/expressroute-introduction' },
      { label: 'Azure Database Migration Service', url: 'https://learn.microsoft.com/es-es/azure/dms/dms-overview' },
      { label: 'Debezium OSS — CDC desde Oracle, SQL Server, PostgreSQL', url: 'https://debezium.io/documentation/reference/stable/' },
      { label: 'Azure Key Vault — gestión de secrets y credenciales', url: 'https://learn.microsoft.com/es-es/azure/key-vault/general/overview' },
      { label: 'Microsoft Sentinel — SIEM cloud-native', url: 'https://learn.microsoft.com/es-es/azure/sentinel/overview' },
    ],
  },
  {
    categoria: '🏦 Banca & Regulatorio RD',
    items: [
      { label: 'Superintendencia de Bancos RD (SB) — ente supervisor', url: 'https://www.sb.gob.do/' },
      { label: 'Banco Central RD (BCRD) — encaje, tasas, política monetaria', url: 'https://www.bancentral.gov.do/' },
      { label: 'UAF — Unidad de Análisis Financiero RD (reportes AML)', url: 'https://www.uaf.gob.do/' },
      { label: 'Ley 155-17 — AML y Financiamiento del Terrorismo RD', url: 'https://www.uaf.gob.do/legislacion/leyes/' },
      { label: 'Ley 183-02 — Ley Monetaria y Financiera RD', url: 'https://www.sb.gob.do/index.php/marco-legal/leyes' },
      { label: 'Ley 172-13 — Protección de Datos Personales RD', url: 'https://indotel.gob.do/servicios/tic/proteccion-de-datos-personales/' },
      { label: 'DGII — Dirección General de Impuestos Internos (FATCA/CRS)', url: 'https://dgii.gov.do/' },
      { label: 'BIS — Marco Basilea III/IV (fuente oficial internacional)', url: 'https://www.bis.org/bcbs/basel3.htm' },
      { label: 'IFRS 9 — IASB (pérdida esperada, staging de créditos)', url: 'https://www.ifrs.org/issued-standards/list-of-standards/ifrs-9-financial-instruments/' },
      { label: 'FATF — Estándares AML internacionales', url: 'https://www.fatf-gafi.org/en/topics/fatf-recommendations.html' },
      { label: 'PCI DSS v4.0 — seguridad de datos de tarjetas', url: 'https://www.pcisecuritystandards.org/document_library/' },
      { label: 'Azure Compliance — Servicios Financieros', url: 'https://learn.microsoft.com/es-es/azure/compliance/offerings/offering-ffiec-us' },
    ],
  },
  {
    categoria: '🏗️ Fundamentos & Modelado',
    items: [
      { label: 'Data Mesh Principles — Martin Fowler', url: 'https://martinfowler.com/articles/data-mesh-principles.html' },
      { label: 'The Analytics Engineering Guide — dbt Labs', url: 'https://www.getdbt.com/analytics-engineering/' },
      { label: 'Kimball — SCD Techniques (referencia original)', url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/slowly-changing-dimensions/' },
      { label: 'Star Schema vs. Data Vault', url: 'https://www.databricks.com/glossary/data-vault' },
      { label: 'Monte Carlo — Qué es la observabilidad de datos', url: 'https://www.montecarlodata.com/blog-what-is-data-observability/' },
      { label: 'Great Expectations — validación de calidad OSS', url: 'https://docs.greatexpectations.io/' },
    ],
  },
]

// ── Componente principal ──────────────────────────────────────────────────────
export default function GlossaryView() {
  const [search, setSearch]           = useState('')
  const [section, setSection]         = useState('glosario')
  const [expandedScd, setExpandedScd] = useState(null)

  const filtered = useMemo(() => {
    // Debug: identificar entradas malformadas (quitar en producción)
    glossary.forEach((g, i) => {
      if (!g?.term || !g?.full || !g?.desc) {
        console.warn(`⚠️ Entrada malformada en glossary.js [índice ${i}]:`, g)
      }
    })
    return glossary.filter(g =>
      g?.term && g?.full && g?.desc && (
        g.term.toLowerCase().includes(search.toLowerCase()) ||
        g.full.toLowerCase().includes(search.toLowerCase()) ||
        g.desc.toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [search])

  const tabStyle = (id) => ({
    padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
    fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
    background: section === id ? '#1e3a5f' : '#f1f5f9',
    color: section === id ? '#fff' : '#475569',
  })

  const cardBase = {
    background: '#fff', borderRadius: 12, padding: '14px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1.5px solid #e2e8f0',
    transition: 'all 0.15s',
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e40af)',
        borderRadius: 16, padding: '20px 24px', marginBottom: 16, color: '#fff',
      }}>
        <div style={{ fontSize: 'clamp(17px,3vw,22px)', fontWeight: 900 }}>
          📖 Glosario · SCD · Recursos
        </div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
          Siglas bancarias y técnicas, tipos de dimensiones y referencias de aprendizaje del stack.
        </div>
        <div style={{ marginTop: 8, fontSize: 11, opacity: 0.65 }}>
          {glossary.length} términos (incluyendo regulatorio bancario) · 6 tipos SCD con código · 5 categorías de recursos
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        <button style={tabStyle('glosario')} onClick={() => setSection('glosario')}>
          📖 Glosario ({glossary.length})
        </button>
        <button style={tabStyle('scd')} onClick={() => setSection('scd')}>
          🔄 Tipos SCD
        </button>
        <button style={tabStyle('recursos')} onClick={() => setSection('recursos')}>
          🎓 Recursos
        </button>
      </div>

      {/* ══ GLOSARIO ══════════════════════════════════════════════════════════ */}
      {section === 'glosario' && (
        <>
          <div style={{ marginBottom: 14 }}>
            <input
              type="text"
              placeholder="🔍  Buscar término, sigla o descripción... (ej: IFRS, SCD, AML)"
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
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 5, paddingLeft: 2 }}>
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

      {/* ══ SCD ═══════════════════════════════════════════════════════════════ */}
      {section === 'scd' && (
        <div>
          {/* Banner intro */}
          <div style={{
            background: '#eff6ff', border: '1.5px solid #bfdbfe',
            borderRadius: 12, padding: '14px 18px', marginBottom: 14, fontSize: 13, color: '#1e40af', lineHeight: 1.7,
          }}>
            <strong>¿Qué es una SCD?</strong> Una <em>Slowly Changing Dimension</em> define cómo tu Data Warehouse maneja los cambios en las tablas dimensionales (clientes, productos, créditos).{' '}
            <strong>En banca es crítico</strong>: el staging IFRS 9 (Stage 1→2→3) de un crédito y el segmento de un cliente cambian con el tiempo y debes conservar ese historial para calcular provisiones regulatorias.
            <span style={{ display: 'block', marginTop: 6, color: '#2563eb', fontWeight: 600 }}>
              👇 Haz clic en cada tipo para ver el código dbt real.
            </span>
          </div>

          {/* Árbol de decisión */}
          <div style={{
            background: '#f8fafc', border: '1.5px solid #e2e8f0',
            borderRadius: 12, padding: '14px 18px', marginBottom: 14,
          }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', marginBottom: 8 }}>🌳 Árbol de decisión</div>
            <pre style={{ margin: 0, fontFamily: 'monospace', lineHeight: 1.9, fontSize: 11, color: '#1e293b', overflowX: 'auto' }}>
{`¿Necesitas historial?
  ├── NO  → SCD 1  (sobreescribir — más simple)
  └── SÍ → ¿El dato es inmutable por naturaleza?
              ├── SÍ → SCD 0  (fija — nunca cambia)
              └── NO → ¿Cuánto historial necesitas?
                         ├── Solo el valor anterior  → SCD 3
                         ├── Historial completo      → SCD 2  ⭐ estándar bancario
                         └── Dimensión enorme        → SCD 4  (tabla aparte)
                         └── Historial + valor actual en misma fila → SCD 6`}
            </pre>
          </div>

          {/* Cards SCD */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 10, marginBottom: 16 }}>
            {SCD_TYPES.map((scd, i) => (
              <div key={i}
                onClick={() => setExpandedScd(expandedScd === i ? null : i)}
                style={{
                  background: scd.bg, border: `2px solid ${expandedScd === i ? scd.color : scd.border}`,
                  borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s',
                  boxShadow: expandedScd === i ? `0 4px 16px ${scd.color}22` : '0 1px 4px rgba(0,0,0,0.06)',
                }}
                onMouseEnter={e => { if (expandedScd !== i) e.currentTarget.style.borderColor = scd.color }}
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
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>
                  <span style={{ fontWeight: 700 }}>Cuándo:</span> {scd.cuando}
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  <span style={{ fontWeight: 700 }}>Ej banca:</span> {scd.ejemplo}
                </div>
                <div style={{ fontSize: 10, color: scd.color, marginTop: 10, fontWeight: 700 }}>
                  {expandedScd === i ? '▲ Ocultar código' : '▼ Ver código dbt'}
                </div>
              </div>
            ))}
          </div>

          {/* Panel de código expandido */}
          {expandedScd !== null && (
            <div style={{
              background: '#0f172a', borderRadius: 14, padding: '20px 24px',
              marginBottom: 16, border: `2px solid ${SCD_TYPES[expandedScd].color}`,
            }}>
              <div style={{
                color: SCD_TYPES[expandedScd].color, fontWeight: 800,
                fontSize: 13, marginBottom: 12,
              }}>
                {SCD_TYPES[expandedScd].tipo} — {SCD_TYPES[expandedScd].nombre}
              </div>
              <pre style={{
                margin: 0, color: '#e2e8f0', fontSize: 11.5,
                lineHeight: 1.75, fontFamily: 'monospace', overflowX: 'auto',
              }}>
                {SCD_TYPES[expandedScd].codigo}
              </pre>
              <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
                <a href="https://docs.getdbt.com/docs/build/snapshots" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, color: '#7dd3fc', fontWeight: 600, textDecoration: 'none' }}>
                  📖 dbt Snapshots →
                </a>
                <a href="https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/slowly-changing-dimensions/" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, color: '#7dd3fc', fontWeight: 600, textDecoration: 'none' }}>
                  📖 Kimball — SCD Reference →
                </a>
              </div>
            </div>
          )}

          {/* Nota IFRS 9 */}
          <div style={{
            background: '#fefce8', border: '1.5px solid #fde047',
            borderRadius: 12, padding: '13px 16px', fontSize: 12, color: '#713f12', lineHeight: 1.7,
          }}>
            <strong>⚠️ SCD 2 e IFRS 9 en banca:</strong> El <em>staging</em> de un crédito (Stage 1 → Stage 2 → Stage 3)
            cambia a lo largo de su vida. Para calcular la Pérdida Esperada (ECL = PD × LGD × EAD) necesitas saber
            en qué Stage estaba el cliente <em>cuando ocurrió</em> cada transacción, no solo el Stage actual.
            Sin SCD 2, el cálculo regulatorio es incorrecto. dbt Snapshots resuelve esto automáticamente
            con columnas <code>valid_from</code> / <code>valid_to</code> / <code>is_current</code>.
          </div>
        </div>
      )}

      {/* ══ RECURSOS ══════════════════════════════════════════════════════════ */}
      {section === 'recursos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {RECURSOS.map((cat, ci) => (
            <div key={ci} style={{ ...cardBase }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', marginBottom: 10 }}>
                {cat.categoria}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
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