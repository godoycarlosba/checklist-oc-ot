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

const BASE = '/api'

async function apiRequest<T>(
  path: string,
  options?: RequestInit & { adminKey?: string }
): Promise<T> {
  const { adminKey, ...fetchOptions } = options ?? {}
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(adminKey ? { 'x-admin-key': adminKey } : {}),
  }
  const res = await fetch(`${BASE}${path}`, { ...fetchOptions, headers })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
  return json as T
}

export const api = {
  submitQuote: (payload: QuotePayload) =>
    apiRequest<{ success: true; id: string }>('/quotes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listQuotes: (adminKey: string) =>
    apiRequest<QuoteRecord[]>('/quotes', { adminKey }),

  updateStatus: (id: string, status: QuoteRecord['status'], adminKey: string) =>
    apiRequest<{ success: true }>(`/quotes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      adminKey,
    }),

  deleteQuote: (id: string, adminKey: string) =>
    apiRequest<{ success: true }>(`/quotes/${id}`, {
      method: 'DELETE',
      adminKey,
    }),

  health: () =>
    apiRequest<{ status: string; supabase: boolean; resend: boolean }>('/health'),
}
