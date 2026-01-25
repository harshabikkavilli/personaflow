import {
	Background,
	BackgroundVariant,
	Controls,
	MarkerType,
	ReactFlow,
	ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {useSetAtom} from 'jotai';
import {ExternalLink, Sparkles, X} from 'lucide-react';
import {useCallback, useEffect, useMemo} from 'react';
import {selectedTemplateModalAtom} from '../../atoms/examplesAtoms';
import {difficultyColors, frameworkColors} from '../../constants/examples';
import type {ExampleGraph} from '../../data/examples';
import type {PersonaEdge, PersonaNode, PersonaNodeType} from '../../types';
import {getNodeConfig} from '../../types';
import {edgeTypes} from '../editor/edges/edgeTypes';
import {nodeTypes} from '../editor/nodes/nodeTypes';

const nodeTypeLabels: Record<PersonaNodeType, string> = {
	planner: 'Planner',
	executor: 'Executor',
	critic: 'Critic',
	router: 'Router',
	tool: 'Tool',
	memory: 'Memory',
	humanCheckpoint: 'Human'
};

// Read-only React Flow preview component
interface GraphPreviewProps {
	nodes: PersonaNode[];
	edges: PersonaEdge[];
}

const GraphPreview = ({nodes, edges}: GraphPreviewProps) => {
	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={nodeTypes}
			edgeTypes={edgeTypes}
			fitView
			fitViewOptions={{padding: 0.2, maxZoom: 1.5}}
			// Disable all interactions for read-only mode
			nodesDraggable={false}
			nodesConnectable={false}
			elementsSelectable={false}
			panOnDrag={true}
			zoomOnScroll={true}
			zoomOnPinch={true}
			panOnScroll={false}
			selectNodesOnDrag={false}
			// Styling
			defaultEdgeOptions={{
				type: 'smoothstep',
				style: {stroke: '#666666', strokeWidth: 2},
				markerEnd: {type: MarkerType.ArrowClosed, color: '#666666'}
			}}
			proOptions={{hideAttribution: true}}>
			<Background
				variant={BackgroundVariant.Dots}
				gap={16}
				size={1}
				color='var(--pf-border)'
			/>
			<Controls showZoom showFitView showInteractive={false} />
		</ReactFlow>
	);
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

	// Memoize nodes and edges to prevent unnecessary re-renders
	const flowNodes = useMemo(() => example.nodes, [example.nodes]);
	const flowEdges = useMemo(() => example.edges, [example.edges]);

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
						<div className='flex-1 bg-[#0d0d0d] graph-preview-dots relative overflow-hidden min-h-[300px] border-b lg:border-b-0 lg:border-r border-[var(--pf-border)]'>
							<ReactFlowProvider>
								<GraphPreview nodes={flowNodes} edges={flowEdges} />
							</ReactFlowProvider>
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
						<button
							onClick={handleClose}
							className='px-4 py-2 text-sm font-medium bg-[var(--pf-bg-tertiary)] hover:bg-[var(--pf-border)] transition-colors rounded-md text-[var(--pf-text-primary)]'>
							Cancel
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
