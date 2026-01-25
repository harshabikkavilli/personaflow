import {useAtomValue, useSetAtom} from 'jotai';
import {selectedNodeAtom} from '../../atoms/graphAtoms';
import {closeDetailsPanelAtom} from '../../atoms/uiAtoms';
import {getNodeConfig} from '../../types';
import {Panel} from '../ui/Panel';
import {Section} from '../ui/Section';

export function DetailsPanel() {
	const selectedNode = useAtomValue(selectedNodeAtom);
	const closePanel = useSetAtom(closeDetailsPanelAtom);
	const isOpen = selectedNode !== null;

	// Only show if a node is selected
	if (!selectedNode) {
		return null;
	}

	const nodeConfig = getNodeConfig(selectedNode.data.personaType);
	const {name, meta} = selectedNode.data;

	return (
		<Panel
			isOpen={isOpen}
			onClose={() => closePanel()}
			title="Component Details"
			position="right"
			width="w-full sm:w-96 lg:w-80">
			{/* Content */}
			<div className="flex-1 overflow-auto p-4 space-y-4">
				{/* Node Name and Type */}
				<div>
					<h3 className="text-lg font-semibold text-[var(--pf-text-primary)]">{name}</h3>
					<p className="text-xs text-[var(--pf-text-muted)]">
						type: {nodeConfig?.label || selectedNode.data.personaType}
					</p>
				</div>

				{/* Description */}
				{meta.description && (
					<div>
						<p className="text-sm text-[var(--pf-text-secondary)] leading-relaxed">
							{meta.description}
						</p>
					</div>
				)}

				{/* Responsibilities */}
				{meta.responsibilities && (
					<Section title="Responsibilities" defaultOpen>
						<p className="text-sm text-[var(--pf-text-secondary)]">{meta.responsibilities}</p>
					</Section>
				)}

				{/* Logic & Thresholds */}
				{meta.logicConfig && Object.keys(meta.logicConfig).length > 0 && (
					<Section title="Logic & Thresholds" defaultOpen>
						<div className="bg-[var(--pf-bg-secondary)] rounded-lg p-3 font-mono text-xs">
							{Object.entries(meta.logicConfig).map(([key, value]) => (
								<div key={key} className="flex justify-between py-1">
									<span className="text-[var(--pf-text-muted)]">{key}</span>
									<span className="text-[var(--pf-planner)]">{String(value)}</span>
								</div>
							))}
						</div>
					</Section>
				)}

				{/* Input Schema */}
				{meta.inputSchema && Object.keys(meta.inputSchema).length > 0 && (
					<Section title="Input Schema" defaultOpen>
						<pre className="bg-[var(--pf-bg-secondary)] rounded-lg p-3 font-mono text-xs text-[var(--pf-text-secondary)] overflow-auto">
							{JSON.stringify(meta.inputSchema, null, 2)}
						</pre>
					</Section>
				)}

				{/* Output Destinations */}
				{meta.outputDestinations && meta.outputDestinations.length > 0 && (
					<Section title="Output Destinations" defaultOpen>
						<div className="space-y-1">
							{meta.outputDestinations.map((dest, i) => (
								<div key={i} className="text-sm text-[var(--pf-text-secondary)]">
									{dest}
								</div>
							))}
						</div>
					</Section>
				)}

				{/* Potential Risks */}
				{meta.risks && meta.risks.length > 0 && (
					<Section title="Potential Risks" defaultOpen>
						<ul className="space-y-1">
							{meta.risks.map((risk, i) => (
								<li key={i} className="flex items-start gap-2 text-sm text-[var(--pf-text-secondary)]">
									<span className="text-[var(--pf-warning)] mt-1">•</span>
									{risk}
								</li>
							))}
						</ul>
					</Section>
				)}
			</div>

			{/* Footer */}
			<div className="p-4 border-t border-[var(--pf-border)]">
				<button className="w-full py-2 px-4 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
					Configure Node Logic
				</button>
			</div>
		</Panel>
	);
}
