import type { ComponentChildren } from 'preact';

interface LayoutProps {
  children: ComponentChildren;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div>
      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: 'var(--pico-spacing)' }}>
        {children}
      </main>
    </div>
  );
}
