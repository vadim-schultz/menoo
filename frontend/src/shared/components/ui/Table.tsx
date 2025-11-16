import {
	Table as CTable,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
	type TableProps,
} from '@chakra-ui/react';

export {
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
};
export type { TableProps };

export function Table(props: TableProps) {
	return <CTable size="sm" variant="simple" {...props} />;
}


