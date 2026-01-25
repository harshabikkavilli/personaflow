import {X} from 'lucide-react';
import type {ReactNode} from 'react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	subtitle?: string;
	children: ReactNode;
	footer?: ReactNode;
	className?: string;
	icon?: ReactNode;
}

export function Modal({
	isOpen,
	onClose,
	title,
	subtitle,
	children,
	footer,
	className = '',
	icon
}: ModalProps) {
	if (!isOpen) return null;

	return (
		<div
			className={`fixed inset-0 z-[100] overflow-y-auto ${className}`}
			aria-labelledby='modal-title'
			role='dialog'
			aria-modal='true'>
			{/* Backdrop */}
			<div
				className='fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300'
				onClick={onClose}
				aria-hidden='true'
			/>

			{/* Modal container */}
			<div className='flex min-h-screen items-center justify-center p-6'>
				{/* Modal dialog */}
				<div className='relative w-full max-w-5xl h-[85vh] max-h-[calc(100vh-8rem)] bg-[var(--pf-bg-primary)] rounded-xl shadow-2xl border border-[var(--pf-border)] flex flex-col overflow-hidden'>
					{/* Header */}
					<div className='px-6 py-4 border-b border-[var(--pf-border)] flex items-center justify-between flex-shrink-0'>
						<div className='flex items-center gap-3'>
							{icon && (
								<div className='p-2 bg-[var(--pf-primary-gradient)]/10 rounded-lg'>
									{icon}
								</div>
							)}
							<div>
								<h2
									id='modal-title'
									className='text-xl font-semibold text-[var(--pf-text-primary)]'>
									{title}
								</h2>
								{subtitle && (
									<p className='text-sm text-[var(--pf-text-muted)]'>
										{subtitle}
									</p>
								)}
							</div>
						</div>
						<button
							onClick={onClose}
							className='text-[var(--pf-text-muted)] hover:text-[var(--pf-text-primary)] transition-colors p-2 rounded-lg hover:bg-[var(--pf-bg-tertiary)]'
							aria-label='Close modal'>
							<X className='w-5 h-5' />
						</button>
					</div>

					{/* Content */}
					{children}

					{/* Footer */}
					{footer && (
						<div className='px-6 py-4 bg-[var(--pf-bg-secondary)] border-t border-[var(--pf-border)] flex items-center justify-between flex-shrink-0'>
							{footer}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
