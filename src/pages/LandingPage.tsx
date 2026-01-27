import {ReactFlowProvider} from '@xyflow/react';
import {
	ArrowRight,
	CheckCircle,
	Github,
	Network,
	Play,
	Scale,
	Shield,
	Sparkles,
	Users,
	Workflow
} from 'lucide-react';
import {Link} from 'react-router-dom';
import {GraphPreview} from '../components/ui/GraphPreview';
import {ItemCard} from '../components/ui/ItemCard';
import {defaultExample, examples} from '../data/examples';

// Featured templates to showcase
const featuredTemplates = [
	examples.find((e) => e.id === 'sequential-planner'),
	examples.find((e) => e.id === 'agentic-rag'),
	examples.find((e) => e.id === 'multi-agent-debate')
].filter(Boolean);

// Features for the features section
const features = [
	{
		icon: Workflow,
		title: 'Design-First Workflow',
		desc: 'Map out complex state machines and multi-step reasoning before writing a single line of agent code.',
		color:
			'bg-[var(--pf-planner)]/10 border-[var(--pf-planner)] text-[var(--pf-planner)]'
	},
	{
		icon: Network,
		title: 'Framework Agnostic',
		desc: 'Export to LangGraph, CrewAI, or vanilla Python. We focus on the logic, you choose the runtime.',
		color:
			'bg-[var(--pf-critic)]/10 border-[var(--pf-critic)] text-[var(--pf-critic)]'
	},
	{
		icon: Shield,
		title: 'Risk-Aware Verifiers',
		desc: 'Built-in nodes for human-in-the-loop and automated verification to prevent hallucination cycles.',
		color:
			'bg-[var(--pf-human)]/10 border-[var(--pf-human)] text-[var(--pf-human)]'
	}
];

// Read-only React Flow preview component for hero section
const HeroGraphPreview = () => {
	return (
		<GraphPreview
			nodes={defaultExample.nodes}
			edges={defaultExample.edges}
			height='500px'
			fitViewOptions={{padding: 0.15, maxZoom: 1.1, minZoom: 0.5}}
			interactive={false}
		/>
	);
};

