import type {ReactNode} from 'react';

interface SectionProps {
	title: string;
	children: ReactNode;
	defaultOpen?: boolean;
	collapsible?: boolean;
}

export function Section({title, children, defaultOpen = false, collapsible = true}: SectionProps) {
	if (!collapsible) {
		return (
			<div>
				<h3 className="text-xs font-semibold text-[var(--pf-text-muted)] uppercase tracking-wider mb-2">
					{title}
				</h3>
				{children}
			</div>
		);
	}

	return (
		<details open={defaultOpen} className="group">
			<summary className="flex items-center justify-between cursor-pointer text-xs font-semibold text-[var(--pf-text-muted)] uppercase tracking-wider mb-2 list-none">
				{title}
				<span className="text-[var(--pf-text-muted)] group-open:rotate-180 transition-transform">
					▼
				</span>
			</summary>
			{children}
		</details>
	);
}
