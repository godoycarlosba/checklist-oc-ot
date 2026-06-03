import { useState, useEffect, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import { TIPO_LABELS } from '../lib/pricing'
import { api, isDemoMode, DEMO_ADMIN_KEY, onDemoModeChange } from '../lib/api'
import type { QuoteRecord } from '../lib/api'
import type { Tipo } from '../lib/pricing'

const STATUS_LABELS: Record<QuoteRecord['status'], string> = {
  pending: 'Pendiente',
  contacted: 'Contactado',
  closed: 'Cerrado',
}

const STATUS_COLORS: Record<QuoteRecord['status'], string> = {
  pending: '#c8944a',
  contacted: '#4a9dc8',
  closed: '#4ac872',
}

// ─── Login overlay ───────────────────────────────────────
function LoginOverlay({ onAuth }: { onAuth: (key: string) => void }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [demo, setDemo] = useState(isDemoMode())

  useEffect(() => {
    const unsub = onDemoModeChange(setDemo)
    // Auto-login in demo mode
    if (isDemoMode()) onAuth(DEMO_ADMIN_KEY)
    return unsub
  }, [onAuth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.listQuotes(key)
      sessionStorage.setItem('mecan-admin-key', key)
      onAuth(key)
    } catch {
      setError('Clave incorrecta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--black)',
    }}>
      <div className="card" style={{ width: 360, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
        <h2 style={{ fontSize: 22, color: 'var(--beige)', marginBottom: 8 }}>Panel admin</h2>
        <p style={{ fontSize: 14, color: 'var(--gray-light)', marginBottom: demo ? 12 : 24 }}>
          Ingresá la clave de administrador (ADMIN_SECRET en .env)
        </p>
        {demo && (
          <div style={{ background: 'rgba(200,148,74,0.1)', border: '1px solid rgba(200,148,74,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: '#c8944a', margin: 0 }}>
              🧪 Modo demo activo — cargando datos locales…
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            className="form-input"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={demo ? 'demo (modo local)' : 'Clave de admin'}
            autoFocus
          />
          {error && <p style={{ color: '#e05252', fontSize: 13 }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading || !key}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
        <Link to="/" style={{ display: 'block', marginTop: 16, fontSize: 13, color: 'var(--gray-light)' }}>
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}

// ─── Main admin page ─────────────────────────────────────
export function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(
    () => isDemoMode() ? DEMO_ADMIN_KEY : sessionStorage.getItem('mecan-admin-key')
  )
  const [quotes, setQuotes] = useState<QuoteRecord[]>([])
  const [selected, setSelected] = useState<QuoteRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')

  const loadQuotes = useCallback(async (key: string) => {
    setLoading(true)
    setFetchError('')
    try {
      const data = await api.listQuotes(key)
      setQuotes(data)
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Error al cargar cotizaciones')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (adminKey) loadQuotes(adminKey)
  }, [adminKey, loadQuotes])

  const handleAuth = (key: string) => {
    setAdminKey(key)
    loadQuotes(key)
  }

  const updateStatus = async (id: string, status: QuoteRecord['status']) => {
    if (!adminKey) return
    try {
      await api.updateStatus(id, status, adminKey)
      const updated = quotes.map((q) => q.id === id ? { ...q, status } : q)
      setQuotes(updated)
      if (selected?.id === id) setSelected((s) => s ? { ...s, status } : null)
    } catch {}
  }

  const deleteQuote = async (id: string) => {
    if (!adminKey || !confirm('¿Eliminar esta cotización?')) return
    try {
      await api.deleteQuote(id, adminKey)
      setQuotes((prev) => prev.filter((q) => q.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch {}
  }

  if (!adminKey) return <LoginOverlay onAuth={handleAuth} />

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80 }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <span className="badge badge-beige" style={{ marginBottom: 8, display: 'inline-flex' }}>Admin</span>
            <h1 style={{ fontSize: 36, color: 'var(--beige)' }}>
              Cotizaciones
              {!loading && (
                <span style={{ fontSize: 20, color: 'var(--gray)', marginLeft: 12 }}>({quotes.length})</span>
              )}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => loadQuotes(adminKey)}
              disabled={loading}
            >
              {loading ? 'Cargando...' : '↻ Actualizar'}
            </button>
            <button
              className="btn btn-outline btn-sm"
              style={{ borderColor: '#e05252', color: '#e05252' }}
              onClick={() => {
                sessionStorage.removeItem('mecan-admin-key')
                setAdminKey(null)
              }}
            >
              Salir
            </button>
            <Link to="/" className="btn btn-outline btn-sm">← Inicio</Link>
          </div>
        </div>

        {fetchError && (
          <div className="card" style={{ borderColor: '#e05252', color: '#e05252', marginBottom: 20 }}>
            {fetchError}
          </div>
        )}

        {!loading && quotes.length === 0 && !fetchError ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <p style={{ color: 'var(--gray-light)', marginBottom: 16 }}>No hay cotizaciones registradas aún.</p>
            <Link to="/configurador" className="btn btn-primary">Ir al configurador</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 20 }}>
            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {loading
                ? Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="card" style={{ height: 84, opacity: 0.4, background: 'var(--black-mid)', animation: 'pulse 1.5s infinite' }} />
                  ))
                : quotes.map((q) => (
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
                              {q.customer_name}
                            </span>
                            <span
                              className="badge"
                              style={{ background: `${STATUS_COLORS[q.status]}20`, color: STATUS_COLORS[q.status] }}
                            >
                              {STATUS_LABELS[q.status]}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--gray-light)', flexWrap: 'wrap' }}>
                            <span>{q.email}</span>
                            <span>{TIPO_LABELS[q.structure_type as Tipo]}</span>
                            <span>
                              {String(q.config.largo)}m × {String(q.config.ancho)}m × {String(q.config.alto)}m
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--beige)' }}>
                            USD {q.estimated_price.toLocaleString('es-AR')}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--gray)' }}>
                            {new Date(q.created_at).toLocaleDateString('es-AR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              }
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="card" style={{ position: 'sticky', top: 80, height: 'fit-content', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, color: 'var(--beige)' }}>Detalle</h3>
                  <button
                    onClick={() => setSelected(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--gray-light)', fontSize: 20, lineHeight: 1, cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>

                {selected.screenshot_url && (
                  <a href={selected.screenshot_url} target="_blank" rel="noreferrer">
                    <img
                      src={selected.screenshot_url}
                      alt="Vista 3D"
                      style={{ width: '100%', borderRadius: 6, marginBottom: 16 }}
                    />
                  </a>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {[
                    ['Nombre', selected.customer_name],
                    ['Email', selected.email],
                    ['Teléfono', selected.phone ?? '—'],
                    ['Ciudad', selected.city ?? '—'],
                    ['Tipología', TIPO_LABELS[selected.structure_type as Tipo]],
                    ['Precio estimado', `USD ${selected.estimated_price.toLocaleString('es-AR')}`],
                    ['Fecha', new Date(selected.created_at).toLocaleString('es-AR')],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: 'var(--gray-light)' }}>{label}</span>
                      <span style={{ color: 'var(--beige)', fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                </div>

                {selected.message && (
                  <div style={{ marginBottom: 20 }}>
                    <div className="form-label" style={{ marginBottom: 6 }}>Mensaje</div>
                    <p style={{ fontSize: 13, color: 'var(--beige-dark)', lineHeight: 1.6, background: 'var(--black)', padding: '10px 12px', borderRadius: 6 }}>
                      {selected.message}
                    </p>
                  </div>
                )}

                <div className="divider" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="form-label">Estado</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(['pending', 'contacted', 'closed'] as QuoteRecord['status'][]).map((s) => (
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
