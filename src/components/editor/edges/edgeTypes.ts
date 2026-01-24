import {EditableEdge} from './EditableEdge';

// Register all custom edge types for React Flow
export const edgeTypes = {
	default: EditableEdge,
	smoothstep: EditableEdge,
	bezier: EditableEdge
};
