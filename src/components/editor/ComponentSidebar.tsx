import { 
  Brain, 
  Play, 
  Shield, 
  GitBranch, 
  Wrench, 
  Database, 
  UserCheck,
  type LucideIcon
} from 'lucide-react';
import type { PersonaNodeType, NodeConfig } from '../../types';
import { AGENT_CONFIGS, SYSTEM_CONFIGS } from '../../types';

// Icon mapping for node types
const nodeIcons: Record<PersonaNodeType, LucideIcon> = {
  planner: Brain,
  executor: Play,
  critic: Shield,
  router: GitBranch,
  tool: Wrench,
  memory: Database,
  humanCheckpoint: UserCheck,
};

interface DraggableNodeProps {
  config: NodeConfig;
}

function DraggableNode({ config }: DraggableNodeProps) {
  const Icon = nodeIcons[config.type];

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/personaflow-node', config.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-grab hover:bg-[var(--pf-bg-tertiary)] transition-colors group"
    >
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${config.color}20` }}
      >
        <Icon className="w-4 h-4" style={{ color: config.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[var(--pf-text-primary)] group-hover:text-white transition-colors">
          {config.label}
        </div>
      </div>
    </div>
  );
}

import { X } from 'lucide-react';

interface ComponentSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function ComponentSidebar({ isOpen = true, onClose }: ComponentSidebarProps) {
  return (
    <>
      {/* Mobile overlay - only show when sidebar is open */}
      {onClose && isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          style={{ top: '5rem' }} // Below navbar
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static
          top-20 lg:top-0 left-0
          h-[calc(100vh-5rem)] lg:h-auto
          w-64 sm:w-72 lg:w-56
          border-r border-[var(--pf-border)] 
          bg-[var(--pf-bg-primary)] 
          flex flex-col
          z-50 lg:z-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile header with close button */}
        {onClose && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--pf-border)] lg:hidden">
            <h2 className="text-sm font-semibold text-[var(--pf-text-primary)]">
              Components
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-[var(--pf-bg-tertiary)] text-[var(--pf-text-muted)] hover:text-[var(--pf-text-primary)] transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {/* Agents Section */}
          <div className="p-3">
            <h3 className="text-xs font-semibold text-[var(--pf-text-muted)] uppercase tracking-wider mb-2">
              Agents
            </h3>
            <div className="space-y-1">
              {AGENT_CONFIGS.map((config) => (
                <DraggableNode key={config.type} config={config} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--pf-border)] mx-3" />

          {/* System Components Section */}
          <div className="p-3">
            <h3 className="text-xs font-semibold text-[var(--pf-text-muted)] uppercase tracking-wider mb-2">
              System Components
            </h3>
            <div className="space-y-1">
              {SYSTEM_CONFIGS.map((config) => (
                <DraggableNode key={config.type} config={config} />
              ))}
            </div>
          </div>
        </div>

        {/* Help text */}
        <div className="p-3 border-t border-[var(--pf-border)]">
          <p className="text-xs text-[var(--pf-text-muted)] leading-relaxed">
            Drag and drop components to build your multi-agent architecture. Use connectors to define information flow.
          </p>
        </div>
      </div>
    </>
  );
}
