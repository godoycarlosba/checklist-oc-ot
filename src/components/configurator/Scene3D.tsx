import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Environment, PerspectiveCamera } from '@react-three/drei'
import { StructureMesh } from './StructureMesh'
import type { ConfiguratorConfig, Tipo } from '../../lib/pricing'

interface Props {
  tipo: Tipo
  config: ConfiguratorConfig
  canvasRef?: React.RefObject<HTMLCanvasElement>
}

function SceneContent({ tipo, config }: { tipo: Tipo; config: ConfiguratorConfig }) {
  const maxDim = Math.max(config.largo, config.ancho)
  const camDistance = maxDim * 1.8

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[camDistance * 0.7, camDistance * 0.5, camDistance * 0.9]}
        fov={45}
      />

      <ambientLight intensity={0.4} color="#e8dcc4" />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-10, 8, -10]} intensity={0.3} color="#c8944a" />

      <Suspense fallback={null}>
        <StructureMesh tipo={tipo} config={config} />
      </Suspense>

      <Grid
        position={[0, 0, 0]}
        args={[80, 80]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#2a2a2a"
        sectionSize={5}
        sectionThickness={0.8}
        sectionColor="#333333"
        fadeDistance={60}
        fadeStrength={1}
      />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, config.alto / 3, 0]}
      />
    </>
  )
}

export function Scene3D({ tipo, config, canvasRef }: Props) {
  return (
    <div className="scene-3d">
      <Canvas
        ref={canvasRef}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        shadows
        style={{ background: '#0d0d0d' }}
      >
        <SceneContent tipo={tipo} config={config} />
      </Canvas>

      <div className="scene-controls-hint">
        <span>🖱️ Drag para rotar · Scroll para zoom · Shift+drag para mover</span>
      </div>

      <style>{`
        .scene-3d {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 0;
        }
        .scene-controls-hint {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(10,10,10,0.7);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(232,220,196,0.1);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 11px;
          color: var(--gray-light);
          pointer-events: none;
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}
