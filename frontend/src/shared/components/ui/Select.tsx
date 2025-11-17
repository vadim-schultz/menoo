import {
	NativeSelectRoot,
	NativeSelectField,
	NativeSelectIndicator,
	type NativeSelectRootProps,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

// For backward compatibility with existing code that uses <select>
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children?: ReactNode }) {
	return <select {...props} />;
}

// Chakra UI v3 NativeSelect components
export const NativeSelect = NativeSelectRoot;
export const NativeSelectFieldComponent = NativeSelectField;
export const NativeSelectIndicatorComponent = NativeSelectIndicator;


