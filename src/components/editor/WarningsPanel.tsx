import {useAtomValue, useSetAtom} from 'jotai';
import {warningsAtom} from '../../atoms/graphAtoms';
import {isWarningsPanelOpenAtom, closeWarningsPanelAtom} from '../../atoms/uiAtoms';
import {WarningsList} from './WarningsList';
import {Panel} from '../ui/Panel';

export function WarningsPanel() {
	const warnings = useAtomValue(warningsAtom);
	const isOpen = useAtomValue(isWarningsPanelOpenAtom);
	const closePanel = useSetAtom(closeWarningsPanelAtom);

	return (
		<Panel
			isOpen={isOpen}
			onClose={() => closePanel()}
			title="System Warnings"
			position="right"
			width="w-full sm:w-96 lg:w-80"
			className="z-[45]">
			<div className="flex-1 overflow-auto">
				<WarningsList warnings={warnings} />
			</div>
		</Panel>
	);
}
