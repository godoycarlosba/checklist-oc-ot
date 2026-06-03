import { useRef } from 'react'
import * as THREE from 'three'
import type { ConfiguratorConfig, Tipo } from '../../lib/pricing'

interface Props {
  tipo: Tipo
  config: ConfiguratorConfig
}

function useRoofGeometry(ancho: number, ridgeH: number) {
  const panelWidth = Math.sqrt((ancho / 2) ** 2 + ridgeH ** 2)
  const angle = Math.atan2(ridgeH, ancho / 2)
  return { panelWidth, angle }
}

function Columns({ ancho, largo, alto, color }: { ancho: number; largo: number; alto: number; color: string }) {
  const colSize: [number, number, number] = [0.2, alto, 0.2]
  const corners: [number, number, number][] = [
    [-ancho / 2 + 0.1, alto / 2, -largo / 2 + 0.1],
    [ancho / 2 - 0.1, alto / 2, -largo / 2 + 0.1],
    [-ancho / 2 + 0.1, alto / 2, largo / 2 - 0.1],
    [ancho / 2 - 0.1, alto / 2, largo / 2 - 0.1],
  ]
  return (
    <>
      {corners.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={colSize} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} />
        </mesh>
      ))}
    </>
  )
}

function FlatRoof({ ancho, largo, alto, color }: { ancho: number; largo: number; alto: number; color: string }) {
  return (
    <mesh position={[0, alto + 0.06, 0]}>
      <boxGeometry args={[ancho + 0.4, 0.12, largo + 0.4]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
    </mesh>
  )
}

function PitchedRoof({
  ancho, largo, alto, ridgeH, color,
}: { ancho: number; largo: number; alto: number; ridgeH: number; color: string }) {
  const { panelWidth, angle } = useRoofGeometry(ancho, ridgeH)
  return (
    <>
      <mesh position={[-ancho / 4, alto + ridgeH / 2, 0]} rotation={[0, 0, angle]}>
        <boxGeometry args={[panelWidth, 0.1, largo + 0.4]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[ancho / 4, alto + ridgeH / 2, 0]} rotation={[0, 0, -angle]}>
        <boxGeometry args={[panelWidth, 0.1, largo + 0.4]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
    </>
  )
}

function MonoRoof({
  ancho, largo, alto, ridgeH, color,
}: { ancho: number; largo: number; alto: number; ridgeH: number; color: string }) {
  const panelWidth = Math.sqrt(ancho ** 2 + ridgeH ** 2)
  const angle = Math.atan2(ridgeH, ancho)
  return (
    <mesh position={[0, alto + ridgeH / 2, 0]} rotation={[0, 0, angle]}>
      <boxGeometry args={[panelWidth, 0.1, largo + 0.4]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
    </mesh>
  )
}

function Walls({
  ancho, largo, alto, color, opacity = 1,
}: { ancho: number; largo: number; alto: number; color: string; opacity?: number }) {
  const mat = <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} transparent opacity={opacity} />
  return (
    <>
      <mesh position={[0, alto / 2, -largo / 2]}>
        <boxGeometry args={[ancho, alto, 0.08]} />
        {mat}
      </mesh>
      <mesh position={[0, alto / 2, largo / 2]}>
        <boxGeometry args={[ancho, alto, 0.08]} />
        {mat}
      </mesh>
      <mesh position={[-ancho / 2, alto / 2, 0]}>
        <boxGeometry args={[0.08, alto, largo]} />
        {mat}
      </mesh>
      <mesh position={[ancho / 2, alto / 2, 0]}>
        <boxGeometry args={[0.08, alto, largo]} />
        {mat}
      </mesh>
    </>
  )
}

function Door({
  x, z, width, height, wallAxis,
}: { x: number; z: number; width: number; height: number; wallAxis: 'x' | 'z' }) {
  const rotY = wallAxis === 'x' ? 0 : 0
  return (
    <mesh position={[x, height / 2, z]} rotation={[0, rotY, 0]}>
      <boxGeometry args={wallAxis === 'z' ? [width, height, 0.12] : [0.12, height, width]} />
      <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

function Window({ x, y, z, wallAxis }: { x: number; y: number; z: number; wallAxis: 'x' | 'z' }) {
  return (
    <mesh position={[x, y, z]}>
      <boxGeometry args={wallAxis === 'z' ? [1.2, 1.0, 0.1] : [0.1, 1.0, 1.2]} />
      <meshStandardMaterial color="#4a90d9" metalness={0.1} roughness={0.0} transparent opacity={0.6} />
    </mesh>
  )
}

function GroundShadow({ ancho, largo }: { ancho: number; largo: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
      <planeGeometry args={[ancho + 2, largo + 2]} />
      <meshStandardMaterial color="#1a1a1a" transparent opacity={0.6} />
    </mesh>
  )
}

export function StructureMesh({ tipo, config }: Props) {
  const { largo, ancho, alto, tipoTecho, colorEstructura, colorCubierta, colorExterior } = config

  const roofColor = colorCubierta || colorEstructura
  const ridgeH = Math.max(0.6, ancho * 0.18)
  const baseColor = tipo === 'modulo' ? (colorExterior || colorEstructura) : colorEstructura

  return (
    <group>
      <GroundShadow ancho={ancho} largo={largo} />

      {tipo === 'nave' && (
        <>
          <Columns ancho={ancho} largo={largo} alto={alto} color={colorEstructura} />
          <Walls ancho={ancho} largo={largo} alto={alto} color={colorEstructura} />
          {tipoTecho === '2aguas' && (
            <PitchedRoof ancho={ancho} largo={largo} alto={alto} ridgeH={ridgeH} color={roofColor} />
          )}
          {tipoTecho === '1agua' && (
            <MonoRoof ancho={ancho} largo={largo} alto={alto} ridgeH={ridgeH * 0.6} color={roofColor} />
          )}
          {tipoTecho === 'plano' && (
            <FlatRoof ancho={ancho} largo={largo} alto={alto} color={roofColor} />
          )}
          {config.cantidadPuertas > 0 && config.tipoPuerta !== 'ninguna' && (
            <Door x={0} z={-largo / 2} width={3.5} height={Math.min(alto - 0.3, 4)} wallAxis="z" />
          )}
          {config.cantidadVentanas > 0 && (
            <>
              <Window x={-ancho / 2} y={alto * 0.6} z={-largo / 4} wallAxis="x" />
              {config.cantidadVentanas > 1 && (
                <Window x={ancho / 2} y={alto * 0.6} z={-largo / 4} wallAxis="x" />
              )}
            </>
          )}
        </>
      )}

      {tipo === 'cobertizo' && (
        <>
          <Columns ancho={ancho} largo={largo} alto={alto} color={colorEstructura} />
          {config.laterales === 'cerrados' && (
            <Walls ancho={ancho} largo={largo} alto={alto} color={colorEstructura} />
          )}
          {config.laterales === 'abiertos' && (
            <>
              <mesh position={[0, alto / 2, -largo / 2]}>
                <boxGeometry args={[ancho, alto, 0.08]} />
                <meshStandardMaterial color={colorEstructura} metalness={0.4} roughness={0.6} />
              </mesh>
              <mesh position={[0, alto / 2, largo / 2]}>
                <boxGeometry args={[ancho, alto, 0.08]} />
                <meshStandardMaterial color={colorEstructura} metalness={0.4} roughness={0.6} />
              </mesh>
            </>
          )}
          {config.laterales === 'mixto' && (
            <Walls ancho={ancho} largo={largo} alto={alto} color={colorEstructura} opacity={0.5} />
          )}
          {tipoTecho === '2aguas' ? (
            <PitchedRoof ancho={ancho} largo={largo} alto={alto} ridgeH={ridgeH} color={roofColor} />
          ) : tipoTecho === '1agua' ? (
            <MonoRoof ancho={ancho} largo={largo} alto={alto} ridgeH={ridgeH * 0.6} color={roofColor} />
          ) : (
            <FlatRoof ancho={ancho} largo={largo} alto={alto} color={roofColor} />
          )}
          {config.puertaCobertizo !== 'ninguna' && (
            <Door x={0} z={-largo / 2} width={ancho * 0.7} height={Math.min(alto - 0.3, 3)} wallAxis="z" />
          )}
        </>
      )}

      {tipo === 'pergola' && (
        <>
          {/* Columns only */}
          <Columns ancho={ancho} largo={largo} alto={alto} color={colorEstructura} />

          {/* Top frame beams */}
          <mesh position={[0, alto, -largo / 2]}>
            <boxGeometry args={[ancho, 0.15, 0.15]} />
            <meshStandardMaterial color={colorEstructura} metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, alto, largo / 2]}>
            <boxGeometry args={[ancho, 0.15, 0.15]} />
            <meshStandardMaterial color={colorEstructura} metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[-ancho / 2, alto, 0]}>
            <boxGeometry args={[0.15, 0.15, largo]} />
            <meshStandardMaterial color={colorEstructura} metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[ancho / 2, alto, 0]}>
            <boxGeometry args={[0.15, 0.15, largo]} />
            <meshStandardMaterial color={colorEstructura} metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Cross beams every 1.5m */}
          {Array.from({ length: Math.floor(largo / 1.5) - 1 }, (_, i) => (
            <mesh key={i} position={[0, alto, -largo / 2 + 1.5 * (i + 1)]}>
              <boxGeometry args={[ancho, 0.1, 0.1]} />
              <meshStandardMaterial color={colorEstructura} metalness={0.9} roughness={0.1} />
            </mesh>
          ))}

          {/* Roof cover */}
          {config.cubiertaPergola === 'policarbonato' && (
            <mesh position={[0, alto + 0.06, 0]}>
              <boxGeometry args={[ancho + 0.2, 0.06, largo + 0.2]} />
              <meshStandardMaterial color="#88ccff" transparent opacity={0.35} metalness={0} roughness={0.1} />
            </mesh>
          )}
          {config.cubiertaPergola === 'pvc' && (
            <mesh position={[0, alto + 0.06, 0]}>
              <boxGeometry args={[ancho + 0.2, 0.06, largo + 0.2]} />
              <meshStandardMaterial color="#dddddd" transparent opacity={0.5} />
            </mesh>
          )}

          {/* Lateral enclosures */}
          {config.cerramientosLaterales && (
            <Walls ancho={ancho} largo={largo} alto={alto} color={colorEstructura} opacity={0.25} />
          )}
        </>
      )}

      {tipo === 'modulo' && (
        <>
          <Columns ancho={ancho} largo={largo} alto={alto} color={colorEstructura} />
          <Walls ancho={ancho} largo={largo} alto={alto} color={baseColor} />
          {tipoTecho === '2aguas' ? (
            <PitchedRoof ancho={ancho} largo={largo} alto={alto} ridgeH={ridgeH} color={roofColor} />
          ) : tipoTecho === '1agua' ? (
            <MonoRoof ancho={ancho} largo={largo} alto={alto} ridgeH={ridgeH * 0.6} color={roofColor} />
          ) : (
            <FlatRoof ancho={ancho} largo={largo} alto={alto} color={roofColor} />
          )}

          {/* Door */}
          <Door
            x={0}
            z={-largo / 2}
            width={Math.min(ancho * 0.35, 1.0)}
            height={2.1}
            wallAxis="z"
          />

          {/* Windows */}
          {config.cantidadVentanasModulo > 0 && (
            <Window x={-ancho / 2} y={alto * 0.55} z={0} wallAxis="x" />
          )}
          {config.cantidadVentanasModulo > 1 && (
            <Window x={ancho / 2} y={alto * 0.55} z={0} wallAxis="x" />
          )}
          {config.cantidadVentanasModulo > 2 && (
            <Window x={0} y={alto * 0.55} z={largo / 2} wallAxis="z" />
          )}

          {/* Insulation indicator (slight tint) */}
          {config.aislamiento && (
            <mesh position={[0, alto / 2, 0]}>
              <boxGeometry args={[ancho - 0.2, alto - 0.2, largo - 0.2]} />
              <meshStandardMaterial color="#c8944a" transparent opacity={0.04} />
            </mesh>
          )}
        </>
      )}
    </group>
  )
}
