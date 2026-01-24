import type {PersonaEdge, PersonaNode} from '../types';
import {generateId} from '../types';

export type Framework = 'LangGraph' | 'CrewAI' | 'Framework-agnostic';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type UseCase =
	| 'Planning & Execution'
	| 'Research & Reasoning'
	| 'Safety & Governance'
	| 'Product & Operations';

export interface ExampleGraph {
	id: string;
	name: string;
	description: string;
	nodes: PersonaNode[];
	edges: PersonaEdge[];
	framework: Framework;
	difficulty: Difficulty;
	useCase: UseCase;
	nodeTypes: string[]; // Array of node types used in this example
}

/**
 * Example 1: Sequential Planner
 * Baseline pattern. This should be the first thing users open.
 */
export const sequentialPlannerExample: ExampleGraph = {
	id: 'sequential-planner',
	name: 'Sequential Planner',
	description:
		'A foundational agent architecture where a central planner decomposes a user goal into steps, executes them sequentially, and validates the final output.',
	framework: 'LangGraph',
	difficulty: 'Beginner',
	useCase: 'Planning & Execution',
	nodeTypes: ['planner', 'executor', 'critic', 'memory', 'tool'],
	nodes: [
		{
			id: 'planner-1',
			type: 'persona',
			position: {x: 0, y: 0},
			data: {
				name: 'Task Planner',
				personaType: 'planner',
				meta: {
					description: 'Breaks down user goals into ordered steps.',
					responsibilities:
						'Interpret the user goal and clarify intent\nDecompose the goal into concrete tasks\nOrder tasks to minimize rework\nHand off tasks to the executor',
					risks: [
						'Over-decomposition creates unnecessary steps',
						'Missing tasks lead to incomplete results',
						'Ambiguous tasks executors cannot perform'
					]
				}
			}
		},
		{
			id: 'executor-1',
			type: 'persona',
			position: {x: 0, y: 150},
			data: {
				name: 'Action Executor',
				personaType: 'executor',
				meta: {
					description: 'Runs tasks using tools and external APIs.',
					responsibilities:
						'Execute planned tasks sequentially\nCall tools or APIs as needed\nAggregate intermediate results\nHandle basic retries',
					risks: [
						'Tool misuse or wrong API calls',
						'No fallback for failed steps',
						'Excessive latency or cost'
					]
				}
			}
		},
		{
			id: 'critic-1',
			type: 'persona',
			position: {x: 0, y: 300},
			data: {
				name: 'Quality Verifier',
				personaType: 'critic',
				meta: {
					description: 'Checks the final result for quality and errors.',
					responsibilities:
						'Validate output against original goal\nDetect hallucinations or gaps\nDecide if the result is acceptable',
					risks: [
						'Overly lenient checks',
						'Overly strict rejection',
						'No clear acceptance criteria'
					]
				}
			}
		},
		{
			id: 'memory-1',
			type: 'persona',
			position: {x: -260, y: 180},
			data: {
				name: 'Conversation Memory',
				personaType: 'memory',
				meta: {
					description: 'Stores context and intermediate results.',
					responsibilities:
						'Persist plans and execution results\nProvide context across steps',
					risks: ['Storing noisy or unused data', 'Never being read']
				}
			}
		},
		{
			id: 'tool-search-1',
			type: 'persona',
			position: {x: 260, y: 180},
			data: {
				name: 'Search Tool',
				personaType: 'tool',
				meta: {
					description: 'External search or knowledge source.',
					responsibilities: 'Provide factual information to the executor',
					risks: ['Low-quality or outdated sources']
				}
			}
		}
	],
	edges: [
		{
			id: generateId(),
			source: 'planner-1',
			target: 'executor-1',
			label: 'planned tasks',
			animated: true
		},
		{
			id: generateId(),
			source: 'executor-1',
			target: 'critic-1',
			label: 'final draft',
			animated: true
		},
		{
			id: generateId(),
			source: 'planner-1',
			target: 'memory-1',
			label: 'store plan'
		},
		{
			id: generateId(),
			source: 'executor-1',
			target: 'memory-1',
			label: 'store results'
		},
		{
			id: generateId(),
			source: 'memory-1',
			target: 'executor-1',
			label: 'load context',
			animated: true
		},
		{
			id: generateId(),
			source: 'executor-1',
			target: 'tool-search-1',
			label: 'query'
		}
	]
};

