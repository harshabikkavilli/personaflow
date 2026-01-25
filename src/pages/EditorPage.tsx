import {useEffect} from 'react';
import {useSetAtom, useAtomValue} from 'jotai';
import {ReactFlowProvider} from '@xyflow/react';
import {TopStrip} from '../components/editor/TopStrip';
import {ComponentSidebar} from '../components/editor/ComponentSidebar';
import {Canvas} from '../components/editor/Canvas';
import {DetailsPanel} from '../components/editor/DetailsPanel';
import {WarningsPanel} from '../components/editor/WarningsPanel';
import {ExportModal} from '../components/editor/ExportModal';
import {loadGraphAtom, nodesAtom, hasLoadedDefaultAtom} from '../atoms/graphAtoms';
import {defaultExample} from '../data/examples';

export function EditorPage() {
	const loadGraph = useSetAtom(loadGraphAtom);
	const nodes = useAtomValue(nodesAtom);
	const hasLoadedDefault = useAtomValue(hasLoadedDefaultAtom);
	const setHasLoadedDefault = useSetAtom(hasLoadedDefaultAtom);

	// Load default example once on mount only if graph is empty
	useEffect(() => {
		if (!hasLoadedDefault && nodes.length === 0) {
			loadGraph({
				nodes: defaultExample.nodes,
				edges: defaultExample.edges
			});
			setHasLoadedDefault(true);
		}
	}, [loadGraph, nodes.length, hasLoadedDefault, setHasLoadedDefault]);

	return (
		<ReactFlowProvider>
			<div className='flex-1 flex flex-col'>
				{/* Top Strip with stats and warnings */}
				<TopStrip />

				{/* Main editor area */}
				<div className='flex-1 flex overflow-hidden relative'>
					{/* Left Sidebar - Component palette */}
					<ComponentSidebar />

					{/* Center - Canvas */}
					<Canvas />

					{/* Right Sidebars - Details panel and Warnings panel */}
					<DetailsPanel />
					<WarningsPanel />
				</div>

				{/* Export Modal */}
				<ExportModal />
			</div>
		</ReactFlowProvider>
	);
}
