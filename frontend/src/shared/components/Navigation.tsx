import { Utensils, Package } from 'lucide-preact';

export function Navigation() {
  return (
    <nav>
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 'var(--pico-spacing)', gap: 'var(--pico-spacing)', borderBottom: '1px solid var(--pico-border-color)' }}>
        <li>
          <strong>
            <a href="/" style={{ textDecoration: 'none', color: 'var(--pico-primary)' }}>
              Menoo
            </a>
          </strong>
        </li>
        <li style={{ marginLeft: 'auto' }}>
          <a href="/ingredients" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Package size={16} />
            Ingredients
          </a>
        </li>
        <li>
          <a href="/recipes" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Utensils size={16} />
            Recipes
          </a>
        </li>
      </ul>
    </nav>
  );
}
