import { createStandaloneToast } from '@chakra-ui/react';

const { toast } = createStandaloneToast();

export function showToast(title: string, status: 'info' | 'warning' | 'success' | 'error' = 'info', description?: string) {
	toast({
		title,
		description,
		status,
		isClosable: true,
		duration: 3000,
		variant: 'subtle',
		position: 'top',
	});
}


