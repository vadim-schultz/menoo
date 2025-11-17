import { Container } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Container maxW="container.lg" p={4}>
      {children}
    </Container>
  );
}
