import {
	Brain,
	Database,
	GitBranch,
	Play,
	Shield,
	UserCheck,
	Wrench,
	type LucideIcon
} from 'lucide-react';
import type {PersonaNodeType} from '../types';

// Icon mapping for node types
export const nodeIcons: Record<PersonaNodeType, LucideIcon> = {
	planner: Brain,
	executor: Play,
	critic: Shield,
	router: GitBranch,
	tool: Wrench,
	memory: Database,
	humanCheckpoint: UserCheck
};

// Color mapping for node types (hex values)
export const nodeTypeColors: Record<PersonaNodeType, string> = {
	planner: '#3b82f6',
	executor: '#f97316',
	critic: '#a855f7',
	router: '#eab308',
	tool: '#6b7280',
	memory: '#14b8a6',
	humanCheckpoint: '#ec4899'
};

// Color mapping for CSS variables to hex values
export const colorHexMap: Record<string, string> = {
	'var(--pf-planner)': '#3b82f6',
	'var(--pf-executor)': '#f97316',
	'var(--pf-critic)': '#a855f7',
	'var(--pf-router)': '#eab308',
	'var(--pf-tool)': '#6b7280',
	'var(--pf-memory)': '#14b8a6',
	'var(--pf-human)': '#ec4899',
	'var(--pf-text-muted)': '#666666'
};
