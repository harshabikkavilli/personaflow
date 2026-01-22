import { useAtomValue } from 'jotai';
import { X } from 'lucide-react';
import { selectedNodeAtom } from '../../atoms/graphAtoms';
import { getNodeConfig } from '../../types';

interface DetailsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DetailsPanel({ isOpen = false, onClose }: DetailsPanelProps) {
  const selectedNode = useAtomValue(selectedNodeAtom);

  // Only show if a node is selected
  if (!selectedNode) {
    return null;
  }

  const nodeConfig = getNodeConfig(selectedNode.data.personaType);
  const { name, meta } = selectedNode.data;

  return (
    <>
      {/* Mobile overlay - only show when panel is open */}
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
          z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--pf-border)]">
          <h2 className="text-sm font-semibold text-[var(--pf-text-primary)]">
            Component Details
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
          <DetailSection title="Responsibilities">
            <p className="text-sm text-[var(--pf-text-secondary)]">{meta.responsibilities}</p>
          </DetailSection>
        )}

        {/* Logic & Thresholds */}
        {meta.logicConfig && Object.keys(meta.logicConfig).length > 0 && (
          <DetailSection title="Logic & Thresholds" defaultOpen>
            <div className="bg-[var(--pf-bg-secondary)] rounded-lg p-3 font-mono text-xs">
              {Object.entries(meta.logicConfig).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1">
                  <span className="text-[var(--pf-text-muted)]">{key}</span>
                  <span className="text-[var(--pf-planner)]">{String(value)}</span>
                </div>
              ))}
            </div>
          </DetailSection>
        )}

        {/* Input Schema */}
        {meta.inputSchema && Object.keys(meta.inputSchema).length > 0 && (
          <DetailSection title="Input Schema" defaultOpen>
            <pre className="bg-[var(--pf-bg-secondary)] rounded-lg p-3 font-mono text-xs text-[var(--pf-text-secondary)] overflow-auto">
              {JSON.stringify(meta.inputSchema, null, 2)}
            </pre>
          </DetailSection>
        )}

        {/* Output Destinations */}
        {meta.outputDestinations && meta.outputDestinations.length > 0 && (
          <DetailSection title="Output Destinations">
            <div className="space-y-1">
              {meta.outputDestinations.map((dest, i) => (
                <div key={i} className="text-sm text-[var(--pf-text-secondary)]">
                  {dest}
                </div>
              ))}
            </div>
          </DetailSection>
        )}

        {/* Potential Risks */}
        {meta.risks && meta.risks.length > 0 && (
          <DetailSection title="Potential Risks">
            <ul className="space-y-1">
              {meta.risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--pf-text-secondary)]">
                  <span className="text-[var(--pf-warning)] mt-1">•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </DetailSection>
        )}
      </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--pf-border)]">
          <button className="w-full py-2 px-4 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Configure Node Logic
          </button>
        </div>
      </div>
    </>
  );
}

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function DetailSection({ title, children, defaultOpen = false }: DetailSectionProps) {
  return (
    <details open={defaultOpen} className="group">
      <summary className="flex items-center justify-between cursor-pointer text-xs font-semibold text-[var(--pf-text-muted)] uppercase tracking-wider mb-2 list-none">
        {title}
        <span className="text-[var(--pf-text-muted)] group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>
      {children}
    </details>
  );
}
