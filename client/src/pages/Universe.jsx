import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useCareerStore } from '../store/careerStore';
import { useRef, useState } from 'react';

function Star({ position = [0,0,0], onClick }) {
  const ref = useRef();
  return (
    <mesh ref={ref} position={position} onClick={onClick}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#8ab4ff" emissive="#4b72ff" emissiveIntensity={0.6} />
    </mesh>
  );
}

export default function Universe() {
  const { careers } = useCareerStore();
  const [selected, setSelected] = useState(null);
  return (
    <div className="h-[calc(100vh-120px)] grid grid-cols-1 lg:grid-cols-[1fr_320px]">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <color attach="background" args={[0,0,0]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[5,5,5]} intensity={1} />
        <Stars radius={50} depth={20} count={2000} factor={4} saturation={0} fade speed={1} />
        {careers.map((c, i) => (
          <Star key={c.id || i} position={[Math.sin(i)*3, Math.cos(i)*2, (i%3)-1]} onClick={() => setSelected(c)} />
        ))}
        <OrbitControls enableDamping />
      </Canvas>
      <aside className="hidden lg:block border-l border-neutral-800 p-4">
        {!selected ? (
          <div className="text-neutral-400 text-sm">Click a star to view details.</div>
        ) : (
          <div>
            <div className="text-sm text-neutral-400">Selected domain</div>
            <h3 className="text-lg font-semibold">{selected.title}</h3>
            {selected.summary && <p className="text-neutral-300 mt-2">{selected.summary}</p>}
            {selected.trendingRoles && (
              <div className="mt-4">
                <div className="text-sm text-neutral-400">Trending roles</div>
                <ul className="list-disc list-inside text-sm">
                  {selected.trendingRoles.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
            {selected.inDemandSkills && (
              <div className="mt-4">
                <div className="text-sm text-neutral-400">In-demand skills</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selected.inDemandSkills.map((s, i) => <span key={i} className="px-2 py-0.5 rounded-full border border-neutral-700 text-xs">{s}</span>)}
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}


