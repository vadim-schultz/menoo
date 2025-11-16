import { Button } from '../../../shared/components';
import { ChevronLeft, ChevronRight } from 'lucide-preact';

export interface IngredientPaginationProps {
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void; // Kept for API compatibility but not used
}

export const IngredientPagination = ({ page, pageSize, onPageChange }: IngredientPaginationProps) => {
  return (
    <nav style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center', padding: '1rem', marginTop: '1rem' }}>
      <Button
        type="button"
        variant="secondary"
        icon={ChevronLeft}
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Previous page"
      />
      <span style={{ minWidth: '80px', textAlign: 'center' }}>Page {page}</span>
      <Button
        type="button"
        variant="secondary"
        icon={ChevronRight}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      />
    </nav>
  );
};