/**
 * Example 2: Agentic RAG (Self-Correcting)
 * Shows loops, verification, and why design-time analysis is important.
 */
export const agenticRAGExample: ExampleGraph = {
	id: 'agentic-rag',
	name: 'Agentic RAG (Self-Correcting)',
	description:
		'A retrieval-augmented generation system with a verification loop that detects low-confidence outputs and triggers corrective re-queries.',
	framework: 'LangGraph',
	difficulty: 'Intermediate',
	useCase: 'Research & Reasoning',
	nodeTypes: ['planner', 'executor', 'critic', 'memory', 'tool'],
	nodes: [
		{
			id: 'planner-rag',
			type: 'persona',
			position: {x: 0, y: 0},
			data: {
				name: 'Research Planner',
				personaType: 'planner',
				meta: {
					description: 'Breaks the question into search and synthesis steps.',
					responsibilities:
						'Interpret the user question and clarify the information need\nDecide what needs to be looked up vs inferred\nGenerate search plans and sub-questions\nProvide a rough outline for the final answer',
					risks: [
						'Overly narrow or overly broad search plans',
						'Missing key sub-questions',
						'Generating search tasks that tools cannot answer'
					]
				}
			}
		},
		{
			id: 'retriever-rag',
			type: 'persona',
			position: {x: -260, y: 160},
			data: {
				name: 'Retriever Agent',
				personaType: 'executor',
				meta: {
					description: 'Runs search queries and collects documents.',
					responsibilities:
						'Turn the planner’s search plan into concrete queries\nCall the search tool and fetch documents\nFilter out obviously irrelevant results\nStore useful documents in shared memory',
					risks: [
						'Fetching too many irrelevant documents',
						'Over-reliance on keyword matching',
						'Dropping diverse or dissenting sources'
					]
				}
			}
		},
		{
			id: 'synthesizer-rag',
			type: 'persona',
			position: {x: 0, y: 260},
			data: {
				name: 'Answer Synthesizer',
				personaType: 'executor',
				meta: {
					description: 'Combines documents into a grounded draft answer.',
					responsibilities:
						'Read retrieved documents and the original question\nProduce a coherent, grounded draft answer\nRespect the planner’s outline when present',
					risks: [
						'Hallucinating beyond the documents',
						'Cherry-picking evidence',
						'Ignoring constraints or user preferences'
					]
				}
			}
		},
		{
			id: 'critic-rag',
			type: 'persona',
			position: {x: 0, y: 460},
			data: {
				name: 'Answer Critic',
				personaType: 'critic',
				meta: {
					description: 'Checks grounding, coverage, and confidence.',
					responsibilities:
						'Compare the draft answer to the original question\nCheck that claims are supported by documents\nDetect gaps or missing viewpoints\nDecide whether to accept or request refinement',
					risks: [
						'Passing low-quality answers',
						'Over-correcting good answers',
						'Using vague quality criteria'
					]
				}
			}
		},
		{
			id: 'memory-rag',
			type: 'persona',
			position: {x: 260, y: 260},
			data: {
				name: 'Research Memory',
				personaType: 'memory',
				meta: {
					description: 'Stores queries, documents, and notes.',
					responsibilities:
						'Persist retrieved documents or snippets\nStore prior search attempts and planner decisions\nProvide context to the synthesizer and critic',
					risks: ['Growing without pruning', 'Storing duplicated or noisy content']
				}
			}
		},
		{
			id: 'tool-search-rag',
			type: 'persona',
			position: {x: -520, y: 160},
			data: {
				name: 'Search Tool',
				personaType: 'tool',
				meta: {
					description: 'External web or knowledge search.',
					responsibilities: 'Execute search queries\nReturn candidate documents or snippets',
					risks: ['Out-of-date or low-quality sources']
				}
			}
		}
	],
	edges: [
		{
			id: generateId(),
			source: 'planner-rag',
			target: 'retriever-rag',
			label: 'search plan',
			animated: true
		},
		{
			id: generateId(),
			source: 'retriever-rag',
			target: 'tool-search-rag',
			label: 'search queries'
		},
		{
			id: generateId(),
			source: 'retriever-rag',
			target: 'memory-rag',
			label: 'store documents'
		},
		{
			id: generateId(),
			source: 'memory-rag',
			target: 'synthesizer-rag',
			label: 'context'
		},
		{
			id: generateId(),
			source: 'planner-rag',
			target: 'synthesizer-rag',
			label: 'answer outline'
		},
		{
			id: generateId(),
			source: 'synthesizer-rag',
			target: 'critic-rag',
			label: 'draft answer',
			animated: true
		},
		{
			id: generateId(),
			source: 'critic-rag',
			target: 'planner-rag',
			label: 'refinement request',
			animated: true
		}
	]
};

