import { useEffect } from 'react';
import { ReactFlow, Background, Controls, MiniMap, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCareerStore } from '../store/careerStore';
import { api } from '../services/api';
import { useMemo, useState } from 'react';

export default function Mindmap() {
  const { interests, graph, setGraph, setCareers, aiProvider, aiModel } = useCareerStore();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ aiGenerated: false, provider: '', model: '' });
  const [rfInstance, setRfInstance] = useState(null);
  const [error, setError] = useState('');

  function layoutIfMissing(nodes) {
    if (!nodes || !nodes.length) return nodes;
    const missing = nodes.some(n => !n.position || typeof n.position.x !== 'number');
    if (!missing) return nodes;
    // Classify into three bands: interests (top), skills (middle), careers (bottom)
    const isInterest = (n) => interests.includes(n?.data?.label);
    const isCareer = (n) => Array.isArray(n?.data?.inDemandSkills) || typeof n?.data?.summary === 'string';
    const interestsNodes = [];
    const skillsNodes = [];
    const careerNodes = [];
    for (const n of nodes) {
      if (isInterest(n)) interestsNodes.push(n);
      else if (isCareer(n)) careerNodes.push(n);
      else skillsNodes.push(n);
    }
    const gapX = 260, gapY = 180;
    const placeRow = (rowNodes, rowIdx) => rowNodes.map((n, i) => ({
      ...n,
      position: { x: i * gapX, y: rowIdx * gapY }
    }));
    const laid = [
      ...placeRow(interestsNodes, 0),
      ...placeRow(skillsNodes, 1),
      ...placeRow(careerNodes, 2),
    ];
    // Preserve any nodes that already had positions
    const withExisting = nodes.map((n) => {
      if (n.position && typeof n.position.x === 'number') return n;
      const found = laid.find((m) => m.id === n.id);
      return found || n;
    });
    return withExisting;
  }

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.post('/api/recommendations', { interests, provider: aiProvider, model: aiModel });
        setMeta({ aiGenerated: !!data.aiGenerated, provider: data.provider, model: data.model });
        const careers = (data.careers || []).slice().sort((a,b) => (a.title||'').localeCompare(b.title||''));
        setCareers(careers);
        const nodes = layoutIfMissing(data.nodes || []);
        const idSet = new Set(nodes.map((n) => n.id));
        const edges = (data.edges || []).filter((e) => idSet.has(e.source) && idSet.has(e.target));
        setGraph({ nodes, edges });
        // ensure the viewport fits after a tick
        setTimeout(() => {
          try { rfInstance?.fitView({ padding: 0.2, includeHiddenNodes: true }); } catch (_) {}
        }, 0);
      } catch (e) {
        setError('Failed to generate mindmap');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [interests, aiProvider, aiModel, rfInstance, setGraph, setCareers]);

  const nodeTypes = useMemo(() => ({
    default: (props) => {
      const label = props?.data?.label || 'Node';
      const summary = props?.data?.summary;
      return (
        <div
          onMouseEnter={() => setSelected({ type: 'node', data: props.data })}
          onMouseLeave={() => setSelected((s) => (s?.data?.label === label ? null : s))}
          onClick={() => setSelected({ type: 'node', data: props.data })}
          className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm shadow"
        >
          <div className="font-medium">{label}</div>
          {summary && <div className="text-neutral-400 text-xs mt-1 max-w-[240px] overflow-hidden text-ellipsis">{summary}</div>}
        </div>
      );
    },
  }), []);

  return (
    <div className="h-[calc(100vh-120px)] grid grid-cols-1 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col min-h-0">
        <div className="border-b border-neutral-800 p-3 text-xs flex items-center gap-3 justify-between">
          {loading ? <span className="text-neutral-400">Generating mindmap…</span> : (
            <span className="text-neutral-400">{meta.aiGenerated ? 'AI-generated' : 'Sample'} · {meta.provider} · {meta.model}</span>
          )}
          {error && <span className="text-red-400">{error}</span>}
          <div className="flex items-center gap-2">
            <button onClick={() => { try { setSelected(null); setError(''); /* retrigger */ } finally { } }} className="hidden" />
            <button onClick={() => { /* regenerate */ (async () => {
              setSelected(null); setError(''); setLoading(true);
              try {
                const { data } = await api.post('/api/recommendations', { interests, provider: aiProvider, model: aiModel });
                setMeta({ aiGenerated: !!data.aiGenerated, provider: data.provider, model: data.model });
                const careers = (data.careers || []).slice().sort((a,b) => (a.title||'').localeCompare(b.title||''));
                setCareers(careers);
                const nodes = layoutIfMissing(data.nodes || []);
                const idSet = new Set(nodes.map((n) => n.id));
                const edges = (data.edges || []).filter((e) => idSet.has(e.source) && idSet.has(e.target));
                setGraph({ nodes, edges });
                setTimeout(() => { try { rfInstance?.fitView({ padding: 0.2, includeHiddenNodes: true }); } catch (_) {} }, 0);
              } catch (e) { setError('Failed to generate mindmap'); }
              finally { setLoading(false); }
            })() }} className="px-2 py-1 border border-neutral-700 rounded text-xs">Regenerate</button>
            <button onClick={() => { try { rfInstance?.fitView({ padding: 0.2, includeHiddenNodes: true }); } catch (_) {} }} className="px-2 py-1 border border-neutral-700 rounded text-xs">Fit view</button>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ReactFlowProvider>
            <ReactFlow nodes={graph.nodes} edges={graph.edges} fitView nodeTypes={nodeTypes} onNodeClick={(_, n) => setSelected({ type: 'node', data: n?.data })} onInit={setRfInstance}>
              <Background />
              <MiniMap />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
      <aside className="hidden lg:block border-l border-neutral-800 p-4 overflow-y-auto">
        {!selected ? (
          <div>
            <div className="text-neutral-400 text-sm mb-3">Hover or click a node to see details.</div>
            <div className="text-sm text-neutral-400">Top careers</div>
            <ul className="mt-2 space-y-3">
              {useCareerStore.getState().careers.map((c, i) => (
                <li key={i} className="border border-neutral-800 rounded-lg p-3">
                  <div className="font-medium">{c.title}</div>
                  {c.summary && <div className="text-neutral-400 text-xs mt-1">{c.summary}</div>}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <div className="text-sm text-neutral-400">Selected node</div>
            <h3 className="text-lg font-semibold">{selected.data?.label}</h3>
            {selected.data?.summary && <p className="text-neutral-300 mt-2">{selected.data.summary}</p>}
            {selected.data?.trendingRoles && (
              <div className="mt-4">
                <div className="text-sm text-neutral-400">Trending roles</div>
                <ul className="list-disc list-inside text-sm">
                  {selected.data.trendingRoles.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
            {selected.data?.inDemandSkills && (
              <div className="mt-4">
                <div className="text-sm text-neutral-400">In-demand skills</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selected.data.inDemandSkills.map((s, i) => <span key={i} className="px-2 py-0.5 rounded-full border border-neutral-700 text-xs">{s}</span>)}
                </div>
              </div>
            )}
            {!selected.data?.summary && (
              <div className="mt-4 text-neutral-500 text-sm">No summary available for this node.</div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}


