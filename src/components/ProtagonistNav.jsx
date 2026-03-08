import { colors } from '../data/blockData'
import { useLanguage } from '../i18n/LanguageContext'

export default function ProtagonistsNav({ onSelect }) {
  const { t } = useLanguage()
  const tp = t.protagonistNav

  const cards = [
    {
      key: 'DBT', emoji: '🟡',
      title: 'dbt',
      desc: tp.dbtDesc,
      color: colors.dbt,
    },
    {
      key: 'FABRIC', emoji: '🟣',
      title: 'Microsoft Fabric',
      desc: tp.fabricDesc,
      color: colors.fabric,
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
      {cards.map(({ key, emoji, title, desc, color }) => (
        <div
          key={key}
          onClick={() => onSelect(key)}
          style={{
            background: `linear-gradient(135deg, ${color.bg}, ${key === 'DBT' ? '#fffbeb' : '#f5f3ff'})`,
            border: `2px solid ${color.border}`,
            borderRadius: 14, padding: '18px 20px', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = `0 6px 24px ${color.border}44`}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
          <div style={{ fontSize: 28 }}>{emoji}</div>
          <div style={{ fontWeight: 900, fontSize: 18, color: color.text, marginTop: 8 }}>{title}</div>
          <div style={{ fontSize: 12, color: color.text, opacity: 0.75, marginTop: 4, lineHeight: 1.5 }}>
            {desc}
          </div>
          <div style={{
            marginTop: 12, display: 'inline-block',
            background: color.border, color: '#fff',
            borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700,
          }}>
            {tp.viewDetail}
          </div>
        </div>
      ))}
    </div>
  )
}