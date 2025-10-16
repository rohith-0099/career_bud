import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Mock API for demonstration - replace with your actual API
const mockApi = {
  post: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      data: {
        aiGenerated: true,
        provider: 'OpenAI',
        model: 'GPT-4',
        careers: [
          { 
            id: 1, 
            title: 'Data Science', 
            summary: 'Transform data into insights',
            trendingRoles: ['ML Engineer', 'Data Analyst'],
            inDemandSkills: ['Python', 'TensorFlow', 'SQL']
          },
          { 
            id: 2, 
            title: 'Web Development', 
            summary: 'Build modern web experiences',
            trendingRoles: ['Frontend Dev', 'Full Stack'],
            inDemandSkills: ['React', 'Node.js', 'TypeScript']
          },
          { 
            id: 3, 
            title: 'Cloud Computing', 
            summary: 'Scale infrastructure globally',
            trendingRoles: ['Cloud Architect', 'DevOps'],
            inDemandSkills: ['AWS', 'Docker', 'Kubernetes']
          }
        ],
        nodes: [
          { id: '1', data: { label: data.interests[0] || 'AI', type: 'interest' }, position: { x: 0, y: 0 } },
          { id: '2', data: { label: data.interests[1] || 'Programming', type: 'interest' }, position: { x: 260, y: 0 } },
          { id: '3', data: { label: data.interests[2] || 'Data', type: 'interest' }, position: { x: 520, y: 0 } },
          { id: '4', data: { label: 'Machine Learning', type: 'skill' }, position: { x: 0, y: 180 } },
          { id: '5', data: { label: 'Python', type: 'skill' }, position: { x: 260, y: 180 } },
          { id: '6', data: { label: 'JavaScript', type: 'skill' }, position: { x: 520, y: 180 } },
          { id: '7', data: { label: 'AWS', type: 'skill' }, position: { x: 780, y: 180 } },
          { id: '8', data: { label: 'Data Science', type: 'career', summary: 'Transform data into insights', trendingRoles: ['ML Engineer', 'Data Analyst'], inDemandSkills: ['Python', 'TensorFlow'] }, position: { x: 0, y: 360 } },
          { id: '9', data: { label: 'Web Development', type: 'career', summary: 'Build modern web experiences', trendingRoles: ['Frontend Dev'], inDemandSkills: ['React', 'Node.js'] }, position: { x: 520, y: 360 } },
          { id: '10', data: { label: 'Cloud Computing', type: 'career', summary: 'Scale infrastructure globally', trendingRoles: ['Cloud Architect'], inDemandSkills: ['AWS', 'Docker'] }, position: { x: 780, y: 360 } },
        ],
        edges: [
          { id: 'e1-4', source: '1', target: '4' },
          { id: 'e1-5', source: '1', target: '5' },
          { id: 'e2-5', source: '2', target: '5' },
          { id: 'e2-6', source: '2', target: '6' },
          { id: 'e3-6', source: '3', target: '6' },
          { id: 'e3-7', source: '3', target: '7' },
          { id: 'e4-8', source: '4', target: '8' },
          { id: 'e5-8', source: '5', target: '8' },
          { id: 'e5-9', source: '5', target: '9' },
          { id: 'e6-9', source: '6', target: '9' },
          { id: 'e7-10', source: '7', target: '10' },
        ]
      }
    };
  }
};

// Mock store - replace with useCareerStore()
const mockStore = {
  interests: ['AI', 'Programming', 'Data'],
  aiProvider: 'OpenAI',
  aiModel: 'GPT-4'
};

