import {useAtomValue, useSetAtom} from 'jotai';
import {
	AlertTriangle,
	Bot,
	CheckCircle,
	Database,
	Download,
	Menu,
	Wrench
} from 'lucide-react';
import {
	isValidSystemAtom,
	statsAtom,
	warningsAtom
} from '../../atoms/graphAtoms';
import {
	toggleLeftSidebarAtom,
	toggleDetailsPanelAtom,
	openWarningsPanelAtom,
	openExportModalAtom
} from '../../atoms/uiAtoms';

export function TopStrip() {
	const stats = useAtomValue(statsAtom);
	const warnings = useAtomValue(warningsAtom);
	const isValid = useAtomValue(isValidSystemAtom);
	const toggleLeftSidebar = useSetAtom(toggleLeftSidebarAtom);
	const toggleDetailsPanel = useSetAtom(toggleDetailsPanelAtom);
	const openWarnings = useSetAtom(openWarningsPanelAtom);
	const openExport = useSetAtom(openExportModalAtom);

	return (
		<div className='flex items-center justify-between px-2 sm:px-4 h-10 sm:h-10 border-b border-[var(--pf-border)] bg-[var(--pf-bg-secondary)]'>
			{/* Left side: Mobile menu button, Workspace name and stats */}
			<div className='flex items-center gap-2 sm:gap-6 flex-1 min-w-0'>
				{/* Mobile menu button */}
				<button
					onClick={() => toggleLeftSidebar()}
					className='lg:hidden p-1.5 rounded hover:bg-[var(--pf-bg-tertiary)] text-[var(--pf-text-secondary)] hover:text-[var(--pf-text-primary)] transition-colors'
					aria-label='Toggle components sidebar'>
					<Menu className='w-4 h-4' />
				</button>

				<span className='text-xs sm:text-sm font-medium text-[var(--pf-text-primary)] hidden sm:inline'>
					Workspace
				</span>

				<div className='flex items-center gap-2 sm:gap-4 text-xs flex-wrap'>
					<div className='flex items-center gap-1 sm:gap-1.5 text-[var(--pf-text-secondary)]'>
						<Bot className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
						<span className='hidden xs:inline'>{stats.agents} AGENTS</span>
						<span className='xs:hidden'>{stats.agents}</span>
					</div>
					<div className='flex items-center gap-1 sm:gap-1.5 text-[var(--pf-text-secondary)]'>
						<Wrench className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
						<span className='hidden xs:inline'>{stats.tools} TOOLS</span>
						<span className='xs:hidden'>{stats.tools}</span>
					</div>
					<div className='flex items-center gap-1 sm:gap-1.5 text-[var(--pf-text-secondary)]'>
						<Database className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
						<span className='hidden xs:inline'>{stats.memory} MEMORY</span>
						<span className='xs:hidden'>{stats.memory}</span>
					</div>
				</div>
			</div>

			{/* Right side: Export, Warnings, validation status, and details toggle */}
			<div className='flex items-center gap-2 sm:gap-4 flex-shrink-0'>
				{/* Export button */}
				<button
					onClick={() => openExport()}
					className='flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded bg-[var(--pf-bg-tertiary)] text-[var(--pf-text-secondary)] hover:text-[var(--pf-text-primary)] hover:bg-[var(--pf-bg-tertiary)] transition-colors border border-[var(--pf-border)]'
					aria-label='Export code'>
					<Download className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
					<span className='text-xs font-medium hidden sm:inline'>Export</span>
				</button>

				{warnings.length > 0 && (
					<button
						onClick={() => openWarnings()}
						className='flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded bg-[var(--pf-warning)]/10 text-[var(--pf-warning)] hover:bg-[var(--pf-warning)]/20 transition-colors cursor-pointer'
						aria-label='View warnings'>
						<AlertTriangle className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
						<span className='text-xs font-medium hidden sm:inline'>
							{warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
						</span>
						<span className='text-xs font-medium sm:hidden'>
							{warnings.length}
						</span>
					</button>
				)}

				<div
					className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded ${
						isValid
							? 'bg-[var(--pf-success)]/10 text-[var(--pf-success)]'
							: 'bg-[var(--pf-error)]/10 text-[var(--pf-error)]'
					}`}>
					<CheckCircle className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
					<span className='text-xs font-medium hidden sm:inline'>
						{isValid ? 'Valid System' : 'Invalid'}
					</span>
					<span className='text-xs font-medium sm:hidden'>
						{isValid ? '✓' : '✗'}
					</span>
				</div>

				{/* Mobile details toggle button */}
				<button
					onClick={() => toggleDetailsPanel()}
					className='lg:hidden p-1.5 rounded hover:bg-[var(--pf-bg-tertiary)] text-[var(--pf-text-secondary)] hover:text-[var(--pf-text-primary)] transition-colors'
					aria-label='Toggle details panel'>
					<Menu className='w-4 h-4' />
				</button>
			</div>
		</div>
	);
}
