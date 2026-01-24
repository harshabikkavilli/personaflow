import {atom} from 'jotai';
import {examples, type ExampleGraph, type Framework, type UseCase} from '../data/examples';

const ALL_USE_CASES: UseCase[] = [
	'Planning & Execution',
	'Research & Reasoning',
	'Safety & Governance',
	'Product & Operations'
];

// Primitive atoms for filter state
export const examplesSearchQueryAtom = atom('');
export const examplesSelectedUseCasesAtom = atom<Set<UseCase>>(new Set(ALL_USE_CASES));
export const examplesSelectedNodeTypesAtom = atom<Set<string>>(new Set<string>());
export const examplesSelectedFrameworkAtom = atom<Framework | 'all'>('all');
export const examplesSortByAtom = atom<'Featured' | 'Most Popular' | 'Newest'>('Featured');
export const examplesCurrentPageAtom = atom(1);

// Modal state atom
export const selectedTemplateModalAtom = atom<ExampleGraph | null>(null);

// Derived atom: filtered examples
export const examplesFilteredAtom = atom<ExampleGraph[]>((get) => {
	const searchQuery = get(examplesSearchQueryAtom);
	const selectedUseCases = get(examplesSelectedUseCasesAtom);
	const selectedNodeTypes = get(examplesSelectedNodeTypesAtom);
	const selectedFramework = get(examplesSelectedFrameworkAtom);

	return examples.filter((example) => {
		// Search filter
		if (
			searchQuery &&
			!example.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
			!example.description.toLowerCase().includes(searchQuery.toLowerCase())
		) {
			return false;
		}

		// Use case filter
		if (!selectedUseCases.has(example.useCase)) {
			return false;
		}

		// Node types filter
		if (selectedNodeTypes.size > 0) {
			const hasSelectedType = example.nodeTypes.some((type) =>
				selectedNodeTypes.has(type)
			);
			if (!hasSelectedType) {
				return false;
			}
		}

		// Framework filter
		if (selectedFramework !== 'all' && example.framework !== selectedFramework) {
			return false;
		}

		return true;
	});
});

// Action atoms for filter operations
export const toggleUseCaseAtom = atom(
	null,
	(get, set, useCase: UseCase) => {
		const current = get(examplesSelectedUseCasesAtom);
		const newSet = new Set(current);
		if (newSet.has(useCase)) {
			newSet.delete(useCase);
		} else {
			newSet.add(useCase);
		}
		set(examplesSelectedUseCasesAtom, newSet);
		set(examplesCurrentPageAtom, 1);
	}
);

export const toggleAllUseCasesAtom = atom(null, (get, set) => {
	const current = get(examplesSelectedUseCasesAtom);
	if (current.size === ALL_USE_CASES.length) {
		set(examplesSelectedUseCasesAtom, new Set());
	} else {
		set(examplesSelectedUseCasesAtom, new Set(ALL_USE_CASES));
	}
	set(examplesCurrentPageAtom, 1);
});

export const toggleNodeTypeAtom = atom(
	null,
	(get, set, nodeType: string) => {
		const current = get(examplesSelectedNodeTypesAtom);
		const newSet = new Set(current);
		if (newSet.has(nodeType)) {
			newSet.delete(nodeType);
		} else {
			newSet.add(nodeType);
		}
		set(examplesSelectedNodeTypesAtom, newSet);
		set(examplesCurrentPageAtom, 1);
	}
);

export const setExamplesSearchQueryAtom = atom(
	null,
	(_get, set, query: string) => {
		set(examplesSearchQueryAtom, query);
		set(examplesCurrentPageAtom, 1);
	}
);

export const setExamplesFrameworkAtom = atom(
	null,
	(_get, set, framework: Framework | 'all') => {
		set(examplesSelectedFrameworkAtom, framework);
		set(examplesCurrentPageAtom, 1);
	}
);
