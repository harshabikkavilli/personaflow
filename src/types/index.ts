import type { Edge, Node } from '@xyflow/react';

// Node types for the PersonaFlow system
export type PersonaNodeType =
  | 'planner'
  | 'executor'
  | 'critic'
  | 'router'
  | 'tool'
  | 'memory'
  | 'humanCheckpoint';

// Agent types (subset of PersonaNodeType)
export const AGENT_TYPES: PersonaNodeType[] = ['planner', 'executor', 'critic', 'router'];

// System component types (subset of PersonaNodeType)
export const SYSTEM_TYPES: PersonaNodeType[] = ['tool', 'memory', 'humanCheckpoint'];

// Metadata for a persona node
export interface PersonaNodeMeta {
  description?: string;
  responsibilities?: string;
  risks?: string[];
  logicConfig?: Record<string, unknown>;
  inputSchema?: Record<string, unknown>;
  outputDestinations?: string[];
}

// Data stored in a persona node
export interface PersonaNodeData extends Record<string, unknown> {
  name: string;
  personaType: PersonaNodeType;
  meta: PersonaNodeMeta;
}

// React Flow node with PersonaFlow data
export type PersonaNode = Node<PersonaNodeData>;

// React Flow edge for PersonaFlow
export interface PersonaEdge extends Edge {
  label?: string;
  animated?: boolean;
  style?: React.CSSProperties;
}

// Analysis warning types
export type WarningType = 'unverified-executor' | 'unused-memory' | 'unbounded-loop';

// Analysis warning
export interface AnalysisWarning {
  id: string;
  type: WarningType;
  message: string;
  nodeIds: string[];
  severity: 'warning' | 'error';
}

// Graph statistics
export interface GraphStats {
  agents: number;
  tools: number;
  memory: number;
}

// Node configuration for the sidebar
export interface NodeConfig {
  type: PersonaNodeType;
  label: string;
  description: string;
  color: string;
}

// Agent node configurations
export const AGENT_CONFIGS: NodeConfig[] = [
  {
    type: 'planner',
    label: 'Planner',
    description: 'Decomposes goals into sub-tasks',
    color: 'var(--pf-planner)',
  },
  {
    type: 'executor',
    label: 'Executor',
    description: 'Executes tools and API calls',
    color: 'var(--pf-executor)',
  },
  {
    type: 'critic',
    label: 'Critic/Verifier',
    description: 'Validates agent outputs',
    color: 'var(--pf-critic)',
  },
  {
    type: 'router',
    label: 'Router',
    description: 'Routes requests to appropriate agents',
    color: 'var(--pf-router)',
  },
];

// System component configurations
export const SYSTEM_CONFIGS: NodeConfig[] = [
  {
    type: 'tool',
    label: 'Tool',
    description: 'External tool or API integration',
    color: 'var(--pf-tool)',
  },
  {
    type: 'memory',
    label: 'Memory',
    description: 'Persistent storage for context',
    color: 'var(--pf-memory)',
  },
  {
    type: 'humanCheckpoint',
    label: 'Human Review',
    description: 'Human-in-the-loop checkpoint',
    color: 'var(--pf-human)',
  },
];

// All node configurations
export const ALL_NODE_CONFIGS: NodeConfig[] = [...AGENT_CONFIGS, ...SYSTEM_CONFIGS];

// Helper to get node config by type
export function getNodeConfig(type: PersonaNodeType): NodeConfig | undefined {
  return ALL_NODE_CONFIGS.find((config) => config.type === type);
}

// Helper to check if a type is an agent type
export function isAgentType(type: PersonaNodeType): boolean {
  return AGENT_TYPES.includes(type);
}

// Helper to generate unique IDs
export function generateId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