export default function Mindmap() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const nodeObjectsRef = useRef([]);
  const connectionsRef = useRef([]);
  const animationIdRef = useRef(null);
  
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [careers, setCareers] = useState([]);
  const [meta, setMeta] = useState({ aiGenerated: false, provider: '', model: '' });

  // Replace with your actual store
  const interests = mockStore.interests;
  const aiProvider = mockStore.aiProvider;
  const aiModel = mockStore.aiModel;

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace mockApi with your actual api
        const { data } = await mockApi.post('/api/recommendations', { 
          interests, 
          provider: aiProvider, 
          model: aiModel 
        });
        
        setMeta({ 
          aiGenerated: !!data.aiGenerated, 
          provider: data.provider, 
          model: data.model 
        });
        
        setCareers(data.careers || []);
        setGraph({ 
          nodes: data.nodes || [], 
          edges: data.edges || [] 
        });
      } catch (e) {
        console.error('Failed to load data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [interests, aiProvider, aiModel]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current || graph.nodes.length === 0) return;

    // Clear previous scene
    if (sceneRef.current) {
      while(sceneRef.current.children.length > 0) { 
        sceneRef.current.remove(sceneRef.current.children[0]); 
      }
    }
    nodeObjectsRef.current = [];
    connectionsRef.current = [];

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 30);
    cameraRef.current = camera;

    // Renderer
    let renderer = rendererRef.current;
    if (!renderer) {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x8ab4ff, 1.5, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff6b9d, 1.5, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Background stars
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 3000; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 0.1, 
      transparent: true, 
      opacity: 0.6 
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Create node visualization
    const createNodeVisualization = (node) => {
      const group = new THREE.Group();
      
      let color = 0x8ab4ff;
      let size = 0.8;
      
      if (node.data.type === 'interest') {
        color = 0xfbbf24;
        size = 1;
      } else if (node.data.type === 'career') {
        color = 0xff6b9d;
        size = 1.2;
      }

      const sphereGeo = new THREE.SphereGeometry(size, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      const glowGeo = new THREE.SphereGeometry(size * 1.3, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      group.add(glow);

      const ringGeo = new THREE.TorusGeometry(size * 1.5, 0.02, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({ 
        color: color, 
        transparent: true, 
        opacity: 0.3 
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      const x = (node.position.x - 390) / 50;
      const y = -(node.position.y - 180) / 50;
      group.position.set(x, y, 0);

      group.userData = {
        node,
        sphere,
        glow,
        ring,
        originalScale: group.scale.clone()
      };

      scene.add(group);
      nodeObjectsRef.current.push(group);
      return group;
    };

    const createConnection = (sourcePos, targetPos, color = 0x4dd4ff) => {
      const curve = new THREE.QuadraticBezierCurve3(
        sourcePos,
        new THREE.Vector3(
          (sourcePos.x + targetPos.x) / 2,
          (sourcePos.y + targetPos.y) / 2 + 2,
          0
        ),
        targetPos
      );

      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4
      });
      const line = new THREE.Line(geometry, material);
      
      const particleGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const particleMat = new THREE.MeshBasicMaterial({ color: color });
      const particle = new THREE.Mesh(particleGeo, particleMat);
      particle.userData = { curve, progress: Math.random() };

      scene.add(line);
      scene.add(particle);
      connectionsRef.current.push({ line, particle });
    };

    // Build graph
    graph.nodes.forEach(node => createNodeVisualization(node));
    
    graph.edges.forEach(edge => {
      const sourceNode = nodeObjectsRef.current.find(n => n.userData.node.id === edge.source);
      const targetNode = nodeObjectsRef.current.find(n => n.userData.node.id === edge.target);
      if (sourceNode && targetNode) {
        createConnection(sourceNode.position, targetNode.position);
      }
    });

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredNode = null;

    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        nodeObjectsRef.current.map(g => g.userData.sphere),
        false
      );

      if (hoveredNode && !intersects.find(i => i.object === hoveredNode.userData.sphere)) {
        hoveredNode.scale.copy(hoveredNode.userData.originalScale);
        hoveredNode = null;
        document.body.style.cursor = 'default';
      }

      if (intersects.length > 0) {
        const parentGroup = nodeObjectsRef.current.find(
          g => g.userData.sphere === intersects[0].object
        );
        if (parentGroup) {
          hoveredNode = parentGroup;
          parentGroup.scale.set(1.2, 1.2, 1.2);
          document.body.style.cursor = 'pointer';
        }
      }
    };

    const onClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        nodeObjectsRef.current.map(g => g.userData.sphere),
        false
      );

      if (intersects.length > 0) {
        const parentGroup = nodeObjectsRef.current.find(
          g => g.userData.sphere === intersects[0].object
        );
        if (parentGroup) {
          setSelected({ type: 'node', data: parentGroup.userData.node.data });
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Camera controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseDrag = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      camera.position.x -= deltaX * 0.02;
      camera.position.y += deltaY * 0.02;
      camera.lookAt(0, 0, 0);
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      const zoomSpeed = 0.5;
      const direction = e.deltaY > 0 ? 1 : -1;
      camera.position.z += direction * zoomSpeed;
      camera.position.z = Math.max(10, Math.min(50, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseDrag);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // Animation loop
    const animate = (time) => {
      animationIdRef.current = requestAnimationFrame(animate);

      const t = time * 0.001;

      stars.rotation.y += 0.0002;

      nodeObjectsRef.current.forEach((group, i) => {
        group.userData.sphere.rotation.y += 0.01;
        group.userData.ring.rotation.z += 0.02;
        
        const pulse = Math.sin(t * 2 + i) * 0.1 + 1;
        group.userData.glow.scale.setScalar(pulse);

        group.position.y += Math.sin(t + i) * 0.0005;
      });

      connectionsRef.current.forEach(conn => {
        if (conn.particle && conn.particle.userData.curve) {
          conn.particle.userData.progress += 0.008;
          if (conn.particle.userData.progress > 1) {
            conn.particle.userData.progress = 0;
          }
          const point = conn.particle.userData.curve.getPoint(conn.particle.userData.progress);
          conn.particle.position.copy(point);
        }
      });

      renderer.render(scene, camera);
    };

    animate(0);

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseDrag);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [graph]);

  const fitView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 30);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const regenerate = async () => {
    setSelected(null);
    setLoading(true);
    try {
      const { data } = await mockApi.post('/api/recommendations', { 
        interests, 
        provider: aiProvider, 
        model: aiModel 
      });
      
      setMeta({ 
        aiGenerated: !!data.aiGenerated, 
        provider: data.provider, 
        model: data.model 
      });
      
      setCareers(data.careers || []);
      setGraph({ 
        nodes: data.nodes || [], 
        edges: data.edges || [] 
      });
    } catch (e) {
      console.error('Failed to regenerate:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-[1fr_360px] bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <div className="flex flex-col min-h-0 relative">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-10 border-b border-white/10 bg-black/60 backdrop-blur-md p-3 text-xs flex items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            {loading ? (
              <>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-white/60">Generating mindmap…</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-white/60">
                  {meta.aiGenerated ? 'AI-generated' : 'Sample'} · {meta.provider} · {meta.model}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={regenerate}
              disabled={loading}
              className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded text-xs text-purple-300 transition-colors disabled:opacity-50"
            >
              Regenerate
            </button>
            <button 
              onClick={fitView} 
              className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded text-xs text-cyan-300 transition-colors"
            >
              Reset View
            </button>
          </div>
        </div>

        {/* Universe canvas */}
        <div ref={mountRef} className="flex-1 w-full h-full" />

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
                <div className="absolute inset-2 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
              </div>
              <p className="text-white/80">Building your career universe...</p>
            </div>
          </div>
        )}

        {/* Instructions overlay */}
        {!loading && graph.nodes.length > 0 && (
          <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-4 py-3 pointer-events-none">
            <div className="text-white/40 text-xs mb-1">Controls</div>
            <div className="text-white/60 text-xs space-y-1">
              <div>🖱️ Click nodes to view details</div>
              <div>✋ Drag to rotate view</div>
              <div>🔍 Scroll to zoom</div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="hidden lg:block border-l border-white/10 p-6 bg-gradient-to-b from-black via-slate-950 to-black overflow-y-auto">
        {!selected ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-white/40 text-sm">Click a celestial node</div>
              <div className="text-white/60 text-xs mt-1">to explore details</div>
            </div>

            {careers.length > 0 && (
              <div className="mb-4">
                <div className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">Top Careers</div>
                <ul className="space-y-3">
                  {careers.map((c, i) => (
                    <li 
                      key={i} 
                      className="border border-white/10 rounded-lg p-3 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" 
                      onClick={() => setSelected({ type: 'node', data: c })}
                    >
                      <div className="font-medium text-white text-sm">{c.title}</div>
                      {c.summary && <div className="text-white/60 text-xs mt-1">{c.summary}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">Selected Node</div>
              <h3 className="text-2xl font-bold text-white mb-3">{selected.data?.label || selected.data?.title}</h3>
              {selected.data?.summary && (
                <p className="text-white/70 text-sm leading-relaxed">{selected.data.summary}</p>
              )}
            </div>

            {selected.data?.trendingRoles && selected.data.trendingRoles.length > 0 && (
              <div>
                <div className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">Trending Roles</div>
                <div className="space-y-2">
                  {selected.data.trendingRoles.map((role, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/80 text-sm bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected.data?.inDemandSkills && selected.data.inDemandSkills.length > 0 && (
              <div>
                <div className="text-pink-400 text-xs font-semibold uppercase tracking-wider mb-3">In-Demand Skills</div>
                <div className="flex flex-wrap gap-2">
                  {selected.data.inDemandSkills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 text-pink-300 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={() => setSelected(null)}
              className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 text-sm transition-colors"
            >
              Close Details
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}