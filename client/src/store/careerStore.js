import { create } from 'zustand';

export const useCareerStore = create((set) => ({
  interests: [],
  careers: [],
  graph: { nodes: [], edges: [] },
  aiProvider: 'ollama',
  aiModel: 'gemma3',
  setInterests: (interests) => set({ interests }),
  setCareers: (careers) => set({ careers }),
  setGraph: (graph) => set({ graph }),
  setAI: ({ provider, model }) => set((s) => ({ aiProvider: provider || s.aiProvider, aiModel: model || s.aiModel })),
}));


