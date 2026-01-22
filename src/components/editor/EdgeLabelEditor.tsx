import { useRef, useState } from 'react';
import type { PersonaEdge } from '../../types';

interface EdgeLabelEditorProps {
  edge: PersonaEdge;
  onUpdate: (label: string) => void;
}

export function EdgeLabelEditor({ edge, onUpdate }: EdgeLabelEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Initialize with current value and focus
    setValue(edge.label || '');
    setIsEditing(true);
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== edge.label) {
      onUpdate(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      // Reset to original value
      setValue(edge.label || '');
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="text-xs bg-[var(--pf-bg-primary)] border border-[var(--pf-border)] rounded px-2 py-1 text-[var(--pf-text-secondary)] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:ring-offset-1 focus:ring-offset-[var(--pf-bg-primary)] min-w-[80px]"
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="cursor-text hover:bg-[var(--pf-bg-tertiary)] rounded px-2 py-1 transition-colors text-xs text-[var(--pf-text-secondary)]"
      title="Double-click to edit"
    >
      {edge.label}
    </div>
  );
}
