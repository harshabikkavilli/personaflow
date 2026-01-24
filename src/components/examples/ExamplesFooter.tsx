import {Layers, PenTool} from 'lucide-react';

export function ExamplesFooter() {
	return (
		<footer className='border-t border-[var(--pf-border)] py-12 flex-shrink-0'>
			<div className='max-w-[1600px] mx-auto px-6'>
				<div className='flex flex-col md:flex-row items-start justify-between gap-12'>
					{/* Left Side - Description */}
					<div className='flex-1 max-w-2xl'>
						<h3 className='text-xl font-bold mb-2 text-[var(--pf-text-primary)]'>
							Curated Agent Architectures
						</h3>
						<p className='text-sm text-[var(--pf-text-muted)] mb-6'>
							Designed to illustrate proven multi-agent patterns and common
							failure modes.
						</p>

						{/* Stats */}
						<div className='flex flex-wrap items-center gap-8 mb-6'>
							<div className='flex items-center gap-2'>
								<div className='text-2xl font-bold text-[var(--pf-primary-gradient)]'>
									10
								</div>
								<div className='text-sm font-semibold text-[var(--pf-text-primary)]'>
									Curated Patterns
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<Layers className='w-6 h-6 text-[var(--pf-primary-gradient)]' />
								<div>
									<div className='text-sm font-semibold text-[var(--pf-text-primary)]'>
										Framework-agnostic
									</div>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<PenTool className='w-6 h-6 text-[var(--pf-primary-gradient)]' />
								<div>
									<div className='text-sm font-semibold text-[var(--pf-text-primary)]'>
										Design-time focused
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right Side - Coming Soon */}
					<div className='flex-1 max-w-md'>
						<div className='bg-[var(--pf-bg-secondary)] border border-[var(--pf-border)] rounded-xl p-6'>
							<h4 className='font-semibold mb-2 text-[var(--pf-text-primary)]'>
								More patterns coming
							</h4>
							<p className='text-sm text-[var(--pf-text-muted)] leading-relaxed'>
								PersonaFlow will expand its template library as agent design
								practices evolve.
							</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
