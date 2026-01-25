import { atom } from 'jotai';
import { analyzeGraph } from '../analysis/analysisEngine';
import type { AnalysisWarning, GraphStats, PersonaEdge, PersonaNode } from '../types';
import { AGENT_TYPES } from '../types';

// Primitive atoms
export const nodesAtom = atom<PersonaNode[]>([]);
export const edgesAtom = atom<PersonaEdge[]>([]);
export const selectedNodeIdAtom = atom<string | null>(null);

// Derived atom: get the currently selected node
export const selectedNodeAtom = atom((get) => {
  const id = get(selectedNodeIdAtom);
  if (!id) return null;
  const nodes = get(nodesAtom);
  return nodes.find((n) => n.id === id) ?? null;
});

// Derived atom factory: get node by ID
export const nodeByIdAtom = (id: string) => atom((get) => {
  const nodes = get(nodesAtom);
  return nodes.find((n) => n.id === id) ?? null;
});

// Derived atom factory: get edge by ID
export const edgeByIdAtom = (id: string) => atom((get) => {
  const edges = get(edgesAtom);
  return edges.find((e) => e.id === id) ?? null;
});

// Derived atom: compute warnings from the graph
export const warningsAtom = atom<AnalysisWarning[]>((get) => {
  const nodes = get(nodesAtom);
  const edges = get(edgesAtom);
  return analyzeGraph(nodes, edges);
});

// Derived atom: compute graph statistics
export const statsAtom = atom<GraphStats>((get) => {
  const nodes = get(nodesAtom);
  return {
    agents: nodes.filter((n) => AGENT_TYPES.includes(n.data.personaType)).length,
    tools: nodes.filter((n) => n.data.personaType === 'tool').length,
    memory: nodes.filter((n) => n.data.personaType === 'memory').length,
  };
});

// Derived atom: check if graph is valid (no errors)
export const isValidSystemAtom = atom((get) => {
  const warnings = get(warningsAtom);
  return warnings.filter((w) => w.severity === 'error').length === 0;
});

// Action atom: add a new node
export const addNodeAtom = atom(null, (get, set, node: PersonaNode) => {
  const nodes = get(nodesAtom);
  set(nodesAtom, [...nodes, node]);
});

// Action atom: update a node
export const updateNodeAtom = atom(
  null,
  (get, set, { id, data }: { id: string; data: Partial<PersonaNode['data']> }) => {
    const nodes = get(nodesAtom);
    set(
      nodesAtom,
      nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n))
    );
  }
);

// Action atom: delete a node and its connected edges
export const deleteNodeAtom = atom(null, (get, set, nodeId: string) => {
  const nodes = get(nodesAtom);
  const edges = get(edgesAtom);
  
  set(
    nodesAtom,
    nodes.filter((n) => n.id !== nodeId)
  );
  set(
    edgesAtom,
    edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
  );
  
  // Clear selection if deleted node was selected
  if (get(selectedNodeIdAtom) === nodeId) {
    set(selectedNodeIdAtom, null);
  }
});

// Action atom: add an edge
export const addEdgeAtom = atom(null, (get, set, edge: PersonaEdge) => {
  const edges = get(edgesAtom);
  // Prevent duplicate edges
  const exists = edges.some(
    (e) => e.source === edge.source && e.target === edge.target
  );
  if (!exists) {
    set(edgesAtom, [...edges, edge]);
  }
});

// Action atom: delete an edge
export const deleteEdgeAtom = atom(null, (get, set, edgeId: string) => {
  const edges = get(edgesAtom);
  set(
    edgesAtom,
    edges.filter((e) => e.id !== edgeId)
  );
});

// Action atom: update an edge
export const updateEdgeAtom = atom(
  null,
  (get, set, { id, updates }: { id: string; updates: Partial<PersonaEdge> }) => {
    const edges = get(edgesAtom);
    set(
      edgesAtom,
      edges.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }
);

// Action atom: load a complete graph (for examples)
export const loadGraphAtom = atom(
  null,
  (_get, set, { nodes, edges }: { nodes: PersonaNode[]; edges: PersonaEdge[] }) => {
    set(nodesAtom, nodes);
    set(edgesAtom, edges);
    set(selectedNodeIdAtom, null);
  }
);

// Action atom: clear the graph
export const clearGraphAtom = atom(null, (_get, set) => {
  set(nodesAtom, []);
  set(edgesAtom, []);
  set(selectedNodeIdAtom, null);
});

// Atom to track if default example has been loaded
export const hasLoadedDefaultAtom = atom<boolean>(false);
