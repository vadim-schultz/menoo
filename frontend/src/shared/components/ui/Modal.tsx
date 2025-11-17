import {
	DialogRoot,
	DialogBackdrop,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogBody,
	DialogCloseTrigger,
	DialogTitle,
	type DialogRootProps,
	useDisclosure,
} from '@chakra-ui/react';

export {
	DialogBackdrop as ModalOverlay,
	DialogContent as ModalContent,
	DialogHeader as ModalHeader,
	DialogFooter as ModalFooter,
	DialogBody as ModalBody,
	DialogCloseTrigger as ModalCloseButton,
	DialogTitle as ModalTitle,
	useDisclosure,
};
export type { DialogRootProps as ModalProps };

export const Modal = DialogRoot;


