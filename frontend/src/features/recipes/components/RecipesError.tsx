import { AlertRoot, AlertTitle, AlertDescription, AlertContent } from '@chakra-ui/react';

interface RecipesErrorProps {
  message?: string;
}

export function RecipesError({ message }: RecipesErrorProps) {
  return (
    <AlertRoot status="error" borderRadius="md">
      <AlertContent>
        <AlertTitle>Error:</AlertTitle>
        <AlertDescription>{message || 'An error occurred'}</AlertDescription>
      </AlertContent>
    </AlertRoot>
  );
}


