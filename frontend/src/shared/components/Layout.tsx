import { Container, Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box px={6} py={8} width="100%">
      <Container maxW="container.lg" margin="0 auto">
        {children}
      </Container>
    </Box>
  );
}
