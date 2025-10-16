import { Link, NavLink, Outlet } from 'react-router-dom';
import ModelSelector from './components/ModelSelector.jsx';
import { Sun, Moon, GraduationCap } from 'lucide-react';
import { Button } from './components/ui/button.jsx';
import React from 'react';

function App() {
  const [theme, setTheme] = React.useState('system');

  React.useEffect(() => {
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
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-10 border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <Link to="/" className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              CareerVerse
            </Link>
          </div>
          <nav className="text-sm text-neutral-700 dark:text-neutral-300 flex gap-4 items-center">
            <NavLink to="/interests" className={({isActive}) => isActive ? 'text-indigo-600 dark:text-white' : 'hover:text-indigo-600 dark:hover:text-white'}>Interests</NavLink>
            <NavLink to="/mindmap" className={({isActive}) => isActive ? 'text-indigo-600 dark:text-white' : 'hover:text-indigo-600 dark:hover:text-white'}>Mindmap</NavLink>
            <NavLink to="/universe" className={({isActive}) => isActive ? 'text-indigo-600 dark:text-white' : 'hover:text-indigo-600 dark:hover:text-white'}>Universe</NavLink>
            <NavLink to="/resources" className={({isActive}) => isActive ? 'text-indigo-600 dark:text-white' : 'hover:text-indigo-600 dark:hover:text-white'}>Resources</NavLink>
            <NavLink to="/summary" className={({isActive}) => isActive ? 'text-indigo-600 dark:text-white' : 'hover:text-indigo-600 dark:hover:text-white'}>Summary</NavLink>
            <div className="ml-4"><ModelSelector /></div>
            <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme" className="px-2">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-neutral-800 text-neutral-400 text-xs py-4 text-center">
        © {new Date().getFullYear()} CareerVerse — Explore your path.
      </footer>
    </div>
  );
}

export default App;
