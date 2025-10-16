import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

// Mock API and store for demonstration
const mockApi = {
  get: async (url, config) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        resources: [
          { title: 'Advanced Machine Learning Course', url: '#', source: 'Coursera' },
          { title: 'Deep Learning Specialization', url: '#', source: 'deeplearning.ai' },
          { title: 'Python for Data Science', url: '#', source: 'DataCamp' },
          { title: 'Neural Networks and Deep Learning', url: '#', source: 'MIT OpenCourseWare' },
          { title: 'Natural Language Processing', url: '#', source: 'Stanford Online' },
          { title: 'Computer Vision Fundamentals', url: '#', source: 'Udacity' },
        ]
      }
    };
  }
};

const mockCareers = [
  { id: 1, title: 'Data Science' }
];

export default function Resources() {
  const careers = mockCareers; // Replace with useCareerStore()
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const mountRef = useRef(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const q = careers[0]?.title || '';
      const { data } = await mockApi.get('/api/resources', { params: { q } });
      setResources(data.resources || []);
      setLoading(false);
    };
    run();
  }, [careers]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mountRef.current.appendChild(renderer.domElement);

    // Create stars
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    const starColors = [];
    for (let i = 0; i < 3000; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      starVertices.push(x, y, z);

      const color = new THREE.Color();
      const hue = Math.random() * 0.3 + 0.5; // Blue to purple range
      color.setHSL(hue, 0.8, 0.7);
      starColors.push(color.r, color.g, color.b);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    const starMaterial = new THREE.PointsMaterial({ 
      size: 0.7, 
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Create floating orbs
    const orbs = [];
    for (let i = 0; i < 15; i++) {
      const orbGeometry = new THREE.SphereGeometry(Math.random() * 0.5 + 0.3, 16, 16);
      const orbMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.6),
        transparent: true,
        opacity: 0.3,
      });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 50 - 30
      );
      orb.userData = {
        speed: Math.random() * 0.02 + 0.01,
        direction: Math.random() * Math.PI * 2
      };
      scene.add(orb);
      orbs.push(orb);
    }

    // Create nebula particles
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaVertices = [];
    const nebulaColors = [];
    for (let i = 0; i < 1000; i++) {
      const radius = Math.random() * 40 + 20;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 10;
      
      nebulaVertices.push(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius - 40
      );

      const color = new THREE.Color();
      color.setHSL(0.7 + Math.random() * 0.2, 0.8, 0.5);
      nebulaColors.push(color.r, color.g, color.b);
    }
    nebulaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nebulaVertices, 3));
    nebulaGeometry.setAttribute('color', new THREE.Float32BufferAttribute(nebulaColors, 3));
    const nebulaMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);

    // Create shooting stars
    const shootingStars = [];
    const createShootingStar = () => {
      const geometry = new THREE.BufferGeometry();
      const material = new THREE.LineBasicMaterial({
        color: 0x4dd4ff,
        transparent: true,
        opacity: 0.8
      });
      
      const points = [];
      for (let i = 0; i < 10; i++) {
        points.push(new THREE.Vector3(i * 0.5, 0, 0));
      }
      geometry.setFromPoints(points);
      
      const line = new THREE.Line(geometry, material);
      line.position.set(
        (Math.random() - 0.5) * 100,
        Math.random() * 50 + 20,
        -50
      );
      line.rotation.z = Math.random() * Math.PI * 0.5 - Math.PI * 0.25;
      line.userData = {
        speed: Math.random() * 0.5 + 0.3,
        lifetime: 0
      };
      scene.add(line);
      shootingStars.push(line);
    };

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    let animationId;
    let lastShootingStarTime = 0;
    
    const animate = (time) => {
      animationId = requestAnimationFrame(animate);

      // Rotate star field slowly
      stars.rotation.y += 0.0002;
      stars.rotation.x += 0.0001;

      // Rotate nebula
      nebula.rotation.y += 0.0003;

      // Animate orbs
      orbs.forEach(orb => {
        orb.position.x += Math.cos(orb.userData.direction) * orb.userData.speed;
        orb.position.y += Math.sin(orb.userData.direction) * orb.userData.speed;
        orb.rotation.x += 0.01;
        orb.rotation.y += 0.01;

        // Bounce back if too far
        if (Math.abs(orb.position.x) > 50) orb.userData.direction = Math.PI - orb.userData.direction;
        if (Math.abs(orb.position.y) > 50) orb.userData.direction = -orb.userData.direction;

        // Pulse opacity
        orb.material.opacity = 0.2 + Math.sin(time * 0.001 + orb.position.x) * 0.15;
      });

      // Create shooting stars periodically
      if (time - lastShootingStarTime > 2000 && Math.random() > 0.98) {
        createShootingStar();
        lastShootingStarTime = time;
      }

      // Animate shooting stars
      shootingStars.forEach((star, index) => {
        star.userData.lifetime += 1;
        star.position.x -= star.userData.speed;
        star.position.y -= star.userData.speed * 0.5;
        star.material.opacity = Math.max(0, 0.8 - star.userData.lifetime * 0.02);

        if (star.userData.lifetime > 50) {
          scene.remove(star);
          shootingStars.splice(index, 1);
        }
      });

      // Camera follows mouse slightly
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate(0);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Three.js Background */}
      <div 
        ref={mountRef} 
        className="fixed inset-0 z-0" 
        style={{ 
          background: 'linear-gradient(to bottom, #0a0a1a, #1a0a2e)',
          width: '100%',
          height: '100%'
        }} 
      />

      {/* Content */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-500/20 backdrop-blur-md border border-purple-500/30 rounded-full">
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            <span className="text-purple-300 text-sm font-medium">Knowledge Base</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Learning Resources
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Explore curated courses and materials from across the galaxy
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
              <div className="absolute inset-2 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
            </div>
            <p className="text-white/60">Scanning the cosmos for resources...</p>
          </div>
        ) : (
          <>
            {/* Resource count */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 rounded-full">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-cyan-300 text-sm font-medium">
                  {resources.length} resources discovered
                </span>
              </div>
            </div>

            {/* Resources grid */}
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((r, i) => (
                <li
                  key={i}
                  className="group relative"
                  style={{
                    animation: 'fadeInUp 0.5s ease-out forwards',
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0
                  }}
                >
                  {/* Card glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-500" />
                  
                  {/* Card */}
                  <div className="relative bg-slate-900/70 backdrop-blur-md border border-white/10 rounded-xl p-6 h-full transition-all duration-300 group-hover:border-purple-500/50 group-hover:translate-y-[-4px] group-hover:bg-slate-900/80">
                    {/* Constellation decoration */}
                    <div className="absolute top-4 right-4 w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity">
                      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" className="text-purple-400">
                        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                        <circle cx="24" cy="8" r="1.5" fill="currentColor" />
                        <circle cx="16" cy="20" r="1.5" fill="currentColor" />
                        <circle cx="8" cy="26" r="1.5" fill="currentColor" />
                        <line x1="8" y1="8" x2="24" y2="8" strokeWidth="0.5" />
                        <line x1="24" y1="8" x2="16" y2="20" strokeWidth="0.5" />
                        <line x1="16" y1="20" x2="8" y2="26" strokeWidth="0.5" />
                        <line x1="8" y1="8" x2="8" y2="26" strokeWidth="0.5" />
                      </svg>
                    </div>

                    {/* Index badge */}
                    <div className="inline-flex items-center justify-center w-8 h-8 mb-3 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border border-purple-500/40">
                      <span className="text-purple-300 text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                    </div>

                    {/* Title */}
                    <a
                      className="block font-semibold text-lg text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2"
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {r.title}
                    </a>

                    {/* Source */}
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{r.source}</span>
                    </div>

                    {/* Launch arrow */}
                    <div className="absolute bottom-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-purple-500/0 group-hover:bg-purple-500/20 transition-all">
                      <svg className="w-4 h-4 text-purple-400 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Empty state */}
        {!loading && resources.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center backdrop-blur-md">
              <svg className="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-white/60 text-lg mb-2">No resources found in this sector</p>
            <p className="text-white/40 text-sm">Try exploring a different career domain</p>
          </div>
        )}
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}