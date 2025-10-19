export function HomePage() {
  return (
    <div className="card">
      <h1>Welcome to Menoo</h1>
      <p style={{ marginTop: '1rem', color: 'var(--color-text-light)' }}>
        Manage your ingredients, create recipes, and get cooking suggestions.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Quick Start</h2>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>Add your ingredients to the inventory</li>
          <li>Create recipes with those ingredients</li>
          <li>Get suggestions for what you can cook</li>
        </ul>
      </div>
    </div>
  );
}
