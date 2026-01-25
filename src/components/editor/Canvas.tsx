import {
	Background,
	BackgroundVariant,
	Controls,
	MarkerType,
	ReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {useCanvasDrop} from '../../hooks/useCanvasDrop';
import {useCanvasInteractions} from '../../hooks/useCanvasInteractions';
import {edgeTypes} from './edges/edgeTypes';
import {LayoutControl} from './LayoutControl';
import {nodeTypes} from './nodes/nodeTypes';

export function Canvas() {
	const {onDragOver, onDrop} = useCanvasDrop();
	const {nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeClick, onPaneClick} = useCanvasInteractions();

	return (
		<div className="flex-1 bg-[var(--pf-bg-secondary)]">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onNodeClick={onNodeClick}
				onPaneClick={onPaneClick}
				onDragOver={onDragOver}
				onDrop={onDrop}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				fitView
				snapToGrid
				snapGrid={[16, 16]}
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
				<Controls showZoom showFitView showInteractive={false}>
					<LayoutControl direction="TB" />
				</Controls>
			</ReactFlow>
		</div>
	);
}
