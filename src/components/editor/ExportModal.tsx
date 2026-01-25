import {useAtomValue, useSetAtom} from 'jotai';
import {
	Braces,
	Check,
	ChevronDown,
	Code,
	Copy,
	Download,
	FileText,
	Info,
	Terminal
} from 'lucide-react';
import {useState} from 'react';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {isExportModalOpenAtom, closeExportModalAtom} from '../../atoms/uiAtoms';
import {useExportCode} from '../../hooks/useExportCode';
import {useModalKeyboard} from '../../hooks/useModalKeyboard';
import {Modal} from '../ui/Modal';

type TabType = 'langgraph' | 'json';

// Toggle switch component
function Toggle({
	checked,
	onChange,
	label,
	description
}: {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label: string;
	description?: string;
}) {
	return (
		<div className='flex items-center justify-between'>
			<div className='flex flex-col'>
				<span className='text-sm font-medium text-[var(--pf-text-primary)]'>
					{label}
				</span>
				{description && (
					<span className='text-xs text-[var(--pf-text-muted)]'>
						{description}
					</span>
				)}
			</div>
			<button
				type='button'
				onClick={() => onChange(!checked)}
				className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--pf-primary-gradient)] focus:ring-offset-2 focus:ring-offset-[var(--pf-bg-secondary)] ${
					checked ? 'bg-[var(--pf-primary-gradient)]' : 'bg-[var(--pf-border)]'
				}`}
				role='switch'
				aria-checked={checked}>
				<span
					className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
						checked ? 'translate-x-6' : 'translate-x-1'
					}`}
				/>
			</button>
		</div>
	);
}

