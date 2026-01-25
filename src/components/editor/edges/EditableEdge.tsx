import {
	BaseEdge,
	EdgeLabelRenderer,
	getSmoothStepPath,
	type EdgeProps
} from '@xyflow/react';
import {useAtomValue, useSetAtom} from 'jotai';
import {useMemo} from 'react';
import {edgeByIdAtom, nodeByIdAtom, updateEdgeAtom} from '../../../atoms/graphAtoms';
import {EdgeLabelEditor} from './EdgeLabelEditor';
import {nodeTypeColors} from '../../../constants/nodeConstants';
import {hexToRgba} from '../../../utils/colorUtils';
import type {PersonaEdge, PersonaNodeType} from '../../../types';

// Helper to get edge color based on source node type
function getEdgeColor(sourceNodeType?: PersonaNodeType): string {
	if (!sourceNodeType) return '#666666';
	return nodeTypeColors[sourceNodeType] || '#666666';
}

export function EditableEdge(props: EdgeProps) {
	const {
		id,
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		data,
		source,
		target,
		selected = false,
		markerEnd
	} = props;
	const updateEdge = useSetAtom(updateEdgeAtom);
	
	// Use derived atoms for efficient lookups
	const edgeAtom = useMemo(() => edgeByIdAtom(id), [id]);
	const edgeObj = useAtomValue(edgeAtom);
	const isAnimated = edgeObj?.animated || false;

	// Get source node to determine edge color
	const sourceNodeAtom = useMemo(() => nodeByIdAtom(source || ''), [source]);
	const sourceNode = useAtomValue(sourceNodeAtom);
	const sourceNodeType = sourceNode?.data?.personaType;
	const edgeColor = useMemo(() => getEdgeColor(sourceNodeType), [sourceNodeType]);

	// Use smoothstep for cleaner, more organized paths
	const [edgePath, labelX, labelY] = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		borderRadius: 20
	});

	// Safely extract label from data or use empty string
	const edgeLabel =
		data && typeof data === 'object' && 'label' in data && typeof data.label === 'string'
			? data.label
			: edgeObj?.label || '';

	// Construct edge for the editor component
	const edge: PersonaEdge = {
		id,
		source: source || '',
		target: target || '',
		label: edgeLabel
	};

	const handleLabelUpdate = (newLabel: string) => {
		updateEdge({id, updates: {label: newLabel}});
	};

	// Determine stroke width and style based on state
	const strokeWidth = selected ? 3 : 2;

	// For animated edges, add a gradient effect
	const edgeStyle: React.CSSProperties = isAnimated
		? {
				stroke: edgeColor,
				strokeWidth,
				filter: `drop-shadow(0 0 4px ${hexToRgba(edgeColor, 0.5)})`,
				opacity: 0.9
			}
		: {
				stroke: edgeColor,
				strokeWidth,
				opacity: selected ? 1 : 0.7,
				transition: 'all 0.2s ease'
			};

	return (
		<>
			<BaseEdge
				id={id}
				path={edgePath}
				style={edgeStyle}
				markerEnd={markerEnd}
				className={isAnimated ? 'animated-edge' : ''}
			/>
			{/* Animated edge overlay for pulsing effect */}
			{isAnimated && (
				<BaseEdge
					id={`${id}-animated`}
					path={edgePath}
					style={{
						stroke: edgeColor,
						strokeWidth: strokeWidth + 2,
						opacity: 0.3,
						pointerEvents: 'none'
					}}
					className="animated-edge-pulse"
				/>
			)}
			<EdgeLabelRenderer>
				<div
					style={{
						position: 'absolute',
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						pointerEvents: 'all'
					}}
					className="nodrag nopan">
					<EdgeLabelEditor edge={edge} onUpdate={handleLabelUpdate} />
				</div>
			</EdgeLabelRenderer>
		</>
	);
}
