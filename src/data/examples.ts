import type { PersonaEdge, PersonaNode } from '../types';

export interface ExampleGraph {
  id: string;
  name: string;
  description: string;
  nodes: PersonaNode[];
  edges: PersonaEdge[];
}

/**
 * Example 1: User Query Router
 * A typical multi-agent flow where user queries are routed, planned, executed, and verified.
 */
export const userQueryRouterExample: ExampleGraph = {
  id: 'user-query-router',
  name: 'User Query Router',
  description: 'Routes incoming requests to appropriate agents based on complexity heuristics.',
  nodes: [
    {
      id: '1',
      type: 'persona',
      position: { x: 250, y: 50 },
      data: {
        name: 'User Query Handler',
        personaType: 'router',
        meta: {
          description: 'Routes incoming requests to appropriate agents',
        },
      },
    },
    {
      id: '2',
      type: 'persona',
      position: { x: 100, y: 200 },
      data: {
        name: 'Task Planner',
        personaType: 'planner',
        meta: {
          description: 'Breaks down complex tasks into steps',
        },
      },
    },
    {
      id: '3',
      type: 'persona',
      position: { x: 400, y: 200 },
      data: {
        name: 'Action Executor',
        personaType: 'executor',
        meta: {
          description: 'Executes planned actions using tools',
        },
      },
    },
    {
      id: '4',
      type: 'persona',
      position: { x: 250, y: 350 },
      data: {
        name: 'Quality Verifier',
        personaType: 'critic',
        meta: {
          description: 'Validates outputs and checks for errors',
        },
      },
    },
    {
      id: '5',
      type: 'persona',
      position: { x: 550, y: 300 },
      data: {
        name: 'Search API',
        personaType: 'tool',
        meta: {
          description: 'External search capability',
        },
      },
    },
    {
      id: '6',
      type: 'persona',
      position: { x: -50, y: 300 },
      data: {
        name: 'Conversation Memory',
        personaType: 'memory',
        meta: {
          description: 'Stores context and history',
        },
      },
    },
    {
      id: '7',
      type: 'persona',
      position: { x: 250, y: 500 },
      data: {
        name: 'Human Review',
        personaType: 'humanCheckpoint',
        meta: {
          description: 'Manual approval for critical actions',
        },
      },
    },
  ],
  edges: [
    // Animated edges from router (routing decisions)
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3', animated: true },
    // Solid edges for data flow
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e3-4', source: '3', target: '4' },
    { id: 'e3-5', source: '3', target: '5' },
    { id: 'e6-2', source: '6', target: '2' },
    { id: 'e4-7', source: '4', target: '7' },
  ],
};

// All available examples
export const examples: ExampleGraph[] = [
  userQueryRouterExample,
];

// Default example to load
export const defaultExample = userQueryRouterExample;