export function LandingPage() {
	return (
		<div className='flex-1 flex flex-col'>
			{/* Hero Section */}
			<section className='relative h-screen pt-12 sm:pt-20 pb-16 sm:pb-32 overflow-hidden flex items-center'>
				<div className='max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center'>
					<div className='z-10'>
						<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--pf-primary-gradient)]/10 border border-[var(--pf-primary-gradient)]/20 text-[var(--pf-primary-gradient)] text-xs font-semibold mb-6'>
							<span className='flex h-2 w-2 rounded-full bg-[var(--pf-primary-gradient)] animate-pulse'></span>
							Multi-Agent Visual Designer
						</div>
						<h1 className='text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight'>
							Design Multi-Agent Systems{' '}
							<span
								className='text-transparent bg-clip-text'
								style={{
									backgroundImage: 'linear-gradient(to right, #818cf8, #a78bfa)'
								}}>
								with Precision
							</span>
						</h1>
						<p className='text-lg sm:text-xl text-[var(--pf-text-secondary)] mb-10 leading-relaxed max-w-xl'>
							PersonaFlow is a visual workspace for designing, validating, and
							documenting multi-agent architectures, before you write or run a
							single line of agent code.
						</p>
						<div className='flex flex-wrap gap-4'>
							<Link
								to='/editor'
								className='px-4 py-4 bg-[var(--pf-primary-gradient)] hover:opacity-90 text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[var(--pf-primary-gradient)]/20'>
								Open Editor
								<ArrowRight className='w-5 h-5' />
							</Link>
							<Link
								to='/examples'
								className='px-8 py-4 bg-[var(--pf-bg-secondary)] border border-[var(--pf-border)] hover:border-[var(--pf-text-muted)] font-semibold rounded-xl transition-all'>
								Browse Templates
							</Link>
						</div>
						<p className='text-sm text-[var(--pf-text-muted)] mt-4 italic'>
							Runs locally in your browser. No accounts. No API keys.
						</p>
					</div>
					{/* Graph Preview - Hidden on mobile, shown on md+ */}
					<div className='relative pointer-events-none'>
						<div className='absolute inset-0 bg-[var(--pf-primary-gradient)]/20 blur-[120px] rounded-full'></div>
						<div className='relative bg-[var(--pf-bg-primary)] border border-[var(--pf-border)] rounded-2xl shadow-2xl overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]'>
							<ReactFlowProvider>
								<HeroGraphPreview />
							</ReactFlowProvider>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className='py-20 px-6 bg-[var(--pf-bg-surface)]/50'>
				<div className='max-w-7xl mx-auto'>
					<div className='text-center max-w-3xl mx-auto mb-12'>
						<h2 className='text-4xl font-bold mb-4 tracking-tight'>
							Built for Modern AI Teams
						</h2>
						<p className='text-[var(--pf-text-secondary)]'>
							Everything you need to design, validate, and deploy
							production-ready multi-agent systems.
						</p>
					</div>
					<div className='grid md:grid-cols-3 gap-6'>
						{features.map((feature, index) => {
							const Icon = feature.icon;
							return (
								<ItemCard
									key={index}
									icon={<Icon className='w-6 h-6' />}
									title={feature.title}
									desc={feature.desc}
									color={feature.color}
								/>
							);
						})}
					</div>
				</div>
			</section>

			{/* Process Section */}
			<section className='py-20 px-6'>
				<div className='max-w-7xl mx-auto'>
					<div className='text-center max-w-3xl mx-auto mb-20'>
						<h2 className='text-4xl font-bold mb-4 tracking-tight'>
							From Design to Implementation
						</h2>
						<p className='text-[var(--pf-text-secondary)]'>
							PersonaFlow fits at the start of your agent development workflow.
						</p>
					</div>
					<div className='grid md:grid-cols-3 gap-8 relative'>
						<div className='hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--pf-border)] to-transparent -translate-y-24'></div>
						<div className='relative z-10 flex flex-col items-center text-center'>
							<div className='w-16 h-16 rounded-2xl bg-[var(--pf-bg-secondary)] border-2 border-[var(--pf-border)] flex items-center justify-center mb-8 shadow-xl'>
								<span className='text-2xl font-mono text-[var(--pf-primary-gradient)] font-bold'>
									01
								</span>
							</div>
							<h4 className='text-lg font-bold mb-2'>Design</h4>
							<p className='text-sm text-[var(--pf-text-secondary)] px-4'>
								Visually compose agents, tools, memory, and control flow to
								define how your system should think and act.
							</p>
						</div>
						<div className='relative z-10 flex flex-col items-center text-center'>
							<div className='w-16 h-16 rounded-2xl bg-[var(--pf-bg-secondary)] border-2 border-[var(--pf-border)] flex items-center justify-center mb-8 shadow-xl'>
								<span className='text-2xl font-mono text-[var(--pf-primary-gradient)] font-bold'>
									02
								</span>
							</div>
							<h4 className='text-lg font-bold mb-2'>Implement</h4>
							<p className='text-sm text-[var(--pf-text-secondary)] px-4'>
								Translate the design into LangGraph, CrewAI, or custom code with
								a clear architectural blueprint.
							</p>
						</div>
						<div className='relative z-10 flex flex-col items-center text-center'>
							<div className='w-16 h-16 rounded-2xl bg-[var(--pf-bg-secondary)] border-2 border-[var(--pf-border)] flex items-center justify-center mb-8 shadow-xl'>
								<span className='text-2xl font-mono text-[var(--pf-primary-gradient)] font-bold'>
									03
								</span>
							</div>
							<h4 className='text-lg font-bold mb-2'>Run & Observe</h4>
							<p className='text-sm text-[var(--pf-text-secondary)] px-4'>
								Execute and trace your system using LangSmith or your existing
								observability stack — grounded in a design you trust.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Templates Section */}
			<section className='py-20 px-6 bg-[var(--pf-bg-surface)]/50'>
				<div className='max-w-7xl mx-auto'>
					<div className='flex items-center justify-between mb-12'>
						<div>
							<h2 className='text-3xl font-bold mb-2'>Proven Architectures</h2>
							<p className='text-[var(--pf-text-secondary)]'>
								Start from industry-standard multi-agent patterns.
							</p>
						</div>
						<Link
							to='/examples'
							className='text-[var(--pf-primary-gradient)] font-semibold flex items-center gap-1 hover:underline'>
							Browse All
							<ArrowRight className='w-4 h-4' />
						</Link>
					</div>
					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{featuredTemplates.map((template) => {
							if (!template) return null;
							const difficultyColors: Record<string, string> = {
								Beginner: 'bg-green-500/10 text-green-500',
								Intermediate: 'bg-orange-500/10 text-orange-500',
								Advanced: 'bg-red-500/10 text-red-500'
							};
							const frameworkColors: Record<string, string> = {
								LangGraph: 'bg-blue-500/10 text-blue-500',
								CrewAI: 'bg-purple-500/10 text-purple-500',
								'Framework-agnostic': 'bg-purple-500/10 text-purple-500'
							};

							// Custom preview for each template type
							const renderPreview = () => {
								if (template.id === 'sequential-planner') {
									return (
										<div className='flex items-center gap-4'>
											<div className='w-8 h-8 rounded-md bg-[var(--pf-planner)]/20 border border-[var(--pf-planner)] flex items-center justify-center'>
												<Sparkles className='w-4 h-4 text-[var(--pf-planner)]' />
											</div>
											<span className='w-8 h-px bg-[var(--pf-border)]'></span>
											<div className='w-8 h-8 rounded-md bg-[var(--pf-executor)]/20 border border-[var(--pf-executor)] flex items-center justify-center'>
												<Play className='w-4 h-4 text-[var(--pf-executor)]' />
											</div>
										</div>
									);
								}
								if (template.id === 'multi-agent-debate') {
									return (
										<div className='flex flex-col items-center gap-4'>
											<div className='flex gap-4'>
												<div className='w-8 h-8 rounded-full bg-[var(--pf-critic)]/20 border border-[var(--pf-critic)] flex items-center justify-center'>
													<Users className='w-4 h-4 text-[var(--pf-critic)]' />
												</div>
												<div className='w-8 h-8 rounded-full bg-[var(--pf-critic)]/20 border border-[var(--pf-critic)] flex items-center justify-center'>
													<Users className='w-4 h-4 text-[var(--pf-critic)]' />
												</div>
											</div>
											<div className='w-8 h-8 rounded-md bg-[var(--pf-memory)]/20 border border-[var(--pf-memory)] flex items-center justify-center'>
												<Scale className='w-4 h-4 text-[var(--pf-memory)]' />
											</div>
										</div>
									);
								}
								if (template.id === 'agentic-rag') {
									return (
										<div className='grid grid-cols-2 gap-2'>
											<div className='w-6 h-6 bg-[var(--pf-bg-primary)] rounded'></div>
											<div className='w-6 h-6 bg-[var(--pf-bg-primary)] rounded'></div>
											<div className='w-6 h-6 bg-[var(--pf-bg-primary)] rounded'></div>
											<div className='w-6 h-6 bg-[var(--pf-primary-gradient)] rounded animate-pulse'></div>
										</div>
									);
								}
								// Default preview
								return (
									<div className='flex gap-3'>
										{template.nodeTypes.slice(0, 2).map((type, idx) => {
											const colors: Record<string, string> = {
												planner:
													'bg-[var(--pf-planner)]/20 border-[var(--pf-planner)]',
												executor:
													'bg-[var(--pf-executor)]/20 border-[var(--pf-executor)]',
												critic:
													'bg-[var(--pf-critic)]/20 border-[var(--pf-critic)]',
												memory:
													'bg-[var(--pf-memory)]/20 border-[var(--pf-memory)]',
												router:
													'bg-[var(--pf-router)]/20 border-[var(--pf-router)]',
												tool: 'bg-gray-500/20 border-gray-500',
												humanCheckpoint:
													'bg-[var(--pf-human)]/20 border-[var(--pf-human)]'
											};
											return (
												<div
													key={idx}
													className={`w-8 h-8 rounded ${
														colors[type] || 'bg-gray-500/20 border-gray-500'
													} border`}></div>
											);
										})}
									</div>
								);
							};

							return (
								<Link
									key={template.id}
									to='/examples'
									className='group bg-[var(--pf-bg-secondary)] rounded-2xl border border-[var(--pf-border)] overflow-hidden hover:border-[var(--pf-primary-gradient)]/50 transition-all duration-300 hover:-translate-y-1'>
									<div className='aspect-video bg-[var(--pf-bg-primary)]/20 graph-preview-dots p-6 flex items-center justify-center'>
										{renderPreview()}
									</div>
									<div className='p-6'>
										<div className='flex gap-2 mb-4'>
											<span
												className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
													frameworkColors[template.framework] ||
													'bg-gray-500/10 text-gray-500'
												}`}>
												{template.framework}
											</span>
											<span
												className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
													difficultyColors[template.difficulty] ||
													'bg-gray-500/10 text-gray-500'
												}`}>
												{template.difficulty}
											</span>
										</div>
										<h3 className='font-bold text-lg mb-2'>{template.name}</h3>
										<p className='text-sm text-[var(--pf-text-secondary)] line-clamp-2'>
											{template.description}
										</p>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className='py-20 bg-[var(--pf-bg-primary)]'>
				<div className='max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 bg-[var(--pf-bg-secondary)]/50 p-8 md:p-12 rounded-3xl border border-[var(--pf-border)]'>
					<div>
						<h2 className='text-3xl font-bold mb-4'>
							Built for Engineers Who Care About Architecture
						</h2>
						<ul className='space-y-3'>
							<li className='flex items-center gap-3 text-[var(--pf-text-secondary)]'>
								<CheckCircle className='w-5 h-5 text-[var(--pf-primary-gradient)]' />
								Open-source and local-first
							</li>
							<li className='flex items-center gap-3 text-[var(--pf-text-secondary)]'>
								<CheckCircle className='w-5 h-5 text-[var(--pf-primary-gradient)]' />
								Explicit control flow and reasoning
							</li>
							<li className='flex items-center gap-3 text-[var(--pf-text-secondary)]'>
								<CheckCircle className='w-5 h-5 text-[var(--pf-primary-gradient)]' />
								Designed for complex, multi-agent systems
							</li>
						</ul>
					</div>
					<div className='flex flex-col items-center gap-4'>
						<a
							href='https://github.com/harshabikkavilli/personaflow'
							target='_blank'
							rel='noopener noreferrer'
							className='w-full md:w-auto px-8 py-4 bg-[var(--pf-bg-tertiary)] hover:bg-[var(--pf-border)] font-bold rounded-xl flex items-center justify-center gap-3 transition-colors'>
							<Github className='w-6 h-6' />
							Star on GitHub
						</a>
						<p className='text-xs text-[var(--pf-text-muted)] font-mono'>
							PersonaFlow runs entirely in your browser and stores designs
							locally. No servers, no credentials, and no lock-in.
						</p>
					</div>
				</div>
				<div className='mt-20 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[var(--pf-text-muted)] border-t border-[var(--pf-border)] pt-6'>
					<div className='w-full px-6 flex justify-between'>
						<div className='gap-2 flex items-center'>
							<span className='font-bold text-[var(--pf-text-primary)]'>
								PersonaFlow
							</span>
							<span>
								- A visual standard for designing multi-agent systems.
							</span>
						</div>
						<div className='flex gap-8'>
							<span>© 2026. All rights reserved.</span>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
