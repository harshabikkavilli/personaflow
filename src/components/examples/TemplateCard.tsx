import {
	Brain,
	CheckCircle,
	Database,
	ExternalLink,
	Eye,
	Network,
	RefreshCw,
	Scale,
	Sparkles,
	User,
	Users
} from 'lucide-react';
import {useSetAtom} from 'jotai';
import {difficultyColors, frameworkColors} from '../../constants/examples';
import {selectedTemplateModalAtom} from '../../atoms/examplesAtoms';
import type {ExampleGraph} from '../../data/examples';

interface TemplateCardProps {
	example: ExampleGraph;
	onOpenInEditor: () => void;
}

export function TemplateCard({example, onOpenInEditor}: TemplateCardProps) {
	const setSelectedTemplate = useSetAtom(selectedTemplateModalAtom);

	const handleViewDetails = () => {
		setSelectedTemplate(example);
	};
	const renderGraphPreview = () => {
		// Render different previews based on example ID
		switch (example.id) {
			case 'sequential-planner':
				return (
					<div className='flex flex-col gap-4'>
						<div className='w-32 h-10 border border-[var(--pf-border)] rounded bg-[var(--pf-bg-secondary)] shadow-sm flex items-center px-3 gap-2'>
							<div className='w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center'>
								<Brain className='w-[10px] h-[10px] text-indigo-400' />
							</div>
							<div className='h-1.5 w-16 bg-[var(--pf-border)] rounded'></div>
						</div>
						<div className='ml-16 w-32 h-10 border border-[var(--pf-border)] rounded bg-[var(--pf-bg-secondary)] shadow-sm flex items-center px-3 gap-2'>
							<div className='w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center'>
								<CheckCircle className='w-[10px] h-[10px] text-emerald-400' />
							</div>
							<div className='h-1.5 w-16 bg-[var(--pf-border)] rounded'></div>
						</div>
					</div>
				);
			case 'agentic-rag':
				return (
					<div className='flex items-center gap-4'>
						<div className='w-10 h-10 rounded-lg border border-[var(--pf-border)] bg-[var(--pf-bg-secondary)] shadow-sm flex items-center justify-center'>
							<Database className='w-5 h-5 text-amber-500' />
						</div>
						<div className='w-8 h-[1px] bg-[var(--pf-border)]'></div>
						<div className='w-10 h-10 rounded-lg border border-[var(--pf-border)] bg-[var(--pf-bg-secondary)] shadow-sm flex items-center justify-center'>
							<Brain className='w-5 h-5 text-indigo-500' />
						</div>
					</div>
				);
			case 'multi-agent-debate':
				return (
					<div className='grid grid-cols-2 gap-3'>
						<div className='w-12 h-12 rounded-full border border-pink-500/30 bg-pink-500/10 flex items-center justify-center'>
							<User className='w-6 h-6 text-pink-500' />
						</div>
						<div className='w-12 h-12 rounded-full border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center'>
							<Users className='w-6 h-6 text-cyan-500' />
						</div>
						<div className='col-span-2 mx-auto w-12 h-12 rounded-lg border border-purple-500/30 bg-purple-500/10 flex items-center justify-center'>
							<Scale className='w-6 h-6 text-purple-500' />
						</div>
					</div>
				);
			case 'human-in-loop-verifier':
				return (
					<div className='flex items-center gap-4'>
						<div className='w-10 h-10 rounded border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center'>
							<Sparkles className='w-5 h-5 text-indigo-500' />
						</div>
						<div className='w-4 h-4 text-[var(--pf-text-muted)]'>→</div>
						<div className='w-10 h-10 rounded border border-rose-500/30 bg-rose-500/10 flex items-center justify-center'>
							<User className='w-5 h-5 text-rose-500' />
						</div>
					</div>
				);
			case 'hierarchical-support':
				return (
					<div className='flex flex-col items-center gap-2'>
						<div className='w-8 h-8 rounded border border-[var(--pf-border)] bg-[var(--pf-bg-secondary)] shadow-sm'></div>
						<div className='flex gap-4'>
							<div className='w-8 h-8 rounded border border-[var(--pf-border)] bg-[var(--pf-bg-secondary)] shadow-sm'></div>
							<div className='w-8 h-8 rounded border border-[var(--pf-border)] bg-[var(--pf-bg-secondary)] shadow-sm'></div>
							<div className='w-8 h-8 rounded border border-[var(--pf-border)] bg-[var(--pf-bg-secondary)] shadow-sm'></div>
						</div>
					</div>
				);
			case 'recursive-researcher':
				return (
					<div className='relative w-16 h-16 border-2 border-dashed border-indigo-500/30 rounded-full flex items-center justify-center'>
						<RefreshCw
							className='w-6 h-6 text-indigo-400 animate-spin'
							style={{animationDuration: '10s'}}
						/>
						<div className='absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full'></div>
					</div>
				);
			case 'router-with-executors':
				return (
					<div className='flex flex-col items-center gap-3'>
						<div className='w-12 h-12 rounded-lg border border-yellow-500/30 bg-yellow-500/10 flex items-center justify-center'>
							<Network className='w-6 h-6 text-yellow-500' />
						</div>
						<div className='flex gap-3'>
							<div className='w-10 h-10 rounded border border-[var(--pf-border)] bg-[var(--pf-bg-secondary)] shadow-sm flex items-center justify-center'>
								<CheckCircle className='w-5 h-5 text-[var(--pf-text-muted)]' />
							</div>
							<div className='w-10 h-10 rounded border border-[var(--pf-border)] bg-[var(--pf-bg-secondary)] shadow-sm flex items-center justify-center'>
								<CheckCircle className='w-5 h-5 text-[var(--pf-text-muted)]' />
							</div>
						</div>
					</div>
				);
			case 'verifier-first':
				return (
					<div className='flex items-center gap-4'>
						<div className='w-10 h-10 rounded border border-red-500/30 bg-red-500/10 flex items-center justify-center'>
							<CheckCircle className='w-5 h-5 text-red-500' />
						</div>
						<div className='w-4 h-4 text-[var(--pf-text-muted)]'>→</div>
						<div className='w-10 h-10 rounded border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center'>
							<CheckCircle className='w-5 h-5 text-indigo-500' />
						</div>
					</div>
				);
			case 'escalation-aware-support':
				return (
					<div className='flex flex-col items-center gap-3'>
						<div className='w-10 h-10 rounded border border-[var(--pf-border)] bg-[var(--pf-bg-secondary)] shadow-sm flex items-center justify-center'>
							<CheckCircle className='w-5 h-5 text-[var(--pf-text-muted)]' />
						</div>
						<div className='w-4 h-[1px] bg-[var(--pf-border)]'></div>
						<div className='w-10 h-10 rounded border border-rose-500/30 bg-rose-500/10 flex items-center justify-center'>
							<User className='w-5 h-5 text-rose-500' />
						</div>
					</div>
				);
			case 'memory-centric':
				return (
					<div className='flex items-center gap-4'>
						<div className='w-12 h-12 rounded-lg border border-teal-500/30 bg-teal-500/10 flex items-center justify-center'>
							<Database className='w-6 h-6 text-teal-500' />
						</div>
						<div className='flex flex-col gap-2'>
							<div className='w-8 h-8 rounded border border-[var(--pf-border)] bg-[var(--pf-bg-secondary)] shadow-sm'></div>
							<div className='w-8 h-8 rounded border border-[var(--pf-border)] bg-[var(--pf-bg-secondary)] shadow-sm'></div>
						</div>
					</div>
				);
			default:
				// Default preview for user-query-router or unknown templates
				return (
					<div className='flex items-center gap-4'>
						<Network className='w-10 h-10 text-[var(--pf-text-muted)]' />
					</div>
				);
		}
	};

	return (
		<div className='group relative bg-[var(--pf-bg-secondary)] border border-[var(--pf-border)] rounded-xl overflow-hidden hover:border-[var(--pf-primary-gradient)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--pf-primary-gradient)]/10'>
			{/* Graph Preview */}
			<div className='h-44 bg-[#0d0d0d] graph-preview-dots relative overflow-hidden p-6 flex items-center justify-center border-b border-[var(--pf-border)]'>
				{renderGraphPreview()}
				{/* Hover Overlay */}
				<div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3'>
					<button
						onClick={onOpenInEditor}
						className='bg-[var(--pf-primary-gradient)] hover:opacity-90 text-white px-4 py-2 rounded font-medium text-sm flex items-center gap-2 transition-opacity'>
						<ExternalLink className='w-4 h-4' />
						Open in Editor
					</button>
					<button
						onClick={handleViewDetails}
						className='bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded font-medium text-sm backdrop-blur transition-colors'>
						<Eye className='w-4 h-4 inline mr-2' />
						View Details
					</button>
				</div>
			</div>

			{/* Content */}
			<div className='p-5'>
				<div className='flex items-center gap-2 mb-3'>
					<span
						className={`px-2 py-0.5 ${frameworkColors[example.framework]} text-[10px] font-bold uppercase rounded`}>
						{example.framework}
					</span>
					<span
						className={`px-2 py-0.5 ${difficultyColors[example.difficulty]} text-[10px] font-bold uppercase rounded`}>
						{example.difficulty}
					</span>
				</div>
				<h3 className='font-bold text-lg mb-2 text-[var(--pf-text-primary)]'>
					{example.name}
				</h3>
				<p className='text-sm text-[var(--pf-text-muted)] line-clamp-2'>
					{example.description}
				</p>
			</div>
		</div>
	);
}
