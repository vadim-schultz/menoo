import {
	TableRoot,
	TableHeader,
	TableBody,
	TableFooter,
	TableRow,
	TableColumnHeader,
	TableCell,
	TableCaption,
	TableScrollArea,
	type TableRootProps,
	Box,
} from '@chakra-ui/react';

export const Table = TableRoot;
export const Thead = TableHeader;
export const Tbody = TableBody;
export const Tfoot = TableFooter;
export const Tr = TableRow;
export const Th = TableColumnHeader;
export const Td = TableCell;
export { TableCaption, TableScrollArea };

export function TableContainer({ children, ...props }: { children: React.ReactNode } & React.ComponentProps<typeof Box>) {
	return (
		<Box overflowX="auto" {...props}>
			{children}
		</Box>
	);
}

export function TableWithDefaults(props: TableRootProps) {
	return <TableRoot size="sm" {...props} />;
}


