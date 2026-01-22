import { useAtomValue } from 'jotai';
import { AlertTriangle, Bot, CheckCircle, Database, Menu, Wrench } from 'lucide-react';
import { isValidSystemAtom, statsAtom, warningsAtom } from '../../atoms/graphAtoms';

interface TopStripProps {
  onToggleLeftSidebar?: () => void;
  onToggleDetailsPanel?: () => void;
  onOpenWarnings?: () => void;
}

export function TopStrip({ onToggleLeftSidebar, onToggleDetailsPanel, onOpenWarnings }: TopStripProps) {
  const stats = useAtomValue(statsAtom);
  const warnings = useAtomValue(warningsAtom);
  const isValid = useAtomValue(isValidSystemAtom);

  return (
    <div className="flex items-center justify-between px-2 sm:px-4 h-10 sm:h-10 border-b border-[var(--pf-border)] bg-[var(--pf-bg-secondary)]">
      {/* Left side: Mobile menu button, Workspace name and stats */}
      <div className="flex items-center gap-2 sm:gap-6 flex-1 min-w-0">
        {/* Mobile menu button */}
        {onToggleLeftSidebar && (
          <button
            onClick={onToggleLeftSidebar}
            className="lg:hidden p-1.5 rounded hover:bg-[var(--pf-bg-tertiary)] text-[var(--pf-text-secondary)] hover:text-[var(--pf-text-primary)] transition-colors"
            aria-label="Toggle components sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        
        <span className="text-xs sm:text-sm font-medium text-[var(--pf-text-primary)] hidden sm:inline">
          Workspace
        </span>
        
        <div className="flex items-center gap-2 sm:gap-4 text-xs flex-wrap">
          <div className="flex items-center gap-1 sm:gap-1.5 text-[var(--pf-text-secondary)]">
            <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">{stats.agents} AGENTS</span>
            <span className="xs:hidden">{stats.agents}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 text-[var(--pf-text-secondary)]">
            <Wrench className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">{stats.tools} TOOLS</span>
            <span className="xs:hidden">{stats.tools}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 text-[var(--pf-text-secondary)]">
            <Database className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">{stats.memory} MEMORY</span>
            <span className="xs:hidden">{stats.memory}</span>
          </div>
        </div>
      </div>

      {/* Right side: Warnings, validation status, and details toggle */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {warnings.length > 0 && (
          <button
            onClick={onOpenWarnings}
            className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded bg-[var(--pf-warning)]/10 text-[var(--pf-warning)] hover:bg-[var(--pf-warning)]/20 transition-colors cursor-pointer"
            aria-label="View warnings"
          >
            <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="text-xs font-medium hidden sm:inline">{warnings.length} Warning{warnings.length !== 1 ? 's' : ''}</span>
            <span className="text-xs font-medium sm:hidden">{warnings.length}</span>
          </button>
        )}
        
        <div className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded ${
          isValid 
            ? 'bg-[var(--pf-success)]/10 text-[var(--pf-success)]' 
            : 'bg-[var(--pf-error)]/10 text-[var(--pf-error)]'
        }`}>
          <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="text-xs font-medium hidden sm:inline">{isValid ? 'Valid System' : 'Invalid'}</span>
          <span className="text-xs font-medium sm:hidden">{isValid ? '✓' : '✗'}</span>
        </div>

        {/* Mobile details toggle button - only show if there's a way to open it */}
        {onToggleDetailsPanel && (
          <button
            onClick={onToggleDetailsPanel}
            className="lg:hidden p-1.5 rounded hover:bg-[var(--pf-bg-tertiary)] text-[var(--pf-text-secondary)] hover:text-[var(--pf-text-primary)] transition-colors"
            aria-label="Toggle details panel"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
