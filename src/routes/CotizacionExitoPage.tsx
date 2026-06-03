import { Link } from '@tanstack/react-router'
import { useConfiguratorStore } from '../lib/configurator-store'
import { TIPO_LABELS } from '../lib/pricing'

export function CotizacionExitoPage() {
  const { tipo, estimatedPrice, reset } = useConfiguratorStore()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: 80,
      padding: '80px 24px',
    }}>
      <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{
          width: 80, height: 80,
          borderRadius: '50%',
          background: 'rgba(200,148,74,0.15)',
          border: '2px solid var(--warm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36,
        }}>
          ✓
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 52px)', color: 'var(--beige)', lineHeight: 1.05 }}>
            Cotización<br />
            <span style={{ color: 'var(--warm)' }}>enviada.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--gray-light)', lineHeight: 1.7 }}>
            Recibimos tu solicitud para{' '}
            {tipo ? (
              <strong style={{ color: 'var(--beige)' }}>{TIPO_LABELS[tipo]}</strong>
            ) : 'tu estructura'}
            {estimatedPrice > 0 && (
              <> — estimado <strong style={{ color: 'var(--beige)' }}>USD {estimatedPrice.toLocaleString('es-AR')}</strong></>
            )}.
          </p>
          <p style={{ fontSize: 15, color: 'var(--gray-light)', lineHeight: 1.7 }}>
            Nos comunicaremos dentro de las <strong style={{ color: 'var(--beige)' }}>24 horas hábiles</strong> con el presupuesto detallado.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          <Link to="/configurador" className="btn btn-primary" onClick={reset}>
            Nueva cotización
          </Link>
          <Link to="/" className="btn btn-outline">
            Volver al inicio
          </Link>
        </div>

        <div style={{
          display: 'flex',
          gap: 32,
          marginTop: 24,
          padding: '24px 32px',
          background: 'var(--black-soft)',
          border: '1px solid rgba(232,220,196,0.08)',
          borderRadius: 'var(--radius-lg)',
        }}>
          {[
            { label: 'Respondemos en', value: '< 24hs' },
            { label: 'Costo de cotizar', value: 'Gratis' },
            { label: 'Atención', value: 'Personalizada' },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--beige)' }}>{item.value}</div>
              <div style={{ fontSize: 11, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
