import { Button, Input } from '../../../shared/components';

export interface IngredientPaginationProps {
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const IngredientPagination = ({
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: IngredientPaginationProps) => {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
      <Button
        type="button"
        variant="secondary"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        Previous
      </Button>
      <span>Page {page}</span>
      <Button type="button" variant="secondary" onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
      <Input
        label="Page Size"
        name="page_size"
        type="number"
        value={pageSize}
        onChange={(v) => {
          const num = parseInt(v) || 100;
          onPageSizeChange(num);
        }}
      />
    </div>
  );
};

