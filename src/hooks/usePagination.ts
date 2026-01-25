import {useMemo, useCallback} from 'react';
import {useAtom, useAtomValue} from 'jotai';
import {examplesCurrentPageAtom, examplesFilteredAtom} from '../atoms/examplesAtoms';

const ITEMS_PER_PAGE = 6;

export function usePagination() {
	const [currentPage, setCurrentPage] = useAtom(examplesCurrentPageAtom);
	const filteredExamples = useAtomValue(examplesFilteredAtom);
	
	const totalPages = useMemo(
		() => Math.ceil(filteredExamples.length / ITEMS_PER_PAGE),
		[filteredExamples.length]
	);
	
	const paginatedExamples = useMemo(
		() =>
			filteredExamples.slice(
				(currentPage - 1) * ITEMS_PER_PAGE,
				currentPage * ITEMS_PER_PAGE
			),
		[filteredExamples, currentPage]
	);

	const goToPage = useCallback(
		(page: number) => {
			setCurrentPage(Math.max(1, Math.min(page, totalPages)));
		},
		[setCurrentPage, totalPages]
	);

	const goToNextPage = useCallback(() => {
		setCurrentPage((prev) => Math.min(totalPages, prev + 1));
	}, [setCurrentPage, totalPages]);

	const goToPreviousPage = useCallback(() => {
		setCurrentPage((prev) => Math.max(1, prev - 1));
	}, [setCurrentPage]);

	return {
		currentPage,
		totalPages,
		paginatedExamples,
		goToPage,
		goToNextPage,
		goToPreviousPage,
		hasNextPage: currentPage < totalPages,
		hasPreviousPage: currentPage > 1
	};
}