/**
 * Example 3: Multi-Agent Debate
 * Visually distinctive and clearly multi-agent.
 */
export const multiAgentDebateExample: ExampleGraph = {
	id: 'multi-agent-debate',
	name: 'Multi-Agent Debate',
	description:
		'Two or more agents argue opposing viewpoints on a topic, overseen by a judge agent that synthesizes or selects the final response.',
	framework: 'LangGraph',
	difficulty: 'Advanced',
	useCase: 'Research & Reasoning',
	nodeTypes: ['executor', 'critic'],
	nodes: [
		{
			id: 'agent-proponent',
			type: 'persona',
			position: {x: -200, y: 150},
			data: {
				name: 'Proponent Agent',
				personaType: 'executor',
				meta: {
					description: 'Argues in favor of a position or viewpoint.',
					responsibilities:
						'Develop arguments supporting the assigned position\nPresent evidence and reasoning\nAnticipate and counter opposing arguments\nMaintain logical consistency',
					risks: [
						'Cherry-picking evidence to support position',
						'Ignoring valid counterarguments',
						'Overstating case strength',
						'Confirmation bias in research'
					]
				}
			}
		},
		{
			id: 'agent-opponent',
			type: 'persona',
			position: {x: 200, y: 150},
			data: {
				name: 'Opponent Agent',
				personaType: 'executor',
				meta: {
					description: 'Argues against a position or viewpoint.',
					responsibilities:
						'Develop arguments challenging the assigned position\nPresent counterevidence and alternative reasoning\nIdentify weaknesses in proponent arguments\nMaintain logical consistency',
					risks: [
						'Cherry-picking evidence to oppose position',
						'Dismissing valid supporting arguments',
						'Overstating opposition strength',
						'Negativity bias in analysis'
					]
				}
			}
		},
		{
			id: 'judge-agent',
			type: 'persona',
			position: {x: 0, y: 350},
			data: {
				name: 'Judge Agent',
				personaType: 'critic',
				meta: {
					description: 'Evaluates arguments and synthesizes final response.',
					responsibilities:
						'Evaluate strength of arguments from both sides\nIdentify logical fallacies and weak reasoning\nWeigh evidence and counterevidence\nSynthesize balanced final conclusion or select stronger position',
					risks: [
						'Favoring one side due to presentation style',
						'Missing nuanced arguments',
						'Overweighting superficial factors',
						'Failing to synthesize genuinely novel insights'
					]
				}
			}
		}
	],
	edges: [
		{
			id: generateId(),
			source: 'agent-proponent',
			target: 'judge-agent',
			label: 'argument',
			animated: true
		},
		{
			id: generateId(),
			source: 'agent-opponent',
			target: 'judge-agent',
			label: 'counterargument',
			animated: true
		}
	]
};

/**
 * Example 4: Router with Specialized Executors
 * Extremely common real-world pattern.
 */
