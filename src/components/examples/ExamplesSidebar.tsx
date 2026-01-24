import {Search} from 'lucide-react';
import {useAtomValue, useSetAtom} from 'jotai';
import {
	examplesSearchQueryAtom,
	examplesSelectedUseCasesAtom,
	examplesSelectedNodeTypesAtom,
	examplesSelectedFrameworkAtom,
	setExamplesSearchQueryAtom,
	toggleUseCaseAtom,
	toggleAllUseCasesAtom,
	toggleNodeTypeAtom,
	setExamplesFrameworkAtom
} from '../../atoms/examplesAtoms';
import type {Framework, UseCase} from '../../data/examples';

const ALL_USE_CASES: UseCase[] = [
	'Planning & Execution',
	'Research & Reasoning',
	'Safety & Governance',
	'Product & Operations'
];

const NODE_TYPES = ['planner', 'critic', 'memory', 'humanCheckpoint'] as const;

const FRAMEWORKS: Framework[] = ['LangGraph', 'CrewAI', 'Framework-agnostic'];

const nodeTypeLabels: Record<string, string> = {
	planner: 'Planner',
	critic: 'Verifier',
	memory: 'Memory',
	humanCheckpoint: 'Human',
	router: 'Router',
	executor: 'Executor',
	tool: 'Tool'
};

export function ExamplesSidebar() {
	const searchQuery = useAtomValue(examplesSearchQueryAtom);
	const selectedUseCases = useAtomValue(examplesSelectedUseCasesAtom);
	const selectedNodeTypes = useAtomValue(examplesSelectedNodeTypesAtom);
	const selectedFramework = useAtomValue(examplesSelectedFrameworkAtom);
	const setSearchQuery = useSetAtom(setExamplesSearchQueryAtom);
	const toggleUseCase = useSetAtom(toggleUseCaseAtom);
	const toggleAllUseCases = useSetAtom(toggleAllUseCasesAtom);
	const toggleNodeType = useSetAtom(toggleNodeTypeAtom);
	const setSelectedFramework = useSetAtom(setExamplesFrameworkAtom);
	return (
		<aside className='w-64 flex-shrink-0 space-y-8 hidden lg:block'>
			{/* Search */}
			<div>
				<h3 className='text-xs font-semibold text-[var(--pf-text-muted)] uppercase tracking-wider mb-4'>
					Search
				</h3>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pf-text-muted)]' />
					<input
						className='w-full bg-[var(--pf-bg-secondary)] border border-[var(--pf-border)] rounded-lg py-2 pl-10 pr-4 text-sm text-[var(--pf-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--pf-primary-gradient)]/50 transition-all'
						placeholder='Search templates...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			{/* Use Case */}
			<div>
				<h3 className='text-xs font-semibold text-[var(--pf-text-muted)] uppercase tracking-wider mb-4'>
					Use Case
				</h3>
				<div className='space-y-2'>
					{/* All Templates checkbox */}
					<label className='flex items-center gap-3 cursor-pointer group'>
						<input
							type='checkbox'
							checked={selectedUseCases.size === ALL_USE_CASES.length}
							onChange={() => toggleAllUseCases()}
							className='rounded border-[var(--pf-border)] text-[var(--pf-primary-gradient)] focus:ring-[var(--pf-primary-gradient)] bg-transparent'
						/>
						<span className='text-sm text-[var(--pf-text-secondary)] group-hover:text-[var(--pf-primary-gradient)] transition-colors font-medium'>
							All Templates
						</span>
					</label>
					{ALL_USE_CASES.map((useCase) => (
						<label
							key={useCase}
							className='flex items-center gap-3 cursor-pointer group'>
							<input
								type='checkbox'
								checked={selectedUseCases.has(useCase)}
								onChange={() => toggleUseCase(useCase)}
								className='rounded border-[var(--pf-border)] text-[var(--pf-primary-gradient)] focus:ring-[var(--pf-primary-gradient)] bg-transparent'
							/>
							<span className='text-sm text-[var(--pf-text-secondary)] group-hover:text-[var(--pf-primary-gradient)] transition-colors'>
								{useCase}
							</span>
						</label>
					))}
				</div>
			</div>

			{/* Node Types */}
			<div>
				<h3 className='text-xs font-semibold text-[var(--pf-text-muted)] uppercase tracking-wider mb-4'>
					Node Types
				</h3>
				<div className='flex flex-wrap gap-2'>
					{NODE_TYPES.map((type) => (
						<button
							key={type}
							onClick={() => toggleNodeType(type)}
							className={`px-3 py-1 rounded-full border text-xs transition-colors ${
								selectedNodeTypes.has(type)
									? 'bg-[var(--pf-primary-gradient)]/10 border-[var(--pf-primary-gradient)] text-[var(--pf-primary-gradient)]'
									: 'bg-[var(--pf-bg-secondary)] border-[var(--pf-border)] text-[var(--pf-text-secondary)] hover:border-[var(--pf-primary-gradient)]'
							}`}>
							{nodeTypeLabels[type] || type}
						</button>
					))}
				</div>
			</div>

			{/* Framework */}
			<div>
				<h3 className='text-xs font-semibold text-[var(--pf-text-muted)] uppercase tracking-wider mb-4'>
					Framework
				</h3>
				<div className='space-y-2'>
					{FRAMEWORKS.map((framework) => (
						<label
							key={framework}
							className='flex items-center gap-3 cursor-pointer group'>
							<input
								type='radio'
								name='framework'
								checked={selectedFramework === framework}
								onChange={() => setSelectedFramework(framework)}
								className='text-[var(--pf-primary-gradient)] focus:ring-[var(--pf-primary-gradient)] bg-transparent border-[var(--pf-border)]'
							/>
							<span className='text-sm text-[var(--pf-text-secondary)] group-hover:text-[var(--pf-primary-gradient)] transition-colors'>
								{framework}
							</span>
						</label>
					))}
					<label className='flex items-center gap-3 cursor-pointer group'>
						<input
							type='radio'
							name='framework'
							checked={selectedFramework === 'all'}
							onChange={() => setSelectedFramework('all')}
							className='text-[var(--pf-primary-gradient)] focus:ring-[var(--pf-primary-gradient)] bg-transparent border-[var(--pf-border)]'
						/>
						<span className='text-sm text-[var(--pf-text-secondary)] group-hover:text-[var(--pf-primary-gradient)] transition-colors'>
							All
						</span>
					</label>
				</div>
			</div>
		</aside>
	);
}
