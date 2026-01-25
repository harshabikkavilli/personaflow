import { atom } from 'jotai';
import { selectedNodeIdAtom } from './graphAtoms';

// Panel visibility state atoms
export const isLeftSidebarOpenAtom = atom<boolean>(true); // Left sidebar should be open by default
export const isDetailsPanelOpenAtom = atom<boolean>((get) => {
  // Details panel is open when a node is selected
  return get(selectedNodeIdAtom) !== null;
});
export const isWarningsPanelOpenAtom = atom<boolean>(false);
export const isExportModalOpenAtom = atom<boolean>(false);

// Action atoms for toggling panels
export const toggleLeftSidebarAtom = atom(
  null,
  (get, set) => {
    const current = get(isLeftSidebarOpenAtom);
    set(isLeftSidebarOpenAtom, !current);
  }
);

export const toggleDetailsPanelAtom = atom(
  null,
  (get, set) => {
    // Toggle by clearing selection if a node is selected, otherwise do nothing
    const selectedId = get(selectedNodeIdAtom);
    if (selectedId !== null) {
      set(selectedNodeIdAtom, null);
    }
  }
);

export const openWarningsPanelAtom = atom(
  null,
  (_get, set) => {
    set(isWarningsPanelOpenAtom, true);
  }
);

export const closeWarningsPanelAtom = atom(
  null,
  (_get, set) => {
    set(isWarningsPanelOpenAtom, false);
  }
);

export const openExportModalAtom = atom(
  null,
  (_get, set) => {
    set(isExportModalOpenAtom, true);
  }
);

export const closeExportModalAtom = atom(
  null,
  (_get, set) => {
    set(isExportModalOpenAtom, false);
  }
);

export const closeLeftSidebarAtom = atom(
  null,
  (_get, set) => {
    set(isLeftSidebarOpenAtom, false);
  }
);

export const closeDetailsPanelAtom = atom(
  null,
  (_get, set) => {
    // Close details panel by clearing the selected node
    set(selectedNodeIdAtom, null);
  }
);
