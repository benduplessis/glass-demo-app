/* eslint-disable react/no-unknown-property */
import * as THREE from 'three'
import { useRef, useState, useEffect, memo } from 'react'
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber'
import {
  useFBO,
  useGLTF,
  useScroll,
  Scroll,
  Preload,
  ScrollControls,
  MeshTransmissionMaterial,
  Text,
} from '@react-three/drei'
import { easing } from 'maath'

export default function EnhancedFluidGlass({
  mode = 'lens',
  lensProps = {},
  barProps = {},
  cubeProps = {},
  backgroundContent = null, // New prop for background content
  backgroundColor = '#f8f9fa', // Fallback color
}) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens
  const rawOverrides =
    mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps

  const {
    navItems = [
      { label: 'Home', link: '' },
      { label: 'About', link: '' },
      { label: 'Contact', link: '' },
    ],
    ...modeProps
  } = rawOverrides

  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 15 }}
      gl={{ alpha: true }}
    >
      <ScrollControls damping={0.2} pages={3} distance={0.4}>
        {mode === 'bar' && <NavItems items={navItems} />}
        <Wrapper modeProps={modeProps}>
          <Scroll>
            <BackgroundRenderer 
              backgroundContent={backgroundContent} 
              backgroundColor={backgroundColor}
            />
          </Scroll>
          <Scroll html />
          <Preload />
        </Wrapper>
      </ScrollControls>
    </Canvas>
  )
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  ...props
}) {
  const ref = useRef()
  const { nodes } = useGLTF(glb)
  const buffer = useFBO()
  const { viewport: vp } = useThree()
  const [scene] = useState(() => new THREE.Scene())
  const geoWidthRef = useRef(1)

  useEffect(() => {
    const geo = nodes[geometryKey]?.geometry
    if (geo) {
      geo.computeBoundingBox()
      geoWidthRef.current =
        geo.boundingBox.max.x - geo.boundingBox.min.x || 1
    }
  }, [nodes, geometryKey])

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state
    const v = viewport.getCurrentViewport(camera, [0, 0, 15])

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0
    const destY = lockToBottom
      ? -v.height / 2 + 0.2
      : followPointer
        ? (pointer.y * v.height) / 2
        : 0
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta)

    if (modeProps.scale == null) {
      const maxWorld = v.width * 0.9
      const desired = maxWorld / geoWidthRef.current
      ref.current.scale.setScalar(Math.min(0.15, desired))
    }

    gl.setRenderTarget(buffer)
    gl.render(scene, camera)
    gl.setRenderTarget(null)

    // Enhanced background color with better contrast
    gl.setClearColor(0xf8f9fa, 0.95)
  })

  const {
    scale,
    ior,
    thickness,
    anisotropy,
    chromaticAberration,
    ...extraMat
  } = modeProps

  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      <mesh
        ref={ref}
        scale={scale ?? 0.15}
        rotation-x={Math.PI / 2}
        geometry={nodes[geometryKey]?.geometry}
        {...props}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          {...extraMat}
        />
      </mesh>
    </>
  )
})

function Lens({ modeProps, ...p }) {
  return (
    <ModeWrapper
      glb="/assets/3d/lens.glb"
      geometryKey="Cylinder"
      followPointer
      modeProps={modeProps}
      {...p}
    />
  )
}

function Cube({ modeProps, ...p }) {
  return (
    <ModeWrapper
      glb="/assets/3d/cube.glb"
      geometryKey="Cube"
      followPointer
      modeProps={modeProps}
      {...p}
    />
  )
}

function Bar({ modeProps = {}, ...p }) {
  const defaultMat = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: 0.25,
  }

  return (
    <ModeWrapper
      glb="/assets/3d/bar.glb"
      geometryKey="Cube"
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    />
  )
}

