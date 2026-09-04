import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import Starfield from './Starfield';

function FloatingTotem({ color = '#8b5cf6', position = [4, 0, -5] }) {
  const meshRef = useRef();
  const innerRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.25;
      meshRef.current.rotation.y += delta * 0.4;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.2;
      innerRef.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
      <group position={position}>
        {/* Outer Wireframe Icosahedron */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Inner Subtle Core */}
        <mesh ref={innerRef}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={color}
            emissiveIntensity={1.5}
            transparent
            opacity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        <pointLight color={color} intensity={8} distance={8} />
      </group>
    </Float>
  );
}

export default function Dynamic3DScene({ theme = 'student', showTotem = true, totemPosition = [4, 0, -5] }) {
  const themeColors = {
    student: '#a855f7',
    academy: '#10b981',
    industry: '#3b82f6',
    auth: '#6366f1'
  };

  const primaryColor = themeColors[theme] || '#8b5cf6';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-15">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color={primaryColor} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#38bdf8" />
        
        {/* Background Particles */}
        <Starfield />

        {/* Floating 3D Sector Totem in distant background */}
        {showTotem && (
          <FloatingTotem color={primaryColor} position={totemPosition} />
        )}
      </Canvas>
    </div>
  );
}
