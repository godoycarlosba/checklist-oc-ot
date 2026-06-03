import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { z } from 'zod'

const app = express()
app.use(cors())
app.use(express.json({ limit: '15mb' }))

// ─── Clients ──────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const FROM_EMAIL = process.env.FROM_EMAIL || 'Mecan Modulo <noreply@mecanmodulo.com>'
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'dev-admin-secret'
const TIPO_LABELS: Record<string, string> = {
  nave: 'Nave Industrial',
  cobertizo: 'Cobertizo / Garaje',
  pergola: 'Pérgola',
  modulo: 'Módulo Habitacional',
}

// ─── Helpers ─────────────────────────────────────────────
function requireAdmin(req: express.Request, res: express.Response): boolean {
  const key = req.headers['x-admin-key']
  if (key !== ADMIN_SECRET) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}

async function uploadScreenshot(base64: string): Promise<string | null> {
  try {
    const data = base64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(data, 'base64')
    const filename = `quotes/${Date.now()}.jpg`
    const { error } = await supabase.storage
      .from('screenshots')
      .upload(filename, buffer, { contentType: 'image/jpeg', upsert: false })
    if (error) return null
    const { data: urlData } = supabase.storage
      .from('screenshots')
      .getPublicUrl(filename)
    return urlData.publicUrl
  } catch {
    return null
  }
}

