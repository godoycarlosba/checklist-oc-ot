-- ─────────────────────────────────────────────────────
-- Mecan Modulo — tabla de cotizaciones
-- Ejecutar en: Supabase → SQL Editor
-- ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  message TEXT,
  structure_type TEXT NOT NULL CHECK (structure_type IN ('nave', 'cobertizo', 'pergola', 'modulo')),
  config JSONB NOT NULL,
  estimated_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed')),
  screenshot_url TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS quotes_created_at_idx ON quotes (created_at DESC);
CREATE INDEX IF NOT EXISTS quotes_status_idx ON quotes (status);

-- RLS: habilitado, insert público, select solo service_role
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert" ON quotes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- (Sin política de SELECT = solo service_role puede leer)

-- ─── Storage bucket para screenshots ──────────────────
-- Ejecutar también en SQL Editor:
INSERT INTO storage.buckets (id, name, public)
VALUES ('screenshots', 'screenshots', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read screenshots" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'screenshots');

CREATE POLICY "Service role insert screenshots" ON storage.objects
  FOR INSERT TO service_role WITH CHECK (bucket_id = 'screenshots');
