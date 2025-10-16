import React, { useEffect, useRef, useState } from "react";
import { Sparkles, TrendingUp, Users, Award, Star, ArrowRight, Code, Palette, Heart, Zap, Briefcase, Target, Rocket, Globe, ChevronRight } from "lucide-react";

// Starfield Background Component
const StarfieldBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.twinkleSpeed;
        
        if (this.opacity > 1 || this.opacity < 0.3) {
          this.twinkleSpeed *= -1;
        }

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        
        // Add glow
        if (this.size > 1) {
          ctx.shadowBlur = 3;
          ctx.shadowColor = 'white';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    class ShootingStar {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height / 2;
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 10 + 10;
        this.opacity = 1;
        this.angle = Math.PI / 4;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.02;

        if (this.opacity <= 0) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x - Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    }

    // Create stars
    for (let i = 0; i < 400; i++) {
      stars.push(new Star());
    }

    // Create shooting stars
    for (let i = 0; i < 3; i++) {
      shootingStars.push(new ShootingStar());
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        star.update();
        star.draw();
      });

      shootingStars.forEach(star => {
        star.update();
        star.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
};

// Floating Card Component
const FloatingCard = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </div>
  );
};

// Glow Card with Mouse Effect
const GlowCard = ({ children }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative group rounded-2xl overflow-hidden"
      style={{
        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.1), transparent 40%)`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10">
        {children}
      </div>
    </div>
  );
};

// Career Cards Data
const careerPaths = [
  {
    id: 1,
    title: "Software Developer",
    icon: Code,
    description: "Build revolutionary applications that change the world",
    skills: ["JavaScript", "Python", "React"],
    salary: "$70k - $150k",
    demand: "Very High",
    growth: "+22%"
  },
  {
    id: 2,
    title: "UX/UI Designer",
    icon: Palette,
    description: "Craft stunning experiences that users love",
    skills: ["Figma", "Adobe XD", "User Research"],
    salary: "$60k - $120k",
    demand: "High",
    growth: "+16%"
  },
  {
    id: 3,
    title: "Data Scientist",
    icon: TrendingUp,
    description: "Unlock insights from data to drive decisions",
    skills: ["Python", "ML", "Statistics"],
    salary: "$80k - $160k",
    demand: "Very High",
    growth: "+28%"
  },
  {
    id: 4,
    title: "Product Manager",
    icon: Briefcase,
    description: "Lead innovation and bring products to life",
    skills: ["Strategy", "Communication", "Analytics"],
    salary: "$90k - $180k",
    demand: "High",
    growth: "+19%"
  }
];

// Statistics Data
const stats = [
  { label: "Active Students", value: "50,000+", icon: Users },
  { label: "Career Paths", value: "200+", icon: Target },
  { label: "Success Rate", value: "94%", icon: Award },
  { label: "Partner Companies", value: "500+", icon: Globe }
];

// Testimonials Data
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer at Google",
    content: "CareerVerse transformed my career journey. The insights were incredible and helped me land my dream role!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "UX Designer at Apple",
    content: "The most comprehensive career platform I've used. Every feature is thoughtfully designed and genuinely helpful.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist at Meta",
    content: "Game-changing platform! It helped me discover opportunities I didn't even know existed.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    rating: 5
  }
];

export default function Landing() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
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
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.1); }
          50% { box-shadow: 0 0 40px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.1); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-shimmer {
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      <StarfieldBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl mb-8 animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span className="text-sm font-medium text-white">
              Explore 200+ Career Paths
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="block text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              Discover Your
            </span>
            <span className="block text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] animate-shimmer bg-clip-text">
              Dream Career
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-lg">
            Unlock your potential with AI-powered career guidance, personalized roadmaps, and connect with industry mentors
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold text-lg overflow-hidden hover:scale-105 transition-transform hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              <span className="relative z-10 flex items-center gap-2">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all backdrop-blur-sm">
              Watch Demo
            </button>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <FloatingCard key={i} delay={i * 100}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-2xl blur-xl transition-opacity duration-500" />
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    <stat.icon className="w-10 h-10 mx-auto mb-3 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    <div className="text-4xl font-bold mb-2 text-white drop-shadow-lg">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>

        {/* Floating Nebula Effects */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </section>

      {/* Career Cards Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              Trending Career Paths
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore high-demand careers with incredible growth potential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {careerPaths.map((career, i) => (
              <FloatingCard key={career.id} delay={i * 150}>
                <GlowCard>
                  <div className="relative">
                    <div className="absolute -top-4 -right-4 px-3 py-1 bg-white text-black rounded-full text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                      {career.growth}
                    </div>
                    
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 mb-4 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                      <career.icon className="w-full h-full text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 text-white">{career.title}</h3>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">{career.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-gray-200 border border-white/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-white">
                          {career.salary}
                        </span>
                        <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold">
                          {career.demand}
                        </span>
                      </div>
                    </div>
                    
                    <button className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all flex items-center justify-center gap-2 group">
                      Explore Path
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </GlowCard>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              Success Stories
            </h2>
            <p className="text-xl text-gray-300">
              Real students, real transformations
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              {testimonials.map((testimonial, i) => (
                <div
                  key={i}
                  className={`transition-all duration-700 ${
                    currentTestimonial === i ? 'block' : 'hidden'
                  }`}
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all">
                    <div className="flex items-center gap-6 mb-8">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full ring-4 ring-white/30 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                      />
                      <div>
                        <h4 className="text-2xl font-bold text-white mb-1">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-300">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <p className="text-2xl text-white leading-relaxed mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-white text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`h-2 rounded-full transition-all ${
                    currentTestimonial === i ? 'w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 rounded-3xl blur-3xl" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-16 text-center hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all">
              <Rocket className="w-20 h-20 mx-auto mb-8 text-white animate-float drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
              
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                Ready to Transform Your Future?
              </h2>
              
              <p className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Join 50,000+ students who are already building their dream careers
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-xl overflow-hidden hover:scale-105 transition-transform hover:shadow-[0_0_40px_rgba(255,255,255,0.6)]">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Zap className="w-6 h-6" />
                    Get Started Free
                  </span>
                </button>
                
                <button className="px-10 py-5 rounded-full font-bold text-xl border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all backdrop-blur-sm">
                  Talk to an Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 CareerVerse. Empowering the next generation of professionals.
          </p>
        </div>
      </footer>
    </div>
  );
}