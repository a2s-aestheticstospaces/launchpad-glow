import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Edges, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// ─── Utility: materialising group ───────────────────────────────────────────
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
    const progress = Math.min(1, Math.max(0, (t - delay) * 1.4));
    if (ref.current) {
      ref.current.scale.setScalar(progress);
      ref.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshBasicMaterial;
          if (mat?.transparent) {
            const target: number = child.userData.targetOpacity ?? 0;
            mat.opacity = target * progress;
          }
        }
      });
    }
  });

  return <group ref={ref} scale={0}>{children}</group>;
}

// ─── Wireframe room ──────────────────────────────────────────────────────────
function WireframeRoom() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.07) * 0.1;
      groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.025;
    }
  });

  const edge = '#1a8fa0';
  const accent = '#c48840';

  return (
    <Float speed={0.4} rotationIntensity={0.015} floatIntensity={0.1}>
      <group ref={groupRef} scale={1.5} position={[0.3, -0.6, -0.5]}>
        {/* Floor */}
        <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 3.5]} />
          <meshBasicMaterial transparent opacity={0.025} color={edge} />
          <Edges color={edge} threshold={15} lineWidth={1.2} />
        </mesh>
        {/* Floor grid */}
        {[-1.5, -0.75, 0, 0.75, 1.5].map((x, i) => (
          <mesh key={`gx${i}`} position={[x, -1.185, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.008, 3.5]} />
            <meshBasicMaterial color={edge} transparent opacity={0.06} />
          </mesh>
        ))}
        {[-1.5, -0.75, 0, 0.75, 1.5].map((z, i) => (
          <mesh key={`gz${i}`} position={[0, -1.185, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4, 0.008]} />
            <meshBasicMaterial color={edge} transparent opacity={0.06} />
          </mesh>
        ))}
        {/* Back wall */}
        <mesh position={[0, 0.05, -1.75]}>
          <planeGeometry args={[4, 2.5]} />
          <meshBasicMaterial transparent opacity={0.018} color={edge} />
          <Edges color={edge} threshold={15} lineWidth={1.2} />
        </mesh>
        {/* Left wall */}
        <mesh position={[-2, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[3.5, 2.5]} />
          <meshBasicMaterial transparent opacity={0.018} color={edge} />
          <Edges color={edge} threshold={15} lineWidth={1.2} />
        </mesh>
        {/* Ceiling edge lines */}
        <mesh position={[0, 1.25, -1.75]}>
          <boxGeometry args={[4, 0.018, 0.018]} />
          <meshBasicMaterial color={edge} transparent opacity={0.12} />
        </mesh>
        <mesh position={[-2, 1.25, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[3.5, 0.018, 0.018]} />
          <meshBasicMaterial color={edge} transparent opacity={0.12} />
        </mesh>
        {/* Sofa */}
        <MaterializingPiece delay={0.4}>
          <group position={[-0.4, -0.75, -1.1]}>
            <mesh><boxGeometry args={[1.8, 0.45, 0.72]} /><meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} /><Edges color={accent} threshold={15} lineWidth={1.2} /></mesh>
            <mesh position={[0, 0.36, -0.27]}><boxGeometry args={[1.8, 0.4, 0.16]} /><meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} /><Edges color={accent} threshold={15} lineWidth={1.2} /></mesh>
            <mesh position={[-0.82, 0.14, 0]}><boxGeometry args={[0.15, 0.26, 0.72]} /><meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} /><Edges color={accent} threshold={15} lineWidth={1} /></mesh>
            <mesh position={[0.82, 0.14, 0]}><boxGeometry args={[0.15, 0.26, 0.72]} /><meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} /><Edges color={accent} threshold={15} lineWidth={1} /></mesh>
          </group>
        </MaterializingPiece>
        {/* Coffee table */}
        <MaterializingPiece delay={1.0}>
          <group position={[-0.4, -1.02, -0.05]}>
            <mesh><boxGeometry args={[0.9, 0.06, 0.52]} /><meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} /><Edges color={edge} threshold={15} lineWidth={1.2} /></mesh>
            {[[-0.38,-0.12,-0.2],[0.38,-0.12,-0.2],[-0.38,-0.12,0.2],[0.38,-0.12,0.2]].map((p, i) => (
              <mesh key={i} position={p as [number,number,number]}><cylinderGeometry args={[0.018,0.018,0.22,6]} /><meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} /><Edges color={edge} threshold={15} lineWidth={0.8} /></mesh>
            ))}
          </group>
        </MaterializingPiece>
        {/* Lamp */}
        <MaterializingPiece delay={1.5}>
          <group position={[1.35, -0.5, -1.3]}>
            <mesh position={[0,-0.72,0]}><cylinderGeometry args={[0.13,0.13,0.025,10]} /><meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} /><Edges color={accent} threshold={15} lineWidth={1} /></mesh>
            <mesh position={[0,-0.05,0]}><cylinderGeometry args={[0.016,0.016,1.3,6]} /><meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} /><Edges color={accent} threshold={15} lineWidth={1} /></mesh>
            <mesh position={[0,0.48,0]}><coneGeometry args={[0.21,0.3,8,1,true]} /><meshBasicMaterial transparent opacity={0} userData={{ targetOpacity: 0 }} /><Edges color={accent} threshold={15} lineWidth={1} /></mesh>
            <pointLight position={[0,0.3,0]} intensity={0.3} color="#c48840" distance={1.5} />
          </group>
        </MaterializingPiece>
        {/* Window */}
        <group position={[1.0, 0.2, -1.74]}>
          <mesh><boxGeometry args={[0.95,0.72,0.02]} /><meshBasicMaterial transparent opacity={0.04} color="#a8d8e0" /><Edges color={edge} threshold={15} lineWidth={1} /></mesh>
          <mesh position={[0,0,0.012]}><boxGeometry args={[0.95,0.015,0.01]} /><meshBasicMaterial color={edge} transparent opacity={0.3} /></mesh>
          <mesh position={[0,0,0.012]}><boxGeometry args={[0.015,0.72,0.01]} /><meshBasicMaterial color={edge} transparent opacity={0.3} /></mesh>
          <pointLight position={[0,0,0.5]} intensity={0.35} color="#c8e8f0" distance={2} />
        </group>
        {/* Rug */}
        <mesh position={[-0.4,-1.185,-0.4]} rotation={[-Math.PI/2,0,0]}>
          <ringGeometry args={[0.28,0.6,28]} />
          <meshBasicMaterial transparent opacity={0.05} color={accent} /><Edges color={accent} threshold={15} lineWidth={0.7} />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Floating UI Mockup Panel ────────────────────────────────────────────────
