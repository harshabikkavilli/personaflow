import type {PersonaEdge, PersonaNode} from '../types';

export interface LangGraphCodegenOptions {
	includeTypes?: boolean;
	includeLogging?: boolean;
	frameworkVersion?: string;
}

/**
 * Sanitize a string to be a valid Python identifier
 */
function sanitizePythonIdentifier(name: string): string {
	// Replace spaces and special chars with underscores, remove invalid chars
	return name
		.replace(/[^a-zA-Z0-9_]/g, '_')
		.replace(/^[0-9]/, '_$&') // Can't start with number
		.toLowerCase();
}

/**
 * Generate LangGraph Python code from PersonaFlow graph
 */
export function generateLangGraphCode(
	nodes: PersonaNode[],
	edges: PersonaEdge[],
	options: LangGraphCodegenOptions = {}
): string {
	const {
		includeTypes = true,
		includeLogging = false,
		frameworkVersion = 'latest'
	} = options;

	const agentNodes = nodes.filter((n) =>
		['planner', 'executor', 'critic', 'router'].includes(n.data.personaType)
	);
	const toolNodes = nodes.filter((n) => n.data.personaType === 'tool');
	const memoryNodes = nodes.filter((n) => n.data.personaType === 'memory');
	const humanCheckpoints = nodes.filter(
		(n) => n.data.personaType === 'humanCheckpoint'
	);

	// Find entry points (nodes with no incoming edges)
	const hasIncoming = new Set(edges.map((e) => e.target));
	const entryNodes = nodes.filter(
		(n) => !hasIncoming.has(n.id) && agentNodes.includes(n)
	);

	// Build node name mapping
	const nodeNameMap = new Map<string, string>();
	nodes.forEach((node) => {
		nodeNameMap.set(node.id, sanitizePythonIdentifier(node.data.name));
	});

	let code = '"""\n';
	code += 'Generated LangGraph workflow from PersonaFlow\n';
	code += `Framework version: ${frameworkVersion}\n`;
	code += '"""\n\n';

	// Imports
	code += 'from typing import TypedDict, Annotated\n';
	code += 'from langgraph.graph import StateGraph, START, END\n';
	if (memoryNodes.length > 0) {
		code += 'from langgraph.checkpoint.memory import MemorySaver\n';
	}
	if (includeLogging) {
		code += 'import logging\n\n';
		code += 'logger = logging.getLogger(__name__)\n';
	}
	code += '\n';

	// State definition
	if (includeTypes) {
		code += 'class State(TypedDict):\n';
		code += '    """Graph state schema"""\n';
		code += '    messages: Annotated[list, "List of messages"]\n';
		code += '    plan: Annotated[str, "Current plan"]\n';
		code += '    feedback: Annotated[str, "Feedback from critic"]\n';
		code += '\n';
	} else {
		code += '# State: dict with messages, plan, feedback\n';
		code += '\n';
	}

	// Tool definitions
	if (toolNodes.length > 0) {
		code += '# Tool definitions\n';
		toolNodes.forEach((tool) => {
			const toolName = nodeNameMap.get(tool.id) || `tool_${tool.id}`;
			code += `def ${toolName}_tool(input_data: dict) -> dict:\n`;
			code += `    """Tool: ${tool.data.name}"""\n`;
			if (includeLogging) {
				code += `    logger.info(f"Executing tool: ${tool.data.name}")\n`;
			}
			code += '    # TODO: Implement tool logic\n';
			code += '    return {"result": "placeholder"}\n';
			code += '\n';
		});
		code += '\n';
	}

	// Node functions
	code += '# Node functions\n';
	agentNodes.forEach((node) => {
		const nodeName = nodeNameMap.get(node.id) || `node_${node.id}`;
		const nodeType = node.data.personaType;

		code += `def ${nodeName}_node(state: ${includeTypes ? 'State' : 'dict'}) -> ${includeTypes ? 'State' : 'dict'}:\n`;
		code += `    """${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}: ${node.data.name}"""\n`;

		if (includeLogging) {
			code += `    logger.info(f"Executing ${node.data.name}")\n`;
		}

		if (nodeType === 'router') {
			code += '    # TODO: Implement routing logic\n';
			code += '    # Return next node name based on state\n';
			code += '    return "next_node"\n';
		} else if (nodeType === 'planner') {
			code += '    # TODO: Implement planning logic\n';
			code += '    state["plan"] = "Generated plan"\n';
			code += '    return state\n';
		} else if (nodeType === 'executor') {
			code += '    # TODO: Implement execution logic\n';
			if (toolNodes.length > 0) {
				code += '    # Use tools here\n';
			}
			code +=
				'    state["messages"].append({"role": "assistant", "content": "Executed"})\n';
			code += '    return state\n';
		} else if (nodeType === 'critic') {
			code += '    # TODO: Implement critique logic\n';
			code += '    state["feedback"] = "Review feedback"\n';
			code += '    return state\n';
		} else {
			code += '    # TODO: Implement node logic\n';
			code += '    return state\n';
		}
		code += '\n';
	});

	// Graph construction
	code += '# Build graph\n';
	code += 'workflow = StateGraph(';
	if (includeTypes) {
		code += 'State';
	} else {
		code += 'dict';
	}
	code += ')\n\n';

	// Add nodes
	agentNodes.forEach((node) => {
		const nodeName = nodeNameMap.get(node.id) || `node_${node.id}`;
		code += `workflow.add_node("${nodeName}", ${nodeName}_node)\n`;
	});
	code += '\n';

	// Add edges
	if (entryNodes.length > 0) {
		const entryNode = entryNodes[0];
		const entryName = nodeNameMap.get(entryNode.id) || `node_${entryNode.id}`;
		code += `workflow.add_edge(START, "${entryName}")\n`;
	}

	// Handle router conditional edges
	const routerNodes = agentNodes.filter((n) => n.data.personaType === 'router');
	routerNodes.forEach((router) => {
		const routerName = nodeNameMap.get(router.id) || `node_${router.id}`;
		const routerEdges = edges.filter((e) => e.source === router.id);

		if (routerEdges.length > 0) {
			code += `\n# Conditional edges from ${routerName}\n`;
			code += `def ${routerName}_route(state: ${includeTypes ? 'State' : 'dict'}) -> str:\n`;
			code += '    # TODO: Implement routing logic\n';
			const targets = routerEdges.map((e) => {
				const targetName = nodeNameMap.get(e.target) || `node_${e.target}`;
				return `"${targetName}"`;
			});
			code += `    return ${targets[0]}  # Default route\n`;
			code += '\n';

			routerEdges.forEach((edge) => {
				const targetName =
					nodeNameMap.get(edge.target) || `node_${edge.target}`;
				code += `workflow.add_conditional_edges("${routerName}", ${routerName}_route, {\n`;
				code += `    "${targetName}": "${targetName}",\n`;
				code += '})\n';
			});
		}
	});

	// Add regular edges
	const regularEdges = edges.filter((e) => {
		const sourceNode = nodes.find((n) => n.id === e.source);
		return sourceNode && !routerNodes.includes(sourceNode);
	});

	regularEdges.forEach((edge) => {
		const sourceName = nodeNameMap.get(edge.source) || `node_${edge.source}`;
		const targetName = nodeNameMap.get(edge.target) || `node_${edge.target}`;
		code += `workflow.add_edge("${sourceName}", "${targetName}")\n`;
	});

	// Add edges to END
	const nodesWithNoOutgoing = agentNodes.filter((node) => {
		return !edges.some((e) => e.source === node.id);
	});

	if (nodesWithNoOutgoing.length > 0) {
		nodesWithNoOutgoing.forEach((node) => {
			const nodeName = nodeNameMap.get(node.id) || `node_${node.id}`;
			code += `workflow.add_edge("${nodeName}", END)\n`;
		});
	}

	// Human checkpoints
	if (humanCheckpoints.length > 0) {
		code += '\n# Human checkpoints\n';
		humanCheckpoints.forEach((checkpoint) => {
			const checkpointName =
				nodeNameMap.get(checkpoint.id) || `node_${checkpoint.id}`;
			// Find the node that should be interrupted before this checkpoint
			const incomingEdges = edges.filter((e) => e.target === checkpoint.id);
			if (incomingEdges.length > 0) {
				const beforeNode = nodes.find((n) => n.id === incomingEdges[0].source);
				if (beforeNode) {
					const beforeName =
						nodeNameMap.get(beforeNode.id) || `node_${beforeNode.id}`;
					code += `workflow.add_edge("${beforeName}", "${checkpointName}")\n`;
				}
			}
		});
	}

	// Compile graph
	code += '\n# Compile graph\n';
	if (memoryNodes.length > 0) {
		code += 'memory = MemorySaver()\n';
		code += 'app = workflow.compile(checkpointer=memory)\n';
	} else {
		code += 'app = workflow.compile()\n';
	}

	// Example usage
	code += '\n# Example usage:\n';
	code += '# initial_state = {\n';
	code += '#     "messages": [{"role": "user", "content": "Hello"}],\n';
	code += '#     "plan": "",\n';
	code += '#     "feedback": ""\n';
	code += '# }\n';
	code += '# result = app.invoke(initial_state)\n';

	return code;
}
