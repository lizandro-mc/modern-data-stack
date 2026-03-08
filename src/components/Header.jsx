import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

function useIsMobile(bp = 600) {
  const [m, setM] = useState(() => window.innerWidth < bp)
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [bp])
  return m
}

export default function Header({ objOpen, setObjOpen, objectives }) {
  const isMobile = useIsMobile()
  const { t, lang } = useLanguage()

  return (
    <div
      data-print="header"
      style={{
        background: 'linear-gradient(135deg, #1e3a5f, #0ea5e9)',
        borderRadius: 16, padding: '20px 24px', marginBottom: 14, color: '#fff',
      }}
    >
      <div style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 900, letterSpacing: -0.5 }}>
        {t.header.title}
      </div>
      <div style={{ fontSize: 'clamp(11px, 2vw, 13px)', opacity: 0.85, marginTop: 4 }}>
        {t.header.subtitle}
      </div>

      {/* Grid de objetivos */}
      {objOpen && (
        <div
          data-print="objectives-grid"
          style={{
            marginTop: 14,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 8,
          }}
        >
          {objectives.map(o => {
            // Soporte bilingüe: si el objetivo tiene label_en/desc_en usa esos, si no cae al español
            const label = (lang === 'en' && o.label_en) ? o.label_en : o.label
            const desc  = (lang === 'en' && o.desc_en)  ? o.desc_en  : o.desc

            return (
              <div
                key={o.label}
                style={{
                  background: 'rgba(255,255,255,0.12)', borderRadius: 8,
                  padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 2,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700 }}>{o.icon} {label}</div>
                <div style={{ fontSize: 11, opacity: 0.82 }}>{desc}</div>
                {o.url && (
                  <a
                    href={o.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 10, color: '#bae6fd', marginTop: 4, textDecoration: 'none', fontWeight: 600, wordBreak: 'break-all' }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                  >
                    📖 {o.url.replace('https://', '')}
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Botón toggle */}
      <button
        className="print-hide"
        onClick={() => setObjOpen(!objOpen)}
        style={{
          marginTop: 12, background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.35)', color: '#fff',
          borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600,
        }}
      >
        {objOpen ? t.header.hideObj : t.header.showObj}
      </button>
    </div>
  )
}