import { useLanguage } from '../i18n/LanguageContext'

export default function NavParts({ parts, activePart, setActivePart }) {
  const { t } = useLanguage()

  return (
    <div className="print-hide" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
      {parts.map(p => (
        <button
          key={p.id}
          onClick={() => setActivePart(p.id)}
          style={{
            padding: '7px 14px', borderRadius: 9, border: 'none', cursor: 'pointer',
            fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 700,
            background: activePart === p.id ? p.color : '#fff',
            color: activePart === p.id ? '#fff' : '#374151',
            boxShadow: activePart === p.id
              ? '0 2px 8px rgba(0,0,0,0.18)'
              : '0 1px 3px rgba(0,0,0,0.08)',
            transition: 'all 0.2s', whiteSpace: 'nowrap',
          }}
        >
          {/* t.parts[p.id] con fallback al label original */}
          {t.parts[p.id] || p.label}
        </button>
      ))}
    </div>
  )
}