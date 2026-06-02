import { useEffect, useRef } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { Scene3D } from '../components/configurator/Scene3D'
import { ControlPanel } from '../components/configurator/ControlPanel'
import { PriceSummary } from '../components/configurator/PriceSummary'
import { useConfiguratorStore } from '../lib/configurator-store'
import { TIPO_LABELS } from '../lib/pricing'
import type { Tipo } from '../lib/pricing'

const VALID_TIPOS: Tipo[] = ['nave', 'cobertizo', 'pergola', 'modulo']

export function ConfiguradorTipoPage() {
  const { tipo: tipoParam } = useParams({ from: '/configurador/$tipo' })
  const { tipo: storedTipo, setTipo, config } = useConfiguratorStore()
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  const tipo = VALID_TIPOS.includes(tipoParam as Tipo) ? (tipoParam as Tipo) : null

  useEffect(() => {
    if (tipo && tipo !== storedTipo) {
      setTipo(tipo)
    }
  }, [tipo, storedTipo, setTipo])

  if (!tipo) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-light)', marginBottom: 16 }}>Tipología no válida.</p>
          <Link to="/configurador" className="btn btn-outline">Volver</Link>
        </div>
      </div>
    )
  }

  const activeTipo = storedTipo || tipo

  return (
    <div className="configurador-layout">
      {/* Top bar */}
      <div className="conf-topbar">
        <div className="conf-breadcrumb">
          <Link to="/configurador" style={{ color: 'var(--gray-light)', fontSize: 13 }}>Configurador</Link>
          <span style={{ color: 'var(--gray)', fontSize: 13 }}>›</span>
          <span style={{ color: 'var(--beige)', fontSize: 13, fontWeight: 600 }}>
            {TIPO_LABELS[tipo]}
          </span>
        </div>

        <div className="conf-tipo-tabs">
          {(['nave', 'cobertizo', 'pergola', 'modulo'] as Tipo[]).map((t) => (
            <Link
              key={t}
              to="/configurador/$tipo"
              params={{ tipo: t }}
              className={`tipo-tab ${t === tipo ? 'active' : ''}`}
            >
              {TIPO_LABELS[t]}
            </Link>
          ))}
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="conf-body">
        {/* Left: Controls */}
        <aside className="conf-panel-left">
          <ControlPanel tipo={activeTipo} />
        </aside>

        {/* Center: 3D scene */}
        <main className="conf-scene">
          <Scene3D tipo={activeTipo} config={config} canvasRef={canvasRef} />
        </main>

        {/* Right: Price */}
        <aside className="conf-panel-right">
          <PriceSummary tipo={activeTipo} canvasRef={canvasRef} />
        </aside>
      </div>

      <style>{`
        .configurador-layout {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding-top: 64px;
          overflow: hidden;
        }
        .conf-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 48px;
          border-bottom: 1px solid rgba(232,220,196,0.08);
          background: var(--black-soft);
          flex-shrink: 0;
        }
        .conf-breadcrumb { display: flex; align-items: center; gap: 8px; }
        .conf-tipo-tabs { display: flex; gap: 4px; }
        .tipo-tab {
          padding: 5px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          color: var(--gray-light);
          transition: all var(--transition);
        }
        .tipo-tab:hover { color: var(--beige); }
        .tipo-tab.active {
          background: rgba(232,220,196,0.1);
          color: var(--beige);
          font-weight: 600;
        }
        .conf-body {
          display: grid;
          grid-template-columns: 280px 1fr 260px;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }
        .conf-panel-left {
          border-right: 1px solid rgba(232,220,196,0.08);
          overflow-y: auto;
          background: var(--black-soft);
        }
        .conf-scene {
          background: #0d0d0d;
        }
        .conf-panel-right {
          overflow-y: auto;
        }
        @media (max-width: 1024px) {
          .configurador-layout { height: auto; overflow: visible; }
          .conf-body { grid-template-columns: 1fr; }
          .conf-scene { height: 50vh; }
          .conf-tipo-tabs { display: none; }
        }
      `}</style>
    </div>
  )
}
