import {useEditableText} from '../../hooks/useEditableText';

interface EditableFieldProps {
	value: string;
	onSave: (value: string) => void;
	placeholder?: string;
	multiline?: boolean;
	className?: string;
	displayClassName?: string;
	inputClassName?: string;
}

export function EditableField({
	value,
	onSave,
	placeholder,
	multiline = false,
	className = '',
	displayClassName = '',
	inputClassName = ''
}: EditableFieldProps) {
	const {
		isEditing,
		value: editedValue,
		setValue,
		inputRef,
		startEditing,
		handleKeyDown,
		handleBlur
	} = useEditableText({
		initialValue: value,
		onSave,
		multiline
	});

	if (isEditing) {
		if (multiline) {
			return (
				<textarea
					ref={inputRef as React.RefObject<HTMLTextAreaElement>}
					value={editedValue}
					onChange={(e) => setValue(e.target.value)}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					className={`w-full text-xs bg-transparent border border-[var(--pf-border)] rounded px-2 py-1 text-[var(--pf-text-secondary)] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:ring-offset-1 focus:ring-offset-[var(--pf-bg-primary)] resize-none ${inputClassName}`}
					rows={2}
					onClick={(e) => e.stopPropagation()}
					onDoubleClick={(e) => e.stopPropagation()}
					placeholder={placeholder}
				/>
			);
		}
		return (
			<input
				ref={inputRef as React.RefObject<HTMLInputElement>}
				type="text"
				value={editedValue}
				onChange={(e) => setValue(e.target.value)}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				className={`w-full text-sm bg-transparent border border-[var(--pf-border)] rounded px-1 py-0.5 text-[var(--pf-text-primary)] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:ring-offset-1 focus:ring-offset-[var(--pf-bg-primary)] ${inputClassName}`}
				onClick={(e) => e.stopPropagation()}
				onDoubleClick={(e) => e.stopPropagation()}
				placeholder={placeholder}
			/>
		);
	}

	return (
		<div
			onDoubleClick={startEditing}
			className={`cursor-text hover:bg-[var(--pf-bg-tertiary)] rounded transition-colors ${displayClassName} ${className}`}
			title="Double-click to edit">
			{value || placeholder || 'Double-click to edit...'}
		</div>
	);
}
