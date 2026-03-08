import { useLanguage } from '../i18n/LanguageContext'

export default function LanguageToggle() {
  const { lang, toggle } = useLanguage()

  return (
    <button
      onClick={toggle}
      className="print-hide"
      title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      style={{
        position: 'fixed',
        bottom: 84,          // encima del botón de print
        right: 24,
        zIndex: 999,
        background: '#fff',
        color: '#1e3a5f',
        border: '2px solid #1e3a5f',
        borderRadius: 50,
        width: 52,
        height: 52,
        fontSize: 13,
        fontWeight: 900,
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: 0.5,
        transition: 'all 0.2s',
        lineHeight: 1,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#1e3a5f'
        e.currentTarget.style.color = '#fff'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#fff'
        e.currentTarget.style.color = '#1e3a5f'
      }}
    >
      {lang === 'es' ? 'EN' : 'ES'}
    </button>
  )
}