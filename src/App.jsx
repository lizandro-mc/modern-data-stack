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

export default function App() {
  const [activePart, setActivePart] = useState('overview')
  const [activeBlock, setActiveBlock] = useState(null)
  const [objOpen, setObjOpen] = useState(false)

  const part = partsConfig.find(p => p.id === activePart)

  const handleBlockClick = (name) => {
    if (blockData[name]) setActiveBlock(name)
  }

  return (
    /* Fondo gris full-screen */
    <div style={{
      background: '#e2e8f0',
      minHeight: '100vh',
      padding: '32px 16px',
    }}>
      {/* Contenedor centrado tipo documento */}
      <div style={{
        maxWidth: 960,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>
        <Header
          objOpen={objOpen}
          setObjOpen={setObjOpen}
          objectives={objectives}
        />

        {!activeBlock && (
          <NavParts
            parts={partsConfig}
            activePart={activePart}
            setActivePart={setActivePart}
          />
        )}

        {activeBlock ? (
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
          }}>
            <BlockDetail
              name={activeBlock}
              onBack={() => setActiveBlock(null)}
            />
          </div>
        ) : (
          <>
            {activePart !== 'overview' && (
              <ProgressCard
                part={part}
                totalDias={TOTAL_DIAS}
                partsConfig={partsConfig}
              />
            )}

            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 20,
              boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
              marginBottom: 14,
            }}>
              <DiagramPart
                activeBlocks={part.activeBlocks}
                onBlockClick={handleBlockClick}
              />
            </div>

            <ToolsGrid activeBlocks={part.activeBlocks} />
          </>
        )}

        <div style={{
          textAlign: 'center',
          fontSize: 11,
          color: '#94a3b8',
          marginTop: 24,
          paddingBottom: 8,
        }}>
          Modern Data Stack · Arquitectura Azure DaaP · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  )
}