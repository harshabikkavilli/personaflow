import dagre from 'dagre';
import type { PersonaEdge, PersonaNode } from '../types';

export type LayoutDirection = 'TB' | 'LR';

// Node type priorities for agent system layout
// Lower numbers = higher priority (appear earlier in the flow)
const NODE_TYPE_PRIORITY: Record<string, number> = {
  router: 0,           // Entry points at top
  planner: 1,          // Middle layer
  executor: 2,         // Middle layer
  critic: 3,           // Lower in graph
  humanCheckpoint: 4,  // Lowest (final step)
  tool: 10,            // Side satellites (high priority = less important for main flow)
  memory: 10,           // Side satellites
};

const nodeWidth = 200;
const nodeHeight = 120;

/**
 * Get the rank/priority for a node based on its type
 */
function getNodeRank(node: PersonaNode): number {
  const type = node.data.personaType;
  return NODE_TYPE_PRIORITY[type] ?? 5;
}

/**
 * Analyze graph structure to determine optimal layout direction
 * Returns depth, width, and aspect ratio of the graph
 */
function analyzeGraphStructure(
  mainNodes: PersonaNode[],
  edges: PersonaEdge[]
): { depth: number; width: number; aspectRatio: number } {
  if (mainNodes.length === 0) {
    return { depth: 0, width: 0, aspectRatio: 1 };
  }

  const mainNodeIds = new Set(mainNodes.map((n) => n.id));

  // Build adjacency list
  const adjacencyList = new Map<string, string[]>();
  mainNodes.forEach((node) => {
    adjacencyList.set(node.id, []);
  });

  edges.forEach((edge) => {
    if (mainNodeIds.has(edge.source) && mainNodeIds.has(edge.target)) {
      const neighbors = adjacencyList.get(edge.source) || [];
      neighbors.push(edge.target);
      adjacencyList.set(edge.source, neighbors);
    }
  });

  // Find entry nodes (nodes with no incoming edges from main nodes)
  const hasIncoming = new Set<string>();
  edges.forEach((edge) => {
    if (mainNodeIds.has(edge.source) && mainNodeIds.has(edge.target)) {
      hasIncoming.add(edge.target);
    }
  });

  const entryNodes = mainNodes.filter((n) => !hasIncoming.has(n.id));

  if (entryNodes.length === 0) {
    // If no entry nodes, use first node as entry
    entryNodes.push(mainNodes[0]);
  }

  // Calculate depth using BFS
  let maxDepth = 0;
  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = [];
  const depthMap = new Map<string, number>();

  entryNodes.forEach((node) => {
    queue.push({ id: node.id, depth: 0 });
    visited.add(node.id);
    depthMap.set(node.id, 0);
  });

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    maxDepth = Math.max(maxDepth, depth);

    const neighbors = adjacencyList.get(id) || [];
    neighbors.forEach((neighborId) => {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        const newDepth = depth + 1;
        queue.push({ id: neighborId, depth: newDepth });
        depthMap.set(neighborId, newDepth);
      }
    });
  }

  // Calculate width (max nodes at same depth level)
  const nodesByDepth = new Map<number, number>();
  depthMap.forEach((depth) => {
    const count = nodesByDepth.get(depth) || 0;
    nodesByDepth.set(depth, count + 1);
  });

  const maxWidth = Math.max(...Array.from(nodesByDepth.values()), 1);
  const aspectRatio = maxDepth > 0 ? maxWidth / maxDepth : 1;

  return {
    depth: maxDepth,
    width: maxWidth,
    aspectRatio,
  };
}

/**
 * Auto-determine the best layout direction based on graph structure
 */
function determineOptimalDirection(
  mainNodes: PersonaNode[],
  edges: PersonaEdge[]
): LayoutDirection {
  const structure = analyzeGraphStructure(mainNodes, edges);

  // If graph is much wider than deep (aspect ratio > 1.5), use LR
  if (structure.aspectRatio > 1.5) {
    return 'LR';
  }

  // If graph is much deeper than wide (aspect ratio < 0.67), use TB
  if (structure.aspectRatio < 0.67) {
    return 'TB';
  }

  // Default to TB for agent systems (vertical flow is more natural)
  return 'TB';
}

