import {
	Stack as CStack,
	HStack as CHStack,
	VStack as CVStack,
	Flex as CFlex,
	Grid as CGrid,
	SimpleGrid as CSimpleGrid,
	type StackProps,
	type FlexProps,
	type GridProps,
	type SimpleGridProps,
} from '@chakra-ui/react';

export type { StackProps, FlexProps, GridProps, SimpleGridProps };

export function Stack(props: StackProps) {
	return <CStack {...props} />;
}
export function HStack(props: StackProps) {
	return <CHStack {...props} />;
}
export function VStack(props: StackProps) {
	return <CVStack {...props} />;
}
export function Flex(props: FlexProps) {
	return <CFlex {...props} />;
}
export function Grid(props: GridProps) {
	return <CGrid {...props} />;
}
export function SimpleGrid(props: SimpleGridProps) {
	return <CSimpleGrid {...props} />;
}


