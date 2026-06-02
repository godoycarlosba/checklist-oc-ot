import { Link } from '@tanstack/react-router'

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-content container">
        <div className="hero-badge badge badge-beige animate-fade-up">
          Configurador 3D interactivo
        </div>

        <h1 className="hero-title animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Diseñá tu<br />
          <span className="hero-title-accent">estructura</span><br />
          en minutos.
        </h1>

        <p className="hero-subtitle animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Naves industriales, cobertizos, pérgolas y módulos habitacionales.
          Configurá en 3D, obtené el precio estimado y solicitá tu cotización.
        </p>

        <div className="hero-actions animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Link to="/configurador" className="btn btn-primary btn-lg">
            Empezar a configurar
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link to="/contacto" className="btn btn-outline btn-lg">
            Hablar con un asesor
          </Link>
        </div>

        <div className="hero-stats animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="stat">
            <span className="stat-number">4</span>
            <span className="stat-label">Tipologías</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">+15</span>
            <span className="stat-label">Parámetros</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">3D</span>
            <span className="stat-label">Visualización</span>
          </div>
        </div>
      </div>

      <div className="hero-bg">
        <div className="hero-grid" />
        <div className="hero-glow" />
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          padding-top: 100px;
          padding-bottom: 80px;
          max-width: 720px;
        }
        .hero-badge {
          margin-bottom: 24px;
        }
        .hero-title {
          font-size: clamp(52px, 8vw, 96px);
          line-height: 0.95;
          color: var(--beige);
          margin-bottom: 24px;
        }
        .hero-title-accent {
          color: var(--warm);
          -webkit-text-stroke: 0;
        }
        .hero-subtitle {
          font-size: 18px;
          color: var(--gray-light);
          max-width: 480px;
          margin-bottom: 40px;
          line-height: 1.7;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 64px;
        }
        .hero-stats {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-number {
          font-family: var(--font-display);
          font-size: 32px;
          color: var(--beige);
        }
        .stat-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gray);
        }
        .stat-divider {
          width: 1px;
          height: 36px;
          background: rgba(232,220,196,0.15);
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(232,220,196,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,220,196,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }
        .hero-glow {
          position: absolute;
          top: 20%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(200,148,74,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .hero-content { padding-top: 80px; }
          .hero-actions { flex-direction: column; }
          .hero-actions .btn { width: 100%; }
        }
      `}</style>
    </section>
  )
}
