import { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useConfiguratorStore } from '../lib/configurator-store'
import { TIPO_LABELS } from '../lib/pricing'

interface FormData {
  nombre: string
  email: string
  telefono: string
  ciudad: string
  mensaje: string
}

const INITIAL: FormData = {
  nombre: '',
  email: '',
  telefono: '',
  ciudad: '',
  mensaje: '',
}

export function CotizacionPage() {
  const { tipo, config, estimatedPrice } = useConfiguratorStore()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const screenshot = localStorage.getItem('mecan-screenshot')

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tipo) { setError('No hay configuración guardada.'); return }
    if (!form.nombre || !form.email) { setError('Completá nombre y email.'); return }

    setLoading(true)
    setError('')

    try {
      const quote = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        tipo,
        config,
        estimatedPrice,
        customer: form,
        screenshot: screenshot || null,
        status: 'pending',
      }

      const existing = JSON.parse(localStorage.getItem('mecan-quotes') || '[]')
      localStorage.setItem('mecan-quotes', JSON.stringify([quote, ...existing]))
      localStorage.removeItem('mecan-screenshot')

      navigate({ to: '/cotizacion/exito' })
    } catch {
      setError('Error al guardar la cotización. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!tipo) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-light)', marginBottom: 16 }}>
            Primero configurá tu estructura.
          </p>
          <Link to="/configurador" className="btn btn-primary">Ir al configurador</Link>
        </div>
      </div>
    )
  }

  const sup = config.largo * config.ancho

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 960 }}>
        <div style={{ marginBottom: 48 }}>
          <Link to="/configurador/$tipo" params={{ tipo }} style={{ fontSize: 13, color: 'var(--gray-light)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            ← Volver al configurador
          </Link>
          <span className="badge badge-beige" style={{ marginBottom: 16, display: 'inline-flex' }}>Solicitar cotización</span>
          <h1 style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--beige)', marginBottom: 8 }}>
            Un paso más para<br />
            <span style={{ color: 'var(--warm)' }}>tu estructura.</span>
          </h1>
          <p style={{ color: 'var(--gray-light)', fontSize: 16 }}>
            Completá el formulario y nos ponemos en contacto en menos de 24 horas.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input className="form-input" value={form.nombre} onChange={set('nombre')} placeholder="Tu nombre completo" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="tu@email.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input className="form-input" type="tel" value={form.telefono} onChange={set('telefono')} placeholder="+54 9 ..." />
              </div>
              <div className="form-group">
                <label className="form-label">Ciudad / Provincia</label>
                <input className="form-input" value={form.ciudad} onChange={set('ciudad')} placeholder="Buenos Aires" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mensaje adicional</label>
              <textarea
                className="form-input"
                value={form.mensaje}
                onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
                placeholder="Consultas adicionales, plazos, lugar de instalación..."
                rows={4}
                style={{ resize: 'vertical' }}
              />
            </div>

            {error && (
              <p style={{ color: '#e05252', fontSize: 13 }}>{error}</p>
            )}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Enviando...' : 'Solicitar cotización'}
              {!loading && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>

            <p style={{ fontSize: 12, color: 'var(--gray)', lineHeight: 1.5 }}>
              Al enviar aceptás que nos comuniquemos con vos sobre tu consulta. No compartimos tus datos con terceros.
            </p>
          </form>

          {/* Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--beige)', marginBottom: 16 }}>
                Tu configuración
              </h3>

              {screenshot && (
                <img
                  src={screenshot}
                  alt="Vista 3D"
                  style={{ width: '100%', borderRadius: 6, marginBottom: 16, border: '1px solid rgba(232,220,196,0.1)' }}
                />
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Tipología', TIPO_LABELS[tipo]],
                  ['Largo', `${config.largo} m`],
                  ['Ancho', `${config.ancho} m`],
                  ['Alto', `${config.alto} m`],
                  ['Superficie', `${sup.toFixed(0)} m²`],
                  ['Techo', config.tipoTecho],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--gray-light)' }}>{label}</span>
                    <span style={{ color: 'var(--beige)', fontWeight: 500, textTransform: 'capitalize' }}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="divider" />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 12, color: 'var(--gray-light)' }}>Estimado</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--beige)' }}>
                  USD {estimatedPrice.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            <div className="card" style={{ background: 'rgba(200,148,74,0.06)', borderColor: 'rgba(200,148,74,0.2)' }}>
              <p style={{ fontSize: 13, color: 'var(--beige-dark)', lineHeight: 1.6 }}>
                🕐 Respondemos en menos de <strong>24 horas hábiles</strong>. El presupuesto definitivo puede ajustarse según terreno y logística.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div > div:last-child > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
