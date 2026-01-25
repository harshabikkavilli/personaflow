import {useCallback} from 'react';
import {useReactFlow} from '@xyflow/react';
import {useSetAtom} from 'jotai';
import {addNodeAtom} from '../atoms/graphAtoms';
import type {PersonaNode, PersonaNodeType} from '../types';
import {generateId, getNodeConfig} from '../types';

export function useCanvasDrop() {
	const {screenToFlowPosition} = useReactFlow();
	const addNode = useSetAtom(addNodeAtom);

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
				y: event.clientY
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
						risks: []
					}
				}
			};

			addNode(newNode);
		},
		[screenToFlowPosition, addNode]
	);

	return {onDragOver, onDrop};
}
