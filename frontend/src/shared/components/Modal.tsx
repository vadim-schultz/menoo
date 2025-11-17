import {
	DialogRoot,
	DialogBackdrop,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogBody,
	DialogCloseTrigger,
	DialogTitle,
} from '@chakra-ui/react';
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
			<DialogContent>
				{title ? (
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogCloseTrigger />
					</DialogHeader>
				) : null}
				<DialogBody>{children}</DialogBody>
				{footer ? <DialogFooter>{footer}</DialogFooter> : null}
			</DialogContent>
		</DialogRoot>
	);
}
