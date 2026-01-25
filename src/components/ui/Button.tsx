import type {ReactNode, ButtonHTMLAttributes} from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
	size?: 'sm' | 'md' | 'lg';
	icon?: ReactNode;
}

export function Button({
	children,
	variant = 'primary',
	size = 'md',
	icon,
	className = '',
	...props
}: ButtonProps) {
	const baseClasses = 'font-medium transition-all rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
	
	const variantClasses = {
		primary: 'bg-[var(--pf-primary-gradient)] hover:opacity-90 text-white shadow-lg shadow-[var(--pf-primary-gradient)]/20',
		secondary: 'bg-[var(--pf-bg-tertiary)] hover:bg-[var(--pf-border)] text-[var(--pf-text-primary)]',
		ghost: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur',
		danger: 'bg-red-500 hover:bg-red-600 text-white'
	};

	const sizeClasses = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	return (
		<button
			className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
			{...props}>
			{icon && <span>{icon}</span>}
			{children}
		</button>
	);
}
