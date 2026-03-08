import { createContext, useContext } from 'react'
import { translations } from './translations.js'

const LanguageContext = createContext(null)

export function LanguageProvider({ children, initialLang = 'es' }) {
  const t = translations[initialLang]

  return (
    <LanguageContext.Provider value={{ lang: initialLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook de uso en cualquier componente:
// const { lang, t } = useLanguage()
// t.header.title  →  cadena en el idioma activo
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}