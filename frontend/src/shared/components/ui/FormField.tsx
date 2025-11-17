import {
	Box,
	Text,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

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
		<Box className={className} mb={4}>
			{label ? (
				<Text as="label" htmlFor={htmlFor} mb={1} display="block" fontWeight="medium">
					{label}
					{required && <Text as="span" color="red.500" ml={1}>*</Text>}
				</Text>
			) : null}
			{children}
			{error ? (
				<Text color="red.500" fontSize="sm" mt={1}>
					{error}
				</Text>
			) : null}
		</Box>
	);
}


