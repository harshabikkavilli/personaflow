import type {ReactNode} from 'react';

interface BadgeProps {
	children: ReactNode;
	variant?: 'framework' | 'difficulty' | 'nodeType' | 'default';
	className?: string;
}

export function Badge({children, variant = 'default', className = ''}: BadgeProps) {
	const baseClasses = 'px-2 py-0.5 text-[10px] font-bold uppercase rounded';
	
	// Default variant classes - can be overridden by className prop
	const variantClasses = {
		framework: '',
		difficulty: '',
		nodeType: '',
		default: 'bg-[var(--pf-bg-tertiary)] text-[var(--pf-text-muted)]'
	};

	return (
		<span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
			{children}
		</span>
	);
}
