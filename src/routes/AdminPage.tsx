import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { TIPO_LABELS } from '../lib/pricing'
import type { Tipo } from '../lib/pricing'

interface Quote {
  id: string
  createdAt: string
  tipo: Tipo
  estimatedPrice: number
  customer: {
    nombre: string
    email: string
    telefono: string
    ciudad: string
    mensaje: string
  }
  config: Record<string, unknown>
  status: 'pending' | 'contacted' | 'closed'
  screenshot: string | null
}

const STATUS_LABELS: Record<Quote['status'], string> = {
  pending: 'Pendiente',
  contacted: 'Contactado',
  closed: 'Cerrado',
}

const STATUS_COLORS: Record<Quote['status'], string> = {
  pending: '#c8944a',
  contacted: '#4a9dc8',
  closed: '#4ac872',
}

export function AdminPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [selected, setSelected] = useState<Quote | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('mecan-quotes')
    if (raw) setQuotes(JSON.parse(raw))
  }, [])

  const updateStatus = (id: string, status: Quote['status']) => {
    const updated = quotes.map((q) => (q.id === id ? { ...q, status } : q))
    setQuotes(updated)
    localStorage.setItem('mecan-quotes', JSON.stringify(updated))
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : null)
  }

  const deleteQuote = (id: string) => {
    const updated = quotes.filter((q) => q.id !== id)
    setQuotes(updated)
    localStorage.setItem('mecan-quotes', JSON.stringify(updated))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80 }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <span className="badge badge-beige" style={{ marginBottom: 8, display: 'inline-flex' }}>Admin</span>
            <h1 style={{ fontSize: 36, color: 'var(--beige)' }}>
              Cotizaciones
              <span style={{ fontSize: 20, color: 'var(--gray)', marginLeft: 12 }}>({quotes.length})</span>
            </h1>
          </div>
          <Link to="/" className="btn btn-outline btn-sm">← Inicio</Link>
        </div>

        {quotes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <p style={{ color: 'var(--gray-light)', marginBottom: 16 }}>No hay cotizaciones registradas aún.</p>
            <Link to="/configurador" className="btn btn-primary">Ir al configurador</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 20 }}>
            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {quotes.map((q) => (
                <div
                  key={q.id}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    borderColor: selected?.id === q.id ? 'rgba(232,220,196,0.35)' : undefined,
                    transition: 'all var(--transition)',
                  }}
                  onClick={() => setSelected(q)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--beige)' }}>
                          {q.customer.nombre}
                        </span>
                        <span
                          className="badge"
                          style={{ background: `${STATUS_COLORS[q.status]}20`, color: STATUS_COLORS[q.status] }}
                        >
                          {STATUS_LABELS[q.status]}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--gray-light)', flexWrap: 'wrap' }}>
                        <span>{q.customer.email}</span>
                        <span>{TIPO_LABELS[q.tipo]}</span>
                        <span>{String(q.config.largo)}m × {String(q.config.ancho)}m × {String(q.config.alto)}m</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--beige)' }}>
                        USD {q.estimatedPrice.toLocaleString('es-AR')}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--gray)' }}>
                        {new Date(q.createdAt).toLocaleDateString('es-AR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="card" style={{ position: 'sticky', top: 80, height: 'fit-content', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, color: 'var(--beige)' }}>Detalle</h3>
                  <button
                    onClick={() => setSelected(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--gray-light)', fontSize: 18, lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>

                {selected.screenshot && (
                  <img
                    src={selected.screenshot}
                    alt="Vista 3D"
                    style={{ width: '100%', borderRadius: 6, marginBottom: 16 }}
                  />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {[
                    ['Nombre', selected.customer.nombre],
                    ['Email', selected.customer.email],
                    ['Teléfono', selected.customer.telefono || '—'],
                    ['Ciudad', selected.customer.ciudad || '—'],
                    ['Tipología', TIPO_LABELS[selected.tipo]],
                    ['Precio estimado', `USD ${selected.estimatedPrice.toLocaleString('es-AR')}`],
                    ['Fecha', new Date(selected.createdAt).toLocaleString('es-AR')],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: 'var(--gray-light)' }}>{label}</span>
                      <span style={{ color: 'var(--beige)', fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                </div>

                {selected.customer.mensaje && (
                  <div style={{ marginBottom: 20 }}>
                    <div className="form-label" style={{ marginBottom: 6 }}>Mensaje</div>
                    <p style={{ fontSize: 13, color: 'var(--beige-dark)', lineHeight: 1.6, background: 'var(--black)', padding: '10px 12px', borderRadius: 6 }}>
                      {selected.customer.mensaje}
                    </p>
                  </div>
                )}

                <div className="divider" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="form-label">Cambiar estado</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(['pending', 'contacted', 'closed'] as Quote['status'][]).map((s) => (
                      <button
                        key={s}
                        className={`chip ${selected.status === s ? 'active' : ''}`}
                        onClick={() => updateStatus(selected.id, s)}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => deleteQuote(selected.id)}
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: 8, borderColor: '#e05252', color: '#e05252' }}
                  >
                    Eliminar registro
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
