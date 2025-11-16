import type { ComponentChildren } from 'preact';
import { Container } from '@chakra-ui/react';

interface LayoutProps {
  children: ComponentChildren;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Container maxW="container.lg" p={4}>
      {children}
    </Container>
  );
}
