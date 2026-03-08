import { useState } from 'react'
import { partsConfig, TOTAL_DIAS } from './data/partsConfig'
import { objectives } from './data/objectives'
import { blockData } from './data/blockData'
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

const TOP_TABS = [
  { id: 'stack',    label: '🏗️ Stack' },
  { id: 'dbt',      label: '🟡 dbt' },
  { id: 'fabric',   label: '🟣 Fabric' },
  { id: 'roadmap',  label: '📅 Roadmap' },
  { id: 'glossary', label: '📖 Glosario' },
]

export default function App() {
  const [topTab, setTopTab]           = useState('stack')
  const [activePart, setActivePart]   = useState('overview')
  const [activeBlock, setActiveBlock] = useState(null)
  const [objOpen, setObjOpen]         = useState(true)

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

        {/* ── Tabs principales — ocultos en print ── */}
        {!activeBlock && (
          <div className="print-hide" style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            {TOP_TABS.map(t => (
              <button key={t.id} onClick={() => handleTabChange(t.id)}
                style={{
                  padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 700,
                  background: topTab === t.id ? '#1e3a5f' : '#fff',
                  color: topTab === t.id ? '#fff' : '#374151',
                  boxShadow: topTab === t.id
                    ? '0 2px 10px rgba(0,0,0,0.18)'
                    : '0 1px 3px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s',
                }}
              >{t.label}</button>
            ))}
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

        <div className="print-hide" style={{ textAlign: 'center', fontSize: 10, color: '#94a3b8', marginTop: 24, paddingBottom: 8 }}>
          Modern Data Stack · Azure DaaP · {new Date().getFullYear()}
        </div>

        {/* Pie de página solo en print */}
        <div style={{ display: 'none' }} data-print="footer">
          Modern Data Stack · Azure DaaP · {new Date().getFullYear()}
        </div>

      </div>

      <PrintButton />
    </div>
  )
}