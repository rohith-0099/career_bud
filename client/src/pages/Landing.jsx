import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
        Discover your path in a universe of careers
      </h1>
      <p className="text-neutral-300 max-w-2xl mb-8">
        CareerVerse helps students explore careers through interactive mindmaps and a 3D universe,
        powered by AI insights on emerging trends, skills, and roles.
      </p>
      <div className="flex gap-4">
        <Link to="/interests" className="px-5 py-3 rounded-md bg-white text-black font-medium">Get started</Link>
        <Link to="/mindmap" className="px-5 py-3 rounded-md border border-neutral-700">See mindmap</Link>
      </div>
    </section>
  );
}