export const routerWithExecutorsExample: ExampleGraph = {
	id: 'router-with-executors',
	name: 'Router with Specialized Executors',
	description:
		'A routing agent classifies incoming requests and dispatches them to specialized executor agents based on intent or domain.',
	framework: 'LangGraph',
	difficulty: 'Intermediate',
	useCase: 'Planning & Execution',
	nodeTypes: ['router', 'executor'],
	nodes: [
		{
			id: 'router-intent',
			type: 'persona',
			position: {x: 0, y: 0},
			data: {
				name: 'Intent Router',
				personaType: 'router',
				meta: {
					description: 'Routes requests based on intent.',
					responsibilities:
						'Classify incoming requests\nRoute to appropriate executor',
					risks: ['Misclassification']
				}
			}
		},
		{
			id: 'executor-research',
			type: 'persona',
			position: {x: -260, y: 160},
			data: {
				name: 'Research Executor',
				personaType: 'executor',
				meta: {
					description: 'Handles research and information gathering tasks.',
					responsibilities:
						'Process research requests\nGather and synthesize information\nReturn comprehensive research results',
					risks: [
						'Incomplete research',
						'Relying on outdated sources',
						'Missing key information'
					]
				}
			}
		},
		{
			id: 'executor-writing',
			type: 'persona',
			position: {x: 0, y: 160},
			data: {
				name: 'Writing Executor',
				personaType: 'executor',
				meta: {
					description: 'Handles content creation and writing tasks.',
					responsibilities:
						'Process writing requests\nGenerate high-quality content\nAdapt tone and style to requirements',
					risks: [
						'Generic or low-quality output',
						'Inconsistent style',
						'Missing context'
					]
				}
			}
		},
		{
			id: 'executor-analysis',
			type: 'persona',
			position: {x: 260, y: 160},
			data: {
				name: 'Analysis Executor',
				personaType: 'executor',
				meta: {
					description: 'Handles data analysis and interpretation tasks.',
					responsibilities:
						'Process analysis requests\nPerform data analysis and interpretation\nProvide insights and recommendations',
					risks: [
						'Misinterpreting data',
						'Drawing incorrect conclusions',
						'Overlooking important patterns'
					]
				}
			}
		}
	],
	edges: [
		{
			id: generateId(),
			source: 'router-intent',
			target: 'executor-research',
			label: 'research',
			animated: true
		},
		{
			id: generateId(),
			source: 'router-intent',
			target: 'executor-writing',
			label: 'writing',
			animated: true
		},
		{
			id: generateId(),
			source: 'router-intent',
			target: 'executor-analysis',
			label: 'analysis',
			animated: true
		}
	]
};

/**
 * Example 5: Human-in-the-Loop Verifier
 * Demonstrates human checkpoints and governance.
 */
export const humanInLoopVerifierExample: ExampleGraph = {
	id: 'human-in-loop-verifier',
	name: 'Human-in-the-Loop Verifier',
	description:
		'A safety-aware workflow where execution pauses for human approval when confidence thresholds or risk criteria are met.',
	framework: 'LangGraph',
	difficulty: 'Beginner',
	useCase: 'Safety & Governance',
	nodeTypes: ['executor', 'critic', 'humanCheckpoint'],
	nodes: [
		{
			id: 'executor',
			type: 'persona',
			position: {x: 0, y: 0},
			data: {
				name: 'Action Executor',
				personaType: 'executor',
				meta: {
					description: 'Executes tasks and generates outputs.',
					responsibilities:
						'Execute assigned tasks\nGenerate draft outputs or results\nProvide execution details for verification',
					risks: [
						'Incorrect or suboptimal execution',
						'Lack of error handling',
						'Producing outputs that need human oversight'
					]
				}
			}
		},
		{
			id: 'critic',
			type: 'persona',
			position: {x: 0, y: 150},
			data: {
				name: 'Automated Verifier',
				personaType: 'critic',
				meta: {
					description: 'Evaluates outputs and determines if human review is needed.',
					responsibilities:
						'Assess execution results for quality and risk\nCheck against confidence thresholds\nDetermine if human approval is required',
					risks: [
						'Overly lenient verification allowing risky outputs',
						'Overly strict criteria causing unnecessary human reviews',
						'Missing edge cases that require human judgment'
					]
				}
			}
		},
		{
			id: 'human',
			type: 'persona',
			position: {x: 0, y: 300},
			data: {
				name: 'Human Reviewer',
				personaType: 'humanCheckpoint',
				meta: {
					description: 'Provides final approval or rejection of outputs.',
					responsibilities:
						'Review flagged outputs for approval\nProvide feedback on quality and safety\nMake final decision on whether to proceed',
					risks: [
						'Becoming a bottleneck in the workflow',
						'Approval fatigue leading to rubber-stamping',
						'Lack of clear criteria for approval decisions'
					]
				}
			}
		}
	],
	edges: [
		{
			id: generateId(),
			source: 'executor',
			target: 'critic',
			label: 'result',
			animated: true
		},
		{
			id: generateId(),
			source: 'critic',
			target: 'human',
			label: 'needs approval',
			animated: true
		}
	]
};

