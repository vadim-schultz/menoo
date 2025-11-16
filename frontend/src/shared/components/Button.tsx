import { Button as UIButton, type ButtonProps as UIButtonProps } from '../components/ui/Button';
import type { ComponentChildren } from 'preact';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
	children?: ComponentChildren;
	onClick?: (e: Event) => void;
	type?: 'button' | 'submit' | 'reset';
	variant?: Variant;
	disabled?: boolean;
	className?: string;
	icon?: any;
	iconPosition?: 'left' | 'right';
}

function mapVariant(variant: Variant | undefined): Pick<UIButtonProps, 'variant' | 'colorScheme'> {
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
}: ButtonProps) {
	const leftIcon = Icon && iconPosition === 'left' ? <Icon size={16} /> : undefined;
	const rightIcon = Icon && iconPosition === 'right' ? <Icon size={16} /> : undefined;
	const mapped = mapVariant(variant);
	return (
		<UIButton
			type={type as UIButtonProps['type']}
			onClick={onClick as any}
			isDisabled={disabled}
			className={className}
			leftIcon={leftIcon as any}
			rightIcon={rightIcon as any}
			{...mapped}
		>
			{children}
		</UIButton>
	);
}