function NavItems({ items }) {
  const group = useRef()
  const { viewport, camera } = useThree()

  const DEVICE = {
    mobile: { max: 639, spacing: 0.2, fontSize: 0.035 },
    tablet: { max: 1023, spacing: 0.24, fontSize: 0.045 },
    desktop: { max: Infinity, spacing: 0.3, fontSize: 0.045 },
  }
  const getDevice = () => {
    const w = window.innerWidth
    return w <= DEVICE.mobile.max
      ? 'mobile'
      : w <= DEVICE.tablet.max
        ? 'tablet'
        : 'desktop'
  }

  const [device, setDevice] = useState(getDevice())

  useEffect(() => {
    const onResize = () => setDevice(getDevice())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { spacing, fontSize } = DEVICE[device]

  useFrame(() => {
    if (!group.current) return
    const v = viewport.getCurrentViewport(camera, [0, 0, 15])
    group.current.position.set(0, -v.height / 2 + 0.2, 15.1)

    group.current.children.forEach((child, i) => {
      child.position.x = (i - (items.length - 1) / 2) * spacing
    })
  })

  const handleNavigate = (link) => {
    if (!link) return
    link.startsWith('#')
      ? (window.location.hash = link)
      : (window.location.href = link)
  }

  return (
    <group ref={group} renderOrder={10}>
      {items.map(({ label, link }) => (
        <Text
          key={label}
          fontSize={fontSize}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/assets/fonts/figtreeblack.ttf"
          depthWrite={false}
          outlineWidth={0}
          outlineBlur="20%"
          outlineColor="#000"
          outlineOpacity={0.5}
          depthTest={false}
          renderOrder={10}
          onClick={(e) => {
            e.stopPropagation()
            handleNavigate(link)
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          {label}
        </Text>
      ))}
    </group>
  )
}

// New component to render background content instead of just images
function BackgroundRenderer({ backgroundContent, backgroundColor }) {
  const group = useRef()
  const data = useScroll()
  const { height, width } = useThree((s) => s.viewport)

  useFrame(() => {
    if (group.current.children[0]) {
      // Create a subtle zoom effect based on scroll
      const zoomFactor = 1 + data.range(0, 1) / 10 // More subtle zoom
      group.current.scale.setScalar(zoomFactor)
      
      // Add subtle rotation for dynamic feel
      group.current.rotation.z = data.range(0, 1) * 0.05
    }
  })

  return (
    <group ref={group}>
      {/* Background plane */}
      <mesh position={[0, 0, -1]} scale={[width * 2, height * 2, 1]}>
        <planeGeometry />
        <meshBasicMaterial 
          color={backgroundColor} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Gradient overlay for depth */}
      <mesh position={[0, 0, -0.5]} scale={[width * 1.5, height * 1.5, 1]}>
        <planeGeometry />
        <meshBasicMaterial 
          transparent 
          opacity={0.3}
        >
          <meshBasicMaterial attach="material" transparent>
            <primitive 
              attach="map" 
              object={(() => {
                const canvas = document.createElement('canvas')
                canvas.width = 512
                canvas.height = 512
                const ctx = canvas.getContext('2d')
                
                // Create radial gradient
                const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
                gradient.addColorStop(0, 'rgba(135, 206, 235, 0.2)')
                gradient.addColorStop(0.5, 'rgba(173, 216, 230, 0.15)')
                gradient.addColorStop(1, 'rgba(255, 182, 193, 0.1)')
                
                ctx.fillStyle = gradient
                ctx.fillRect(0, 0, 512, 512)
                
                const texture = new THREE.CanvasTexture(canvas)
                texture.needsUpdate = true
                return texture
              })()} 
            />
          </meshBasicMaterial>
        </meshBasicMaterial>
      </mesh>
      
      {/* Optional: Render custom background content */}
      {backgroundContent}
    </group>
  )
}

function Typography() {
  const DEVICE = {
    mobile: { fontSize: 0.2 },
    tablet: { fontSize: 0.40 },
    desktop: { fontSize: 0.7 },
  }
  const getDevice = () => {
    const w = window.innerWidth
    return w <= 639
      ? 'mobile'
      : w <= 1023
        ? 'tablet'
        : 'desktop'
  }

  const [device, setDevice] = useState(getDevice())

  useEffect(() => {
    const onResize = () => setDevice(getDevice())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}