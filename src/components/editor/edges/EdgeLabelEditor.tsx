import type {PersonaEdge} from '../../../types';
import {EditableField} from '../../ui/EditableField';

interface EdgeLabelEditorProps {
	edge: PersonaEdge;
	onUpdate: (label: string) => void;
}

export function EdgeLabelEditor({edge, onUpdate}: EdgeLabelEditorProps) {
	return (
		<div onClick={(e) => e.stopPropagation()}>
			<EditableField
				value={edge.label || ''}
				onSave={onUpdate}
				placeholder=""
				className="text-xs text-[var(--pf-text-secondary)]"
				displayClassName="px-2 py-1 rounded"
				inputClassName="min-w-[80px]"
			/>
		</div>
	);
}
