import {ReactFlowProvider} from '@xyflow/react';
import {useSetAtom} from 'jotai';
import {ExternalLink, Sparkles} from 'lucide-react';
import {useCallback, useMemo} from 'react';
import {selectedTemplateModalAtom} from '../../atoms/examplesAtoms';
import {difficultyColors, frameworkColors} from '../../constants/examples';
import type {ExampleGraph} from '../../data/examples';
import {useModalKeyboard} from '../../hooks/useModalKeyboard';
import type {PersonaNodeType} from '../../types';
import {getNodeConfig} from '../../types';
import {Badge} from '../ui/Badge';
import {Button} from '../ui/Button';
import {GraphPreview} from '../ui/GraphPreview';
import {Modal} from '../ui/Modal';

const nodeTypeLabels: Record<PersonaNodeType, string> = {
	planner: 'Planner',
	executor: 'Executor',
	critic: 'Critic',
	router: 'Router',
	tool: 'Tool',
	memory: 'Memory',
	humanCheckpoint: 'Human'
};

interface TemplateDetailsModalProps {
	example: ExampleGraph;
	onOpenInEditor: () => void;
}

export function TemplateDetailsModal({
	example,
	onOpenInEditor
}: TemplateDetailsModalProps) {
	const setSelectedTemplate = useSetAtom(selectedTemplateModalAtom);

	const handleClose = useCallback(() => {
		setSelectedTemplate(null);
	}, [setSelectedTemplate]);

	useModalKeyboard(handleClose, true);

	// Memoize nodes and edges to prevent unnecessary re-renders
	const flowNodes = useMemo(() => example.nodes, [example.nodes]);
	const flowEdges = useMemo(() => example.edges, [example.edges]);

	const footer = (
		<div className='flex items-center justify-end gap-3 w-full'>
			<Button variant='secondary' onClick={handleClose}>
				Cancel
			</Button>
			<Button
				variant='primary'
				onClick={onOpenInEditor}
				icon={<ExternalLink className='w-4 h-4' />}>
				Open in Editor
			</Button>
		</div>
	);

	return (
		<Modal
			isOpen={true}
			onClose={handleClose}
			title='Template Preview'
			subtitle='View template details and architecture'
			footer={footer}
			icon={<Sparkles className='w-5 h-5 text-[var(--pf-primary-gradient)]' />}>
			{/* Content */}
			<div className='flex-1 flex flex-col lg:flex-row overflow-hidden'>
				{/* Graph Preview */}
				<div className='flex-1 bg-[#0d0d0d] graph-preview-dots relative overflow-hidden min-h-[300px] border-b lg:border-b-0 lg:border-r border-[var(--pf-border)]'>
					<ReactFlowProvider>
						<GraphPreview
							nodes={flowNodes}
							edges={flowEdges}
							showControls={true}
						/>
					</ReactFlowProvider>
				</div>

				{/* Details Panel */}
				<div className='w-full lg:w-96 p-6 flex flex-col overflow-y-auto flex-shrink-0 border-l border-[var(--pf-border)] bg-[var(--pf-bg-primary)]'>
					<div className='mb-8'>
						<div className='flex items-center gap-2 mb-4'>
							<Badge
								variant='framework'
								className={frameworkColors[example.framework]}>
								{example.framework}
							</Badge>
							<Badge
								variant='difficulty'
								className={difficultyColors[example.difficulty]}>
								{example.difficulty}
							</Badge>
						</div>
						<h1 className='text-2xl font-semibold mb-3 text-[var(--pf-text-primary)]'>
							{example.name}
						</h1>
						<p className='text-sm text-[var(--pf-text-secondary)] leading-relaxed'>
							{example.description}
						</p>
					</div>

					<div className='space-y-6 mt-auto'>
						{/* Nodes Used */}
						<div>
							<h4 className='text-xs font-semibold uppercase tracking-wider text-[var(--pf-text-muted)] mb-3'>
								Nodes used
							</h4>
							<div className='flex flex-wrap gap-2'>
								{example.nodeTypes.map((type) => {
									const config = getNodeConfig(type as PersonaNodeType);
									const color = config?.color || '#6366f1';

									return (
										<span
											key={type}
											className='px-3 py-1.5 bg-[var(--pf-bg-secondary)] border border-[var(--pf-border)] rounded-lg text-xs font-medium flex items-center gap-2'>
											<span
												className='w-1.5 h-1.5 rounded-full'
												style={{backgroundColor: color}}
											/>
											{nodeTypeLabels[type as PersonaNodeType] || type}
										</span>
									);
								})}
							</div>
						</div>

						{/* Framework & Difficulty */}
						<div className='grid grid-cols-2 gap-4 pt-6 border-t border-[var(--pf-border)]'>
							<div>
								<span className='block text-[10px] font-semibold uppercase tracking-wider text-[var(--pf-text-muted)] mb-1'>
									Framework
								</span>
								<span className='text-sm font-medium text-[var(--pf-text-primary)]'>
									{example.framework}
								</span>
							</div>
							<div>
								<span className='block text-[10px] font-semibold uppercase tracking-wider text-[var(--pf-text-muted)] mb-1'>
									Difficulty
								</span>
								<span className='text-sm font-medium text-[var(--pf-text-primary)]'>
									{example.difficulty}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
}
