import { useConfiguratorStore } from '../../lib/configurator-store'
import { COLOR_OPTIONS } from '../../lib/pricing'
import type { Tipo } from '../../lib/pricing'

interface Props {
  tipo: Tipo
}

function SliderField({
  label, value, min, max, step = 0.5, unit = 'm',
  onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string;
  onChange: (v: number) => void
}) {
  return (
    <div className="slider-group">
      <div className="slider-header">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{value}<span>{unit}</span></span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

function ChipField({
  label, value, options, onChange,
}: {
  label: string; value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void
}) {
  return (
    <div className="form-group">
      <span className="form-label">{label}</span>
      <div className="option-chips">
        {options.map((o) => (
          <button
            key={o.value}
            className={`chip ${value === o.value ? 'active' : ''}`}
            onClick={() => onChange(o.value)}
            type="button"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function ColorField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="form-group">
      <span className="form-label">{label}</span>
      <div className="color-swatches">
        {COLOR_OPTIONS.map((c) => (
          <button
            key={c.value}
            className={`color-swatch ${value === c.value ? 'active' : ''}`}
            style={{ background: c.value }}
            title={c.label}
            onClick={() => onChange(c.value)}
            type="button"
          />
        ))}
      </div>
    </div>
  )
}

function ToggleField({
  label, value, onChange,
}: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  const id = label.replace(/\s/g, '-')
  return (
    <div className="toggle-group">
      <span className="toggle-label">{label}</span>
      <label className="toggle">
        <input type="checkbox" id={id} checked={value} onChange={(e) => onChange(e.target.checked)} />
        <span className="toggle-slider" />
      </label>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 8 }}>
      <span className="badge badge-beige" style={{ fontSize: 10 }}>{children}</span>
    </div>
  )
}

export function ControlPanel({ tipo }: Props) {
  const { config, updateConfig } = useConfiguratorStore()
  const u = updateConfig

  return (
    <div className="control-panel">
      <SectionTitle>Dimensiones</SectionTitle>

      <SliderField label="Largo" value={config.largo} min={3} max={50} onChange={(v) => u({ largo: v })} />
      <SliderField label="Ancho" value={config.ancho} min={2} max={30} onChange={(v) => u({ ancho: v })} />
      <SliderField label="Alto" value={config.alto} min={2} max={12} onChange={(v) => u({ alto: v })} />

      <div className="divider" />

      <ChipField
        label="Tipo de techo"
        value={config.tipoTecho}
        options={
          tipo === 'pergola'
            ? [{ label: 'Plano', value: 'plano' }]
            : [
                { label: 'Plano', value: 'plano' },
                { label: '1 agua', value: '1agua' },
                { label: '2 aguas', value: '2aguas' },
              ]
        }
        onChange={(v) => u({ tipoTecho: v as typeof config.tipoTecho })}
      />

      <ColorField
        label="Color estructura"
        value={config.colorEstructura}
        onChange={(v) => u({ colorEstructura: v })}
      />

      <div className="divider" />

      {tipo === 'nave' && (
        <>
          <SectionTitle>Accesos</SectionTitle>

          <ChipField
            label="Tipo de puerta"
            value={config.tipoPuerta}
            options={[
              { label: 'Seccional', value: 'seccional' },
              { label: 'Corredera', value: 'corredera' },
              { label: 'Enrollable', value: 'enrollable' },
              { label: 'Ninguna', value: 'ninguna' },
            ]}
            onChange={(v) => u({ tipoPuerta: v as typeof config.tipoPuerta })}
          />

          {config.tipoPuerta !== 'ninguna' && (
            <SliderField
              label="Cantidad de puertas"
              value={config.cantidadPuertas}
              min={1}
              max={6}
              step={1}
              unit=" u."
              onChange={(v) => u({ cantidadPuertas: v })}
            />
          )}

          <SliderField
            label="Ventanas"
            value={config.cantidadVentanas}
            min={0}
            max={12}
            step={1}
            unit=" u."
            onChange={(v) => u({ cantidadVentanas: v })}
          />

          <ToggleField label="Tragaluces" value={config.tragaluces} onChange={(v) => u({ tragaluces: v })} />

          <div className="divider" />
          <SectionTitle>Cubierta</SectionTitle>

          <ChipField
            label="Tipo de chapa"
            value={config.tipoChapa}
            options={[
              { label: 'Simple', value: 'simple' },
              { label: 'Sándwich', value: 'sandwich' },
              { label: 'Fibrocemento', value: 'fibrocemento' },
            ]}
            onChange={(v) => u({ tipoChapa: v as typeof config.tipoChapa })}
          />

          <ColorField
            label="Color cubierta"
            value={config.colorCubierta}
            onChange={(v) => u({ colorCubierta: v })}
          />
        </>
      )}

      {tipo === 'cobertizo' && (
        <>
          <SectionTitle>Accesos y cerramientos</SectionTitle>

          <ChipField
            label="Puerta"
            value={config.puertaCobertizo}
            options={[
              { label: 'Levadiza', value: 'levadiza' },
              { label: 'Corredera', value: 'corredera' },
              { label: 'Enrollable', value: 'enrollable' },
              { label: 'Ninguna', value: 'ninguna' },
            ]}
            onChange={(v) => u({ puertaCobertizo: v as typeof config.puertaCobertizo })}
          />

          <ChipField
            label="Laterales"
            value={config.laterales}
            options={[
              { label: 'Cerrados', value: 'cerrados' },
              { label: 'Abiertos', value: 'abiertos' },
              { label: 'Mixto', value: 'mixto' },
            ]}
            onChange={(v) => u({ laterales: v as typeof config.laterales })}
          />

          <div className="divider" />
          <SectionTitle>Cubierta</SectionTitle>

          <ChipField
            label="Tipo de chapa"
            value={config.tipoChapa}
            options={[
              { label: 'Simple', value: 'simple' },
              { label: 'Sándwich', value: 'sandwich' },
            ]}
            onChange={(v) => u({ tipoChapa: v as typeof config.tipoChapa })}
          />

          <ColorField
            label="Color cubierta"
            value={config.colorCubierta}
            onChange={(v) => u({ colorCubierta: v })}
          />
        </>
      )}

      {tipo === 'pergola' && (
        <>
          <SectionTitle>Cubierta y cerramientos</SectionTitle>

          <ChipField
            label="Cubierta"
            value={config.cubiertaPergola}
            options={[
              { label: 'Policarbonato', value: 'policarbonato' },
              { label: 'PVC', value: 'pvc' },
              { label: 'Abierta', value: 'abierta' },
            ]}
            onChange={(v) => u({ cubiertaPergola: v as typeof config.cubiertaPergola })}
          />

          <ToggleField
            label="Cerramientos laterales"
            value={config.cerramientosLaterales}
            onChange={(v) => u({ cerramientosLaterales: v })}
          />
        </>
      )}

      {tipo === 'modulo' && (
        <>
          <SectionTitle>Puertas y ventanas</SectionTitle>

          <SliderField
            label="Puertas"
            value={config.cantidadPuertasModulo}
            min={1}
            max={4}
            step={1}
            unit=" u."
            onChange={(v) => u({ cantidadPuertasModulo: v })}
          />

          <SliderField
            label="Ventanas"
            value={config.cantidadVentanasModulo}
            min={0}
            max={6}
            step={1}
            unit=" u."
            onChange={(v) => u({ cantidadVentanasModulo: v })}
          />

          <div className="divider" />
          <SectionTitle>Terminaciones</SectionTitle>

          <ToggleField label="Aislamiento térmico" value={config.aislamiento} onChange={(v) => u({ aislamiento: v })} />
          <ToggleField label="Eléctrica preinstalada" value={config.electricidad} onChange={(v) => u({ electricidad: v })} />
          <ToggleField label="Revestimiento interior" value={config.revestimientoInterior} onChange={(v) => u({ revestimientoInterior: v })} />

          <ChipField
            label="Suelo"
            value={config.suelo}
            options={[
              { label: 'OSB', value: 'osb' },
              { label: 'Contrachapado', value: 'contrachapado' },
              { label: 'Sin suelo', value: 'sin-suelo' },
            ]}
            onChange={(v) => u({ suelo: v as typeof config.suelo })}
          />

          <ColorField
            label="Color exterior"
            value={config.colorExterior}
            onChange={(v) => u({ colorExterior: v })}
          />
        </>
      )}

      <style>{`
        .control-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 24px;
          height: 100%;
          overflow-y: auto;
        }
      `}</style>
    </div>
  )
}
