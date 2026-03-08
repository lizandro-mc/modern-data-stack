import { colors } from '../data/blockData'

export default function ProtagonistsNav({ onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
      {/* dbt */}
      <div
        onClick={() => onSelect('DBT')}
        style={{
          background: `linear-gradient(135deg, ${colors.dbt.bg}, #fffbeb)`,
          border: `2px solid ${colors.dbt.border}`,
          borderRadius: 14, padding: '18px 20px', cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = `0 6px 24px ${colors.dbt.border}44`}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ fontSize: 28 }}>🟡</div>
        <div style={{ fontWeight: 900, fontSize: 18, color: colors.dbt.text, marginTop: 8 }}>dbt</div>
        <div style={{ fontSize: 12, color: '#92400e', marginTop: 4, lineHeight: 1.5 }}>
          Data Build Tool · SQL como Código · Tests · Linaje · Gobernanza · Métricas · Portabilidad
        </div>
        <div style={{
          marginTop: 12, display: 'inline-block',
          background: colors.dbt.border, color: '#fff',
          borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700,
        }}>Ver detalle →</div>
      </div>

      {/* Fabric */}
      <div
        onClick={() => onSelect('FABRIC')}
        style={{
          background: `linear-gradient(135deg, ${colors.fabric.bg}, #f5f3ff)`,
          border: `2px solid ${colors.fabric.border}`,
          borderRadius: 14, padding: '18px 20px', cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = `0 6px 24px ${colors.fabric.border}44`}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ fontSize: 28 }}>🟣</div>
        <div style={{ fontWeight: 900, fontSize: 18, color: colors.fabric.text, marginTop: 8 }}>Microsoft Fabric</div>
        <div style={{ fontSize: 12, color: '#4c1d95', marginTop: 4, lineHeight: 1.5 }}>
          OneLake · One Security · One Governance · DirectLake · F-SKUs · Zero-copy · dbt Integration
        </div>
        <div style={{
          marginTop: 12, display: 'inline-block',
          background: colors.fabric.border, color: '#fff',
          borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700,
        }}>Ver detalle →</div>
      </div>
    </div>
  )
}