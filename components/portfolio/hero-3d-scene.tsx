"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sphere, Stars, Trail } from "@react-three/drei"
import type * as THREE from "three"

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.8, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#8b5cf6"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

function OrbitingParticle({
  radius,
  speed,
  offset,
  color,
  size = 0.08,
}: {
  radius: number
  speed: number
  offset: number
  color: string
  size?: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + offset
      ref.current.position.x = Math.cos(t) * radius
      ref.current.position.z = Math.sin(t) * radius
      ref.current.position.y = Math.sin(t * 2) * 0.3
    }
  })

  return (
    <Trail width={0.5} length={8} color={color} attenuation={(t) => t * t}>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </Trail>
  )
}

function OrbitRings() {
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.1
      ring1Ref.current.rotation.z = t * 0.1
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 3
      ring2Ref.current.rotation.z = -t * 0.15
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI / 2.5
      ring3Ref.current.rotation.y = t * 0.08
    }
  })

  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.8, 0.02, 16, 100]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.2, 0.015, 16, 100]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.5} transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.6, 0.01, 16, 100]} />
        <meshStandardMaterial color="#c4b5fd" emissive="#c4b5fd" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>
    </>
  )
}

function FloatingCubes() {
  const cubesData = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4 - 2] as [
        number,
        number,
        number,
      ],
      rotation: Math.random() * Math.PI,
      speed: 0.2 + Math.random() * 0.3,
      scale: 0.1 + Math.random() * 0.15,
    }))
  }, [])

  return (
    <>
      {cubesData.map((cube, i) => (
        <FloatingCube key={i} {...cube} />
      ))}
    </>
  )
}

function FloatingCube({
  position,
  rotation,
  speed,
  scale,
}: {
  position: [number, number, number]
  rotation: number
  speed: number
  scale: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed + rotation
      ref.current.rotation.y = state.clock.elapsedTime * speed * 0.5
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5
    }
  })

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1]} />
      <meshStandardMaterial
        color="#8b5cf6"
        emissive="#8b5cf6"
        emissiveIntensity={0.3}
        transparent
        opacity={0.6}
        wireframe
      />
    </mesh>
  )
}

function Scene() {
  const orbitingParticles = useMemo(
    () => [
      { radius: 2.8, speed: 0.8, offset: 0, color: "#8b5cf6", size: 0.1 },
      { radius: 2.8, speed: 0.8, offset: Math.PI, color: "#a78bfa", size: 0.08 },
      { radius: 3.2, speed: -0.6, offset: Math.PI / 2, color: "#c4b5fd", size: 0.07 },
      { radius: 3.2, speed: -0.6, offset: Math.PI * 1.5, color: "#ddd6fe", size: 0.06 },
      { radius: 3.6, speed: 0.4, offset: Math.PI / 4, color: "#7c3aed", size: 0.09 },
      { radius: 3.6, speed: 0.4, offset: Math.PI * 1.25, color: "#6d28d9", size: 0.08 },
    ],
    [],
  )

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a78bfa" />
      <spotLight position={[0, 10, 0]} intensity={0.8} color="#ffffff" angle={0.3} penumbra={1} />

      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

      <AnimatedSphere />
      <OrbitRings />

      {orbitingParticles.map((particle, i) => (
        <OrbitingParticle key={i} {...particle} />
      ))}

      <FloatingCubes />
    </>
  )
}

export function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Scene />
      </Canvas>
    </div>
  )
}
