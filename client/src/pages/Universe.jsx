import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// Mock store for demonstration
const mockCareers = [
  { id: 1, title: 'Data Science', summary: 'Transform data into insights', trendingRoles: ['ML Engineer', 'Data Analyst'], inDemandSkills: ['Python', 'TensorFlow', 'SQL'] },
  { id: 2, title: 'Web Development', summary: 'Build modern web experiences', trendingRoles: ['Frontend Dev', 'Full Stack'], inDemandSkills: ['React', 'Node.js', 'TypeScript'] },
  { id: 3, title: 'Cloud Computing', summary: 'Scale infrastructure globally', trendingRoles: ['Cloud Architect', 'DevOps'], inDemandSkills: ['AWS', 'Docker', 'Kubernetes'] },
  { id: 4, title: 'Cybersecurity', summary: 'Protect digital assets', trendingRoles: ['Security Analyst', 'Pentester'], inDemandSkills: ['Network Security', 'Cryptography'] },
  { id: 5, title: 'AI & Robotics', summary: 'Build intelligent systems', trendingRoles: ['AI Researcher', 'Robotics Engineer'], inDemandSkills: ['PyTorch', 'Computer Vision', 'ROS'] },
];

export default function Universe() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const starsRef = useRef([]);
  const [selected, setSelected] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 12);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xff8c42, 2, 100);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const blueLight = new THREE.PointLight(0x4dd4ff, 0.5, 100);
    blueLight.position.set(10, 5, 10);
    scene.add(blueLight);

    const pinkLight = new THREE.PointLight(0xff6b9d, 0.5, 100);
    pinkLight.position.set(-10, -5, -10);
    scene.add(pinkLight);

    // Background stars
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Galaxy particles
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyVertices = [];
    const galaxyColors = [];
    for (let i = 0; i < 3000; i++) {
      const radius = Math.random() * 15 + 5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 3;
      galaxyVertices.push(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6);
      galaxyColors.push(color.r, color.g, color.b);
    }
    galaxyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(galaxyVertices, 3));
    galaxyGeometry.setAttribute('color', new THREE.Float32BufferAttribute(galaxyColors, 3));
    const galaxyMaterial = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.8 });
    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    scene.add(galaxy);

    // Central sun
    const sunGroup = new THREE.Group();
    const sunGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({
      color: 0xffb347,
      emissive: 0xff6b35,
      emissiveIntensity: 2
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(sun);

    const glowGeometry1 = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff8c42, transparent: true, opacity: 0.2 });
    const glow1 = new THREE.Mesh(glowGeometry1, glowMaterial1);
    sunGroup.add(glow1);

    const glowGeometry2 = new THREE.SphereGeometry(1.5, 32, 32);
    const glowMaterial2 = new THREE.MeshBasicMaterial({ color: 0xff6b35, transparent: true, opacity: 0.1 });
    const glow2 = new THREE.Mesh(glowGeometry2, glowMaterial2);
    sunGroup.add(glow2);

    scene.add(sunGroup);

    // Planets
    const planets = [];
    
    // Blue planet with ring
    const planet1 = new THREE.Group();
    const planet1Geo = new THREE.SphereGeometry(0.6, 32, 32);
    const planet1Mat = new THREE.MeshStandardMaterial({ color: 0x4a90e2, roughness: 0.4 });
    const planet1Mesh = new THREE.Mesh(planet1Geo, planet1Mat);
    planet1.add(planet1Mesh);
    const ringGeo1 = new THREE.RingGeometry(0.84, 1.08, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({ color: 0x6bb6ff, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.5;
    planet1.add(ring1);
    planet1.position.set(4, 1, 2);
    planet1.userData = { basePos: [4, 1, 2], orbitSpeed: 0.5 };
    scene.add(planet1);
    planets.push(planet1);

    // Orange planet
    const planet2 = new THREE.Group();
    const planet2Geo = new THREE.SphereGeometry(0.8, 32, 32);
    const planet2Mat = new THREE.MeshStandardMaterial({ color: 0xe27d60 });
    const planet2Mesh = new THREE.Mesh(planet2Geo, planet2Mat);
    planet2.add(planet2Mesh);
    planet2.position.set(-5, -1, 3);
    planet2.userData = { basePos: [-5, -1, 3], orbitSpeed: 0.3 };
    scene.add(planet2);
    planets.push(planet2);

    // Green planet with ring
    const planet3 = new THREE.Group();
    const planet3Geo = new THREE.SphereGeometry(0.5, 32, 32);
    const planet3Mat = new THREE.MeshStandardMaterial({ color: 0x85dcb8 });
    const planet3Mesh = new THREE.Mesh(planet3Geo, planet3Mat);
    planet3.add(planet3Mesh);
    const ringGeo3 = new THREE.RingGeometry(0.7, 0.9, 64);
    const ringMat3 = new THREE.MeshStandardMaterial({ color: 0xb8f3d8, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.x = Math.PI / 2.5;
    planet3.add(ring3);
    planet3.position.set(3, -2, -4);
    planet3.userData = { basePos: [3, -2, -4], orbitSpeed: 0.7 };
    scene.add(planet3);
    planets.push(planet3);

    // Comet
    const cometGroup = new THREE.Group();
    const cometGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const cometMat = new THREE.MeshStandardMaterial({ color: 0x4dd4ff, emissive: 0x4dd4ff, emissiveIntensity: 1.5 });
    const comet = new THREE.Mesh(cometGeo, cometMat);
    cometGroup.add(comet);
    const tailGeo = new THREE.ConeGeometry(0.1, 2, 8);
    const tailMat = new THREE.MeshStandardMaterial({ color: 0x4dd4ff, transparent: true, opacity: 0.6, emissive: 0x4dd4ff, emissiveIntensity: 0.5 });
    const tail = new THREE.Mesh(tailGeo, tailMat);
    tail.position.z = 0.5;
    cometGroup.add(tail);
    scene.add(cometGroup);

    // Career stars
    const starColors = [0x8ab4ff, 0xff6b9d, 0x4dd4ff, 0xa78bfa, 0xfbbf24];
    mockCareers.forEach((career, i) => {
      const angle = (i / mockCareers.length) * Math.PI * 2;
      const radius = 6;
      const height = Math.sin(i * 1.5) * 2;
      
      const starGroup = new THREE.Group();
      
      // Glow
      const glowGeo = new THREE.SphereGeometry(0.6, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({ 
        color: starColors[i % starColors.length], 
        transparent: true, 
        opacity: 0.2 
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      starGroup.add(glowMesh);
      
      // Main star
      const starGeo = new THREE.SphereGeometry(0.4, 24, 24);
      const starMat = new THREE.MeshStandardMaterial({
        color: starColors[i % starColors.length],
        emissive: starColors[i % starColors.length],
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
      });
      const starMesh = new THREE.Mesh(starGeo, starMat);
      starGroup.add(starMesh);
      
      // Core
      const coreGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const core = new THREE.Mesh(coreGeo, coreMat);
      starGroup.add(core);
      
      starGroup.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      starGroup.userData = { career, index: i, glow: glowMesh, mainStar: starMesh };
      scene.add(starGroup);
      starsRef.current.push(starGroup);
    });

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(starsRef.current, true);

      if (intersects.length > 0) {
        const obj = intersects[0].object.parent;
        if (obj.userData.career) {
          setHoveredIndex(obj.userData.index);
          document.body.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredIndex(null);
      document.body.style.cursor = 'default';
    };

    const onClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(starsRef.current, true);

      if (intersects.length > 0) {
        const obj = intersects[0].object.parent;
        if (obj.userData.career) {
          setSelected(obj.userData.career);
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Mouse drag controls
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
      
      camera.position.x += deltaX * 0.01;
      camera.position.y -= deltaY * 0.01;
      camera.lookAt(0, 0, 0);
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseDrag);
    renderer.domElement.addEventListener('mouseup', onMouseUp);

    // Zoom controls
    const onWheel = (e) => {
      e.preventDefault();
      const zoomSpeed = 0.5;
      const direction = e.deltaY > 0 ? 1 : -1;
      camera.position.z += direction * zoomSpeed;
      camera.position.z = Math.max(5, Math.min(25, camera.position.z));
    };

    renderer.domElement.addEventListener('wheel', onWheel);

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Rotate galaxy
      galaxy.rotation.y += 0.0005;

      // Animate sun
      sun.rotation.y += 0.002;
      const sunPulse = Math.sin(time) * 0.1 + 1;
      sun.scale.setScalar(sunPulse);
      const glowPulse = Math.sin(time * 2) * 0.2 + 1;
      glow2.scale.setScalar(glowPulse);

      // Animate planets
      planets.forEach(planet => {
        planet.rotation.y += 0.005;
        const speed = planet.userData.orbitSpeed;
        const base = planet.userData.basePos;
        planet.position.x = base[0] + Math.sin(time * speed) * 0.3;
        planet.position.z = base[2] + Math.cos(time * speed) * 0.3;
      });

      // Animate comet
      const t = time * 0.5;
      cometGroup.position.x = Math.sin(t) * 8;
      cometGroup.position.y = Math.cos(t * 0.7) * 4;
      cometGroup.position.z = Math.sin(t * 0.3) * 6;

      // Animate career stars
      starsRef.current.forEach((starGroup, i) => {
        starGroup.rotation.y += 0.01;
        const isSelected = selected?.id === starGroup.userData.career.id;
        const isHovered = hoveredIndex === i;
        const pulse = Math.sin(time * 2) * 0.1 + 1;
        const scale = (isSelected || isHovered) ? pulse * 1.3 : pulse;
        starGroup.userData.mainStar.scale.setScalar(scale);
        
        const glowPulse = Math.sin(time * 3) * 0.3 + 0.7;
        starGroup.userData.glow.scale.setScalar(glowPulse * 1.5);

        if (isSelected) {
          starGroup.userData.mainStar.material.emissiveIntensity = 1.5;
        } else {
          starGroup.userData.mainStar.material.emissiveIntensity = 0.8;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

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
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    starsRef.current.forEach((starGroup) => {
      const isSelected = selected?.id === starGroup.userData.career.id;
      if (isSelected) {
        starGroup.userData.mainStar.material.emissiveIntensity = 1.5;
      } else {
        starGroup.userData.mainStar.material.emissiveIntensity = 0.8;
      }
    });
  }, [selected]);

  return (
    <div className="h-screen w-full grid grid-cols-1 lg:grid-cols-[1fr_360px] bg-black">
      <div className="relative">
        <div ref={mountRef} className="w-full h-full" />
        
        <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-4 py-3 pointer-events-none">
          <div className="text-white/60 text-sm">Your Career Universe</div>
          <div className="text-white text-lg font-semibold">{mockCareers.length} Domains</div>
        </div>
      </div>
      
      <aside className="hidden lg:block border-l border-white/10 p-6 bg-gradient-to-b from-black via-slate-950 to-black overflow-y-auto">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="text-white/40 text-sm">Click a star in the universe</div>
            <div className="text-white/60 text-xs mt-1">to explore career domains</div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Career Domain</div>
              <h3 className="text-2xl font-bold text-white mb-3">{selected.title}</h3>
              {selected.summary && (
                <p className="text-white/70 text-sm leading-relaxed">{selected.summary}</p>
              )}
            </div>
            
            {selected.trendingRoles && selected.trendingRoles.length > 0 && (
              <div>
                <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">Trending Roles</div>
                <div className="space-y-2">
                  {selected.trendingRoles.map((role, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/80 text-sm bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selected.inDemandSkills && selected.inDemandSkills.length > 0 && (
              <div>
                <div className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">In-Demand Skills</div>
                <div className="flex flex-wrap gap-2">
                  {selected.inDemandSkills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}