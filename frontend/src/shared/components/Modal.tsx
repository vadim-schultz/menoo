import type { ComponentChildren } from 'preact';
import {
	Modal as UIModal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from './ui/Modal';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ComponentChildren;
	footer?: ComponentChildren;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
	return (
		<UIModal isOpen={isOpen} onClose={onClose} isCentered size="lg">
			<ModalOverlay />
			<ModalContent>
				{title ? (
					<>
						<ModalHeader>{title}</ModalHeader>
						<ModalCloseButton />
					</>
				) : null}
				<ModalBody>{children}</ModalBody>
				{footer ? <ModalFooter>{footer}</ModalFooter> : null}
			</ModalContent>
		</UIModal>
	);
}
