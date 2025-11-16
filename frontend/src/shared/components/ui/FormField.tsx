import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	type FormControlProps,
} from '@chakra-ui/react';
import { ComponentChildren } from 'preact';

export interface FormFieldProps extends FormControlProps {
	label?: string;
	error?: string;
	children: ComponentChildren;
	htmlFor?: string;
}

export function FormField({ label, error, children, htmlFor, ...rest }: FormFieldProps) {
	return (
		<FormControl isInvalid={!!error} {...rest}>
			{label ? <FormLabel htmlFor={htmlFor}>{label}</FormLabel> : null}
			{children}
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
}


