import {
	DialogRoot,
	DialogBackdrop,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogBody,
	DialogTitle,
} from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { CircleX } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
	return (
		<DialogRoot 
			open={isOpen} 
			onOpenChange={(details) => {
				if (!details.open) {
					onClose();
				}
			}} 
			size="lg"
		>
			<DialogBackdrop />
			<DialogContent
				position="fixed"
				top="50%"
				left="50%"
				transform="translate(-50%, -50%)"
				maxW="lg"
				w="90%"
				maxH="90vh"
			>
				{title && (
					<DialogHeader p={6}>
						<DialogTitle>{title}</DialogTitle>
					</DialogHeader>
				)}
				<IconButton
					aria-label="Close"
					variant="ghost"
					size="sm"
					onClick={onClose}
					position="absolute"
					top={3}
					right={3}
					zIndex={1}
				>
					<CircleX size={16} />
				</IconButton>
				<DialogBody p={6}>{children}</DialogBody>
				{footer && <DialogFooter p={6}>{footer}</DialogFooter>}
			</DialogContent>
		</DialogRoot>
	);
}