/**
 * Example 6: Verifier-First Architecture
 * Shows PersonaFlow isn't prescriptive about order.
 */
export const verifierFirstExample: ExampleGraph = {
	id: 'verifier-first-architecture',
	name: 'Verifier-First Architecture',
	description:
		'A non-traditional flow where verification and policy checks happen before execution, reducing downstream failures and rework.',
	framework: 'Framework-agnostic',
	difficulty: 'Intermediate',
	useCase: 'Safety & Governance',
	nodeTypes: ['critic', 'executor'],
	nodes: [
		{
			id: 'critic',
			type: 'persona',
			position: {x: 0, y: 0},
			data: {
				name: 'Policy Verifier',
				personaType: 'critic',
				meta: {
					description: 'Validates requests against policies before execution.',
					responsibilities:
						'Check incoming requests against safety policies\nValidate authorization and permissions\nEnsure compliance with governance rules\nApprove or reject execution requests',
					risks: [
						'Overly permissive policies allowing risky actions',
						'Overly restrictive policies blocking valid requests',
						'Policy gaps that miss edge cases'
					]
				}
			}
		},
		{
			id: 'executor',
			type: 'persona',
			position: {x: 0, y: 150},
			data: {
				name: 'Action Executor',
				personaType: 'executor',
				meta: {
					description: 'Executes pre-approved actions with confidence.',
					responsibilities:
						'Execute only pre-verified actions\nPerform tasks knowing they passed policy checks\nGenerate execution results\nReport completion status',
					risks: [
						'Execution errors despite approval',
						'Unexpected side effects',
						'Resource constraints during execution'
					]
				}
			}
		},
		{
			id: 'output-validator',
			type: 'persona',
			position: {x: 0, y: 300},
			data: {
				name: 'Output Validator',
				personaType: 'critic',
				meta: {
					description: 'Validates execution results meet expectations.',
					responsibilities:
						'Verify execution completed successfully\nCheck outputs match approved specifications\nDetect any policy violations in results\nConfirm quality standards',
					risks: [
						'Missing discrepancies in outputs',
						'False positives flagging valid results',
						'Incomplete validation criteria'
					]
				}
			}
		}
	],
	edges: [
		{
			id: generateId(),
			source: 'critic',
			target: 'executor',
			label: 'approved request',
			animated: true
		},
		{
			id: generateId(),
			source: 'executor',
			target: 'output-validator',
			label: 'execution results',
			animated: true
		}
	]
};

/**
 * Example 7: Hierarchical Support Agent
 * Classic manager-worker pattern; easy to reason about visually.
 */
