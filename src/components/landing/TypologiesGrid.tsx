import { Link } from '@tanstack/react-router'
import type { Tipo } from '../../lib/pricing'

const TIPOLOGIAS: {
  tipo: Tipo
  label: string
  desc: string
  desde: string
  params: string[]
  icon: string
}[] = [
  {
    tipo: 'nave',
    label: 'Nave Industrial',
    desc: 'Estructuras de gran envergadura para producción, logística o almacenamiento.',
    desde: 'USD 185/m²',
    params: ['Largo, ancho y alto', 'Techo 1 o 2 aguas', 'Puertas seccionales', 'Chapa simple o sándwich'],
    icon: '🏭',
  },
  {
    tipo: 'cobertizo',
    label: 'Cobertizo / Garaje',
    desc: 'Estructuras compactas para vehículos, equipos o espacios de trabajo al aire libre.',
    desde: 'USD 125/m²',
    params: ['Dimensiones flexibles', 'Laterales abiertos/cerrados', 'Puerta levadiza o corredera', 'Techo 1 agua'],
    icon: '🏗️',
  },
  {
    tipo: 'pergola',
    label: 'Pérgola',
    desc: 'Estructuras livianas y elegantes para espacios exteriores residenciales o comerciales.',
    desde: 'USD 98/m²',
    params: ['Marco metálico', 'Cubierta de policarbonato', 'Cerramientos laterales', 'Diseño personalizable'],
    icon: '⛩️',
  },
  {
    tipo: 'modulo',
    label: 'Módulo Habitacional',
    desc: 'Unidades modulares prefabricadas listas para habitar. Oficinas, viviendas o depósitos.',
    desde: 'USD 260/m²',
    params: ['Aislamiento térmico', 'Instalación eléctrica', 'Puertas y ventanas', 'Revestimiento interior'],
    icon: '🏠',
  },
]

export function TypologiesGrid() {
  return (
    <section className="typologies">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-beige">Tipologías</span>
          <h2 className="section-title">
            Cuatro estructuras.<br />
            <span style={{ color: 'var(--warm)' }}>Infinitas combinaciones.</span>
          </h2>
          <p className="section-subtitle">
            Seleccioná la tipología que mejor se adapta a tu proyecto
            y configurá cada detalle en tiempo real.
          </p>
        </div>

        <div className="typo-grid">
          {TIPOLOGIAS.map((t, i) => (
            <Link
              to="/configurador/$tipo"
              params={{ tipo: t.tipo }}
              key={t.tipo}
              className="typo-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="typo-icon">{t.icon}</div>
              <div className="typo-desde">{t.desde}</div>
              <h3 className="typo-name">{t.label}</h3>
              <p className="typo-desc">{t.desc}</p>
              <ul className="typo-params">
                {t.params.map((p) => (
                  <li key={p}>
                    <span className="param-dot" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="typo-cta">
                Configurar
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .typologies {
          padding: 120px 0;
        }
        .section-header {
          text-align: center;
          margin-bottom: 64px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .section-title {
          font-size: clamp(36px, 5vw, 60px);
          color: var(--beige);
          line-height: 1.05;
        }
        .section-subtitle {
          font-size: 17px;
          color: var(--gray-light);
          max-width: 480px;
          line-height: 1.7;
        }
        .typo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .typo-card {
          background: var(--black-soft);
          border: 1px solid rgba(232,220,196,0.08);
          border-radius: var(--radius-lg);
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all 300ms ease;
          animation: fadeUp 0.5s ease both;
        }
        .typo-card:hover {
          border-color: rgba(232,220,196,0.25);
          background: var(--black-mid);
          transform: translateY(-4px);
        }
        .typo-icon { font-size: 32px; }
        .typo-desde {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--warm);
        }
        .typo-name {
          font-size: 22px;
          color: var(--beige);
          margin-top: 4px;
        }
        .typo-desc {
          font-size: 14px;
          color: var(--gray-light);
          line-height: 1.6;
        }
        .typo-params {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 4px;
          flex: 1;
        }
        .typo-params li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--gray-light);
        }
        .param-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--warm);
          flex-shrink: 0;
        }
        .typo-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--beige);
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(232,220,196,0.08);
          transition: gap var(--transition);
        }
        .typo-card:hover .typo-cta { gap: 10px; }
        @media (max-width: 768px) {
          .typologies { padding: 60px 0; }
          .typo-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