export function ExportModal() {
	const isOpen = useAtomValue(isExportModalOpenAtom);
	const closeModal = useSetAtom(closeExportModalAtom);
	const [activeTab, setActiveTab] = useState<TabType>('langgraph');
	const [copied, setCopied] = useState(false);

	const {
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
		handleCopy: handleCopyCode
	} = useExportCode();

	useModalKeyboard(closeModal, isOpen);

	const handleCopy = async () => {
		await handleCopyCode();
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const filename = activeTab === 'langgraph' ? 'workflow.py' : 'workflow.json';

	const footer = (
		<>
			<button className='flex items-center gap-2 text-sm font-medium text-[var(--pf-text-muted)] hover:text-[var(--pf-text-primary)] transition-colors'>
				<FileText className='w-4 h-4' />
				Documentation
			</button>
			<div className='flex items-center gap-3'>
				<button
					onClick={handleDownload}
					className='px-4 py-2 text-sm font-medium bg-[var(--pf-bg-tertiary)] hover:bg-[var(--pf-border)] transition-colors rounded-md flex items-center gap-2 text-[var(--pf-text-primary)]'>
					<Download className='w-5 h-5' />
					Download {activeTab === 'langgraph' ? '.py' : '.json'}
				</button>
				<button
					onClick={handleCopy}
					className={`px-5 py-2 text-sm font-medium transition-all shadow-lg rounded-md flex items-center gap-2 ${
						copied
							? 'bg-[var(--pf-success)] text-white shadow-[var(--pf-success)]/20'
							: 'bg-[var(--pf-primary-gradient)] hover:opacity-90 text-white shadow-[var(--pf-primary-gradient)]/20'
					}`}>
					{copied ? <Check className='w-5 h-5' /> : <Copy className='w-5 h-5' />}
					Copy to Clipboard
				</button>
			</div>
		</>
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={closeModal}
			title="Export Code"
			subtitle="Generate and download architecture implementation"
			footer={footer}
			icon={<Terminal className='w-5 h-5 text-[var(--pf-primary-gradient)]' />}>
			{/* Tabs */}
			<div className='flex border-b border-[var(--pf-border)] px-6 bg-[var(--pf-bg-primary)] flex-shrink-0'>
				<button
					onClick={() => {
						setActiveTab('langgraph');
						setCopied(false);
					}}
					className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
						activeTab === 'langgraph'
							? 'border-[var(--pf-primary-gradient)] text-[var(--pf-primary-gradient)] bg-[var(--pf-primary-gradient)]/5'
							: 'border-transparent text-[var(--pf-text-muted)] hover:text-[var(--pf-text-secondary)] hover:bg-[var(--pf-bg-tertiary)]'
					}`}>
					<Code className='w-4 h-4' />
					LangGraph (Python)
				</button>
				<button
					onClick={() => {
						setActiveTab('json');
						setCopied(false);
					}}
					className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
						activeTab === 'json'
							? 'border-[var(--pf-primary-gradient)] text-[var(--pf-primary-gradient)] bg-[var(--pf-primary-gradient)]/5'
							: 'border-transparent text-[var(--pf-text-muted)] hover:text-[var(--pf-text-secondary)] hover:bg-[var(--pf-bg-tertiary)]'
					}`}>
					<Braces className='w-4 h-4' />
					JSON Schema
				</button>
			</div>

			{/* Main Content */}
			<div className='flex-1 flex overflow-hidden min-h-0'>
				{/* Code Display */}
				<div className='flex-1 flex flex-col min-w-0 bg-[var(--pf-bg-primary)] overflow-hidden relative'>
					{/* Code viewer */}
					<div className='flex-1 overflow-y-auto overflow-x-auto group min-h-0'>
						{/* Sticky filename badge */}
						<div className='sticky top-4 right-4 p-4 flex justify-end pointer-events-none z-10'>
							<div className='bg-[var(--pf-bg-secondary)]/80 backdrop-blur px-3 py-1 rounded text-xs font-mono text-[var(--pf-text-muted)] border border-[var(--pf-border)]'>
								{filename}
							</div>
						</div>

						<div className='px-6 pb-6'>
							<SyntaxHighlighter
								language={activeTab === 'langgraph' ? 'python' : 'json'}
								style={vscDarkPlus}
								customStyle={{
									margin: 0,
									padding: 0,
									background: 'transparent',
									fontSize: '0.875rem',
									lineHeight: '1.75'
								}}
								codeTagProps={{
									style: {
										fontFamily:
											'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'
									}
								}}>
								{generatedCode}
							</SyntaxHighlighter>
						</div>
					</div>
				</div>

				{/* Configuration Sidebar */}
				<div className='w-80 border-l border-[var(--pf-border)] p-6 flex flex-col gap-8 bg-[var(--pf-bg-primary)] overflow-y-auto flex-shrink-0'>
					<div>
						<h3 className='text-sm font-semibold uppercase tracking-wider text-[var(--pf-text-muted)] mb-4'>
							Configuration
						</h3>

						{activeTab === 'langgraph' ? (
							<div className='space-y-6'>
								<Toggle
									checked={includeTypes}
									onChange={setIncludeTypes}
									label='Include types'
									description='Adds Python type hints'
								/>

								<Toggle
									checked={includeLogging}
									onChange={setIncludeLogging}
									label='Logging boilerplates'
									description='Enable verbose execution logs'
								/>

								{/* Framework version dropdown */}
								<div className='flex flex-col gap-2'>
									<label className='text-sm font-medium text-[var(--pf-text-primary)]'>
										Framework version
									</label>
									<div className='relative'>
										<select
											value={frameworkVersion}
											onChange={(e) => setFrameworkVersion(e.target.value)}
											className='w-full bg-[var(--pf-bg-secondary)] border border-[var(--pf-border)] rounded-md text-sm px-3 py-2 appearance-none focus:ring-[var(--pf-primary-gradient)] focus:border-[var(--pf-primary-gradient)] outline-none text-[var(--pf-text-primary)] cursor-pointer'>
											<option value='latest'>
												LangGraph 0.1.0 (Latest)
											</option>
											<option value='0.2.x'>LangGraph 0.0.9</option>
											<option value='0.1.x'>Legacy (LCEL)</option>
										</select>
										<ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pf-text-muted)] pointer-events-none' />
									</div>
								</div>
							</div>
						) : (
							<div className='space-y-6'>
								<Toggle
									checked={includeMetadata}
									onChange={setIncludeMetadata}
									label='Include metadata'
									description='Add author, dates, and names'
								/>

								<Toggle
									checked={minifyOutput}
									onChange={setMinifyOutput}
									label='Minify output'
									description='Remove all whitespace'
								/>

								{/* Schema version dropdown */}
								<div className='flex flex-col gap-2'>
									<label className='text-sm font-medium text-[var(--pf-text-primary)]'>
										Schema version
									</label>
									<div className='relative'>
										<select
											value={schemaVersion}
											onChange={(e) => setSchemaVersion(e.target.value)}
											className='w-full bg-[var(--pf-bg-secondary)] border border-[var(--pf-border)] rounded-md text-sm px-3 py-2 appearance-none focus:ring-[var(--pf-primary-gradient)] focus:border-[var(--pf-primary-gradient)] outline-none text-[var(--pf-text-primary)] cursor-pointer'>
											<option value='1.0'>v1.0 (Current)</option>
											<option value='0.9'>v0.9</option>
										</select>
										<ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pf-text-muted)] pointer-events-none' />
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Info box */}
					<div className='mt-auto'>
						{activeTab === 'langgraph' ? (
							<div className='bg-[var(--pf-primary-gradient)]/10 p-4 rounded-lg border border-[var(--pf-primary-gradient)]/20'>
								<div className='flex gap-2 text-[var(--pf-primary-gradient)] mb-2'>
									<Info className='w-[18px] h-[18px]' />
									<span className='text-xs font-semibold uppercase'>
										Pro Tip
									</span>
								</div>
								<p className='text-xs text-[var(--pf-text-secondary)] leading-relaxed'>
									You can customize the environment variables and API keys
									in the generated code before deployment.
								</p>
							</div>
						) : (
							<div className='bg-[var(--pf-primary-gradient)]/10 p-4 rounded-lg border border-[var(--pf-primary-gradient)]/20'>
								<div className='flex gap-2 text-[var(--pf-primary-gradient)] mb-2'>
									<Info className='w-[18px] h-[18px]' />
									<span className='text-xs font-semibold uppercase'>
										Structure Info
									</span>
								</div>
								<p className='text-xs text-[var(--pf-text-secondary)] leading-relaxed'>
									The JSON schema identifies the graph structure including
									node types and edge relations for cross-platform
									portability.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
}
