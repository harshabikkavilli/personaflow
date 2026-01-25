import {AlertCircle, AlertTriangle, CheckCircle, InfoIcon} from 'lucide-react';
import type {AnalysisWarning} from '../../types';

interface WarningsListProps {
	warnings: AnalysisWarning[];
}

export function WarningsList({warnings}: WarningsListProps) {
	if (warnings.length === 0) {
		return (
			<div className='p-4 text-center'>
				<CheckCircle className='w-8 h-8 text-[var(--pf-success)] mx-auto mb-2' />
				<p className='text-sm text-[var(--pf-text-secondary)]'>
					No warnings detected
				</p>
				<p className='text-xs text-[var(--pf-text-muted)] mt-1'>
					Your system architecture looks good!
				</p>
			</div>
		);
	}

	return (
		<div className='p-2 space-y-2'>
			{warnings.map((warning) => (
				<WarningItem key={warning.id} warning={warning} />
			))}
		</div>
	);
}

interface WarningItemProps {
	warning: AnalysisWarning;
}

function WarningItem({warning}: WarningItemProps) {
	const isError = warning.severity === 'error';
	const isWarning = warning.severity === 'warning';
	const Icon = isError ? AlertCircle : isWarning ? AlertTriangle : InfoIcon;
	const color = isError
		? 'var(--pf-error)'
		: isWarning
			? 'var(--pf-warning)'
			: 'var(--pf-info)';

	const typeLabels: Record<string, string> = {
		'unverified-executor': 'Unverified Executor',
		'unused-memory': 'Unused Memory',
		'unbounded-loop': 'Possible Loop',
		'disconnected-subgraph': 'Disconnected Subgraph',
		'no-entry-nodes': 'No Entry Nodes',
		'no-exit-nodes': 'No Exit Nodes'
	};

	return (
		<div
			className='p-3 rounded-lg border'
			style={{
				backgroundColor: `${color}08`,
				borderColor: `${color}30`
			}}>
			<div className='flex items-start gap-2'>
				<Icon className='w-4 h-4 mt-0.5 flex-shrink-0' style={{color}} />
				<div className='flex-1 min-w-0'>
					<div className='flex items-center gap-2 mb-1'>
						<span className='text-xs font-medium' style={{color}}>
							{typeLabels[warning.type] || warning.type}
						</span>
					</div>
					<p className='text-sm text-[var(--pf-text-secondary)] leading-relaxed'>
						{warning.message}
					</p>
					{warning.nodeIds.length > 0 && (
						<div className='mt-2 flex flex-wrap gap-1'>
							{warning.nodeIds.map((nodeId) => (
								<span
									key={nodeId}
									className='px-1.5 py-0.5 text-xs rounded bg-[var(--pf-bg-tertiary)] text-[var(--pf-text-muted)]'>
									{nodeId}
								</span>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
