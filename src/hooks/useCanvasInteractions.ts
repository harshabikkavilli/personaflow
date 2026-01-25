import {useCallback} from 'react';
import {useAtom, useSetAtom} from 'jotai';
import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	type OnConnect,
	type OnEdgesChange,
	type OnNodesChange
} from '@xyflow/react';
import {edgesAtom, nodesAtom, selectedNodeIdAtom} from '../atoms/graphAtoms';
import type {PersonaEdge, PersonaNode} from '../types';
import {generateId} from '../types';

export function useCanvasInteractions() {
	const [nodes, setNodes] = useAtom(nodesAtom);
	const [edges, setEdges] = useAtom(edgesAtom);
	const setSelectedNodeId = useSetAtom(selectedNodeIdAtom);

	const onNodesChange: OnNodesChange = useCallback(
		(changes) => {
			setNodes((nds) => applyNodeChanges(changes, nds) as PersonaNode[]);
		},
		[setNodes]
	);

	const onEdgesChange: OnEdgesChange = useCallback(
		(changes) => {
			setEdges((eds) => applyEdgeChanges(changes, eds) as PersonaEdge[]);
		},
		[setEdges]
	);

	const onConnect: OnConnect = useCallback(
		(connection) => {
			setEdges((eds) => addEdge({...connection, id: generateId()}, eds) as PersonaEdge[]);
		},
		[setEdges]
	);

	const onNodeClick = useCallback(
		(_: React.MouseEvent, node: PersonaNode) => {
			setSelectedNodeId(node.id);
		},
		[setSelectedNodeId]
	);

	const onPaneClick = useCallback(() => {
		setSelectedNodeId(null);
	}, [setSelectedNodeId]);

	return {
		nodes,
		edges,
		onNodesChange,
		onEdgesChange,
		onConnect,
		onNodeClick,
		onPaneClick
	};
}
