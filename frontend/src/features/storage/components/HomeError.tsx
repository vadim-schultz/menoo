import { AlertRoot, AlertTitle, AlertDescription, AlertContent } from '@chakra-ui/react';

interface HomeErrorProps {
  message?: string;
}

export function HomeError({ message }: HomeErrorProps) {
  return (
    <AlertRoot status="error" borderRadius="md">
      <AlertContent>
        <AlertTitle>Error:</AlertTitle>
        <AlertDescription>{message || 'An error occurred'}</AlertDescription>
      </AlertContent>
    </AlertRoot>
  );
}



