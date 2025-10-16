import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useCareerStore } from '../store/careerStore';

export default function Resources() {
  const { careers } = useCareerStore();
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const run = async () => {
      const q = careers[0]?.title || '';
      const { data } = await api.get('/api/resources', { params: { q } });
      setResources(data.resources || []);
    };
    run();
  }, [careers]);

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Learning resources</h2>
      <ul className="grid md:grid-cols-2 gap-4">
        {resources.map((r, i) => (
          <li key={i} className="border border-neutral-800 rounded-lg p-4">
            <a className="font-medium hover:underline" href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
            <p className="text-neutral-400 text-sm mt-1">{r.source}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}


