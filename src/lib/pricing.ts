export type Tipo = 'nave' | 'cobertizo' | 'pergola' | 'modulo'

const BASE_M2: Record<Tipo, number> = {
  nave: 185,
  cobertizo: 125,
  pergola: 98,
  modulo: 260,
}

const DOOR_PRICES: Record<string, number> = {
  seccional: 2800,
  corredera: 3200,
  enrollable: 3600,
  levadiza: 2400,
  ninguna: 0,
}

const CHAPA_SURCHARGE: Record<string, number> = {
  simple: 0,
  sandwich: 38,
  fibrocemento: 22,
}

const CUBIERTA_PRICES: Record<string, number> = {
  policarbonato: 45,
  pvc: 28,
  abierta: 0,
}

const TECHO_SURCHARGE: Record<string, number> = {
  plano: 0,
  '1agua': 8,
  '2aguas': 16,
}

export interface ConfiguratorConfig {
  largo: number
  ancho: number
  alto: number
  tipoTecho: 'plano' | '1agua' | '2aguas'
  colorEstructura: string

  // Nave
  tipoPuerta: 'seccional' | 'corredera' | 'enrollable' | 'ninguna'
  cantidadPuertas: number
  cantidadVentanas: number
  tragaluces: boolean
  tipoChapa: 'simple' | 'sandwich' | 'fibrocemento'
  colorCubierta: string

  // Cobertizo
  puertaCobertizo: 'levadiza' | 'corredera' | 'enrollable' | 'ninguna'
  laterales: 'cerrados' | 'abiertos' | 'mixto'

  // Pergola
  cubiertaPergola: 'policarbonato' | 'pvc' | 'abierta'
  cerramientosLaterales: boolean

  // Modulo
  cantidadPuertasModulo: number
  cantidadVentanasModulo: number
  aislamiento: boolean
  suelo: 'osb' | 'contrachapado' | 'sin-suelo'
  electricidad: boolean
  revestimientoInterior: boolean
  colorExterior: string
}

export function calculatePrice(tipo: Tipo, config: ConfiguratorConfig): number {
  const sup = config.largo * config.ancho
  let price = BASE_M2[tipo] * sup

  // Roof type surcharge per m²
  price += sup * (TECHO_SURCHARGE[config.tipoTecho] ?? 0)

  // Height surcharge: +4% per meter above 4m
  const extraHeight = Math.max(0, config.alto - 4)
  price += price * extraHeight * 0.04

  if (tipo === 'nave') {
    price += (DOOR_PRICES[config.tipoPuerta] ?? 0) * config.cantidadPuertas
    price += config.cantidadVentanas * 420
    if (config.tragaluces) price += sup * 12
    price += sup * (CHAPA_SURCHARGE[config.tipoChapa] ?? 0)
  }

  if (tipo === 'cobertizo') {
    price += DOOR_PRICES[config.puertaCobertizo] ?? 0
    if (config.laterales === 'cerrados') price += sup * 18
    if (config.laterales === 'mixto') price += sup * 9
    price += sup * (CHAPA_SURCHARGE[config.tipoChapa] ?? 0)
  }

  if (tipo === 'pergola') {
    price += sup * (CUBIERTA_PRICES[config.cubiertaPergola] ?? 0)
    if (config.cerramientosLaterales) price += sup * 14
  }

  if (tipo === 'modulo') {
    price += config.cantidadPuertasModulo * 1800
    price += config.cantidadVentanasModulo * 650
    if (config.aislamiento) price += sup * 45
    if (config.suelo === 'osb') price += sup * 22
    if (config.suelo === 'contrachapado') price += sup * 32
    if (config.electricidad) price += 1200
    if (config.revestimientoInterior) price += sup * 28
  }

  return Math.round(price)
}

export function priceBreakdown(tipo: Tipo, config: ConfiguratorConfig) {
  const sup = config.largo * config.ancho
  const basePrice = BASE_M2[tipo] * sup
  const total = calculatePrice(tipo, config)
  const extras = total - basePrice

  return [
    { label: 'Estructura base', value: basePrice },
    ...(extras > 0 ? [{ label: 'Accesorios y opciones', value: extras }] : []),
  ]
}

export const TIPO_LABELS: Record<Tipo, string> = {
  nave: 'Nave Industrial',
  cobertizo: 'Cobertizo / Garaje',
  pergola: 'Pérgola',
  modulo: 'Módulo Habitacional',
}

export const COLOR_OPTIONS = [
  { label: 'Negro', value: '#1a1a1a' },
  { label: 'Blanco', value: '#e0e0e0' },
  { label: 'Gris', value: '#707070' },
  { label: 'Beige', value: '#c8b08c' },
  { label: 'Azul', value: '#3a5a8a' },
  { label: 'Verde', value: '#3a6b4a' },
]
