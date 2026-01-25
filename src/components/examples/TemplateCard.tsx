import {
	ExternalLink,
	Eye
} from 'lucide-react';
import {useSetAtom} from 'jotai';
import {difficultyColors, frameworkColors} from '../../constants/examples';
import {selectedTemplateModalAtom} from '../../atoms/examplesAtoms';
import {getTemplatePreview} from './TemplatePreview';
import {Badge} from '../ui/Badge';
import {Button} from '../ui/Button';
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

	return (
		<div className='group relative bg-[var(--pf-bg-secondary)] border border-[var(--pf-border)] rounded-xl overflow-hidden hover:border-[var(--pf-primary-gradient)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--pf-primary-gradient)]/10'>
			{/* Graph Preview */}
			<div className='h-44 bg-[#0d0d0d] graph-preview-dots relative overflow-hidden p-6 flex items-center justify-center border-b border-[var(--pf-border)]'>
				{getTemplatePreview(example.id)}
				{/* Hover Overlay */}
				<div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3'>
					<Button
						variant="primary"
						size="sm"
						onClick={onOpenInEditor}
						icon={<ExternalLink className='w-4 h-4' />}>
						Open in Editor
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleViewDetails}
						icon={<Eye className='w-4 h-4' />}>
						View Details
					</Button>
				</div>
			</div>

			{/* Content */}
			<div className='p-5'>
				<div className='flex items-center gap-2 mb-3'>
					<Badge variant="framework" className={frameworkColors[example.framework]}>
						{example.framework}
					</Badge>
					<Badge variant="difficulty" className={difficultyColors[example.difficulty]}>
						{example.difficulty}
					</Badge>
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
