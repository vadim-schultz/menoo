interface IngredientsErrorProps {
  message?: string;
}

export function IngredientsError({ message }: IngredientsErrorProps) {
  return (
    <article
      style={{
        padding: '1rem',
        backgroundColor: '#FFF5F5',
        color: '#C53030',
        borderRadius: '0.5rem',
      }}
    >
      Error: {message || 'An error occurred'}
    </article>
  );
}


