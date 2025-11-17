import { Button as ChakraButton, type ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import type { ReactNode, MouseEvent } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
	children?: ReactNode;
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
	type?: 'button' | 'submit' | 'reset';
	variant?: Variant;
	disabled?: boolean;
	className?: string;
	icon?: React.ComponentType<{ size?: number }>;
	iconPosition?: 'left' | 'right';
	'aria-label'?: string;
}

function mapVariant(variant: Variant | undefined): Pick<ChakraButtonProps, 'variant' | 'colorScheme'> {
	if (variant === 'secondary') return { variant: 'outline', colorScheme: 'gray' };
	if (variant === 'danger') return { variant: 'solid', colorScheme: 'red' };
	return { variant: 'solid', colorScheme: 'teal' };
}

export function Button({
	children,
	onClick,
	type = 'button',
	variant = 'primary',
	disabled = false,
	className = '',
	icon: Icon,
	iconPosition = 'left',
	'aria-label': ariaLabel,
}: ButtonProps) {
	const mapped = mapVariant(variant);
	const iconElement = Icon ? <Icon size={16} /> : null;
	
	return (
		<ChakraButton
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={className}
			aria-label={ariaLabel}
			{...mapped}
		>
			{iconPosition === 'left' && iconElement}
			{children}
			{iconPosition === 'right' && iconElement}
		</ChakraButton>
	);
}
