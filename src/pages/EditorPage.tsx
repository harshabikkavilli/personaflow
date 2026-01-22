import { useEffect, useState } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { ReactFlowProvider } from '@xyflow/react';
import { TopStrip } from '../components/editor/TopStrip';
import { ComponentSidebar } from '../components/editor/ComponentSidebar';
import { Canvas } from '../components/editor/Canvas';
import { DetailsPanel } from '../components/editor/DetailsPanel';
import { WarningsPanel } from '../components/editor/WarningsPanel';
import { loadGraphAtom, selectedNodeIdAtom } from '../atoms/graphAtoms';
import { defaultExample } from '../data/examples';

export function EditorPage() {
  const loadGraph = useSetAtom(loadGraphAtom);
  const selectedNodeId = useAtomValue(selectedNodeIdAtom);
  // Sidebars closed by default on mobile, open on desktop
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [isWarningsPanelOpen, setIsWarningsPanelOpen] = useState(false);
  
  // Auto-open details panel when a node is selected, close when deselected
  useEffect(() => {
    if (selectedNodeId) {
      setIsDetailsPanelOpen(true);
    } else {
      setIsDetailsPanelOpen(false);
    }
  }, [selectedNodeId]);

  // Load default example on mount
  useEffect(() => {
    loadGraph({
      nodes: defaultExample.nodes,
      edges: defaultExample.edges,
    });
  }, [loadGraph]);

  return (
    <ReactFlowProvider>
      <div className="flex-1 flex flex-col">
        {/* Top Strip with stats and warnings */}
        <TopStrip 
          onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          onToggleDetailsPanel={() => setIsDetailsPanelOpen(!isDetailsPanelOpen)}
          onOpenWarnings={() => setIsWarningsPanelOpen(true)}
        />
        
        {/* Main editor area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Sidebar - Component palette */}
          <ComponentSidebar 
            isOpen={isLeftSidebarOpen}
            onClose={() => setIsLeftSidebarOpen(false)}
          />
          
          {/* Center - Canvas */}
          <Canvas />
          
          {/* Right Sidebars - Details panel and Warnings panel */}
          {/* On desktop, they can stack; on mobile, only one shows at a time */}
          <DetailsPanel 
            isOpen={isDetailsPanelOpen}
            onClose={() => setIsDetailsPanelOpen(false)}
          />
          <WarningsPanel 
            isOpen={isWarningsPanelOpen}
            onClose={() => setIsWarningsPanelOpen(false)}
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
