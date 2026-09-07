"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function ParticleField({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const { positions, sizes, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      sizes[i] = Math.random() * 1.6 + 0.4;
      speeds[i] = 0.4 + Math.random() * 1.2;
    }
    return { positions, sizes, speeds };
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.02;
      ref.current.rotation.x = Math.sin(t * 0.05) * 0.05;
      const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        const j = i * 3;
        const speed = speeds[i];
        attr.array[j + 1] = positions[j + 1] + Math.sin(t * speed + i) * 0.35;
        attr.array[j + 2] = positions[j + 2] + Math.cos(t * speed * 0.8 + i) * 0.3;
      }
      attr.needsUpdate = true;
    }
    void viewport;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors={false}
        color="#a78bfa"
        transparent
        opacity={0.6}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function MeshWave() {
  const ref = useRef<THREE.Mesh>(null);
  const { pos, geom } = useMemo(() => {
    const w = 16;
    const h = 8;
    const segW = 80;
    const segH = 40;
    const geom = new THREE.PlaneGeometry(w, h, segW, segH);
    const pos = (geom.attributes.position as THREE.BufferAttribute).array.slice();
    return { pos, geom };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const attr = geom.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      const x = attr.getX(i);
      const z = attr.getZ(i);
      attr.setY(i, Math.sin(x * 0.6 + t) * 0.28 + Math.cos(z * 0.5 + t * 0.8) * 0.18);
    }
    attr.needsUpdate = true;
    if (ref.current) {
      const n = (ref.current.geometry.attributes.normal as THREE.BufferAttribute) || geom.attributes.normal;
      n.needsUpdate = true;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.7, 0, 0]} position={[0, -1.2, 0]}>
      <primitive object={geom} attach="geometry" />
      <meshStandardMaterial
        color="#7c3aed"
        wireframe
        transparent
        opacity={0.18}
        emissive="#22d3ee"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}

const Hero3D = () => {
  return (
    <div className="pointer-events-none absolute inset-0 bottom-24">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[4, 4, 4]} intensity={0.8} color="#a78bfa" />
        <pointLight position={[-4, -2, 3]} intensity={0.6} color="#22d3ee" />
        <MeshWave />
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default Hero3D;