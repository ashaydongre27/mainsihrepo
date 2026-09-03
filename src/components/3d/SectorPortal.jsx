import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus, Float } from '@react-three/drei';

const Portal = ({ position, color, speed }) => {
  const torusRef = useRef();

  useFrame((state, delta) => {
    if (torusRef.current) {
      torusRef.current.rotation.x += delta * 0.4;
      torusRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <Float speed={speed} floatIntensity={0.8} rotationIntensity={0.6}>
      <group position={position}>
        <Torus ref={torusRef} args={[1.2, 0.06, 16, 64]}>
          <meshStandardMaterial
            emissive={color}
            emissiveIntensity={2}
            color="#0a0a14"
            metalness={0.85}
            roughness={0.2}
            wireframe={false}
          />
        </Torus>
        <pointLight color={color} intensity={8} distance={8} />
      </group>
    </Float>
  );
};

export default function SectorPortal() {
  return (
    <group position={[0, -1, 0]}>
      <Portal
        position={[-6, 0, -4]}
        color="#8b5cf6"
        speed={1.2}
      />
      <Portal
        position={[6, 0, -4]}
        color="#10b981"
        speed={1.5}
      />
      <Portal
        position={[0, -2, 2]}
        color="#3b82f6"
        speed={1.0}
      />
    </group>
  );
}
