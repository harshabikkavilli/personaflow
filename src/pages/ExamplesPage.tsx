import {useSetAtom, useAtom, useAtomValue} from 'jotai';
import {useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {loadGraphAtom} from '../atoms/graphAtoms';
import {
	examplesFilteredAtom,
	examplesCurrentPageAtom,
	examplesSortByAtom,
	selectedTemplateModalAtom
} from '../atoms/examplesAtoms';
import {ExamplesFooter} from '../components/examples/ExamplesFooter';
import {ExamplesPagination} from '../components/examples/ExamplesPagination';
import {ExamplesSidebar} from '../components/examples/ExamplesSidebar';
import {TemplateCard} from '../components/examples/TemplateCard';
import {TemplateDetailsModal} from '../components/examples/TemplateDetailsModal';
import {examples} from '../data/examples';

const ITEMS_PER_PAGE = 6;

export function ExamplesPage() {
	const navigate = useNavigate();
	const loadGraph = useSetAtom(loadGraphAtom);
	const filteredExamples = useAtomValue(examplesFilteredAtom);
	const [currentPage] = useAtom(examplesCurrentPageAtom);
	const [sortBy, setSortBy] = useAtom(examplesSortByAtom);
	const selectedTemplate = useAtomValue(selectedTemplateModalAtom);

	// Pagination
	const paginatedExamples = useMemo(
		() =>
			filteredExamples.slice(
				(currentPage - 1) * ITEMS_PER_PAGE,
				currentPage * ITEMS_PER_PAGE
			),
		[filteredExamples, currentPage]
	);

	const handleOpenInEditor = (example: typeof examples[number]) => {
		if (example.nodes.length > 0) {
			loadGraph({
				nodes: example.nodes,
				edges: example.edges
			});
		}
		navigate('/editor');
	};

	return (
		<div className='flex-1 flex flex-col'>
			{/* Main content area - sidebar + templates */}
			<div className='flex-1 flex gap-8 p-6 max-w-[1600px] mx-auto w-full overflow-hidden min-h-0'>
				<ExamplesSidebar />

				{/* Main Content - Templates section */}
				<section className='flex-1 min-w-0 flex flex-col overflow-hidden min-h-0'>
					{/* Header - Fixed */}
					<div className='flex items-center justify-between mb-8 flex-shrink-0'>
						<div>
							<h1 className='text-2xl font-bold mb-1 text-[var(--pf-text-primary)]'>
								Template Library
							</h1>
							<p className='text-[var(--pf-text-muted)] text-sm'>
								Jumpstart your multi-agent architecture with curated patterns.
							</p>
						</div>
						<div className='flex items-center gap-2 text-sm text-[var(--pf-text-muted)]'>
							<span>Sort by:</span>
							<select
								value={sortBy}
								onChange={(e) =>
									setSortBy(
										e.target.value as 'Featured' | 'Most Popular' | 'Newest'
									)
								}
								className='bg-transparent border-none focus:ring-0 font-medium text-[var(--pf-text-primary)] cursor-pointer'>
								<option>Featured</option>
								<option>Most Popular</option>
								<option>Newest</option>
							</select>
						</div>
					</div>

					{/* Template Grid - Scrollable */}
					<div className='flex-1 overflow-y-auto min-h-0'>
						<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6'>
							{paginatedExamples.map((example) => (
								<TemplateCard
									key={example.id}
									example={example}
									onOpenInEditor={() => handleOpenInEditor(example)}
								/>
							))}
						</div>
					</div>

					{/* Pagination - Fixed */}
					<ExamplesPagination />
				</section>
			</div>

			{/* Footer - Fixed */}
			<ExamplesFooter />

			{/* Template Details Modal */}
			{selectedTemplate && (
				<TemplateDetailsModal
					example={selectedTemplate}
					onOpenInEditor={() => {
						handleOpenInEditor(selectedTemplate);
					}}
				/>
			)}
		</div>
	);
}
