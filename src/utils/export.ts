import type { PersonaEdge, PersonaNode, PersonaFlowExport, ExportNode, ExportEdge } from '../types';

export interface JSONExportOptions {
  includeMetadata?: boolean;
  minifyOutput?: boolean;
  schemaVersion?: string;
}

/**
 * Export the current graph to a JSON schema
 */
export function exportToJSON(
  nodes: PersonaNode[], 
  edges: PersonaEdge[], 
  options: JSONExportOptions = {}
): string {
  const { includeMetadata = true, minifyOutput = false, schemaVersion = '1.0' } = options;

  const exportNodes: ExportNode[] = nodes.map((node) => ({
    id: node.id,
    type: node.data.personaType,
    name: node.data.name,
    position: node.position,
    meta: node.data.meta,
  }));

  const exportEdges: ExportEdge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    animated: edge.animated,
  }));

  const exportData: PersonaFlowExport = {
    version: schemaVersion,
    nodes: exportNodes,
    edges: exportEdges,
  };

  // Add metadata fields if enabled
  if (includeMetadata) {
    exportData.exportedAt = new Date().toISOString();
    exportData.name = 'PersonaFlow Export';
  }

  return minifyOutput 
    ? JSON.stringify(exportData) 
    : JSON.stringify(exportData, null, 2);
}

/**
 * Download a file with the given content and filename
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
  }
}
