import type { PersonaNode, PersonaEdge, AnalysisWarning } from '../types';

/**
 * Analyzes the graph and returns warnings for potential issues.
 * 
 * Rules:
 * 1. Unverified Executor: Executor nodes without downstream Critic/Verifier or HumanCheckpoint
 * 2. Unused Memory: Memory nodes with only incoming OR only outgoing edges (not both)
 * 3. Unbounded Loop: Cycles detected in the graph
 */
export function analyzeGraph(
  nodes: PersonaNode[],
  edges: PersonaEdge[]
): AnalysisWarning[] {
  const warnings: AnalysisWarning[] = [];

  // Build adjacency lists for traversal
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();

  for (const node of nodes) {
    outgoing.set(node.id, []);
    incoming.set(node.id, []);
  }

  for (const edge of edges) {
    outgoing.get(edge.source)?.push(edge.target);
    incoming.get(edge.target)?.push(edge.source);
  }

  // Rule 1: Check for unverified executors
  const executorWarnings = checkUnverifiedExecutors(nodes, outgoing);
  warnings.push(...executorWarnings);

  // Rule 2: Check for unused memory
  const memoryWarnings = checkUnusedMemory(nodes, outgoing, incoming);
  warnings.push(...memoryWarnings);

  // Rule 3: Check for cycles (unbounded loops)
  const cycleWarnings = checkCycles(nodes, outgoing);
  warnings.push(...cycleWarnings);

  return warnings;
}

/**
 * Rule 1: Find Executor nodes that don't have a downstream Critic/Verifier or HumanCheckpoint
 */
function checkUnverifiedExecutors(
  nodes: PersonaNode[],
  outgoing: Map<string, string[]>
): AnalysisWarning[] {
  const warnings: AnalysisWarning[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const executors = nodes.filter((n) => n.data.personaType === 'executor');

  for (const executor of executors) {
    const hasVerifier = hasDownstreamVerifier(executor.id, nodeMap, outgoing, new Set());
    
    if (!hasVerifier) {
      warnings.push({
        id: `unverified-${executor.id}`,
        type: 'unverified-executor',
        message: `Executor "${executor.data.name}" has no downstream Critic/Verifier or Human Checkpoint`,
        nodeIds: [executor.id],
        severity: 'warning',
      });
    }
  }

  return warnings;
}

/**
 * Recursively check if a node has a downstream verifier (critic or humanCheckpoint)
 */
function hasDownstreamVerifier(
  nodeId: string,
  nodeMap: Map<string, PersonaNode>,
  outgoing: Map<string, string[]>,
  visited: Set<string>
): boolean {
  if (visited.has(nodeId)) return false;
  visited.add(nodeId);

  const targets = outgoing.get(nodeId) ?? [];
  
  for (const targetId of targets) {
    const target = nodeMap.get(targetId);
    if (!target) continue;

    // Found a verifier
    if (target.data.personaType === 'critic' || target.data.personaType === 'humanCheckpoint') {
      return true;
    }

    // Recursively check downstream
    if (hasDownstreamVerifier(targetId, nodeMap, outgoing, visited)) {
      return true;
    }
  }

  return false;
}

/**
 * Rule 2: Find Memory nodes that have only incoming OR only outgoing edges (not both)
 */
function checkUnusedMemory(
  nodes: PersonaNode[],
  outgoing: Map<string, string[]>,
  incoming: Map<string, string[]>
): AnalysisWarning[] {
  const warnings: AnalysisWarning[] = [];

  const memoryNodes = nodes.filter((n) => n.data.personaType === 'memory');

  for (const memory of memoryNodes) {
    const hasIncoming = (incoming.get(memory.id)?.length ?? 0) > 0;
    const hasOutgoing = (outgoing.get(memory.id)?.length ?? 0) > 0;

    if (hasIncoming !== hasOutgoing) {
      const issue = hasIncoming ? 'no outgoing edges (never read)' : 'no incoming edges (never written)';
      warnings.push({
        id: `unused-memory-${memory.id}`,
        type: 'unused-memory',
        message: `Memory "${memory.data.name}" has ${issue}`,
        nodeIds: [memory.id],
        severity: 'warning',
      });
    } else if (!hasIncoming && !hasOutgoing) {
      warnings.push({
        id: `unused-memory-${memory.id}`,
        type: 'unused-memory',
        message: `Memory "${memory.data.name}" is not connected to any nodes`,
        nodeIds: [memory.id],
        severity: 'warning',
      });
    }
  }

  return warnings;
}

/**
 * Rule 3: Detect cycles in the graph using DFS
 */
function checkCycles(
  nodes: PersonaNode[],
  outgoing: Map<string, string[]>
): AnalysisWarning[] {
  const warnings: AnalysisWarning[] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycleNodes = new Set<string>();

  function dfs(nodeId: string, path: string[]): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const targets = outgoing.get(nodeId) ?? [];
    
    for (const targetId of targets) {
      if (!visited.has(targetId)) {
        if (dfs(targetId, [...path, nodeId])) {
          return true;
        }
      } else if (recursionStack.has(targetId)) {
        // Found a cycle - collect all nodes in the cycle
        const cycleStart = path.indexOf(targetId);
        const cyclePath = cycleStart >= 0 ? path.slice(cycleStart) : path;
        cyclePath.push(nodeId);
        cyclePath.forEach((id) => cycleNodes.add(id));
        cycleNodes.add(targetId);
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id, []);
    }
  }

  if (cycleNodes.size > 0) {
    warnings.push({
      id: 'cycle-detected',
      type: 'unbounded-loop',
      message: 'Possible unbounded loop detected in the graph',
      nodeIds: Array.from(cycleNodes),
      severity: 'warning',
    });
  }

  return warnings;
}
