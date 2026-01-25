import {useMemo, useState, useCallback} from 'react';
import {useAtomValue} from 'jotai';
import {edgesAtom, nodesAtom} from '../atoms/graphAtoms';
import {
	copyToClipboard,
	downloadFile,
	exportToJSON,
	type JSONExportOptions
} from '../utils/export';
import {
	generateLangGraphCode,
	type LangGraphCodegenOptions
} from '../utils/langgraphCodegen';

type TabType = 'langgraph' | 'json';

export function useExportCode() {
	const nodes = useAtomValue(nodesAtom);
	const edges = useAtomValue(edgesAtom);
	const [activeTab, setActiveTab] = useState<TabType>('langgraph');

	// LangGraph configuration options
	const [includeTypes, setIncludeTypes] = useState(true);
	const [includeLogging, setIncludeLogging] = useState(false);
	const [frameworkVersion, setFrameworkVersion] = useState('latest');

	// JSON configuration options
	const [includeMetadata, setIncludeMetadata] = useState(true);
	const [minifyOutput, setMinifyOutput] = useState(false);
	const [schemaVersion, setSchemaVersion] = useState('1.0');

	// Generate code based on active tab
	const generatedCode = useMemo(() => {
		if (nodes.length === 0) {
			return '// No nodes in graph. Add some components to generate code.';
		}

		if (activeTab === 'json') {
			const options: JSONExportOptions = {
				includeMetadata,
				minifyOutput,
				schemaVersion
			};
			return exportToJSON(nodes, edges, options);
		} else {
			const options: LangGraphCodegenOptions = {
				includeTypes,
				includeLogging,
				frameworkVersion
			};
			return generateLangGraphCode(nodes, edges, options);
		}
	}, [
		nodes,
		edges,
		activeTab,
		includeTypes,
		includeLogging,
		frameworkVersion,
		includeMetadata,
		minifyOutput,
		schemaVersion
	]);

	const handleDownload = useCallback(() => {
		const filename = activeTab === 'langgraph' ? 'workflow.py' : 'workflow.json';
		const mimeType = activeTab === 'langgraph' ? 'text/x-python' : 'application/json';
		downloadFile(generatedCode, filename, mimeType);
	}, [activeTab, generatedCode]);

	const handleCopy = useCallback(async () => {
		await copyToClipboard(generatedCode);
	}, [generatedCode]);

	return {
		activeTab,
		setActiveTab,
		generatedCode,
		includeTypes,
		setIncludeTypes,
		includeLogging,
		setIncludeLogging,
		frameworkVersion,
		setFrameworkVersion,
		includeMetadata,
		setIncludeMetadata,
		minifyOutput,
		setMinifyOutput,
		schemaVersion,
		setSchemaVersion,
		handleDownload,
		handleCopy
	};
}
