import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { useSetAtom } from 'jotai';
import {
	Brain,
	Database,
	GitBranch,
	Play,
	Shield,
	UserCheck,
	Wrench,
	type LucideIcon
} from 'lucide-react';
import { memo, useRef, useState } from 'react';
import { updateNodeAtom } from '../../../atoms/graphAtoms';
import type { PersonaNodeData, PersonaNodeType } from '../../../types';
import { getNodeConfig } from '../../../types';

// Icon mapping for node types
const nodeIcons: Record<PersonaNodeType, LucideIcon> = {
  planner: Brain,
  executor: Play,
  critic: Shield,
  router: GitBranch,
  tool: Wrench,
  memory: Database,
  humanCheckpoint: UserCheck,
};

type PersonaNodeProps = NodeProps<Node<PersonaNodeData>>;

// Color mapping for hex values (from CSS variables)
const colorHexMap: Record<string, string> = {
  'var(--pf-planner)': '#3b82f6',
  'var(--pf-executor)': '#f97316',
  'var(--pf-critic)': '#a855f7',
  'var(--pf-router)': '#eab308',
  'var(--pf-tool)': '#6b7280',
  'var(--pf-memory)': '#14b8a6',
  'var(--pf-human)': '#ec4899',
  'var(--pf-text-muted)': '#666666',
};

// Helper to convert color to rgba with opacity
function getColorWithOpacity(color: string, opacity: number): string {
  const hex = colorHexMap[color] || color;
  // If it's already a hex color, convert to rgba
  if (hex.startsWith('#')) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  // Fallback for other formats
  return color;
}

function PersonaNodeComponent({ id, data, selected }: PersonaNodeProps) {
  const { name, personaType, meta } = data;
  const config = getNodeConfig(personaType);
  const Icon = nodeIcons[personaType];
  const color = config?.color || 'var(--pf-text-muted)';
  const updateNode = useSetAtom(updateNodeAtom);
  
  // Editing state - only track if we're editing, use props directly for values
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);


  const handleNameDoubleClick = () => {
    // Initialize with current value and focus
    setEditedName(name);
    setIsEditingName(true);
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }, 0);
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
    const trimmedName = editedName.trim();
    if (trimmedName && trimmedName !== name) {
      updateNode({ id, data: { name: trimmedName } });
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nameInputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
      // Reset to original value
      setEditedName(name);
    }
  };

  const handleDescriptionDoubleClick = () => {
    // Initialize with current value and focus
    setEditedDescription(meta.description || '');
    setIsEditingDescription(true);
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      descriptionInputRef.current?.focus();
      descriptionInputRef.current?.select();
    }, 0);
  };

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    const trimmedDescription = editedDescription.trim();
    const currentDescription = meta.description || '';
    if (trimmedDescription !== currentDescription) {
      updateNode({ 
        id, 
        data: { 
          meta: { ...meta, description: trimmedDescription || undefined } 
        } 
      });
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      descriptionInputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsEditingDescription(false);
      // Reset to original value
      setEditedDescription(meta.description || '');
    }
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
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              className="w-full text-sm font-medium bg-transparent border border-[var(--pf-border)] rounded px-1 py-0.5 text-[var(--pf-text-primary)] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:ring-offset-1 focus:ring-offset-[var(--pf-bg-primary)]"
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              className="text-sm font-medium text-[var(--pf-text-primary)] truncate cursor-text hover:bg-[var(--pf-bg-tertiary)] rounded px-1 -mx-1 transition-colors"
              onDoubleClick={handleNameDoubleClick}
              title="Double-click to edit"
            >
              {name}
            </div>
          )}
          <div className="text-[10px] text-[var(--pf-text-muted)]">
            {config?.label || personaType}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-2 border-t border-[var(--pf-border)]">
        {isEditingDescription ? (
          <textarea
            ref={descriptionInputRef}
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            onKeyDown={handleDescriptionKeyDown}
            className="w-full text-xs bg-transparent border border-[var(--pf-border)] rounded px-2 py-1 text-[var(--pf-text-secondary)] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:ring-offset-1 focus:ring-offset-[var(--pf-bg-primary)] resize-none"
            rows={2}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            placeholder="Add description..."
          />
        ) : (
          <p
            className={`text-xs text-[var(--pf-text-secondary)] ${meta.description ? 'line-clamp-2' : 'text-[var(--pf-text-muted)] italic'} cursor-text hover:bg-[var(--pf-bg-tertiary)] rounded px-1 -mx-1 py-0.5 transition-colors`}
            onDoubleClick={handleDescriptionDoubleClick}
            title="Double-click to edit"
          >
            {meta.description || 'Double-click to add description...'}
          </p>
        )}
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