function buildAdminEmail(quote: {
  customer: { nombre: string; email: string; telefono?: string; ciudad?: string; mensaje?: string }
  tipo: string
  config: Record<string, unknown>
  estimatedPrice: number
  screenshotUrl: string | null
}): string {
  const { customer, tipo, config, estimatedPrice, screenshotUrl } = quote
  const tipoLabel = TIPO_LABELS[tipo] ?? tipo
  const sup = Number(config.largo ?? 0) * Number(config.ancho ?? 0)

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head><meta charset="UTF-8" /><style>
    body { font-family: Inter, Arial, sans-serif; background: #f5f0e8; margin: 0; padding: 24px; }
    .card { background: #0a0a0a; border-radius: 12px; padding: 32px; max-width: 560px; margin: 0 auto; }
    h1 { font-size: 28px; color: #e8dcc4; margin: 0 0 4px; }
    .sub { color: #888; font-size: 14px; margin-bottom: 28px; }
    .badge { display: inline-block; background: rgba(200,148,74,0.15); color: #c8944a; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 9px 0; font-size: 14px; border-bottom: 1px solid rgba(232,220,196,0.08); }
    td:first-child { color: #888; width: 40%; }
    td:last-child { color: #e8dcc4; font-weight: 500; }
    .price { font-size: 32px; color: #e8dcc4; font-weight: 800; margin: 20px 0 4px; }
    .price-label { color: #888; font-size: 13px; }
    img { width: 100%; border-radius: 8px; margin-top: 20px; }
  </style></head>
  <body>
    <div class="card">
      <div class="badge">Nueva cotización</div>
      <h1>${customer.nombre}</h1>
      <p class="sub">${customer.email}${customer.ciudad ? ` · ${customer.ciudad}` : ''}</p>
      <table>
        <tr><td>Tipología</td><td>${tipoLabel}</td></tr>
        <tr><td>Dimensiones</td><td>${config.largo}m × ${config.ancho}m × ${config.alto}m</td></tr>
        <tr><td>Superficie</td><td>${sup.toFixed(0)} m²</td></tr>
        <tr><td>Techo</td><td>${config.tipoTecho}</td></tr>
        ${customer.telefono ? `<tr><td>Teléfono</td><td>${customer.telefono}</td></tr>` : ''}
        ${customer.mensaje ? `<tr><td>Mensaje</td><td>${customer.mensaje}</td></tr>` : ''}
      </table>
      <p class="price">USD ${estimatedPrice.toLocaleString('es-AR')}</p>
      <p class="price-label">Precio estimado</p>
      ${screenshotUrl ? `<img src="${screenshotUrl}" alt="Vista 3D" />` : ''}
    </div>
  </body>
  </html>`
}

function buildCustomerEmail(quote: {
  customer: { nombre: string }
  tipo: string
  config: Record<string, unknown>
  estimatedPrice: number
}): string {
  const { customer, tipo, config, estimatedPrice } = quote
  const tipoLabel = TIPO_LABELS[tipo] ?? tipo
  const sup = Number(config.largo ?? 0) * Number(config.ancho ?? 0)

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head><meta charset="UTF-8" /><style>
    body { font-family: Inter, Arial, sans-serif; background: #f5f0e8; margin: 0; padding: 24px; }
    .card { background: #0a0a0a; border-radius: 12px; padding: 32px; max-width: 520px; margin: 0 auto; }
    h1 { font-size: 26px; color: #e8dcc4; margin: 0 0 8px; }
    p { color: #888; font-size: 15px; line-height: 1.6; }
    .badge { display: inline-block; background: rgba(200,148,74,0.15); color: #c8944a; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    td { padding: 9px 0; font-size: 14px; border-bottom: 1px solid rgba(232,220,196,0.08); }
    td:first-child { color: #888; width: 40%; }
    td:last-child { color: #e8dcc4; font-weight: 500; }
    .price { font-size: 36px; color: #e8dcc4; font-weight: 800; }
    .cta { display: inline-block; background: #e8dcc4; color: #0a0a0a; padding: 14px 28px; border-radius: 6px; font-size: 14px; font-weight: 700; text-decoration: none; margin-top: 24px; }
    .footer { color: #555; font-size: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(232,220,196,0.08); }
  </style></head>
  <body>
    <div class="card">
      <div class="badge">Cotización recibida</div>
      <h1>Hola, ${customer.nombre}</h1>
      <p>Recibimos tu solicitud de cotización. Nos pondremos en contacto dentro de las <strong style="color:#e8dcc4">24 horas hábiles</strong>.</p>
      <table>
        <tr><td>Tipología</td><td>${tipoLabel}</td></tr>
        <tr><td>Dimensiones</td><td>${config.largo}m × ${config.ancho}m × ${config.alto}m</td></tr>
        <tr><td>Superficie</td><td>${sup.toFixed(0)} m²</td></tr>
        <tr><td>Techo</td><td>${config.tipoTecho}</td></tr>
      </table>
      <p style="color:#888; font-size:13px; margin-bottom:4px">Precio estimado</p>
      <div class="price">USD ${estimatedPrice.toLocaleString('es-AR')}</div>
      <p class="footer">Este precio es orientativo. El presupuesto definitivo puede variar según condiciones del terreno, transporte y personalización adicional.<br/><br/>MECAN MODULO · Estructuras metálicas industriales y habitacionales</p>
    </div>
  </body>
  </html>`
}

// ─── Schema de validación ────────────────────────────────
const QuoteSchema = z.object({
  tipo: z.enum(['nave', 'cobertizo', 'pergola', 'modulo']),
  config: z.record(z.unknown()),
  estimatedPrice: z.number().int().positive(),
  customer: z.object({
    nombre: z.string().min(1, 'Nombre requerido'),
    email: z.string().email('Email inválido'),
    telefono: z.string().optional(),
    ciudad: z.string().optional(),
    mensaje: z.string().max(1000).optional(),
  }),
  screenshot: z.string().nullable().optional(),
})

// ─── POST /api/quotes — Enviar cotización ────────────────
app.post('/api/quotes', async (req, res) => {
  const parsed = QuoteSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos', details: parsed.error.flatten() })
    return
  }

  const { tipo, config, estimatedPrice, customer, screenshot } = parsed.data

  // Upload screenshot
  const screenshotUrl = screenshot ? await uploadScreenshot(screenshot) : null

  // Insert en DB
  const { data: quote, error: dbError } = await supabase
    .from('quotes')
    .insert({
      customer_name: customer.nombre,
      email: customer.email,
      phone: customer.telefono ?? null,
      city: customer.ciudad ?? null,
      message: customer.mensaje ?? null,
      structure_type: tipo,
      config,
      estimated_price: estimatedPrice,
      screenshot_url: screenshotUrl,
    })
    .select('id')
    .single()

  if (dbError) {
    console.error('[DB] Insert error:', dbError)
    res.status(500).json({ error: 'Error al guardar la cotización' })
    return
  }

  // Emails (no bloquea la respuesta si falla)
  if (resend) {
    const emailData = { customer, tipo, config: config as Record<string, unknown>, estimatedPrice, screenshotUrl }
    Promise.all([
      ADMIN_EMAIL && resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `📋 Nueva cotización: ${TIPO_LABELS[tipo]} — ${customer.nombre}`,
        html: buildAdminEmail(emailData),
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: customer.email,
        subject: 'Tu cotización en Mecan Modulo fue recibida',
        html: buildCustomerEmail(emailData),
      }),
    ]).catch((err) => console.error('[Email] Send error:', err))
  } else {
    console.warn('[Email] RESEND_API_KEY no configurado — emails desactivados')
  }

  res.json({ success: true, id: quote.id })
})

// ─── GET /api/quotes — Listar cotizaciones (admin) ───────
app.get('/api/quotes', async (req, res) => {
  if (!requireAdmin(req, res)) return

  const { data, error } = await supabase
    .from('quotes')
    .select('id, created_at, customer_name, email, phone, city, message, structure_type, config, estimated_price, status, screenshot_url')
    .order('created_at', { ascending: false })

  if (error) {
    res.status(500).json({ error: 'Error al obtener cotizaciones' })
    return
  }

  res.json(data)
})

// ─── PATCH /api/quotes/:id — Actualizar estado ───────────
app.patch('/api/quotes/:id', async (req, res) => {
  if (!requireAdmin(req, res)) return

  const statusSchema = z.object({ status: z.enum(['pending', 'contacted', 'closed']) })
  const parsed = statusSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Estado inválido' })
    return
  }

  const { error } = await supabase
    .from('quotes')
    .update({ status: parsed.data.status, viewed_at: new Date().toISOString() })
    .eq('id', req.params.id)

  if (error) {
    res.status(500).json({ error: 'Error al actualizar' })
    return
  }

  res.json({ success: true })
})

// ─── DELETE /api/quotes/:id ───────────────────────────────
app.delete('/api/quotes/:id', async (req, res) => {
  if (!requireAdmin(req, res)) return

  const { error } = await supabase
    .from('quotes')
    .delete()
    .eq('id', req.params.id)

  if (error) {
    res.status(500).json({ error: 'Error al eliminar' })
    return
  }

  res.json({ success: true })
})

// ─── GET /api/health ─────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    supabase: !!process.env.SUPABASE_URL,
    resend: !!resend,
    adminEmail: !!ADMIN_EMAIL,
  })
})

const PORT = Number(process.env.PORT ?? 3001)
app.listen(PORT, () => {
  console.log(`\n✅ Mecan Modulo API → http://localhost:${PORT}`)
  console.log(`   Supabase: ${process.env.SUPABASE_URL ? '✓' : '✗ (falta SUPABASE_URL)'}`)
  console.log(`   Resend:   ${resend ? '✓' : '✗ (emails desactivados)'}`)
  console.log(`   Admin:    http://localhost:${PORT === 3001 ? 5173 : PORT}/admin/cotizaciones\n`)
})
