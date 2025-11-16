import {
	NumberInput as CNumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	type NumberInputProps,
} from '@chakra-ui/react';

export type { NumberInputProps };

export function NumberInput(props: NumberInputProps) {
	return (
		<CNumberInput {...props}>
			<NumberInputField />
			<NumberInputStepper>
				<NumberIncrementStepper />
				<NumberDecrementStepper />
			</NumberInputStepper>
		</CNumberInput>
	);
}


