import type {Difficulty, Framework} from '../data/examples';

export const frameworkColors: Record<Framework, string> = {
	LangGraph: 'bg-indigo-500/10 text-indigo-500',
	CrewAI: 'bg-orange-500/10 text-orange-500',
	'Framework-agnostic': 'bg-purple-500/10 text-purple-500'
};

export const difficultyColors: Record<Difficulty, string> = {
	Beginner: 'bg-emerald-500/10 text-emerald-500',
	Intermediate: 'bg-indigo-500/10 text-indigo-500',
	Advanced: 'bg-red-500/10 text-red-500'
};
