import type { ShoppingListResponse } from '../../../shared/types';
import { Button } from '../../../shared/components';

interface ShoppingListProps {
  shoppingList: ShoppingListResponse | null;
  onClose: () => void;
}

export function ShoppingList({ shoppingList, onClose }: ShoppingListProps) {
  if (!shoppingList) {
    return null;
  }

  const locationOrder = ['fridge', 'freezer', 'pantry', 'counter', 'other'];
  const sortedLocations = Object.keys(shoppingList.items_by_location).sort((a, b) => {
    const aIndex = locationOrder.indexOf(a);
    const bIndex = locationOrder.indexOf(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const formatLocation = (location: string) => {
    return location.charAt(0).toUpperCase() + location.slice(1);
  };

  return (
    <div className="card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h2>Shopping List</h2>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>

      <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
        Total items: <strong>{shoppingList.total_items}</strong>
      </p>

      {sortedLocations.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--color-text-light)', fontStyle: 'italic' }}>
          No items needed - you have everything!
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {sortedLocations.map((location) => {
            const items = shoppingList.items_by_location[location];
            if (!items || items.length === 0) return null;

            return (
              <div
                key={location}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  padding: '1rem',
                  backgroundColor: 'var(--color-bg-secondary)',
                }}
              >
                <h3
                  style={{
                    marginBottom: '1rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '2px solid var(--color-border)',
                  }}
                >
                  {formatLocation(location)} ({items.length} items)
                </h3>

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius)',
                        backgroundColor: 'var(--color-bg)',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                          {item.ingredient_name}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                          For: {item.recipes.join(', ')}
                        </div>
                      </div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--color-primary)',
                          marginLeft: '1rem',
                          textAlign: 'right',
                        }}
                      >
                        {item.total_quantity} {item.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div
        style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
      >
        <Button onClick={() => window.print()}>Print Shopping List</Button>
        <Button
          variant="secondary"
          onClick={() => {
            const text = sortedLocations
              .map((location) => {
                const items = shoppingList.items_by_location[location];
                if (!items || items.length === 0) return '';
                return `${formatLocation(location)}:\n${items.map((item) => `- ${item.ingredient_name}: ${item.total_quantity} ${item.unit}`).join('\n')}`;
              })
              .filter(Boolean)
              .join('\n\n');
            navigator.clipboard.writeText(text);
            alert('Shopping list copied to clipboard!');
          }}
        >
          Copy to Clipboard
        </Button>
      </div>
    </div>
  );
}
