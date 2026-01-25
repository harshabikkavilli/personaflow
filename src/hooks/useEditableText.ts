import {useRef, useState, useCallback} from 'react';

interface UseEditableTextOptions {
	initialValue: string;
	onSave: (value: string) => void;
	multiline?: boolean;
}

export function useEditableText({initialValue, onSave, multiline = false}: UseEditableTextOptions) {
	const [isEditing, setIsEditing] = useState(false);
	const [value, setValue] = useState('');
	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

	const startEditing = useCallback(() => {
		setValue(initialValue);
		setIsEditing(true);
		// Use setTimeout to ensure DOM is ready
		setTimeout(() => {
			inputRef.current?.focus();
			if (inputRef.current instanceof HTMLInputElement) {
				inputRef.current.select();
			}
		}, 0);
	}, [initialValue]);

	const stopEditing = useCallback(() => {
		setIsEditing(false);
		const trimmedValue = value.trim();
		if (trimmedValue !== initialValue) {
			onSave(trimmedValue);
		}
	}, [value, initialValue, onSave]);

	const cancelEditing = useCallback(() => {
		setIsEditing(false);
		setValue(initialValue);
	}, [initialValue]);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (multiline) {
			if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				e.stopPropagation();
				stopEditing();
			} else if (e.key === 'Escape') {
				e.preventDefault();
				e.stopPropagation();
				cancelEditing();
			}
		} else {
			if (e.key === 'Enter') {
				e.preventDefault();
				e.stopPropagation();
				inputRef.current?.blur();
			} else if (e.key === 'Escape') {
				e.preventDefault();
				e.stopPropagation();
				cancelEditing();
			}
		}
	}, [multiline, stopEditing, cancelEditing]);

	const handleBlur = useCallback(() => {
		stopEditing();
	}, [stopEditing]);

	return {
		isEditing,
		value,
		setValue,
		inputRef,
		startEditing,
		stopEditing,
		cancelEditing,
		handleKeyDown,
		handleBlur
	};
}
