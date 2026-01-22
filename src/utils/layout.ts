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

/**
 * Get the rank/priority for a node based on its type
 */
function getNodeRank(node: PersonaNode): number {
  const type = node.data.personaType;
  return NODE_TYPE_PRIORITY[type] ?? 5;
}

/**
 * Apply custom agent system layout with special handling for satellites
 */
export function applyAgentSystemLayout(
  nodes: PersonaNode[],
  edges: PersonaEdge[],
  direction: LayoutDirection = 'TB'
): PersonaNode[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: direction,
    nodesep: 120,
    ranksep: 180,
    edgesep: 50,
    marginx: 50,
    marginy: 50,
  });

  const nodeWidth = 200;
  const nodeHeight = 120;

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

  // Position satellite nodes near their connected main nodes
  const updatedSatelliteNodes = satelliteNodes.map((satellite) => {
    // Find edges connected to this satellite
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

    // Find the connected main node
    const connectedMainNodeId = connectedEdges[0].source === satellite.id
      ? connectedEdges[0].target
      : connectedEdges[0].source;

    const connectedMainNode = updatedMainNodes.find((n) => n.id === connectedMainNodeId);
    if (!connectedMainNode) {
      return satellite;
    }

    // Position satellite to the side of the connected main node
    const isMemory = satellite.data.personaType === 'memory';
    const offsetX = isMemory ? -250 : 250; // Memory on left, tools on right
    const offsetY = 0;

    return {
      ...satellite,
      position: {
        x: connectedMainNode.position.x + offsetX,
        y: connectedMainNode.position.y + offsetY,
      },
    };
  });

  return [...updatedMainNodes, ...updatedSatelliteNodes];
}
