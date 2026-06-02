import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tipo, ConfiguratorConfig } from './pricing'
import { calculatePrice } from './pricing'

const DEFAULT_CONFIG: ConfiguratorConfig = {
  largo: 15,
  ancho: 8,
  alto: 5,
  tipoTecho: '2aguas',
  colorEstructura: '#707070',

  tipoPuerta: 'seccional',
  cantidadPuertas: 1,
  cantidadVentanas: 2,
  tragaluces: false,
  tipoChapa: 'simple',
  colorCubierta: '#555555',

  puertaCobertizo: 'levadiza',
  laterales: 'cerrados',

  cubiertaPergola: 'policarbonato',
  cerramientosLaterales: false,

  cantidadPuertasModulo: 1,
  cantidadVentanasModulo: 2,
  aislamiento: false,
  suelo: 'osb',
  electricidad: false,
  revestimientoInterior: false,
  colorExterior: '#e0e0e0',
}

const DEFAULTS_BY_TIPO: Record<Tipo, Partial<ConfiguratorConfig>> = {
  nave: { largo: 20, ancho: 10, alto: 5, tipoTecho: '2aguas' },
  cobertizo: { largo: 6, ancho: 5, alto: 3, tipoTecho: '1agua' },
  pergola: { largo: 6, ancho: 4, alto: 2.5, tipoTecho: 'plano' },
  modulo: { largo: 6, ancho: 3, alto: 3, tipoTecho: '2aguas' },
}

interface ConfiguratorStore {
  tipo: Tipo | null
  config: ConfiguratorConfig
  estimatedPrice: number
  setTipo: (tipo: Tipo) => void
  updateConfig: (updates: Partial<ConfiguratorConfig>) => void
  reset: () => void
}

export const useConfiguratorStore = create<ConfiguratorStore>()(
  persist(
    (set, get) => ({
      tipo: null,
      config: { ...DEFAULT_CONFIG },
      estimatedPrice: 0,

      setTipo: (tipo: Tipo) => {
        const newConfig = { ...DEFAULT_CONFIG, ...DEFAULTS_BY_TIPO[tipo] }
        set({
          tipo,
          config: newConfig,
          estimatedPrice: calculatePrice(tipo, newConfig),
        })
      },

      updateConfig: (updates: Partial<ConfiguratorConfig>) => {
        const { tipo, config } = get()
        const newConfig = { ...config, ...updates }
        set({
          config: newConfig,
          estimatedPrice: tipo ? calculatePrice(tipo, newConfig) : 0,
        })
      },

      reset: () => {
        set({ tipo: null, config: { ...DEFAULT_CONFIG }, estimatedPrice: 0 })
      },
    }),
    {
      name: 'mecan-modulo-config',
      partialize: (state) => ({ tipo: state.tipo, config: state.config }),
      onRehydrateStorage: () => (state) => {
        if (state?.tipo && state?.config) {
          state.estimatedPrice = calculatePrice(state.tipo, state.config)
        }
      },
    }
  )
)
