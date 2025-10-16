import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Summary() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const canvasRef = useRef(null);
  
  // Mock career data
  const top3 = [
    {
      title: "Software Engineer",
      summary: "Build innovative software solutions and work with cutting-edge technologies to solve complex problems."
    },
    {
      title: "Data Scientist",
      summary: "Analyze large datasets and create predictive models to drive business decisions and insights."
    },
    {
      title: "Product Manager",
      summary: "Lead product development from conception to launch, bridging technical and business teams."
    }
  ];
  
  const send = async () => {
    setSending(true);
    // Simulate API call
    setTimeout(() => {
      setSent(true);
      setSending(false);
    }, 1500);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 15;

    // Starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 3000; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particlesVertices = [];
    for (let i = 0; i < 500; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      particlesVertices.push(x, y, z);
    }

    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlesVertices, 3));
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    canvasRef.current.addEventListener('mousemove', handleMouseMove);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;

      starField.rotation.y += 0.0002;
      starField.rotation.x += 0.0001;

      particles.rotation.y += 0.001;
      particles.rotation.x = Math.sin(time) * 0.1;

      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background space animation */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{ background: 'linear-gradient(to bottom, #0a0a0f, #1a0a2e)' }}
      />
      
      {/* Content overlay */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-4 text-white">Your top career paths</h2>
        <ul className="space-y-3 mb-8">
          {top3.map((c, i) => (
            <li key={i} className="border border-neutral-700/50 rounded-lg p-4 bg-black/40 backdrop-blur-sm">
              <div className="font-medium text-white">{c.title}</div>
              <div className="text-neutral-300 text-sm">{c.summary}</div>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 items-center">
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Your email" 
            className="px-3 py-2 rounded-md bg-black/50 backdrop-blur-sm border border-neutral-700/50 flex-1 text-white placeholder:text-neutral-400" 
          />
          <button 
            onClick={send} 
            disabled={!email || sending} 
            className="px-4 py-2 rounded-md bg-white text-black disabled:opacity-50 hover:bg-neutral-100 transition-colors"
          >
            {sending ? 'Sending...' : 'Email me the report'}
          </button>
        </div>
        {sent && <p className="text-green-400 mt-3 text-sm">Sent! Check your inbox.</p>}
      </div>
    </section>
  );
}