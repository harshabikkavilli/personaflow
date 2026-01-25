import {colorHexMap} from '../constants/nodeConstants';

// Helper to convert CSS variable color to rgba with opacity
export function getColorWithOpacity(color: string, opacity: number): string {
	const hex = colorHexMap[color] || color;
	// If it's already a hex color, convert to rgba
	if (hex.startsWith('#')) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}
	// Fallback for other formats
	return color;
}

// Helper to convert hex to rgba with opacity
export function hexToRgba(hex: string, opacity: number): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
