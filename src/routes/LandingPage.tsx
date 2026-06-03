import { Hero } from '../components/landing/Hero'
import { TypologiesGrid } from '../components/landing/TypologiesGrid'
import { Link } from '@tanstack/react-router'

function WhySection() {
  const features = [
    {
      icon: '⚡',
      title: 'Configuración instantánea',
      desc: 'Ajustá dimensiones, materiales y accesorios en tiempo real. El precio se actualiza al instante.',
    },
    {
      icon: '📐',
      title: 'Visualización 3D real',
      desc: 'Mirá tu estructura desde todos los ángulos antes de comprometer cualquier inversión.',
    },
    {
      icon: '💬',
      title: 'Cotización sin fricción',
      desc: 'Un formulario simple. Sin cuenta, sin burocracia. Recibís respuesta en menos de 24 horas.',
    },
    {
      icon: '🏗️',
      title: 'Fabricación propia',
      desc: 'Estructuras metálicas fabricadas 100% en planta propia con control de calidad integral.',
    },
  ]

  return (
    <section style={{ padding: '100px 0', background: 'var(--black-soft)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <span className="badge badge-beige">Por qué elegirnos</span>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: 'var(--beige)' }}>
            Industria con<br />
            <span style={{ color: 'var(--warm)' }}>tecnología real.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {features.map((f) => (
            <div key={f.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 32 }}>{f.icon}</span>
              <h3 style={{ fontSize: 18, color: 'var(--beige)' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--gray-light)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section style={{ padding: '120px 0' }}>
      <div className="container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <span className="badge badge-warm">Listo para empezar</span>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: 'var(--beige)', maxWidth: 600, lineHeight: 1.05 }}>
          Tu estructura, tu diseño, tu precio.
        </h2>
        <p style={{ fontSize: 17, color: 'var(--gray-light)', maxWidth: 480, lineHeight: 1.7 }}>
          Usá el configurador 3D, personalizá cada detalle y recibí tu cotización personalizada.
        </p>
        <Link to="/configurador" className="btn btn-primary btn-lg">
          Configurar ahora — es gratis
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(232,220,196,0.08)',
      padding: '40px 0',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontFamily: 'var(--font-display)', color: 'var(--beige)', fontSize: 18 }}>
          MECAN<span style={{ color: 'var(--warm)' }}>.</span>MODULO
        </span>
        <p style={{ fontSize: 13, color: 'var(--gray)' }}>
          © {new Date().getFullYear()} Mecan Modulo. Estructuras metálicas industriales y habitacionales.
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link to="/contacto" style={{ fontSize: 13, color: 'var(--gray-light)' }}>Contacto</Link>
          <Link to="/admin/cotizaciones" style={{ fontSize: 13, color: 'var(--gray)' }}>Admin</Link>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  return (
    <div>
      <Hero />
      <TypologiesGrid />
      <WhySection />
      <CtaSection />
      <Footer />
    </div>
  )
}
