import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Edges } from '@react-three/drei';
import * as THREE from 'three';

// Price tag that floats near furniture
function PriceLabel({
  position,
  price,
  label,
  color,
  delay,
}: {
  position: [number, number, number];
  price: string;
  label: string;
  color: string;
  delay: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const opacityRef = useRef(0);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const elapsed = Math.max(0, t - delay);
    opacityRef.current = Math.min(1, elapsed * 1.5);

    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 1.2 + delay) * 0.05;
      ref.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
          child.material.opacity = opacityRef.current * 0.85;
        }
      });
    }
  });

  const hexColor = color;

  return (
    <group ref={ref} position={position}>
      {/* Card backing */}
      <mesh>
        <planeGeometry args={[0.45, 0.22]} />
        <meshBasicMaterial color={hexColor} transparent opacity={0} />
      </mesh>
      {/* Glow ring */}
      <mesh>
        <ringGeometry args={[0.15, 0.18, 24]} />
        <meshBasicMaterial color={hexColor} transparent opacity={0} />
      </mesh>
    </group>
  );
}

// A furniture piece that materializes after `delay` seconds
function MaterializingPiece({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const elapsed = Math.max(0, t - delay);
    const progress = Math.min(1, elapsed * 1.2);
    if (ref.current) {
      ref.current.scale.setScalar(progress);
      ref.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshBasicMaterial;
          if (mat && mat.transparent !== undefined) {
            mat.opacity = Math.min(mat.opacity + 0.01, progress * (mat.userData.targetOpacity ?? 0));
          }
        }
      });
    }
  });

  return <group ref={ref} scale={0}>{children}</group>;
}

