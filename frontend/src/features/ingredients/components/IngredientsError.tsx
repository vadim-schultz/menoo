interface IngredientsErrorProps {
  message?: string;
}

export function IngredientsError({ message }: IngredientsErrorProps) {
  return (
    <article
      style={{
        padding: 'var(--pico-spacing)',
        backgroundColor: 'var(--pico-del-background, #fff5f5)',
        color: 'var(--pico-del-color, #c62828)',
        borderRadius: 'var(--pico-border-radius)',
      }}
    >
      Error: {message || 'An error occurred'}
    </article>
  );
}


