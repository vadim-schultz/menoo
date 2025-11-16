import { Select as CSelect, type SelectProps } from '@chakra-ui/react';
export type { SelectProps };
export function Select(props: SelectProps) {
	return <CSelect {...props} />;
}