function WireframeRoom() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Very subtle slow drift — no full rotation, first-person feel
      groupRef.current.rotation.y = Math.sin(t * 0.07) * 0.12;
      groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.03;
    }
  });

  const edgeColor = '#1a8fa0';
  const accentColor = '#c48840';

  return (
    <Float speed={0.5} rotationIntensity={0.02} floatIntensity={0.15}>
      <group ref={groupRef} scale={1.6} position={[0.2, -0.5, 0]}>

        {/* Floor */}
        <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 3.5]} />
          <meshBasicMaterial transparent opacity={0.03} color="#1a8fa0" />
          <Edges color={edgeColor} threshold={15} lineWidth={1.5} />
        </mesh>

        {/* Floor grid lines */}
        {[-1.5, -0.75, 0, 0.75, 1.5].map((x, i) => (
          <mesh key={`fgx${i}`} position={[x, -1.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.01, 3.5]} />
            <meshBasicMaterial color={edgeColor} transparent opacity={0.07} />
          </mesh>
        ))}
        {[-1.5, -0.75, 0, 0.75, 1.5].map((z, i) => (
          <mesh key={`fgz${i}`} position={[0, -1.19, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4, 0.01]} />
            <meshBasicMaterial color={edgeColor} transparent opacity={0.07} />
          </mesh>
        ))}

        {/* Back wall */}
        <mesh position={[0, 0.05, -1.75]}>
          <planeGeometry args={[4, 2.5]} />
          <meshBasicMaterial transparent opacity={0.02} color="#1a8fa0" />
          <Edges color={edgeColor} threshold={15} lineWidth={1.5} />
        </mesh>

        {/* Left wall */}
        <mesh position={[-2, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[3.5, 2.5]} />
          <meshBasicMaterial transparent opacity={0.02} color="#1a8fa0" />
          <Edges color={edgeColor} threshold={15} lineWidth={1.5} />
        </mesh>

        {/* Ceiling line */}
        <mesh position={[0, 1.25, -1.75]}>
          <boxGeometry args={[4, 0.02, 0.02]} />
          <meshBasicMaterial color={edgeColor} transparent opacity={0.15} />
        </mesh>
        <mesh position={[-2, 1.25, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[3.5, 0.02, 0.02]} />
          <meshBasicMaterial color={edgeColor} transparent opacity={0.15} />
        </mesh>

        {/* === SOFA — materializes at 0.5s === */}
        <MaterializingPiece delay={0.5}>
          <group position={[-0.5, -0.75, -1.1]}>
            {/* Seat */}
            <mesh>
              <boxGeometry args={[1.8, 0.45, 0.75]} />
              <meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} />
              <Edges color={accentColor} threshold={15} lineWidth={1.5} />
            </mesh>
            {/* Back */}
            <mesh position={[0, 0.38, -0.3]}>
              <boxGeometry args={[1.8, 0.42, 0.18]} />
              <meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} />
              <Edges color={accentColor} threshold={15} lineWidth={1.5} />
            </mesh>
            {/* Arms */}
            <mesh position={[-0.82, 0.15, 0]}>
              <boxGeometry args={[0.16, 0.28, 0.75]} />
              <meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} />
              <Edges color={accentColor} threshold={15} lineWidth={1.2} />
            </mesh>
            <mesh position={[0.82, 0.15, 0]}>
              <boxGeometry args={[0.16, 0.28, 0.75]} />
              <meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} />
              <Edges color={accentColor} threshold={15} lineWidth={1.2} />
            </mesh>
            {/* Cushions */}
            {[-0.5, 0.5].map((x, i) => (
              <mesh key={i} position={[x, 0.25, 0.05]}>
                <boxGeometry args={[0.7, 0.3, 0.6]} />
                <meshBasicMaterial transparent opacity={0.015} color={accentColor} />
                <Edges color={accentColor} threshold={15} lineWidth={0.8} />
              </mesh>
            ))}
          </group>
        </MaterializingPiece>

        {/* Price tag — Sofa */}
        <PriceLabel position={[0.55, -0.4, -1.1]} price="₹42,000" label="Sofa" color={accentColor} delay={1.2} />

        {/* === COFFEE TABLE — materializes at 1.1s === */}
        <MaterializingPiece delay={1.1}>
          <group position={[-0.5, -1.02, -0.1]}>
            <mesh>
              <boxGeometry args={[0.9, 0.06, 0.55]} />
              <meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} />
              <Edges color={edgeColor} threshold={15} lineWidth={1.5} />
            </mesh>
            {[[-0.38, -0.12, -0.22], [0.38, -0.12, -0.22], [-0.38, -0.12, 0.22], [0.38, -0.12, 0.22]].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]}>
                <cylinderGeometry args={[0.02, 0.02, 0.22, 6]} />
                <meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} />
                <Edges color={edgeColor} threshold={15} lineWidth={1} />
              </mesh>
            ))}
            {/* Glass top */}
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.86, 0.015, 0.51]} />
              <meshBasicMaterial color="#a8d8e0" transparent opacity={0.06} />
            </mesh>
          </group>
        </MaterializingPiece>

        {/* Price tag — Table */}
        <PriceLabel position={[0.2, -0.65, -0.1]} price="₹12,000" label="Table" color={edgeColor} delay={1.6} />

        {/* === FLOOR LAMP — materializes at 1.7s === */}
        <MaterializingPiece delay={1.7}>
          <group position={[1.4, -0.5, -1.3]}>
            {/* Base */}
            <mesh position={[0, -0.72, 0]}>
              <cylinderGeometry args={[0.14, 0.14, 0.03, 12]} />
              <meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} />
              <Edges color={accentColor} threshold={15} lineWidth={1.2} />
            </mesh>
            {/* Pole */}
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.018, 0.018, 1.35, 6]} />
              <meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} />
              <Edges color={accentColor} threshold={15} lineWidth={1} />
            </mesh>
            {/* Shade */}
            <mesh position={[0, 0.5, 0]}>
              <coneGeometry args={[0.22, 0.32, 8, 1, true]} />
              <meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} />
              <Edges color={accentColor} threshold={15} lineWidth={1.2} />
            </mesh>
            {/* Light glow */}
            <pointLight position={[0, 0.3, 0]} intensity={0.3} color="#c48840" distance={1.5} />
          </group>
        </MaterializingPiece>

        {/* Price tag — Lamp */}
        <PriceLabel position={[1.4, 0.25, -1.3]} price="₹8,500" label="Lamp" color={accentColor} delay={2.2} />

        {/* === SHELF — materializes at 2.3s === */}
        <MaterializingPiece delay={2.3}>
          <group position={[-1.92, 0.05, -0.5]} rotation={[0, Math.PI / 2, 0]}>
            {[0, 0.48, 0.96].map((y, i) => (
              <mesh key={i} position={[0, y - 0.45, 0]}>
                <boxGeometry args={[0.85, 0.045, 0.28]} />
                <meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} />
                <Edges color={edgeColor} threshold={15} lineWidth={1.2} />
              </mesh>
            ))}
            {[-0.4, 0.4].map((x, i) => (
              <mesh key={i} position={[x, 0.05, 0]}>
                <boxGeometry args={[0.045, 1.05, 0.28]} />
                <meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} />
                <Edges color={edgeColor} threshold={15} lineWidth={1} />
              </mesh>
            ))}
          </group>
        </MaterializingPiece>

        {/* Window on back wall */}
        <group position={[1.1, 0.25, -1.74]}>
          <mesh>
            <boxGeometry args={[1.0, 0.75, 0.02]} />
            <meshBasicMaterial transparent opacity={0.04} color="#a8d8e0" />
            <Edges color={edgeColor} threshold={15} lineWidth={1.2} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <boxGeometry args={[1.0, 0.018, 0.01]} />
            <meshBasicMaterial color={edgeColor} transparent opacity={0.35} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <boxGeometry args={[0.018, 0.75, 0.01]} />
            <meshBasicMaterial color={edgeColor} transparent opacity={0.35} />
          </mesh>
          {/* Window light spill */}
          <pointLight position={[0, 0, 0.5]} intensity={0.4} color="#c8e8f0" distance={2} />
        </group>

        {/* Rug */}
        <mesh position={[-0.5, -1.185, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.65, 32]} />
          <meshBasicMaterial transparent opacity={0.06} color={accentColor} />
          <Edges color={accentColor} threshold={15} lineWidth={0.8} />
        </mesh>
        <mesh position={[-0.5, -1.185, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.1, 0.25, 32]} />
          <meshBasicMaterial transparent opacity={0.04} color={accentColor} />
          <Edges color={accentColor} threshold={15} lineWidth={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

function Particles() {
  const count = 60;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 3.5;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.012;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#1a8fa0" transparent opacity={0.2} sizeAttenuation />
    </points>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [2.5, 2, 4], fov: 35 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 4, 4]} intensity={0.35} color="#1a8fa0" />
        <pointLight position={[-4, -2, 2]} intensity={0.25} color="#c48840" />
        <WireframeRoom />
        <Particles />
      </Canvas>
    </div>
  );
}
