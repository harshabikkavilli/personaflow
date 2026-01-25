import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { useSetAtom } from 'jotai';
import { memo } from 'react';
import { updateNodeAtom } from '../../../atoms/graphAtoms';
import {nodeIcons} from '../../../constants/nodeConstants';
import {getColorWithOpacity} from '../../../utils/colorUtils';
import type { PersonaNodeData } from '../../../types';
import { getNodeConfig } from '../../../types';
import {EditableField} from '../../ui/EditableField';

type PersonaNodeProps = NodeProps<Node<PersonaNodeData>>;

function PersonaNodeComponent({ id, data, selected }: PersonaNodeProps) {
  const { name, personaType, meta } = data;
  const config = getNodeConfig(personaType);
  const Icon = nodeIcons[personaType];
  const color = config?.color || 'var(--pf-text-muted)';
  const updateNode = useSetAtom(updateNodeAtom);

  const handleNameSave = (newName: string) => {
    updateNode({ id, data: { name: newName } });
  };

  const handleDescriptionSave = (newDescription: string) => {
    updateNode({ 
      id, 
      data: { 
        meta: { ...meta, description: newDescription || undefined } 
      } 
    });
  };

  return (
    <div
      className={`
        min-w-[180px] max-w-[240px] rounded-lg border-2
        shadow-lg transition-all duration-150
        ${selected ? 'ring-2 ring-offset-2 ring-offset-[var(--pf-bg-secondary)]' : ''}
      `}
      style={{ 
        borderColor: color,
        backgroundColor: getColorWithOpacity(color, 0.05),
        '--ring-color': color,
      } as React.CSSProperties}
    >
      {/* Header */}
      <div 
        className="flex items-center gap-2 px-3 py-2 rounded-t-md"
        style={{ backgroundColor: getColorWithOpacity(color, 0.05) }}
      >
        <div 
          className="w-6 h-6 rounded flex items-center justify-center"
          style={{ backgroundColor: getColorWithOpacity(color, 0.1) }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <EditableField
            value={name}
            onSave={handleNameSave}
            className="text-sm font-medium text-[var(--pf-text-primary)]"
            displayClassName="truncate px-1 -mx-1"
            inputClassName="font-medium"
          />
          <div className="text-[10px] text-[var(--pf-text-muted)]">
            {config?.label || personaType}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-2 border-t border-[var(--pf-border)]">
        <EditableField
          value={meta.description || ''}
          onSave={handleDescriptionSave}
          placeholder="Add description..."
          multiline={true}
          className={`text-xs ${meta.description ? 'text-[var(--pf-text-secondary)] line-clamp-2' : 'text-[var(--pf-text-muted)] italic'}`}
          displayClassName="px-1 -mx-1 py-0.5"
        />
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-[var(--pf-border)] !border-2 !border-[var(--pf-bg-tertiary)] hover:!bg-[var(--pf-text-secondary)]"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-[var(--pf-border)] !border-2 !border-[var(--pf-bg-tertiary)] hover:!bg-[var(--pf-text-secondary)]"
      />
    </div>
  );
}

export const PersonaNode = memo(PersonaNodeComponent);
