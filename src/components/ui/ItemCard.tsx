import type {ReactNode} from 'react';

interface ItemCardProps {
	icon: ReactNode;
	title: string;
	desc: string;
	color: string;
}

export function ItemCard({icon, title, desc, color}: ItemCardProps) {
	return (
		<div className='group p-8 rounded-3xl border border-[var(--pf-border)] bg-[var(--pf-bg-surface)]/50 backdrop-blur-sm hover:bg-[var(--pf-bg-surface)] transition-all duration-300 hover:-translate-y-1'>
			<div
				className={`h-14 w-14 flex items-center justify-center rounded-2xl border mb-6 group-hover:scale-110 transition-transform shadow-lg ${color}`}>
				{icon}
			</div>
			<h3 className='text-xl font-bold text-[var(--pf-text-primary)] mb-3'>
				{title}
			</h3>
			<p className='text-sm text-[var(--pf-text-secondary)] leading-relaxed font-light'>
				{desc}
			</p>
		</div>
	);
}
