import { Link } from '@tanstack/react-router'
import type { Tipo } from '../lib/pricing'
import { TIPO_LABELS } from '../lib/pricing'
import { useConfiguratorStore } from '../lib/configurator-store'

const TIPOS: { tipo: Tipo; icon: string; desc: string }[] = [
  { tipo: 'nave', icon: '🏭', desc: 'Producción, logística y almacenamiento' },
  { tipo: 'cobertizo', icon: '🏗️', desc: 'Vehículos, equipos y espacios de trabajo' },
  { tipo: 'pergola', icon: '⛩️', desc: 'Espacios exteriores residenciales o comerciales' },
  { tipo: 'modulo', icon: '🏠', desc: 'Unidades habitables prefabricadas' },
]

export function ConfiguradorPage() {
  const { tipo: currentTipo } = useConfiguratorStore()

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: 800, padding: '60px 24px', textAlign: 'center' }}>
        <span className="badge badge-beige" style={{ marginBottom: 24, display: 'inline-flex' }}>
          Paso 1 de 2
        </span>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: 'var(--beige)', marginBottom: 16 }}>
          ¿Qué estructura<br />
          <span style={{ color: 'var(--warm)' }}>querés configurar?</span>
        </h1>
        <p style={{ color: 'var(--gray-light)', fontSize: 17, marginBottom: 48, lineHeight: 1.6 }}>
          Seleccioná la tipología. Luego ajustás dimensiones, materiales y accesorios en 3D.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16 }}>
          {TIPOS.map((t) => (
            <Link
              key={t.tipo}
              to="/configurador/$tipo"
              params={{ tipo: t.tipo }}
              className="typo-select-card"
              style={currentTipo === t.tipo ? { borderColor: 'var(--beige)', background: 'var(--black-mid)' } : {}}
            >
              <span style={{ fontSize: 40 }}>{t.icon}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--beige)' }}>
                {TIPO_LABELS[t.tipo]}
              </span>
              <span style={{ fontSize: 12, color: 'var(--gray-light)', lineHeight: 1.5 }}>
                {t.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .typo-select-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 32px 20px;
          background: var(--black-soft);
          border: 1px solid rgba(232,220,196,0.1);
          border-radius: var(--radius-lg);
          text-align: center;
          transition: all 250ms ease;
        }
        .typo-select-card:hover {
          border-color: rgba(232,220,196,0.35);
          background: var(--black-mid);
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  )
}
