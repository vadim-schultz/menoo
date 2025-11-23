import { Button as ChakraButton, type ButtonProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface ButtonPropsExtended extends Omit<ButtonProps, 'children'> {
	children?: ReactNode;
	icon?: React.ComponentType<{ size?: number }>;
	iconPosition?: 'left' | 'right';
}

export function Button({
	children,
	icon: Icon,
	iconPosition = 'left',
	...props
}: ButtonPropsExtended) {
	const iconElement = Icon ? <Icon size={16} /> : null;
	
	return (
		<ChakraButton {...props}>
			{iconPosition === 'left' && iconElement}
			{children}
			{iconPosition === 'right' && iconElement}
		</ChakraButton>
	);
}
