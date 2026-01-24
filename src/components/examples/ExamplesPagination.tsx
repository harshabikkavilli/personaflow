import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useAtom, useAtomValue} from 'jotai';
import {
	examplesCurrentPageAtom,
	examplesFilteredAtom
} from '../../atoms/examplesAtoms';

const ITEMS_PER_PAGE = 6;

export function ExamplesPagination() {
	const [currentPage, setCurrentPage] = useAtom(examplesCurrentPageAtom);
	const filteredExamples = useAtomValue(examplesFilteredAtom);
	const totalPages = Math.ceil(filteredExamples.length / ITEMS_PER_PAGE);
	if (totalPages <= 1) return null;

	return (
		<div className='mt-6 flex items-center justify-center gap-2 flex-shrink-0 pb-2'>
			<button
				onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
				className='w-10 h-10 flex items-center justify-center rounded border border-[var(--pf-border)] text-[var(--pf-text-muted)] hover:text-[var(--pf-primary-gradient)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
				<ChevronLeft className='w-4 h-4' />
			</button>
			{Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
				<button
					key={page}
					onClick={() => setCurrentPage(page)}
					className={`w-10 h-10 flex items-center justify-center rounded border font-medium transition-colors ${
						currentPage === page
							? 'bg-[var(--pf-primary-gradient)] text-white border-[var(--pf-primary-gradient)]'
							: 'border-[var(--pf-border)] text-[var(--pf-text-muted)] hover:text-[var(--pf-primary-gradient)]'
					}`}>
					{page}
				</button>
			))}
			<button
				onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
				disabled={currentPage === totalPages}
				className='w-10 h-10 flex items-center justify-center rounded border border-[var(--pf-border)] text-[var(--pf-text-muted)] hover:text-[var(--pf-primary-gradient)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
				<ChevronRight className='w-4 h-4' />
			</button>
		</div>
	);
}