function UIPanel({
  position,
  rotation,
  width,
  height,
  delay,
  glowColor,
  label,
  children,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  delay: number;
  glowColor: string;
  label: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const opacRef = useRef(0);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    opacRef.current = Math.min(1, Math.max(0, (t - delay) * 1.0));

    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 0.8 + delay) * 0.04;
      ref.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshBasicMaterial;
          if (mat?.transparent) {
            const target: number = child.userData.targetOpacity ?? 0;
            mat.opacity = target * opacRef.current;
          }
        }
      });
    }
  });

  const pw = width;
  const ph = height;
  const bw = 0.035; // border width
  const br = 0.04;  // bar height (title bar)

  return (
    <group ref={ref} position={position} rotation={rotation}>
      {/* Frame / bezel */}
      <mesh userData={{ targetOpacity: 0.92 }}>
        <boxGeometry args={[pw + bw * 2, ph + bw * 2 + br, 0.018]} />
        <meshBasicMaterial color="#0f1a20" transparent opacity={0} />
      </mesh>
      {/* Glow border plane */}
      <mesh position={[0, 0, -0.001]} userData={{ targetOpacity: 0.55 }}>
        <planeGeometry args={[pw + bw * 2 + 0.01, ph + bw * 2 + br + 0.01]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0} />
      </mesh>
      {/* Title bar */}
      <mesh position={[0, ph / 2 + br / 2, 0.01]} userData={{ targetOpacity: 0.9 }}>
        <planeGeometry args={[pw, br]} />
        <meshBasicMaterial color="#0f2830" transparent opacity={0} />
      </mesh>
      {/* Traffic lights */}
      {[-0.05, 0, 0.05].map((x, i) => (
        <mesh key={i} position={[-(pw / 2 - 0.06) + x * 0.6, ph / 2 + br / 2, 0.012]} userData={{ targetOpacity: 0.9 }}>
          <circleGeometry args={[0.012, 12]} />
          <meshBasicMaterial color={['#ff5f57','#febc2e','#28c840'][i]} transparent opacity={0} />
        </mesh>
      ))}
      {/* Screen background */}
      <mesh position={[0, -br / 2, 0.009]} userData={{ targetOpacity: 0.88 }}>
        <planeGeometry args={[pw, ph]} />
        <meshBasicMaterial color="#060e14" transparent opacity={0} />
      </mesh>

      {/* Screen content — passed as children or default rows */}
      {children}
    </group>
  );
}