export const hierarchicalSupportExample: ExampleGraph = {
	id: 'hierarchical-support',
	name: 'Hierarchical Support Agent',
	description:
		'A manager agent delegates incoming support requests to specialized agents and consolidates responses before final delivery.',
	framework: 'CrewAI',
	difficulty: 'Intermediate',
	useCase: 'Product & Operations',
	nodeTypes: ['planner', 'executor'],
	nodes: [
		{
			id: 'manager-agent',
			type: 'persona',
			position: {x: 0, y: 0},
			data: {
				name: 'Manager Agent',
				personaType: 'planner',
				meta: {
					description: 'Delegates support requests to specialized agents.',
					responsibilities:
						'Classify incoming support requests\nDelegate to appropriate specialist\nConsolidate responses from specialists\nEnsure timely resolution',
					risks: [
						'Misclassifying request types',
						'Poor delegation decisions',
						'Bottleneck in response coordination',
						'Losing context when consolidating responses'
					]
				}
			}
		},
		{
			id: 'worker-billing',
			type: 'persona',
			position: {x: -200, y: 150},
			data: {
				name: 'Billing Specialist',
				personaType: 'executor',
				meta: {
					description: 'Handles billing and payment-related support requests.',
					responsibilities:
						'Resolve billing inquiries\nProcess refund requests\nExplain charges and invoices\nUpdate payment information',
					risks: [
						'Providing incorrect billing information',
						'Unauthorized access to payment data',
						'Missing complex billing edge cases',
						'Slow response on time-sensitive billing issues'
					]
				}
			}
		},
		{
			id: 'worker-technical',
			type: 'persona',
			position: {x: 200, y: 150},
			data: {
				name: 'Technical Specialist',
				personaType: 'executor',
				meta: {
					description: 'Handles technical support and troubleshooting requests.',
					responsibilities:
						'Diagnose technical issues\nProvide troubleshooting steps\nEscalate complex technical problems\nDocument solutions for knowledge base',
					risks: [
						'Providing incorrect technical guidance',
						'Missing root cause of issues',
						'Inadequate documentation of solutions',
						'Slow response on critical technical failures'
					]
				}
			}
		}
	],
	edges: [
		{
			id: generateId(),
			source: 'manager-agent',
			target: 'worker-billing',
			label: 'billing issue',
			animated: true
		},
		{
			id: generateId(),
			source: 'manager-agent',
			target: 'worker-technical',
			label: 'technical issue',
			animated: true
		}
	]
};

/**
 * Example 8: Escalation-Aware Support Flow
 * Very practical, very real.
 */
export const escalationAwareSupportExample: ExampleGraph = {
	id: 'escalation-aware-support',
	name: 'Escalation-Aware Support Flow',
	description:
		'A support workflow that detects unresolved or high-risk cases and escalates them to a human reviewer.',
	framework: 'Framework-agnostic',
	difficulty: 'Beginner',
	useCase: 'Safety & Governance',
	nodeTypes: ['executor', 'critic', 'humanCheckpoint'],
	nodes: [
		{
			id: 'executor',
			type: 'persona',
			position: {x: 0, y: 0},
			data: {
				name: 'Support Agent',
				personaType: 'executor',
				meta: {
					description: 'Handles customer support requests and generates responses.',
					responsibilities:
						'Process incoming support tickets\nGenerate helpful responses\nAttempt to resolve customer issues\nDocument conversation context',
					risks: [
						'Providing incorrect or incomplete solutions',
						'Missing complex issues that need human attention',
						'Escalating too frequently or too rarely'
					]
				}
			}
		},
		{
			id: 'critic',
			type: 'persona',
			position: {x: 0, y: 150},
			data: {
				name: 'Escalation Checker',
				personaType: 'critic',
				meta: {
					description: 'Determines if cases require human escalation.',
					responsibilities:
						'Evaluate response quality and completeness\nDetect unresolved or high-risk issues\nIdentify customer dissatisfaction signals\nDecide whether to escalate to human support',
					risks: [
						'Over-escalation creating human bottlenecks',
						'Under-escalation leaving customers frustrated',
						'Inconsistent escalation criteria'
					]
				}
			}
		},
		{
			id: 'human',
			type: 'persona',
			position: {x: 0, y: 300},
			data: {
				name: 'Human Escalation',
				personaType: 'humanCheckpoint',
				meta: {
					description: 'Human support agent handles escalated cases.',
					responsibilities:
						'Review escalated cases and context\nProvide expert assistance for complex issues\nHandle sensitive or high-value customers\nProvide feedback to improve automated responses',
					risks: [
						'Becoming overwhelmed with escalations',
						'Inconsistent handling across human agents',
						'Long response times for urgent cases'
					]
				}
			}
		}
	],
	edges: [
		{
			id: generateId(),
			source: 'executor',
			target: 'critic',
			label: 'response',
			animated: true
		},
		{
			id: generateId(),
			source: 'critic',
			target: 'human',
			label: 'escalate',
			animated: true
		}
	]
};

/**
 * Example 9: Recursive Researcher
 * Perfect demo for loop detection and termination risks.
 */
