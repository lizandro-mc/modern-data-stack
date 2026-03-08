export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print-hide"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 999,
        background: '#1e3a5f',
        color: '#fff',
        border: 'none',
        borderRadius: 50,
        width: 52,
        height: 52,
        fontSize: 20,
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#0ea5e9'}
      onMouseLeave={e => e.currentTarget.style.background = '#1e3a5f'}
      title="Imprimir / Guardar como PDF"
    >
      🖨️
    </button>
  )
}