/**
 * Calculate optimal spacing based on graph size
 */
function calculateSpacing(nodeCount: number): {
  nodesep: number;
  ranksep: number;
} {
  if (nodeCount <= 3) {
    return { nodesep: 150, ranksep: 220 };
  } else if (nodeCount <= 6) {
    return { nodesep: 120, ranksep: 180 };
  } else if (nodeCount <= 10) {
    return { nodesep: 100, ranksep: 150 };
  } else {
    return { nodesep: 80, ranksep: 120 };
  }
}

/**
 * Calculate centroid of connected main nodes for a satellite
 */
function calculateCentroid(
  satellite: PersonaNode,
  edges: PersonaEdge[],
  mainNodes: PersonaNode[]
): { x: number; y: number } | null {
  const connectedEdges = edges.filter(
    (e) => e.source === satellite.id || e.target === satellite.id
  );

  if (connectedEdges.length === 0) {
    return null;
  }

  // Find all connected main nodes
  const connectedMainNodeIds = new Set<string>();
  connectedEdges.forEach((edge) => {
    const mainNodeId = edge.source === satellite.id ? edge.target : edge.source;
    if (mainNodes.some((n) => n.id === mainNodeId)) {
      connectedMainNodeIds.add(mainNodeId);
    }
  });

  if (connectedMainNodeIds.size === 0) {
    return null;
  }

  // Calculate centroid
  let sumX = 0;
  let sumY = 0;
  let count = 0;

  connectedMainNodeIds.forEach((nodeId) => {
    const node = mainNodes.find((n) => n.id === nodeId);
    if (node) {
      sumX += node.position.x + nodeWidth / 2;
      sumY += node.position.y + nodeHeight / 2;
      count++;
    }
  });

  if (count === 0) {
    return null;
  }

  return {
    x: sumX / count,
    y: sumY / count,
  };
}

/**
 * Check if two positions overlap (with padding)
 */
function positionsOverlap(
  pos1: { x: number; y: number },
  pos2: { x: number; y: number },
  padding: number = 50
): boolean {
  const distance = Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
  );
  return distance < nodeWidth + padding;
}

/**
 * Find a non-overlapping position for a satellite
 */
function findNonOverlappingPosition(
  preferredPos: { x: number; y: number },
  existingPositions: Array<{ x: number; y: number }>,
  isMemory: boolean,
  direction: LayoutDirection
): { x: number; y: number } {
  const currentPos = { ...preferredPos };
  let attempts = 0;
  const maxAttempts = 20;
  const stepSize = direction === 'TB' ? nodeHeight + 30 : nodeWidth + 30;

  while (attempts < maxAttempts) {
    let hasOverlap = false;
    for (const existingPos of existingPositions) {
      if (positionsOverlap(currentPos, existingPos)) {
        hasOverlap = true;
        break;
      }
    }

    if (!hasOverlap) {
      return currentPos;
    }

    // Try offsetting vertically (for TB) or horizontally (for LR)
    if (direction === 'TB') {
      currentPos.y += isMemory ? -stepSize : stepSize;
    } else {
      currentPos.x += isMemory ? -stepSize : stepSize;
    }

    attempts++;
  }

  // If we couldn't find a non-overlapping position, return the preferred one
  return preferredPos;
}

/**
 * Apply custom agent system layout with special handling for satellites
 */
