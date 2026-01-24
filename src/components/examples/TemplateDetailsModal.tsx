import {useSetAtom} from 'jotai';
import {
	Brain,
	Database,
	ExternalLink,
	FileSearch,
	GitBranch,
	Play,
	Shield,
	Sparkles,
	User,
	Wrench,
	X
} from 'lucide-react';
import {useCallback, useEffect} from 'react';
import {selectedTemplateModalAtom} from '../../atoms/examplesAtoms';
import {difficultyColors, frameworkColors} from '../../constants/examples';
import type {ExampleGraph} from '../../data/examples';
import type {PersonaNodeType} from '../../types';
import {getNodeConfig} from '../../types';

const nodeTypeIcons: Record<PersonaNodeType, typeof Brain> = {
	planner: Brain,
	executor: Play,
	critic: Shield,
	router: GitBranch,
	tool: Wrench,
	memory: Database,
	humanCheckpoint: User
};

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

	// Handle escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				handleClose();
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [handleClose]);

	// Render graph visualization
	const renderGraphVisualization = () => {
		// For now, render a simplified version based on example ID
		// In a full implementation, you'd parse the actual nodes/edges
		if (example.id === 'agentic-rag') {
			return (
				<div className='relative w-full h-full flex items-center justify-center p-12'>
					<svg
						className='absolute inset-0 w-full h-full pointer-events-none'
						xmlns='http://www.w3.org/2000/svg'>
						<defs>
							<marker
								id='arrowhead'
								markerHeight='7'
								markerWidth='10'
								orient='auto'
								refX='9'
								refY='3.5'>
								<polygon fill='#4b5563' points='0 0, 10 3.5, 0 7' />
							</marker>
						</defs>
						<path
							d='M 300 350 L 400 350'
							fill='none'
							markerEnd='url(#arrowhead)'
							stroke='#4b5563'
							strokeWidth='1.5'
						/>
						<path
							d='M 520 350 L 620 350'
							fill='none'
							markerEnd='url(#arrowhead)'
							stroke='#4b5563'
							strokeWidth='1.5'
						/>
						<path
							d='M 740 350 L 840 350'
							fill='none'
							markerEnd='url(#arrowhead)'
							stroke='#4b5563'
							strokeWidth='1.5'
						/>
						<path
							d='M 890 310 C 890 200, 460 200, 460 310'
							fill='none'
							markerEnd='url(#arrowhead)'
							stroke='#6366f1'
							strokeDasharray='4 4'
							strokeWidth='2'
						/>
					</svg>
					<div className='flex items-center gap-24 relative z-10'>
						<div className='flex flex-col items-center gap-3'>
							<div className='w-32 h-20 bg-[#1e1e1e] border border-[var(--pf-border)] rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-black/40'>
								<GitBranch className='w-6 h-6 text-amber-400' />
								<span className='text-xs font-semibold tracking-wider uppercase text-[var(--pf-text-secondary)]'>
									Router
								</span>
							</div>
						</div>
						<div className='flex flex-col items-center gap-3'>
							<div className='w-32 h-20 bg-[#1e1e1e] border border-[var(--pf-border)] rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-black/40'>
								<FileSearch className='w-6 h-6 text-blue-400' />
								<span className='text-xs font-semibold tracking-wider uppercase text-[var(--pf-text-secondary)]'>
									Retriever
								</span>
							</div>
						</div>
						<div className='flex flex-col items-center gap-3'>
							<div className='w-32 h-20 bg-[#1e1e1e] border-2 border-[var(--pf-primary-gradient)]/50 rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-[var(--pf-primary-gradient)]/10 ring-4 ring-[var(--pf-primary-gradient)]/5'>
								<Shield className='w-6 h-6 text-[var(--pf-primary-gradient)]' />
								<span className='text-xs font-semibold tracking-wider uppercase text-[var(--pf-text-secondary)]'>
									Critic
								</span>
							</div>
							<span className='text-[10px] text-[var(--pf-primary-gradient)] font-bold animate-pulse'>
								SELF-CORRECTION
							</span>
						</div>
						<div className='flex flex-col items-center gap-3'>
							<div className='w-32 h-20 bg-[#1e1e1e] border border-[var(--pf-border)] rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-black/40'>
								<Play className='w-6 h-6 text-emerald-400' />
								<span className='text-xs font-semibold tracking-wider uppercase text-[var(--pf-text-secondary)]'>
									Executor
								</span>
							</div>
						</div>
					</div>
					<div className='absolute bottom-8 left-8 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-md'>
						<span className='w-2 h-2 rounded-full bg-emerald-500'></span>
						<span className='text-[10px] font-medium text-[var(--pf-text-secondary)]'>
							High-Fidelity Preview • Live Editor v2.4
						</span>
					</div>
				</div>
			);
		}

		// Default visualization
		return (
			<div className='flex items-center justify-center gap-8 p-12'>
				{example.nodeTypes.slice(0, 4).map((type, idx) => {
					const Icon = nodeTypeIcons[type as PersonaNodeType] || GitBranch;
					const config = getNodeConfig(type as PersonaNodeType);
					const color = config?.color || '#6366f1';

					return (
						<div key={idx} className='flex flex-col items-center gap-3'>
							<div
								className='w-32 h-20 bg-[#1e1e1e] border border-[var(--pf-border)] rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-black/40'
								style={{
									borderColor: idx === 2 ? `${color}50` : undefined,
									borderWidth: idx === 2 ? '2px' : '1px'
								}}>
								<Icon className='w-6 h-6' style={{color}} />
								<span className='text-xs font-semibold tracking-wider uppercase text-[var(--pf-text-secondary)]'>
									{nodeTypeLabels[type as PersonaNodeType] || type}
								</span>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div
			className='fixed inset-0 z-[100] overflow-y-auto'
			aria-labelledby='modal-title'
			role='dialog'
			aria-modal='true'>
			{/* Backdrop */}
			<div
				className='fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300'
				onClick={handleClose}
				aria-hidden='true'
			/>

			{/* Modal container - centers the modal with proper spacing */}
			<div className='flex min-h-screen items-center justify-center p-6'>
				{/* Modal dialog */}
				<div className='relative w-full max-w-5xl h-[85vh] max-h-[calc(100vh-8rem)] bg-[var(--pf-bg-primary)] rounded-xl shadow-2xl border border-[var(--pf-border)] flex flex-col overflow-hidden'>
					{/* Header */}
					<div className='px-6 py-4 border-b border-[var(--pf-border)] flex items-center justify-between flex-shrink-0'>
						<div className='flex items-center gap-3'>
							<div className='p-2 bg-[var(--pf-primary-gradient)]/10 rounded-lg'>
								<Sparkles className='w-5 h-5 text-[var(--pf-primary-gradient)]' />
							</div>
							<div>
								<h2
									id='modal-title'
									className='text-xl font-semibold text-[var(--pf-text-primary)]'>
									Template Preview
								</h2>
								<p className='text-sm text-[var(--pf-text-muted)]'>
									View template details and architecture
								</p>
							</div>
						</div>
						<button
							onClick={handleClose}
							className='text-[var(--pf-text-muted)] hover:text-[var(--pf-text-primary)] transition-colors p-2 rounded-lg hover:bg-[var(--pf-bg-tertiary)]'
							aria-label='Close modal'>
							<X className='w-5 h-5' />
						</button>
					</div>

					{/* Content */}
					<div className='flex-1 flex flex-col lg:flex-row overflow-hidden'>
						{/* Graph Preview */}
						<div className='flex-1 bg-[#0d0d0d] graph-preview-dots relative overflow-hidden flex items-center justify-center min-h-[300px] border-b lg:border-b-0 lg:border-r border-[var(--pf-border)]'>
							{renderGraphVisualization()}
						</div>

						{/* Details Panel */}
						<div className='w-full lg:w-96 p-6 flex flex-col overflow-y-auto flex-shrink-0 border-l border-[var(--pf-border)] bg-[var(--pf-bg-primary)]'>
							<div className='mb-8'>
								<div className='flex items-center gap-2 mb-4'>
									<span
										className={`px-2 py-1 ${frameworkColors[example.framework]} text-[10px] font-bold uppercase rounded border`}>
										{example.framework}
									</span>
									<span
										className={`px-2 py-1 ${difficultyColors[example.difficulty]} text-[10px] font-bold uppercase rounded border`}>
										{example.difficulty}
									</span>
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

					{/* Footer */}
					<div className='px-6 py-4 gap-3 bg-[var(--pf-bg-secondary)] border-t border-[var(--pf-border)] flex items-center justify-end flex-shrink-0'>
						<button className='px-4 py-2 text-sm font-medium bg-[var(--pf-bg-tertiary)] hover:bg-[var(--pf-border)] transition-colors rounded-md text-[var(--pf-text-primary)]'>
							Clone Template
						</button>
						<button
							onClick={onOpenInEditor}
							className='px-5 py-2 text-sm font-medium transition-all shadow-lg rounded-md flex items-center gap-2 bg-[var(--pf-primary-gradient)] hover:opacity-90 text-white shadow-[var(--pf-primary-gradient)]/20'>
							<ExternalLink className='w-4 h-4' />
							Open in Editor
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