export const recursiveResearcherExample: ExampleGraph = {
	id: 'recursive-researcher',
	name: 'Recursive Researcher',
	description:
		'An agent that recursively plans, executes, and refines research steps until a stopping condition or depth limit is reached.',
	framework: 'LangGraph',
	difficulty: 'Advanced',
	useCase: 'Research & Reasoning',
	nodeTypes: ['planner', 'executor'],
	nodes: [
		{
			id: 'planner-recursive',
			type: 'persona',
			position: {x: 0, y: 0},
			data: {
				name: 'Research Planner',
				personaType: 'planner',
				meta: {
					description: 'Plans research steps and refines based on findings.',
					responsibilities:
						'Break down research questions into sub-questions\nPlan research strategy and sources\nAnalyze partial findings and decide next steps\nDetermine when research is sufficient',
					risks: [
						'Creating overly deep or broad research plans',
						'Missing stopping conditions leading to infinite loops',
						'Poor prioritization of research paths',
						'Accumulating redundant information'
					]
				}
			}
		},
		{
			id: 'executor-recursive',
			type: 'persona',
			position: {x: 0, y: 150},
			data: {
				name: 'Research Executor',
				personaType: 'executor',
				meta: {
					description: 'Executes research tasks and gathers information.',
					responsibilities:
						'Execute research queries and gather information\nSummarize findings and identify gaps\nFeed results back to planner for refinement\nDetect when additional research is needed',
					risks: [
						'Incomplete or low-quality research',
						'Inability to detect research completion',
						'Generating expensive or time-consuming queries',
						'Missing key insights that would end recursion'
					]
				}
			}
		}
	],
	edges: [
		{
			id: generateId(),
			source: 'planner-recursive',
			target: 'executor-recursive',
			label: 'research task',
			animated: true
		},
		{
			id: generateId(),
			source: 'executor-recursive',
			target: 'planner-recursive',
			label: 'refinement',
			animated: true
		}
	]
};

/**
 * Example 10: Memory-Centric Agent
 * Highlights correct and incorrect memory usage.
 */
export const memoryCentricExample: ExampleGraph = {
	id: 'memory-centric-agent',
	name: 'Memory-Centric Agent',
	description:
		'An architecture where shared memory plays a central role in coordinating planning and execution across multiple steps.',
	framework: 'Framework-agnostic',
	difficulty: 'Intermediate',
	useCase: 'Product & Operations',
	nodeTypes: ['planner', 'executor', 'memory', 'critic'],
	nodes: [
		{
			id: 'planner',
			type: 'persona',
			position: {x: -260, y: 75},
			data: {
				name: 'Task Coordinator',
				personaType: 'planner',
				meta: {
					description: 'Coordinates tasks and initializes memory state.',
					responsibilities:
						'Decompose goals into executable tasks\nInitialize memory with task context\nCoordinate execution workflow\nDetermine when to use persisted state',
					risks: [
						'Poor task decomposition',
						'Initializing memory with wrong context',
						'Over-reliance on stale memory'
					]
				}
			}
		},
		{
			id: 'executor',
			type: 'persona',
			position: {x: 0, y: 0},
			data: {
				name: 'Stateful Executor',
				personaType: 'executor',
				meta: {
					description: 'Executes tasks with persistent state management.',
					responsibilities:
						'Load previous state and context from memory\nExecute tasks using stateful context\nGenerate execution results\nMaintain continuity across multiple interactions',
					risks: [
						'State inconsistencies from concurrent access',
						'Stale state leading to incorrect decisions',
						'Missing critical context from memory'
					]
				}
			}
		},
		{
			id: 'memory',
			type: 'persona',
			position: {x: 260, y: 0},
			data: {
				name: 'Shared Memory',
				personaType: 'memory',
				meta: {
					description: 'Central repository for state and context.',
					responsibilities:
						'Store task context and execution state\nProvide context for subsequent executions\nMaintain conversation history\nEnable stateful workflows across sessions',
					risks: [
						'Growing unbounded without cleanup',
						'Storing sensitive data insecurely',
						'Race conditions from concurrent access'
					]
				}
			}
		},
		{
			id: 'critic',
			type: 'persona',
			position: {x: 0, y: 150},
			data: {
				name: 'Output Verifier',
				personaType: 'critic',
				meta: {
					description: 'Validates execution outputs for quality.',
					responsibilities:
						'Verify execution results for correctness\nCheck outputs against expected criteria\nDetect anomalies in stateful behavior\nProvide feedback for improvement',
					risks: [
						'Missing validation of critical outputs',
						'Performance bottleneck from excessive checks',
						'False positives causing unnecessary rejections'
					]
				}
			}
		}
	],
	edges: [
		{
			id: generateId(),
			source: 'planner',
			target: 'executor',
			label: 'task',
			animated: true
		},
		{
			id: generateId(),
			source: 'planner',
			target: 'memory',
			label: 'initialize context'
		},
		{
			id: generateId(),
			source: 'memory',
			target: 'executor',
			label: 'load state',
			animated: true
		},
		{
			id: generateId(),
			source: 'executor',
			target: 'critic',
			label: 'output',
			animated: true
		}
	]
};

