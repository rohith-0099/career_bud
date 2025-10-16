import { Link, NavLink, Outlet } from 'react-router-dom';
import ModelSelector from './components/ModelSelector.jsx';

function App() {
  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-neutral-800 sticky top-0 bg-neutral-950/80 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link to="/" className="font-semibold tracking-tight text-lg">
            CareerVerse
          </Link>
          <nav className="text-sm text-neutral-300 flex gap-4 items-center">
            <NavLink to="/interests" className={({isActive}) => isActive ? 'text-white' : 'hover:text-white'}>Interests</NavLink>
            <NavLink to="/mindmap" className={({isActive}) => isActive ? 'text-white' : 'hover:text-white'}>Mindmap</NavLink>
            <NavLink to="/universe" className={({isActive}) => isActive ? 'text-white' : 'hover:text-white'}>Universe</NavLink>
            <NavLink to="/resources" className={({isActive}) => isActive ? 'text-white' : 'hover:text-white'}>Resources</NavLink>
            <NavLink to="/summary" className={({isActive}) => isActive ? 'text-white' : 'hover:text-white'}>Summary</NavLink>
            <div className="ml-4"><ModelSelector /></div>
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
