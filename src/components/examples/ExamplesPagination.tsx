import {ChevronLeft, ChevronRight} from 'lucide-react';
import {usePagination} from '../../hooks/usePagination';

export function ExamplesPagination() {
	const {currentPage, totalPages, goToPage, goToNextPage, goToPreviousPage, hasNextPage, hasPreviousPage} = usePagination();
	
	if (totalPages <= 1) return null;

	return (
		<div className='mt-6 flex items-center justify-center gap-2 flex-shrink-0 pb-2'>
			<button
				onClick={goToPreviousPage}
				disabled={!hasPreviousPage}
				className='w-10 h-10 flex items-center justify-center rounded border border-[var(--pf-border)] text-[var(--pf-text-muted)] hover:text-[var(--pf-primary-gradient)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
				<ChevronLeft className='w-4 h-4' />
			</button>
			{Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
				<button
					key={page}
					onClick={() => goToPage(page)}
					className={`w-10 h-10 flex items-center justify-center rounded border font-medium transition-colors ${
						currentPage === page
							? 'bg-[var(--pf-primary-gradient)] text-white border-[var(--pf-primary-gradient)]'
							: 'border-[var(--pf-border)] text-[var(--pf-text-muted)] hover:text-[var(--pf-primary-gradient)]'
					}`}>
					{page}
				</button>
			))}
			<button
				onClick={goToNextPage}
				disabled={!hasNextPage}
				className='w-10 h-10 flex items-center justify-center rounded border border-[var(--pf-border)] text-[var(--pf-text-muted)] hover:text-[var(--pf-primary-gradient)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
				<ChevronRight className='w-4 h-4' />
			</button>
		</div>
	);
}
