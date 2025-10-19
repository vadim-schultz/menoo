import type { ComponentChildren } from 'preact';

interface LayoutProps {
  children: ComponentChildren;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <main className="layout__main">{children}</main>
    </div>
  );
}