// Legacy example - keeping for backward compatibility
export const userQueryRouterExample: ExampleGraph = {
	id: 'user-query-router',
	name: 'User Query Router',
	description:
		'Routes incoming requests to appropriate agents based on complexity heuristics.',
	framework: 'LangGraph',
	difficulty: 'Beginner',
	useCase: 'Product & Operations',
	nodeTypes: [
		'router',
		'planner',
		'executor',
		'critic',
		'tool',
		'memory',
		'humanCheckpoint'
	],
	nodes: [
		{
			id: '1',
			type: 'persona',
			position: {x: 250, y: 50},
			data: {
				name: 'User Query Handler',
				personaType: 'router',
				meta: {
					description: 'Routes incoming requests to appropriate agents'
				}
			}
		},
		{
			id: '2',
			type: 'persona',
			position: {x: 100, y: 200},
			data: {
				name: 'Task Planner',
				personaType: 'planner',
				meta: {
					description: 'Breaks down complex tasks into steps'
				}
			}
		},
		{
			id: '3',
			type: 'persona',
			position: {x: 400, y: 200},
			data: {
				name: 'Action Executor',
				personaType: 'executor',
				meta: {
					description: 'Executes planned actions using tools'
				}
			}
		},
		{
			id: '4',
			type: 'persona',
			position: {x: 250, y: 350},
			data: {
				name: 'Quality Verifier',
				personaType: 'critic',
				meta: {
					description: 'Validates outputs and checks for errors'
				}
			}
		},
		{
			id: '5',
			type: 'persona',
			position: {x: 550, y: 300},
			data: {
				name: 'Search API',
				personaType: 'tool',
				meta: {
					description: 'External search capability'
				}
			}
		},
		{
			id: '6',
			type: 'persona',
			position: {x: -50, y: 300},
			data: {
				name: 'Conversation Memory',
				personaType: 'memory',
				meta: {
					description: 'Stores context and history'
				}
			}
		},
		{
			id: '7',
			type: 'persona',
			position: {x: 250, y: 500},
			data: {
				name: 'Human Review',
				personaType: 'humanCheckpoint',
				meta: {
					description: 'Manual approval for critical actions'
				}
			}
		}
	],
	edges: [
		// Animated edges from router (routing decisions)
		{id: 'e1-2', source: '1', target: '2', animated: true},
		{id: 'e1-3', source: '1', target: '3', animated: true},
		// Solid edges for data flow
		{id: 'e2-3', source: '2', target: '3'},
		{id: 'e3-4', source: '3', target: '4'},
		{id: 'e3-5', source: '3', target: '5'},
		{id: 'e6-2', source: '6', target: '2'},
		{id: 'e4-7', source: '4', target: '7'}
	]
};

// All available examples (10 featured templates)
export const examples: ExampleGraph[] = [
	sequentialPlannerExample,
	agenticRAGExample,
	multiAgentDebateExample,
	routerWithExecutorsExample,
	humanInLoopVerifierExample,
	verifierFirstExample,
	hierarchicalSupportExample,
	escalationAwareSupportExample,
	recursiveResearcherExample,
	memoryCentricExample
];

// Default example to load (Sequential Planner - baseline pattern)
export const defaultExample = sequentialPlannerExample;
