import type { ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ComponentChildren;
  footer?: ComponentChildren;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      dialog.showModal();
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      dialog.close();
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (dialog) {
        dialog.close();
      }
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: Event) => {
    const dialog = dialogRef.current;
    if (dialog && e.target === dialog) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      style={{
        padding: 0,
        border: 'none',
        borderRadius: 'var(--pico-border-radius)',
        maxWidth: '90vw',
        maxHeight: '90vh',
        width: 'auto',
      }}
    >
      <article
        style={{
          margin: 0,
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        {title && (
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--pico-spacing)' }}>
            <h2 style={{ margin: 0 }}>{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="close"
              data-close=""
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: 0,
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </header>
        )}
        <div style={{ padding: title || footer ? 'var(--pico-spacing)' : 'var(--pico-spacing)' }}>
          {children}
        </div>
        {footer && (
          <footer style={{ padding: 'var(--pico-spacing)', borderTop: '1px solid var(--pico-border-color)', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            {footer}
          </footer>
        )}
      </article>
    </dialog>
  );
}
