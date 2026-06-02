import { Link } from '@tanstack/react-router'

export function ContactoPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 48 }}>
          <span className="badge badge-beige" style={{ marginBottom: 16, display: 'inline-flex' }}>Contacto</span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: 'var(--beige)', marginBottom: 12 }}>
            ¿Tenés un proyecto<br />
            <span style={{ color: 'var(--warm)' }}>en mente?</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--gray-light)', lineHeight: 1.7, maxWidth: 520 }}>
            Hablemos. Podés usar el configurador 3D para una cotización automática,
            o contactarnos directamente si tenés requisitos especiales.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              {
                icon: '📧',
                label: 'Email',
                value: 'info@mecanmodulo.com',
                desc: 'Respondemos en 24hs hábiles',
              },
              {
                icon: '📱',
                label: 'WhatsApp',
                value: '+54 9 11 XXXX XXXX',
                desc: 'Lun–Vie 8:00 a 18:00',
              },
              {
                icon: '📍',
                label: 'Ubicación',
                value: 'Buenos Aires, Argentina',
                desc: 'Instalamos en todo el país',
              },
              {
                icon: '🕐',
                label: 'Plazos típicos',
                value: '4 a 12 semanas',
                desc: 'Según tipología y complejidad',
              },
            ].map((item) => (
              <div key={item.label} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 28, flex: '0 0 auto' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 4 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 16, color: 'var(--beige)', fontWeight: 500, marginBottom: 2 }}>{item.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-light)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h3 style={{ fontSize: 20, color: 'var(--beige)' }}>Accesos rápidos</h3>

              <Link
                to="/configurador"
                className="btn btn-primary"
                style={{ justifyContent: 'space-between' }}
              >
                Configurar mi estructura
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              <Link
                to="/cotizacion"
                className="btn btn-outline"
                style={{ justifyContent: 'space-between' }}
              >
                Ver mi cotización guardada
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              <div className="divider" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  '¿Fabrican a medida? Sí, 100% personalizable.',
                  '¿Incluye instalación? Consultá disponibilidad por zona.',
                  '¿Aceptan financiamiento? Según proyecto y condiciones.',
                  '¿Cumplen normas IRAM / CIRSOC? Sí.',
                ].map((q) => (
                  <p key={q} style={{ fontSize: 13, color: 'var(--gray-light)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--warm)', flexShrink: 0 }}>›</span>
                    {q}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
