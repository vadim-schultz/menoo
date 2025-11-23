import { Box, Text, chakra } from '@chakra-ui/react';
import type { ReactNode } from 'react';

const Label = chakra('label');

export interface FormFieldProps {
	label?: string;
	error?: string;
	children: ReactNode;
	htmlFor?: string;
	required?: boolean;
	className?: string;
}

export function FormField({ label, error, children, htmlFor, required, className }: FormFieldProps) {
	return (
		<Box className={className}>
			{label ? (
				<Label htmlFor={htmlFor} display="block" fontWeight="medium">
					{label}
					{required && <Text as="span" color="red.500">*</Text>}
				</Label>
			) : null}
			{children}
			{error ? (
				<Text color="red.500" fontSize="sm">
					{error}
				</Text>
			) : null}
		</Box>
	);
}


