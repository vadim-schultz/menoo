import {
  Field,
  Input as ChakraInput,
  Textarea as ChakraTextarea,
  chakra,
} from '@chakra-ui/react';
import type { ChangeEvent } from 'react';

const NativeSelect = chakra('select');

interface BaseFieldProps {
	name: string;
	label?: string;
	error?: string;
	required?: boolean;
	disabled?: boolean;
	className?: string;
	placeholder?: string;
	onBlur?: () => void;
}

interface InputProps extends BaseFieldProps {
	type?: string;
	value: string | number;
	onChange: (value: string) => void;
}

export function Input({
	type = 'text',
	name,
	value,
	onChange,
	onBlur,
	placeholder,
	label,
	error,
	required = false,
	disabled = false,
	className = '',
}: InputProps) {
	return (
		<Field.Root invalid={!!error} required={required} className={className}>
			{label && <Field.Label htmlFor={name}>{label}</Field.Label>}
			<ChakraInput
				id={name}
				name={name}
				type={type}
				value={value}
				onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
				onBlur={onBlur}
				placeholder={placeholder}
				disabled={disabled}
			/>
			{error && <Field.ErrorText>{error}</Field.ErrorText>}
		</Field.Root>
	);
}

interface TextareaProps extends BaseFieldProps {
	value: string;
	onChange: (value: string) => void;
	rows?: number;
}

export function Textarea({
	name,
	value,
	onChange,
	onBlur,
	placeholder,
	label,
	error,
	required = false,
	disabled = false,
	rows = 4,
	className = '',
}: TextareaProps) {
	return (
		<Field.Root invalid={!!error} required={required} className={className}>
			{label && <Field.Label htmlFor={name}>{label}</Field.Label>}
			<ChakraTextarea
				id={name}
				name={name}
				value={value}
				onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
				onBlur={onBlur}
				placeholder={placeholder}
				disabled={disabled}
				rows={rows}
			/>
			{error && <Field.ErrorText>{error}</Field.ErrorText>}
		</Field.Root>
	);
}

interface SelectProps extends BaseFieldProps {
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
}

export function Select({
	name,
	value,
	onChange,
	onBlur,
	options,
	label,
	error,
	required = false,
	disabled = false,
	placeholder,
	className = '',
}: SelectProps) {
	return (
		<Field.Root invalid={!!error} required={required} className={className}>
			{label && <Field.Label htmlFor={name}>{label}</Field.Label>}
			<NativeSelect
				id={name}
				name={name}
				value={value}
				onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
				onBlur={onBlur}
				disabled={disabled}
			>
				{placeholder && (
					<option value="">
						{placeholder}
					</option>
				)}
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</NativeSelect>
			{error && <Field.ErrorText>{error}</Field.ErrorText>}
		</Field.Root>
	);
}
