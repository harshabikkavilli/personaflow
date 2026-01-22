import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	Background,
	BackgroundVariant,
	Controls,
	MarkerType,
	ReactFlow,
	useReactFlow,
	type OnConnect,
	type OnEdgesChange,
	type OnNodesChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { addNodeAtom, edgesAtom, nodesAtom, selectedNodeIdAtom } from '../../atoms/graphAtoms';
import type { PersonaEdge, PersonaNode, PersonaNodeType } from '../../types';
import { generateId, getNodeConfig } from '../../types';
import { edgeTypes } from './edges/edgeTypes';
import { LayoutControl } from './LayoutControl';
import { nodeTypes } from './nodes/nodeTypes';

export function Canvas() {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const setSelectedNodeId = useSetAtom(selectedNodeIdAtom);
  const addNode = useSetAtom(addNodeAtom);
  const { screenToFlowPosition } = useReactFlow();

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
      setEdges((eds) => addEdge({ ...connection, id: generateId() }, eds) as PersonaEdge[]);
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

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/personaflow-node') as PersonaNodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const config = getNodeConfig(type);
      const newNode: PersonaNode = {
        id: generateId(),
        type: 'persona',
        position,
        data: {
          name: config?.label || type,
          personaType: type,
          meta: {
            description: config?.description || '',
            risks: [],
          },
        },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

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
          style: { stroke: '#666666', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#666666' },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={16} 
          size={1} 
          color="var(--pf-border)" 
        />
        <Controls 
          showZoom
          showFitView
          showInteractive={false}
        >
          <LayoutControl direction="TB" />
        </Controls>
        {/* <MiniMap 
          nodeColor={(node) => {
            const personaNode = node as PersonaNode;
            const config = getNodeConfig(personaNode.data?.personaType);
            return config?.color || 'var(--pf-text-muted)';
          }}
          maskColor="rgba(0, 0, 0, 0.8)"
          style={{ backgroundColor: 'var(--pf-bg-tertiary)' }}
        /> */}
      </ReactFlow>
    </div>
  );
}
