import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Users, Award, Star, ArrowRight, GraduationCap, Briefcase, Code, Palette, Heart, Zap, Sun, Moon } from "lucide-react";
import { Link } from 'react-router-dom';
import { cn } from "../lib/utils";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

// Aurora Background Component
const AuroraBackground = ({ className, children, showRadialGradient = true, ...props }) => {
  return (
    <div
      className={cn(
        "relative flex flex-col h-full items-center justify-center bg-zinc-50 dark:bg-neutral-950 text-slate-950 transition-bg",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `[--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
          )}
        ></div>
      </div>
      {children}
    </div>
  );
};

// Text Shimmer Component
function TextShimmer({ children, className, duration = 2, spread = 2 }) {
  const dynamicSpread = React.useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <motion.span
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]',
        '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
        'dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "linear",
      }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
        }
      }
    >
      {children}
    </motion.span>
  );
}

// Glow Card Component
const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 }
};

const GlowCard = ({ children, className = '', glowColor = 'blue' }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const syncPointer = (e) => {
      const { clientX: x, clientY: y } = e;
      
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
      }
    };

    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  return (
    <div
      ref={cardRef}
      data-glow
      style={{
        '--base': base,
        '--spread': spread,
        '--radius': '14',
        '--border': '2',
        '--backdrop': 'hsl(0 0% 60% / 0.12)',
        '--backup-border': 'var(--backdrop)',
        '--size': '200',
        '--border-size': 'calc(var(--border, 2) * 1px)',
        '--spotlight-size': 'calc(var(--size, 150) * 1px)',
        '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
        backgroundImage: `radial-gradient(
          var(--spotlight-size) var(--spotlight-size) at
          calc(var(--x, 0) * 1px)
          calc(var(--y, 0) * 1px),
          hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
        )`,
        backgroundColor: 'var(--backdrop, transparent)',
        backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
        backgroundPosition: '50% 50%',
        backgroundAttachment: 'fixed',
        border: 'var(--border-size) solid var(--backup-border)',
        position: 'relative',
        touchAction: 'none',
      }}
      className={cn(
        "rounded-2xl relative p-6 backdrop-blur-[5px] transition-all duration-300 hover:scale-105",
        className
      )}
    >
      {children}
    </div>
  );
};

// Career Cards Data
const careerPaths = [
  {
    id: 1,
    title: "Software Developer",
    icon: Code,
    description: "Build amazing applications and solve complex problems with code",
    color: "blue",
    skills: ["JavaScript", "Python", "React"],
    salary: "$70k - $150k",
    demand: "Very High"
  },
  {
    id: 2,
    title: "UX/UI Designer",
    icon: Palette,
    description: "Create beautiful and intuitive user experiences",
    color: "purple",
    skills: ["Figma", "Adobe XD", "User Research"],
    salary: "$60k - $120k",
    demand: "High"
  },
  {
    id: 3,
    title: "Data Scientist",
    icon: TrendingUp,
    description: "Analyze data and extract meaningful insights",
    color: "green",
    skills: ["Python", "Machine Learning", "Statistics"],
    salary: "$80k - $160k",
    demand: "Very High"
  },
  {
    id: 4,
    title: "Product Manager",
    icon: Briefcase,
    description: "Lead product strategy and drive innovation",
    color: "orange",
    skills: ["Strategy", "Communication", "Analytics"],
    salary: "$90k - $180k",
    demand: "High"
  }
];

// Statistics Data
const stats = [
  { label: "Active Students", value: "50,000+", icon: Users },
  { label: "Career Paths", value: "200+", icon: Briefcase },
  { label: "Success Rate", value: "94%", icon: Award },
  { label: "Partner Companies", value: "500+", icon: Star }
];

// Testimonials Data
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer at Google",
    content: "CareerVerse helped me discover my passion for coding and land my dream job!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    name: "Michael Chen",
    role: "UX Designer at Apple",
    content: "The career exploration tools are incredible. I found exactly what I was looking for.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist at Meta",
    content: "Best platform for students to explore and plan their career journey!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
  }
];

// Main Component
export default function Landing() {
  const [activeCard, setActiveCard] = useState(null);
  const [theme, setTheme] = useState('system');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // theme init (prefers-color-scheme + localStorage)
  useEffect(() => {
    const stored = localStorage.getItem('cv-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('cv-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Hero Section with Aurora Background */}
      <AuroraBackground className="min-h-screen">
        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          {/* Navigation */}
          <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center mb-20"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                CareerVerse
              </span>
            </div>
            <div className="flex gap-2 sm:gap-4 items-center">
              <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme" className="px-2">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="ghost">Sign In</Button>
              <Button asChild>
                <Link to="/interests">Get Started</Link>
              </Button>
            </div>
          </motion.nav>

          {/* Hero Content */}
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Badge className="mb-4" variant="secondary">
                <Sparkles className="w-3 h-3 mr-1" />
                Explore Your Future
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Discover Your
                <br />
                <TextShimmer className="text-6xl md:text-8xl font-bold" duration={3}>
                  Dream Career
                </TextShimmer>
              </h1>
              <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                Explore 200+ career paths, connect with mentors, and build your future with confidence
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Button size="lg" asChild className="gap-2">
                <Link to="/interests">
                  Start Exploring <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/mindmap">Watch Demo</Link>
              </Button>
            </motion.div>
          </div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AuroraBackground>

      {/* Career Cards Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Career Paths
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-300">
            Discover opportunities that match your passion and skills
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {careerPaths.map((career, index) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setActiveCard(career.id)}
              onHoverEnd={() => setActiveCard(null)}
            >
              <GlowCard glowColor={career.color} className="h-full">
                <Card className="h-full border-0 bg-transparent">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <career.icon className="w-10 h-10 text-primary" />
                      <Badge variant="secondary">{career.demand}</Badge>
                    </div>
                    <h3 className="text-2xl font-bold">{career.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">{career.description}</p>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm font-semibold text-indigo-500 dark:text-indigo-400">
                        {career.salary}
                      </div>
                    </div>
                    <Button className="w-full" variant={activeCard === career.id ? "default" : "outline"}>
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Student Success Stories
            </h2>
            <p className="text-xl text-muted-foreground">
              Hear from students who found their dream careers
            </p>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-background rounded-3xl p-8 md:p-12 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold text-lg">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-muted-foreground">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>
                <p className="text-xl italic">
                  "{testimonials[currentTestimonial].content}"
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    currentTestimonial === index
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-3xl p-12"
        >
          <div className="flex justify-center">
            <Heart className="w-16 h-16 text-primary animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of students discovering their perfect career path
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild className="gap-2">
              <Link to="/interests">
                <Zap className="w-5 h-5" />
                Get Started Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/mindmap">Schedule a Demo</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>© 2024 CareerVerse. Empowering students to discover their future.</p>
        </div>
      </footer>
    </div>
  );
}


