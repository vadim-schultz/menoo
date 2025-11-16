import { FormField } from './ui/FormField';
import { Input as UIInput } from './ui/Input';
import { Textarea as UITextarea } from './ui/Textarea';
import { Select as UISelect } from './ui/Select';

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
		<FormField label={label} error={error} htmlFor={name} isRequired={required} className={className}>
			<UIInput
				id={name}
				name={name}
				type={type}
				value={value as any}
				onChange={(e: any) => onChange(e.target.value)}
				onBlur={onBlur as any}
				placeholder={placeholder}
				isDisabled={disabled}
			/>
		</FormField>
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
		<FormField label={label} error={error} htmlFor={name} isRequired={required} className={className}>
			<UITextarea
				id={name}
				name={name}
				value={value as any}
				onChange={(e: any) => onChange(e.target.value)}
				onBlur={onBlur as any}
				placeholder={placeholder}
				isDisabled={disabled}
				rows={rows}
			/>
		</FormField>
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
		<FormField label={label} error={error} htmlFor={name} isRequired={required} className={className}>
			<UISelect
				id={name}
				name={name}
				value={value}
				onChange={(e: any) => onChange(e.target.value)}
				onBlur={onBlur as any}
				placeholder={placeholder}
				isDisabled={disabled}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</UISelect>
		</FormField>
	);
}
