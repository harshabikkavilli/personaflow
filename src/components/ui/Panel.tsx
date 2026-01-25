import {X} from 'lucide-react';
import type {ReactNode} from 'react';

interface PanelProps {
	isOpen: boolean;
	onClose?: () => void;
	title?: string;
	children: ReactNode;
	position?: 'left' | 'right';
	width?: string;
	className?: string;
	showHeaderOnDesktop?: boolean;
}

export function Panel({
	isOpen,
	onClose,
	title,
	children,
	position = 'right',
	width = 'w-full sm:w-96 lg:w-80',
	className = '',
	showHeaderOnDesktop = true
}: PanelProps) {
	const isLeft = position === 'left';
	const translateClass = isLeft
		? isOpen
			? 'translate-x-0'
			: '-translate-x-full lg:translate-x-0'
		: isOpen
			? 'translate-x-0'
			: 'translate-x-full';

	// Left panels should always render on desktop (lg breakpoint) even when closed
	// Right panels should only render when open to avoid layout issues
	const shouldRender = isLeft ? true : isOpen;

	if (!shouldRender) {
		return null;
	}

	return (
		<>
			{/* Mobile overlay - only show when panel is open */}
			{isOpen && onClose && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
					onClick={onClose}
					style={{top: '5rem'}} // Below navbar
				/>
			)}

			<div
				className={`
          fixed lg:static
          top-20 lg:top-0 ${isLeft ? 'left-0' : 'right-0'}
          h-[calc(100vh-5rem)] lg:h-auto
          ${width}
          max-w-sm lg:max-w-none
          ${isLeft ? 'border-r' : 'border-l'} border-[var(--pf-border)] 
          bg-[var(--pf-bg-primary)] 
          flex flex-col
          z-50 lg:z-auto
          transform transition-transform duration-300 ease-in-out
          ${translateClass}
          ${className}
        `}>
				{/* Header */}
				{(title || onClose) && (
					<div className={`flex items-center justify-between px-4 py-3 border-b border-[var(--pf-border)] ${showHeaderOnDesktop ? '' : 'lg:hidden'}`}>
						{title && (
							<h2 className="text-sm font-semibold text-[var(--pf-text-primary)]">
								{title}
							</h2>
						)}
						{onClose && (
							<button
								onClick={onClose}
								className="p-1.5 rounded hover:bg-[var(--pf-bg-tertiary)] text-[var(--pf-text-muted)] hover:text-[var(--pf-text-primary)] transition-colors"
								aria-label="Close panel">
								<X className="w-4 h-4" />
							</button>
						)}
					</div>
				)}

				{/* Content */}
				{children}
			</div>
		</>
	);
}
