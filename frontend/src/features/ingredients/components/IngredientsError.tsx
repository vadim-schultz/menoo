import { AlertRoot, AlertTitle, AlertDescription, AlertContent } from '@chakra-ui/react';

interface IngredientsErrorProps {
  message?: string;
}

export function IngredientsError({ message }: IngredientsErrorProps) {
  return (
    <AlertRoot status="error" borderRadius="md">
      <AlertContent>
        <AlertTitle>Error:</AlertTitle>
        <AlertDescription>{message || 'An error occurred'}</AlertDescription>
      </AlertContent>
    </AlertRoot>
  );
}


