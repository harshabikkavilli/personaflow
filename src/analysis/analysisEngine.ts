import type {AnalysisWarning, PersonaEdge, PersonaNode} from '../types';

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

	const nodeMap = new Map(nodes.map((n) => [n.id, n]));

	// Rule 1: Check for unverified executors
	const executorWarnings = checkUnverifiedExecutors(nodes, outgoing, nodeMap);
	warnings.push(...executorWarnings);

	// Rule 2: Check for unused memory
	const memoryWarnings = checkUnusedMemory(nodes, outgoing, incoming);
	warnings.push(...memoryWarnings);

	// New Rule: Check for disconnected subgraphs
	const disconnectedWarnings = checkDisconnectedSubgraphs(
		nodes,
		outgoing,
		incoming
	);
	warnings.push(...disconnectedWarnings);

	// Rule 3: Check for cycles (unbounded loops)
	const cycleWarnings = checkCycles(nodes, outgoing, nodeMap);
	warnings.push(...cycleWarnings);

	// New Rule: Check entry and exit nodes
	const entryExitWarnings = checkEntryAndExitNodes(nodes, outgoing, incoming);
	warnings.push(...entryExitWarnings);

	return warnings;
}

/**
 * Rule 1: Find Executor nodes that don't have a downstream Critic/Verifier or HumanCheckpoint
 */
function checkUnverifiedExecutors(
	nodes: PersonaNode[],
	outgoing: Map<string, string[]>,
	nodeMap: Map<string, PersonaNode>
): AnalysisWarning[] {
	const warnings: AnalysisWarning[] = [];

	const executors = nodes.filter((n) => n.data.personaType === 'executor');

	for (const executor of executors) {
		const hasVerifier = hasDownstreamVerifier(
			executor.id,
			nodeMap,
			outgoing,
			new Set()
		);

		if (!hasVerifier) {
			warnings.push({
				id: `unverified-${executor.id}`,
				type: 'unverified-executor',
				message: `Executor "${executor.data.name}" has no downstream Critic/Verifier or Human Checkpoint`,
				nodeIds: [executor.id],
				severity: 'warning'
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
		if (
			target.data.personaType === 'critic' ||
			target.data.personaType === 'humanCheckpoint'
		) {
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
			const issue = hasIncoming
				? 'no outgoing edges (never read). Consider wiring this memory into downstream nodes or removing it.'
				: 'no incoming edges (never written). Consider connecting producers to this memory or removing it.';
			warnings.push({
				id: `unused-memory-${memory.id}`,
				type: 'unused-memory',
				message: `Memory "${memory.data.name}" has ${issue}`,
				nodeIds: [memory.id],
				severity: 'warning'
			});
		} else if (!hasIncoming && !hasOutgoing) {
			warnings.push({
				id: `unused-memory-${memory.id}`,
				type: 'unused-memory',
				message: `Memory "${memory.data.name}" is not connected to any nodes. Consider removing it or connecting it to planners/executors.`,
				nodeIds: [memory.id],
				severity: 'warning'
			});
		}
	}

	return warnings;
}

/**
 * New Rule: Detect disconnected subgraphs in the graph using undirected traversal
 */
function checkDisconnectedSubgraphs(
	nodes: PersonaNode[],
	outgoing: Map<string, string[]>,
	incoming: Map<string, string[]>
): AnalysisWarning[] {
	const warnings: AnalysisWarning[] = [];

	// Build undirected adjacency map
	const adjacency = new Map<string, Set<string>>();
	for (const node of nodes) {
		adjacency.set(node.id, new Set());
	}
	for (const [source, targets] of outgoing.entries()) {
		for (const target of targets) {
			adjacency.get(source)?.add(target);
			adjacency.get(target)?.add(source);
		}
	}
	for (const [target, sources] of incoming.entries()) {
		for (const source of sources) {
			adjacency.get(target)?.add(source);
			adjacency.get(source)?.add(target);
		}
	}

	const visited = new Set<string>();
	const components: string[][] = [];

	for (const node of nodes) {
		if (!visited.has(node.id)) {
			const stack = [node.id];
			const component: string[] = [];
			visited.add(node.id);

			while (stack.length > 0) {
				const current = stack.pop()!;
				component.push(current);
				const neighbors = adjacency.get(current) ?? new Set();
				for (const neighbor of neighbors) {
					if (!visited.has(neighbor)) {
						visited.add(neighbor);
						stack.push(neighbor);
					}
				}
			}

			components.push(component);
		}
	}

	if (components.length <= 1) {
		return warnings;
	}

	// Identify largest component
	let largestComponent = components[0];
	for (const comp of components) {
		if (comp.length > largestComponent.length) {
			largestComponent = comp;
		}
	}

	// Collect orphan nodes (all nodes not in largest component)
	const orphanNodeIds = components.filter((c) => c !== largestComponent).flat();

	if (orphanNodeIds.length > 0) {
		warnings.push({
			id: 'disconnected-subgraphs',
			type: 'disconnected-subgraph',
			message:
				'Multiple disconnected flows detected. Make sure isolated subgraphs are intentional.',
			nodeIds: orphanNodeIds,
			severity: 'info'
		});
	}

	return warnings;
}

/**
 * Rule 3: Detect cycles in the graph using DFS and report all nodes involved in any cycle
 */
function checkCycles(
	nodes: PersonaNode[],
	outgoing: Map<string, string[]>,
	nodeMap: Map<string, PersonaNode>
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
					// continue searching for other cycles
				}
			} else if (recursionStack.has(targetId)) {
				// Found a cycle - collect all nodes in the cycle
				const cycleStart = path.indexOf(targetId);
				const cyclePath = cycleStart >= 0 ? path.slice(cycleStart) : path;
				cyclePath.push(nodeId);
				cyclePath.forEach((id) => cycleNodes.add(id));
				cycleNodes.add(targetId);
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
		const cycleNames = Array.from(cycleNodes).map(
			(id) => nodeMap.get(id)?.data.name ?? id
		);
		warnings.push({
			id: 'cycle-detected',
			type: 'unbounded-loop',
			message:
				cycleNames.length > 0
					? 'Possible unbounded loop detected involving: ' +
						cycleNames.join(' → ')
					: 'Possible unbounded loop detected in the graph',
			nodeIds: Array.from(cycleNodes),
			severity: 'warning'
		});
	}

	return warnings;
}

/**
 * New Rule: Check for entry and exit nodes in the graph
 */
function checkEntryAndExitNodes(
	nodes: PersonaNode[],
	outgoing: Map<string, string[]>,
	incoming: Map<string, string[]>
): AnalysisWarning[] {
	const warnings: AnalysisWarning[] = [];

	if (nodes.length === 0) {
		return warnings;
	}

	const entryNodes = nodes.filter(
		(n) => (incoming.get(n.id)?.length ?? 0) === 0
	);
	const exitNodes = nodes.filter(
		(n) => (outgoing.get(n.id)?.length ?? 0) === 0
	);

	if (entryNodes.length === 0) {
		warnings.push({
			id: 'no-entry-nodes',
			type: 'no-entry-nodes',
			message:
				'No entry nodes detected. Consider clarifying where this flow starts.',
			nodeIds: nodes.map((n) => n.id),
			severity: 'info'
		});
	}

	if (exitNodes.length === 0) {
		warnings.push({
			id: 'no-exit-nodes',
			type: 'no-exit-nodes',
			message:
				'No exit nodes detected. Consider clarifying where this flow terminates.',
			nodeIds: nodes.map((n) => n.id),
			severity: 'info'
		});
	}

	return warnings;
}
