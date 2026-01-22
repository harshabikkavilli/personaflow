import { BaseEdge, EdgeLabelRenderer, getBezierPath, MarkerType, type EdgeProps } from '@xyflow/react';
import { useSetAtom } from 'jotai';
import { updateEdgeAtom } from '../../../atoms/graphAtoms';
import { EdgeLabelEditor } from '../EdgeLabelEditor';
import type { PersonaEdge } from '../../../types';

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
  } = props;
  const updateEdge = useSetAtom(updateEdgeAtom);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Safely extract label from data or use empty string
  const edgeLabel = (data && typeof data === 'object' && 'label' in data && typeof data.label === 'string')
    ? data.label
    : '';

  // Construct edge for the editor component
  const edge: PersonaEdge = {
    id,
    source: props.source || '',
    target: props.target || '',
    label: edgeLabel,
  };

  const handleLabelUpdate = (newLabel: string) => {
    updateEdge({ id, updates: { label: newLabel } });
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: '#666666', strokeWidth: 2 }}
        markerEnd={MarkerType.ArrowClosed}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <EdgeLabelEditor edge={edge} onUpdate={handleLabelUpdate} />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
