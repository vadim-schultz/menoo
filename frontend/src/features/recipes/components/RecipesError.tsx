interface RecipesErrorProps {
  message?: string;
}

export function RecipesError({ message }: RecipesErrorProps) {
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


