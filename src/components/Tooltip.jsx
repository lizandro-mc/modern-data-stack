import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

export default function Tooltip({ text, url, children }) {
  const { t } = useLanguage()
  const [show, setShow] = useState(false)

  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div style={{
          position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)',
          background: '#1e293b', color: '#fff', borderRadius: 8, padding: '8px 12px',
          fontSize: 11, width: 220, zIndex: 999, boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          pointerEvents: 'none', lineHeight: 1.5,
        }}>
          {text}
          {url && (
            <div style={{ marginTop: 4, color: '#93c5fd', fontSize: 10 }}>
              {t.tooltip.clickDocs}
            </div>
          )}
          <div style={{
            position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #1e293b',
          }} />
        </div>
      )}
    </span>
  )
}