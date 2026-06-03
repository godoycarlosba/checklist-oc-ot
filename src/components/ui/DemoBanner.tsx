import { useState, useEffect } from 'react'
import { isDemoMode, onDemoModeChange } from '../../lib/api'

export function DemoBanner() {
  const [demo, setDemo] = useState(isDemoMode())
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const unsub = onDemoModeChange(setDemo)
    return unsub
  }, [])

  if (!demo || dismissed) return null

  return (
    <div className="demo-banner">
      <span className="demo-icon">🧪</span>
      <span className="demo-text">
        <strong>Modo demo</strong> — sin servidor. Las cotizaciones se guardan localmente en tu navegador.
        Para producción, configurá{' '}
        <a
          href="https://supabase.com"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline' }}
        >
          Supabase
        </a>{' '}
        y{' '}
        <a
          href="https://resend.com"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline' }}
        >
          Resend
        </a>
        {' '}en el <code>.env</code>.
      </span>
      <button
        className="demo-dismiss"
        onClick={() => setDismissed(true)}
        aria-label="Cerrar"
      >
        ×
      </button>

      <style>{`
        .demo-banner {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #1a1400;
          border: 1px solid rgba(200,148,74,0.4);
          border-radius: 100px;
          padding: 10px 20px 10px 16px;
          max-width: 90vw;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          animation: slideUp 0.4s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .demo-icon { font-size: 16px; flex-shrink: 0; }
        .demo-text {
          font-size: 13px;
          color: #c8944a;
          line-height: 1.4;
          white-space: nowrap;
        }
        .demo-text code {
          background: rgba(200,148,74,0.15);
          padding: 1px 5px;
          border-radius: 3px;
          font-size: 12px;
        }
        .demo-dismiss {
          background: none;
          border: none;
          color: #c8944a;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
          padding: 0 0 0 4px;
          opacity: 0.7;
          flex-shrink: 0;
        }
        .demo-dismiss:hover { opacity: 1; }
        @media (max-width: 640px) {
          .demo-banner { border-radius: 12px; white-space: normal; }
          .demo-text { white-space: normal; }
        }
      `}</style>
    </div>
  )
}
