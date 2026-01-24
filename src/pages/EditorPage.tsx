import {useRef} from 'react';
import {useEffect, useReducer} from 'react';
import {useSetAtom, useAtomValue} from 'jotai';
import {ReactFlowProvider} from '@xyflow/react';
import {TopStrip} from '../components/editor/TopStrip';
import {ComponentSidebar} from '../components/editor/ComponentSidebar';
import {Canvas} from '../components/editor/Canvas';
import {DetailsPanel} from '../components/editor/DetailsPanel';
import {WarningsPanel} from '../components/editor/WarningsPanel';
import {ExportModal} from '../components/editor/ExportModal';
import {loadGraphAtom, selectedNodeIdAtom, nodesAtom} from '../atoms/graphAtoms';
import {defaultExample} from '../data/examples';

type PanelAction =
	| {type: 'TOGGLE_LEFT_SIDEBAR'}
	| {type: 'TOGGLE_DETAILS_PANEL'}
	| {type: 'OPEN_WARNINGS'}
	| {type: 'CLOSE_WARNINGS'}
	| {type: 'OPEN_EXPORT'}
	| {type: 'CLOSE_EXPORT'}
	| {type: 'CLOSE_LEFT_SIDEBAR'}
	| {type: 'CLOSE_DETAILS_PANEL'};

interface PanelState {
	isLeftSidebarOpen: boolean;
	isWarningsPanelOpen: boolean;
	isExportModalOpen: boolean;
}

function panelReducer(state: PanelState, action: PanelAction): PanelState {
	switch (action.type) {
		case 'TOGGLE_LEFT_SIDEBAR':
			return {...state, isLeftSidebarOpen: !state.isLeftSidebarOpen};
		case 'TOGGLE_DETAILS_PANEL':
			return {...state};
		case 'OPEN_WARNINGS':
			return {...state, isWarningsPanelOpen: true};
		case 'CLOSE_WARNINGS':
			return {...state, isWarningsPanelOpen: false};
		case 'OPEN_EXPORT':
			return {...state, isExportModalOpen: true};
		case 'CLOSE_EXPORT':
			return {...state, isExportModalOpen: false};
		case 'CLOSE_LEFT_SIDEBAR':
			return {...state, isLeftSidebarOpen: false};
		case 'CLOSE_DETAILS_PANEL':
			return {...state};
		default:
			return state;
	}
}

const initialState: PanelState = {
	isLeftSidebarOpen: false,
	isWarningsPanelOpen: false,
	isExportModalOpen: false
};

export function EditorPage() {
	const loadGraph = useSetAtom(loadGraphAtom);
	const selectedNodeId = useAtomValue(selectedNodeIdAtom);
	const nodes = useAtomValue(nodesAtom);
	const [panelState, dispatch] = useReducer(panelReducer, initialState);
	const hasLoadedDefault = useRef(false);

	// Load default example once on mount only if graph is empty
	useEffect(() => {
		if (!hasLoadedDefault.current && nodes.length === 0) {
			loadGraph({
				nodes: defaultExample.nodes,
				edges: defaultExample.edges
			});
			hasLoadedDefault.current = true;
		}
	}, [loadGraph, nodes.length]);

	// Derived state: details panel opens when node is selected
	const isDetailsPanelOpen = Boolean(selectedNodeId);

	return (
		<ReactFlowProvider>
			<div className='flex-1 flex flex-col'>
				{/* Top Strip with stats and warnings */}
				<TopStrip
					onToggleLeftSidebar={() => dispatch({type: 'TOGGLE_LEFT_SIDEBAR'})}
					onToggleDetailsPanel={() => dispatch({type: 'TOGGLE_DETAILS_PANEL'})}
					onOpenWarnings={() => dispatch({type: 'OPEN_WARNINGS'})}
					onOpenExport={() => dispatch({type: 'OPEN_EXPORT'})}
				/>

				{/* Main editor area */}
				<div className='flex-1 flex overflow-hidden relative'>
					{/* Left Sidebar - Component palette */}
					<ComponentSidebar
						isOpen={panelState.isLeftSidebarOpen}
						onClose={() => dispatch({type: 'CLOSE_LEFT_SIDEBAR'})}
					/>

					{/* Center - Canvas */}
					<Canvas />

					{/* Right Sidebars - Details panel and Warnings panel */}
					<DetailsPanel
						isOpen={isDetailsPanelOpen}
						onClose={() => dispatch({type: 'CLOSE_DETAILS_PANEL'})}
					/>
					<WarningsPanel
						isOpen={panelState.isWarningsPanelOpen}
						onClose={() => dispatch({type: 'CLOSE_WARNINGS'})}
					/>
				</div>

				{/* Export Modal */}
				<ExportModal
					isOpen={panelState.isExportModalOpen}
					onClose={() => dispatch({type: 'CLOSE_EXPORT'})}
				/>
			</div>
		</ReactFlowProvider>
	);
}