// Screen: AI Prompt — browser mockup
function PromptScreen({ delay }: { delay: number }) {
  const screenY = -0.025;
  const pw = 0.9;

  return (
    <>
      {/* Prompt input bar */}
      <mesh position={[0, screenY + 0.13, 0.015]} userData={{ targetOpacity: 0.7 }}>
        <planeGeometry args={[pw - 0.06, 0.075]} />
        <meshBasicMaterial color="#112530" transparent opacity={0} />
      </mesh>
      {/* Cursor blink line */}
      <mesh position={[-(pw/2 - 0.12), screenY + 0.13, 0.016]} userData={{ targetOpacity: 0.9 }}>
        <planeGeometry args={[0.005, 0.045]} />
        <meshBasicMaterial color="#1a8fa0" transparent opacity={0} />
      </mesh>
      {/* "Text" lines */}
      {[0, 0.04, 0.08].map((dy, i) => (
        <mesh key={i} position={[-(pw/2 - 0.15) + i * 0.03, screenY - 0.04 - dy, 0.015]} userData={{ targetOpacity: 0.35 }}>
          <planeGeometry args={[pw * (0.75 - i * 0.15), 0.018]} />
          <meshBasicMaterial color="#1a8fa0" transparent opacity={0} />
        </mesh>
      ))}
      {/* Product card rows */}
      {[0, 1, 2].map((i) => (
        <mesh key={`card${i}`} position={[(i - 1) * 0.28, screenY - 0.22, 0.015]} userData={{ targetOpacity: 0.5 }}>
          <planeGeometry args={[0.23, 0.16]} />
          <meshBasicMaterial color="#0d2228" transparent opacity={0} />
        </mesh>
      ))}
      {/* Price tags on cards */}
      {[0, 1, 2].map((i) => (
        <mesh key={`price${i}`} position={[(i - 1) * 0.28, screenY - 0.28, 0.016]} userData={{ targetOpacity: 0.7 }}>
          <planeGeometry args={[0.18, 0.02]} />
          <meshBasicMaterial color="#c48840" transparent opacity={0} />
        </mesh>
      ))}
    </>
  );
}

// Screen: Price comparison — tablet
function PriceScreen() {
  const pw = 0.62;
  const screenY = -0.02;

  return (
    <>
      {/* Header bar */}
      <mesh position={[0, screenY + 0.18, 0.015]} userData={{ targetOpacity: 0.5 }}>
        <planeGeometry args={[pw - 0.06, 0.022]} />
        <meshBasicMaterial color="#1a8fa0" transparent opacity={0} />
      </mesh>
      {/* Comparison bars */}
      {[
        { w: 0.44, color: '#1a8fa0', y: 0.1 },
        { w: 0.32, color: '#c48840', y: 0.04 },
        { w: 0.38, color: '#1a8fa0', y: -0.02 },
        { w: 0.28, color: '#4a6a7a', y: -0.08 },
        { w: 0.40, color: '#4a6a7a', y: -0.14 },
      ].map((bar, i) => (
        <mesh key={i} position={[-(pw/2 - 0.06) + bar.w / 2, screenY + bar.y, 0.015]} userData={{ targetOpacity: 0.75 }}>
          <planeGeometry args={[bar.w, 0.035]} />
          <meshBasicMaterial color={bar.color} transparent opacity={0} />
        </mesh>
      ))}
    </>
  );
}

