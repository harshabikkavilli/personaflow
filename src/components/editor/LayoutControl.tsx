import { ControlButton, useReactFlow } from '@xyflow/react';
import { useAtom } from 'jotai';
import { Wand2 } from 'lucide-react';
import { edgesAtom, nodesAtom } from '../../atoms/graphAtoms';
import type { PersonaNode } from '../../types';
import { applyAgentSystemLayout, type LayoutDirection } from '../../utils/layout';

interface LayoutControlProps {
  direction?: LayoutDirection;
}

export function LayoutControl({ direction = 'TB' }: LayoutControlProps) {
  const { getNodes, setNodes, fitView } = useReactFlow();
  const [, setNodesAtom] = useAtom(nodesAtom);
  const [edges] = useAtom(edgesAtom);

  const handleLayout = () => {
    // Get current nodes from React Flow (they may have been moved)
    const currentNodes = getNodes() as PersonaNode[];
    
    // Apply layout
    const layoutedNodes = applyAgentSystemLayout(currentNodes, edges, direction);
    
    // Update nodes in both React Flow and Jotai
    setNodes(layoutedNodes);
    setNodesAtom(layoutedNodes);
    
    // Fit view after layout
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 400 });
    }, 0);
  };

  return (
    <ControlButton
      onClick={handleLayout}
      title="Auto-layout graph (TB)"
      aria-label="Auto-layout graph"
    >
      <Wand2 className="w-4 h-4" />
    </ControlButton>
  );
}
