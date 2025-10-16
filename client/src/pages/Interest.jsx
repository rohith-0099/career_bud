import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerStore } from '../store/careerStore';

const SUGGESTED = [
  'AI', 'Design', 'Environment', 'Healthcare', 'Space', 'Music', 'Finance', 'Robotics', 'Gaming', 'Cybersecurity', 'Biotech', 'Climate', 'Education', 'Data Science', 'Web3'
];

export default function Interest() {
  const navigate = useNavigate();
  const { interests, setInterests } = useCareerStore();
  const [local, setLocal] = useState(interests);

  const toggle = (tag) => {
    setLocal((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const proceed = () => {
    setInterests(local);
    navigate('/mindmap');
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-2">Pick your interests</h2>
      <p className="text-neutral-300 mb-6">Choose topics you’re passionate about. You can change these anytime.</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {SUGGESTED.map((t) => (
          <button
            key={t}
            onClick={() => toggle(t)}
            className={"px-3 py-1.5 rounded-full border text-sm " + (local.includes(t) ? 'bg-white text-black border-white' : 'border-neutral-700 hover:border-neutral-500')}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={proceed} className="px-4 py-2 rounded-md bg-white text-black">Generate mindmap</button>
      </div>
    </section>
  );
}