export function applyAgentSystemLayout(
  nodes: PersonaNode[],
  edges: PersonaEdge[],
  direction?: LayoutDirection
): PersonaNode[] {
  // Separate main pipeline nodes from satellites
  const mainNodes: PersonaNode[] = [];
  const satelliteNodes: PersonaNode[] = [];

  nodes.forEach((node) => {
    if (node.data.personaType === 'tool' || node.data.personaType === 'memory') {
      satelliteNodes.push(node);
    } else {
      mainNodes.push(node);
    }
  });

  // Auto-determine direction if not provided
  const optimalDirection = direction ?? determineOptimalDirection(mainNodes, edges);

  // Calculate dynamic spacing
  const spacing = calculateSpacing(mainNodes.length);

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: optimalDirection,
    nodesep: spacing.nodesep,
    ranksep: spacing.ranksep,
    edgesep: 50,
    marginx: 50,
    marginy: 50,
  });

  // Add main pipeline nodes
  mainNodes.forEach((node) => {
    g.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  // Add actual edges between main nodes
  edges.forEach((edge) => {
    const sourceIsMain = mainNodes.some((n) => n.id === edge.source);
    const targetIsMain = mainNodes.some((n) => n.id === edge.target);
    if (sourceIsMain && targetIsMain) {
      g.setEdge(edge.source, edge.target);
    }
  });

  // Add virtual edges to enforce type-based ranking
  // This helps dagre understand the preferred order
  const nodesByRank = new Map<number, PersonaNode[]>();
  mainNodes.forEach((node) => {
    const rank = getNodeRank(node);
    if (!nodesByRank.has(rank)) {
      nodesByRank.set(rank, []);
    }
    nodesByRank.get(rank)!.push(node);
  });

  const sortedRanks = Array.from(nodesByRank.keys()).sort((a, b) => a - b);
  for (let i = 0; i < sortedRanks.length - 1; i++) {
    const currentRank = sortedRanks[i];
    const nextRank = sortedRanks[i + 1];
    const currentNodes = nodesByRank.get(currentRank)!;
    const nextNodes = nodesByRank.get(nextRank)!;

    // Add virtual edges from higher priority nodes to lower priority nodes
    // Only if there's no existing edge
    currentNodes.forEach((source) => {
      nextNodes.forEach((target) => {
        if (!g.hasEdge(source.id, target.id)) {
          // Add as a very light edge (minlen = 0 means it's just for ordering)
          g.setEdge(source.id, target.id, { minlen: 0, weight: 0.1 });
        }
      });
    });
  }

  // Run layout for main pipeline
  dagre.layout(g);

  // Update main node positions
  const updatedMainNodes = mainNodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    if (nodeWithPosition) {
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
    }
    return node;
  });

  // Position satellite nodes near their connected main nodes (with collision avoidance)
  const satellitePositions: Array<{ x: number; y: number }> = [];
  const updatedSatelliteNodes = satelliteNodes.map((satellite) => {
    const isMemory = satellite.data.personaType === 'memory';

    // Calculate centroid of connected main nodes
    const centroid = calculateCentroid(satellite, edges, updatedMainNodes);

    let preferredPos: { x: number; y: number };

    if (centroid) {
      // Use centroid as base position
      const offsetX = optimalDirection === 'TB'
        ? (isMemory ? -280 : 280)
        : 0;
      const offsetY = optimalDirection === 'TB'
        ? 0
        : (isMemory ? -280 : 280);

      preferredPos = {
        x: centroid.x + offsetX - nodeWidth / 2,
        y: centroid.y + offsetY - nodeHeight / 2,
      };
    } else {
      // Fallback: find first connected main node
      const connectedEdges = edges.filter(
        (e) => e.source === satellite.id || e.target === satellite.id
      );

      if (connectedEdges.length === 0) {
        // No connections, place at a default position
        return {
          ...satellite,
          position: { x: -200, y: 300 },
        };
      }

      const connectedMainNodeId = connectedEdges[0].source === satellite.id
        ? connectedEdges[0].target
        : connectedEdges[0].source;

      const connectedMainNode = updatedMainNodes.find((n) => n.id === connectedMainNodeId);
      if (!connectedMainNode) {
        return satellite;
      }

      const offsetX = optimalDirection === 'TB'
        ? (isMemory ? -280 : 280)
        : 0;
      const offsetY = optimalDirection === 'TB'
        ? 0
        : (isMemory ? -280 : 280);

      preferredPos = {
        x: connectedMainNode.position.x + nodeWidth / 2 + offsetX - nodeWidth / 2,
        y: connectedMainNode.position.y + nodeHeight / 2 + offsetY - nodeHeight / 2,
      };
    }

    // Find non-overlapping position
    const finalPos = findNonOverlappingPosition(
      preferredPos,
      satellitePositions,
      isMemory,
      optimalDirection
    );

    satellitePositions.push(finalPos);

    return {
      ...satellite,
      position: finalPos,
    };
  });

  return [...updatedMainNodes, ...updatedSatelliteNodes];
}
