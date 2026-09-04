import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float } from '@react-three/drei';

export default function NexusCore() {
  const sphereRef = useRef();

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.005;
      sphereRef.current.rotation.x += 0.002;
    }
  });

  return (
    <Float speed={2} floatIntensity={0.5}>
      <group>
        <Sphere ref={sphereRef} args={[1.5, 64, 64]}>
          <meshStandardMaterial
            emissive="#6366f1"
            emissiveIntensity={2}
            color="#1e1b4b"
            metalness={0.9}
            roughness={0.1}
            wireframe={true}
          />
        </Sphere>
        <pointLight color="#818cf8" intensity={30} distance={20} />
      </group>
    </Float>
  );
}
