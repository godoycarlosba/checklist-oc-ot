import type { ConfiguratorConfig, Tipo } from './pricing'

export interface QuotePayload {
  tipo: Tipo
  config: ConfiguratorConfig
  estimatedPrice: number
  customer: {
    nombre: string
    email: string
    telefono: string
    ciudad: string
    mensaje: string
  }
  screenshot: string | null
}

export interface QuoteRecord {
  id: string
  created_at: string
  customer_name: string
  email: string
  phone: string | null
  city: string | null
  message: string | null
  structure_type: Tipo
  config: ConfiguratorConfig
  estimated_price: number
  status: 'pending' | 'contacted' | 'closed'
  screenshot_url: string | null
}

// ─── Demo mode detection ──────────────────────────────────
let _demoMode: boolean | null = null

export const DEMO_ADMIN_KEY = 'demo'
const DEMO_QUOTES_KEY = 'mecan-demo-quotes'

export async function detectDemoMode(): Promise<boolean> {
  if (_demoMode !== null) return _demoMode
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2500)
    const res = await fetch('/api/health', { signal: controller.signal })
    clearTimeout(timer)
    _demoMode = !res.ok
  } catch {
    _demoMode = true
  }
  return _demoMode
}

export function isDemoMode(): boolean {
  return _demoMode === true
}

// Listeners para notificar cuando cambia el modo
type DemoModeListener = (demo: boolean) => void
const listeners = new Set<DemoModeListener>()

export function onDemoModeChange(fn: DemoModeListener) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

export async function initDemoMode(): Promise<boolean> {
  const demo = await detectDemoMode()
  listeners.forEach((fn) => fn(demo))
  return demo
}

// ─── Demo localStorage store ──────────────────────────────
const demoStore = {
  get: (): QuoteRecord[] => {
    try {
      return JSON.parse(localStorage.getItem(DEMO_QUOTES_KEY) || '[]')
    } catch {
      return []
    }
  },
  save: (quotes: QuoteRecord[]) =>
    localStorage.setItem(DEMO_QUOTES_KEY, JSON.stringify(quotes)),
}

function demoSubmit(payload: QuotePayload): { success: true; id: string } {
  const id = crypto.randomUUID()
  const screenshot = localStorage.getItem('mecan-screenshot')
  const quote: QuoteRecord = {
    id,
    created_at: new Date().toISOString(),
    customer_name: payload.customer.nombre,
    email: payload.customer.email,
    phone: payload.customer.telefono || null,
    city: payload.customer.ciudad || null,
    message: payload.customer.mensaje || null,
    structure_type: payload.tipo,
    config: payload.config,
    estimated_price: payload.estimatedPrice,
    status: 'pending',
    screenshot_url: screenshot || null,
  }
  demoStore.save([quote, ...demoStore.get()])
  return { success: true, id }
}

// ─── Real API client ──────────────────────────────────────
async function apiRequest<T>(
  path: string,
  options?: RequestInit & { adminKey?: string }
): Promise<T> {
  const { adminKey, ...fetchOptions } = options ?? {}
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(adminKey ? { 'x-admin-key': adminKey } : {}),
  }
  const res = await fetch(`/api${path}`, { ...fetchOptions, headers })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
  return json as T
}

// ─── Unified API (auto-falls back to demo) ───────────────
export const api = {
  submitQuote: async (payload: QuotePayload) => {
    if (await detectDemoMode()) return demoSubmit(payload)
    return apiRequest<{ success: true; id: string }>('/quotes', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  listQuotes: async (adminKey: string) => {
    if (adminKey === DEMO_ADMIN_KEY || (await detectDemoMode())) {
      return demoStore.get()
    }
    return apiRequest<QuoteRecord[]>('/quotes', { adminKey })
  },

  updateStatus: async (id: string, status: QuoteRecord['status'], adminKey: string) => {
    if (adminKey === DEMO_ADMIN_KEY || (await detectDemoMode())) {
      demoStore.save(demoStore.get().map((q) => (q.id === id ? { ...q, status } : q)))
      return { success: true as const }
    }
    return apiRequest<{ success: true }>(`/quotes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      adminKey,
    })
  },

  deleteQuote: async (id: string, adminKey: string) => {
    if (adminKey === DEMO_ADMIN_KEY || (await detectDemoMode())) {
      demoStore.save(demoStore.get().filter((q) => q.id !== id))
      return { success: true as const }
    }
    return apiRequest<{ success: true }>(`/quotes/${id}`, {
      method: 'DELETE',
      adminKey,
    })
  },
}
