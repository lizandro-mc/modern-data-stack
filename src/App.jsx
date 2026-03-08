import { useState } from 'react'
import { partsConfig, TOTAL_DIAS } from './data/partsConfig'
import { objectives } from './data/objectives'
import { blockData } from './data/blockData'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import Header from './components/Header'
import NavParts from './components/NavParts'
import DiagramPart from './components/DiagramPart'
import BlockDetail from './components/BlockDetail'
import ProgressCard from './components/ProgressCard'
import ToolsGrid from './components/ToolsGrid'
import ProtagonistDetail from './components/ProtagonistDetail'
import RoadmapView from './components/RoadmapView'
import GlossaryView from './components/GlossaryView'
import PrintButton from './components/PrintButton'
import './print.css'

// ── Lee el idioma desde ?lang=es|en  (default: 'es') ─────────────────────────
function getLangFromURL() {
  const param = new URLSearchParams(window.location.search).get('lang')
  return param === 'en' ? 'en' : 'es'
}

// ── Navega a la misma página cambiando solo el query param ────────────────────
function switchLang(newLang) {
  const url = new URL(window.location.href)
  url.searchParams.set('lang', newLang)
  window.location.href = url.toString()
}

// ── Inner app (necesita acceso al contexto de idioma) ─────────────────────────
function AppInner() {
  const { t, lang } = useLanguage()

  const TOP_TABS = [
    { id: 'stack',    label: t.tabs.stack    },
    { id: 'dbt',      label: t.tabs.dbt      },
    { id: 'fabric',   label: t.tabs.fabric   },
    { id: 'roadmap',  label: t.tabs.roadmap  },
    { id: 'glossary', label: t.tabs.glossary },
  ]

  const [topTab, setTopTab]         = useState('stack')
  const [activePart, setActivePart] = useState('overview')
  const [activeBlock, setActiveBlock] = useState(null)
  const [objOpen, setObjOpen]       = useState(true)

  const part = partsConfig.find(p => p.id === activePart)

  const handleBlockClick = (name) => {
    if (blockData[name]) setActiveBlock(name)
  }

  const handleTabChange = (id) => {
    setTopTab(id)
    setActiveBlock(null)
  }

  return (
    <div style={{ background: '#e2e8f0', minHeight: '100vh', padding: '28px 16px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

        <Header objOpen={objOpen} setObjOpen={setObjOpen} objectives={objectives} />

        {/* ── Tabs principales + selector de idioma ── */}
        {!activeBlock && (
          <div className="print-hide" style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            {TOP_TABS.map(tab => (
              <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                style={{
                  padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 700,
                  background: topTab === tab.id ? '#1e3a5f' : '#fff',
                  color: topTab === tab.id ? '#fff' : '#374151',
                  boxShadow: topTab === tab.id
                    ? '0 2px 10px rgba(0,0,0,0.18)'
                    : '0 1px 3px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s',
                }}
              >{tab.label}</button>
            ))}

            {/* ── Selector de idioma por URL ── */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              {['es', 'en'].map(l => (
                <a
                  key={l}
                  href={(() => { const u = new URL(window.location.href); u.searchParams.set('lang', l); return u.toString() })()}
                  style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                    textDecoration: 'none',
                    background: lang === l ? '#1e3a5f' : '#fff',
                    color: lang === l ? '#fff' : '#374151',
                    boxShadow: lang === l
                      ? '0 2px 10px rgba(0,0,0,0.18)'
                      : '0 1px 3px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s',
                  }}
                >
                  {l.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: STACK ── */}
        {topTab === 'stack' && (
          activeBlock ? (
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
              <BlockDetail name={activeBlock} onBack={() => setActiveBlock(null)} />
            </div>
          ) : (
            <>
              <NavParts parts={partsConfig} activePart={activePart} setActivePart={setActivePart} />
              {activePart !== 'overview' && (
                <ProgressCard part={part} totalDias={TOTAL_DIAS} partsConfig={partsConfig} />
              )}
              <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', marginBottom: 14 }}>
                <DiagramPart activeBlocks={part.activeBlocks} onBlockClick={handleBlockClick} />
              </div>
              <ToolsGrid activeBlocks={part.activeBlocks} />
            </>
          )
        )}

        {/* ── TAB: DBT ── */}
        {topTab === 'dbt' && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
            <ProtagonistDetail name="DBT" onBack={() => handleTabChange('stack')} />
          </div>
        )}

        {/* ── TAB: FABRIC ── */}
        {topTab === 'fabric' && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
            <ProtagonistDetail name="FABRIC" onBack={() => handleTabChange('stack')} />
          </div>
        )}

        {/* ── TAB: ROADMAP ── */}
        {topTab === 'roadmap' && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
            <RoadmapView />
          </div>
        )}

        {/* ── TAB: GLOSARIO ── */}
        {topTab === 'glossary' && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
            <GlossaryView />
          </div>
        )}

        {/* Pie de página */}
        <div className="print-hide" style={{ textAlign: 'center', fontSize: 10, color: '#94a3b8', marginTop: 24, paddingBottom: 8 }}>
          {t.footer(new Date().getFullYear())}
        </div>
      </div>

      <PrintButton />
    </div>
  )
}

// ── Root: pasa el idioma leído de la URL al provider ─────────────────────────
export default function App() {
  return (
    <LanguageProvider initialLang={getLangFromURL()}>
      <AppInner />
    </LanguageProvider>
  )
}