// Screen: Room catalog — phone
function CatalogScreen() {
  const pw = 0.38;
  const ph = 0.68;
  const screenY = -0.02;

  return (
    <>
      {/* Status bar */}
      <mesh position={[0, screenY + ph/2 - 0.03, 0.015]} userData={{ targetOpacity: 0.4 }}>
        <planeGeometry args={[pw - 0.04, 0.022]} />
        <meshBasicMaterial color="#112530" transparent opacity={0} />
      </mesh>
      {/* Grid of product squares */}
      {[[-0.09, 0.12], [0.09, 0.12], [-0.09, -0.04], [0.09, -0.04], [-0.09, -0.2], [0.09, -0.2]].map(([x, y], i) => (
        <mesh key={i} position={[x, screenY + y, 0.015]} userData={{ targetOpacity: i === 0 ? 0.7 : 0.45 }}>
          <planeGeometry args={[0.14, 0.12]} />
          <meshBasicMaterial color={i === 0 ? '#0d2a32' : '#0a1c24'} transparent opacity={0} />
        </mesh>
      ))}
      {/* Featured highlight */}
      <mesh position={[-0.09, screenY + 0.12, 0.016]} userData={{ targetOpacity: 0.6 }}>
        <planeGeometry args={[0.14, 0.005]} />
        <meshBasicMaterial color="#1a8fa0" transparent opacity={0} />
      </mesh>
      {/* Bottom nav bar */}
      <mesh position={[0, screenY - ph/2 + 0.03, 0.015]} userData={{ targetOpacity: 0.5 }}>
        <planeGeometry args={[pw - 0.04, 0.05]} />
        <meshBasicMaterial color="#081218" transparent opacity={0} />
      </mesh>
    </>
  );
}

// ─── Particles ───────────────────────────────────────────────────────────────
function Particles() {
  const count = 50;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 3;
      pos[i * 3]     = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.016} color="#1a8fa0" transparent opacity={0.18} sizeAttenuation />
    </points>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0.5, 5.5], fov: 38 }} dpr={[1, 2]}>
        <ambientLight intensity={0.55} />
        <pointLight position={[4, 4, 4]} intensity={0.3} color="#1a8fa0" />
        <pointLight position={[-4, -2, 2]} intensity={0.2} color="#c48840" />

        {/* Room in background */}
        <WireframeRoom />

        {/* ── Browser mockup: AI Prompt UI — center-right, slightly back ── */}
        <Float speed={0.7} rotationIntensity={0.015} floatIntensity={0.08}>
          <UIPanel
            position={[0.15, 0.2, 1.8]}
            rotation={[0.04, -0.12, 0]}
            width={0.9}
            height={0.58}
            delay={1.8}
            glowColor="#1a8fa0"
            label="AI Prompt"
          >
            <PromptScreen delay={1.8} />
          </UIPanel>
        </Float>

        {/* ── Tablet mockup: Price comparison — left, angled ── */}
        <Float speed={0.55} rotationIntensity={0.012} floatIntensity={0.06}>
          <UIPanel
            position={[-1.1, -0.1, 1.2]}
            rotation={[0.02, 0.22, -0.04]}
            width={0.62}
            height={0.44}
            delay={2.4}
            glowColor="#c48840"
            label="Price Compare"
          >
            <PriceScreen />
          </UIPanel>
        </Float>

        {/* ── Phone mockup: Room catalog — right side ── */}
        <Float speed={0.65} rotationIntensity={0.018} floatIntensity={0.1}>
          <UIPanel
            position={[1.25, -0.2, 1.4]}
            rotation={[-0.03, -0.18, 0.03]}
            width={0.38}
            height={0.68}
            delay={3.0}
            glowColor="#1a8fa0"
            label="Catalog"
          >
            <CatalogScreen />
          </UIPanel>
        </Float>

        <Particles />
      </Canvas>
    </div>
  );
}
