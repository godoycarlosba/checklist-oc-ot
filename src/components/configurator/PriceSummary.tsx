import { useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useConfiguratorStore } from '../../lib/configurator-store'
import { priceBreakdown, TIPO_LABELS } from '../../lib/pricing'
import type { Tipo } from '../../lib/pricing'

interface Props {
  tipo: Tipo
  canvasRef?: React.RefObject<HTMLCanvasElement>
}

export function PriceSummary({ tipo, canvasRef }: Props) {
  const { config, estimatedPrice } = useConfiguratorStore()
  const navigate = useNavigate()
  const breakdown = priceBreakdown(tipo, config)
  const sup = config.largo * config.ancho

  const handleCotizar = () => {
    if (canvasRef?.current) {
      try {
        const screenshot = canvasRef.current.toDataURL('image/jpeg', 0.85)
        localStorage.setItem('mecan-screenshot', screenshot)
      } catch {}
    }
    navigate({ to: '/cotizacion' })
  }

  return (
    <div className="price-summary">
      <div className="price-header">
        <span className="price-label">Precio estimado</span>
        <div className="price-main">
          <span className="price-currency">USD</span>
          <span className="price-amount">{estimatedPrice.toLocaleString('es-AR')}</span>
        </div>
        <span className="price-sub">
          {sup.toFixed(0)} m² — {TIPO_LABELS[tipo]}
        </span>
      </div>

      <div className="divider" />

      <div className="price-breakdown">
        {breakdown.map((item) => (
          <div key={item.label} className="breakdown-row">
            <span className="breakdown-label">{item.label}</span>
            <span className="breakdown-value">USD {item.value.toLocaleString('es-AR')}</span>
          </div>
        ))}
      </div>

      <p className="price-note">
        * Precio orientativo. El presupuesto final puede variar según condiciones del terreno, transporte y personalización adicional.
      </p>

      <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCotizar}>
        Solicitar cotización
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="price-trust">
        <div className="trust-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13 4L6 11l-3-3" stroke="var(--warm)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sin cargo por cotizar
        </div>
        <div className="trust-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13 4L6 11l-3-3" stroke="var(--warm)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Respuesta en 24hs
        </div>
        <div className="trust-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13 4L6 11l-3-3" stroke="var(--warm)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sin compromiso
        </div>
      </div>

      <style>{`
        .price-summary {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: var(--black-mid);
          border-left: 1px solid rgba(232,220,196,0.08);
          height: 100%;
          overflow-y: auto;
        }
        .price-header { display: flex; flex-direction: column; gap: 4px; }
        .price-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gray-light);
        }
        .price-main { display: flex; align-items: baseline; gap: 6px; }
        .price-currency {
          font-size: 16px;
          font-weight: 600;
          color: var(--warm);
        }
        .price-amount {
          font-family: var(--font-display);
          font-size: 40px;
          color: var(--beige);
          line-height: 1;
        }
        .price-sub {
          font-size: 12px;
          color: var(--gray-light);
        }
        .price-breakdown { display: flex; flex-direction: column; gap: 10px; }
        .breakdown-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .breakdown-label { font-size: 13px; color: var(--gray-light); }
        .breakdown-value { font-size: 13px; font-weight: 600; color: var(--beige); }
        .price-note {
          font-size: 11px;
          color: var(--gray);
          line-height: 1.5;
          font-style: italic;
        }
        .price-trust { display: flex; flex-direction: column; gap: 8px; }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--gray-light);
        }
      `}</style>
    </div>
  )
}
