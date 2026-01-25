import {useAtomValue, useSetAtom} from 'jotai';
import type {NodeConfig} from '../../types';
import {AGENT_CONFIGS, SYSTEM_CONFIGS} from '../../types';
import {nodeIcons} from '../../constants/nodeConstants';
import {isLeftSidebarOpenAtom, closeLeftSidebarAtom} from '../../atoms/uiAtoms';
import {Panel} from '../ui/Panel';
import {Section} from '../ui/Section';

interface DraggableNodeProps {
	config: NodeConfig;
}

function DraggableNode({config}: DraggableNodeProps) {
	const Icon = nodeIcons[config.type];

	const onDragStart = (event: React.DragEvent) => {
		event.dataTransfer.setData('application/personaflow-node', config.type);
		event.dataTransfer.effectAllowed = 'move';
	};

	return (
		<div
			draggable
			onDragStart={onDragStart}
			className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-grab hover:bg-[var(--pf-bg-tertiary)] transition-colors group">
			<div
				className="w-8 h-8 rounded-lg flex items-center justify-center"
				style={{backgroundColor: `${config.color}20`}}>
				<Icon className="w-4 h-4" style={{color: config.color}} />
			</div>
			<div className="flex-1 min-w-0">
				<div className="text-sm font-medium text-[var(--pf-text-primary)] group-hover:text-white transition-colors">
					{config.label}
				</div>
			</div>
		</div>
	);
}

export function ComponentSidebar() {
	const isOpen = useAtomValue(isLeftSidebarOpenAtom);
	const closeSidebar = useSetAtom(closeLeftSidebarAtom);

	return (
		<Panel
			isOpen={isOpen}
			onClose={() => closeSidebar()}
			title="Components"
			position="left"
			width="w-64 sm:w-72 lg:w-56"
			showHeaderOnDesktop={false}>
			<div className="flex-1 overflow-y-auto">
				<div className="p-3">
					<Section title="Agents" collapsible={false}>
						<div className="space-y-1 mt-2">
							{AGENT_CONFIGS.map((config) => (
								<DraggableNode key={config.type} config={config} />
							))}
						</div>
					</Section>
				</div>

				<div className="border-t border-[var(--pf-border)] mx-3" />

				<div className="p-3">
					<Section title="System Components" collapsible={false}>
						<div className="space-y-1 mt-2">
							{SYSTEM_CONFIGS.map((config) => (
								<DraggableNode key={config.type} config={config} />
							))}
						</div>
					</Section>
				</div>
			</div>

			{/* Help text */}
			<div className="p-3 border-t border-[var(--pf-border)]">
				<p className="text-xs text-[var(--pf-text-muted)] leading-relaxed">
					Drag and drop components to build your multi-agent architecture. Use connectors to define information flow.
				</p>
			</div>
		</Panel>
	);
}
