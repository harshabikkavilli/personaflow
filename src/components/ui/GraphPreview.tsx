import {
	Background,
	BackgroundVariant,
	Controls,
	MarkerType,
	ReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type {PersonaEdge, PersonaNode} from '../../types';
import {edgeTypes} from '../editor/edges/edgeTypes';
import {nodeTypes} from '../editor/nodes/nodeTypes';

interface GraphPreviewProps {
	nodes: PersonaNode[];
	edges: PersonaEdge[];
	height?: string;
	fitViewOptions?: {
		padding?: number;
		maxZoom?: number;
		minZoom?: number;
	};
	showControls?: boolean;
	interactive?: boolean;
}

export function GraphPreview({
	nodes,
	edges,
	height = '100%',
	fitViewOptions = {padding: 0.2, maxZoom: 1.5},
	showControls = false,
	interactive = false
}: GraphPreviewProps) {
	return (
		<div style={{height, width: '100%'}}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				fitView
				fitViewOptions={fitViewOptions}
				// Interaction settings
				nodesDraggable={interactive}
				nodesConnectable={interactive}
				elementsSelectable={interactive}
				panOnDrag={interactive || showControls}
				zoomOnScroll={interactive || showControls}
				zoomOnPinch={interactive || showControls}
				panOnScroll={false}
				selectNodesOnDrag={interactive}
				// Styling
				defaultEdgeOptions={{
					type: 'smoothstep',
					style: {stroke: '#666666', strokeWidth: 2},
					markerEnd: {type: MarkerType.ArrowClosed, color: '#666666'}
				}}
				proOptions={{hideAttribution: true}}>
				<Background
					variant={BackgroundVariant.Dots}
					gap={16}
					size={1}
					color="var(--pf-border)"
				/>
				{showControls && <Controls showZoom showFitView showInteractive={false} />}
			</ReactFlow>
		</div>
	);
}
