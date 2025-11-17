// Chakra UI v3 doesn't have createStandaloneToast
// Using a console-based fallback for now to prevent app from breaking
// TODO: Implement proper toast system for Chakra UI v3

export function showToast(title: string, status: 'info' | 'warning' | 'success' | 'error' = 'info', description?: string) {
	// Console fallback - in production, implement proper toast notification
	const message = description ? `${title}: ${description}` : title;
	const logMethod = status === 'error' ? console.error : status === 'warning' ? console.warn : console.log;
	logMethod(`[Toast ${status.toUpperCase()}] ${message}`);
	
	// TODO: Implement proper toast UI using Chakra UI v3's toast system
	// Chakra UI v3 may require using a ToastProvider or different API
}


