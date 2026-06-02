import { Link } from '@tanstack/react-router'

export function Nav() {
  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        MECAN<span>.</span>MODULO
      </Link>
      <div className="nav-links">
        <Link to="/configurador" activeProps={{ className: 'active' }}>
          Configurador
        </Link>
        <Link to="/contacto" activeProps={{ className: 'active' }}>
          Contacto
        </Link>
        <Link to="/configurador" className="nav-cta">
          Cotizar estructura
        </Link>
      </div>
    </nav>
  )
}
