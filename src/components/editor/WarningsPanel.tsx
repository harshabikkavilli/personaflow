import { useAtomValue } from 'jotai';
import { X } from 'lucide-react';
import { warningsAtom } from '../../atoms/graphAtoms';
import { WarningsList } from './WarningsList';

interface WarningsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function WarningsPanel({ isOpen = false, onClose }: WarningsPanelProps) {
  const warnings = useAtomValue(warningsAtom);

  return (
    <>
      {/* Overlay - only show when panel is open (on mobile) */}
      {onClose && isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[44] lg:hidden transition-opacity duration-300"
          onClick={onClose}
          style={{ top: '5rem' }} // Below navbar
        />
      )}

      <div
        className={`
          fixed
          top-20 right-0
          h-[calc(100vh-5rem)]
          w-full sm:w-96 lg:w-80
          max-w-sm lg:max-w-none
          border-l border-[var(--pf-border)] 
          bg-[var(--pf-bg-primary)] 
          flex flex-col
          z-[45]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--pf-border)]">
          <h2 className="text-sm font-semibold text-[var(--pf-text-primary)]">
            System Warnings
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-[var(--pf-bg-tertiary)] text-[var(--pf-text-muted)] hover:text-[var(--pf-text-primary)] transition-colors"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-auto">
          <WarningsList warnings={warnings} />
        </div>
      </div>
    </>
  );
}
