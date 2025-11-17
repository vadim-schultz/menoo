import { HStack, Button, Text } from '@chakra-ui/react';

export interface IngredientPaginationProps {
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void; // Kept for API compatibility but not used
}

// TODO: Replace with actual total pages from backend pagination response
const TOTAL_PAGES = 10; // Placeholder until backend returns total count

export const IngredientPagination = ({ page, onPageChange }: IngredientPaginationProps) => {
  // Build page numbers array with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (TOTAL_PAGES <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= TOTAL_PAGES; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (page <= 4) {
        // Near the beginning: 1, 2, 3, 4, 5, ..., last
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(TOTAL_PAGES);
      } else if (page >= TOTAL_PAGES - 3) {
        // Near the end: 1, ..., last-4, last-3, last-2, last-1, last
        pages.push('ellipsis');
        for (let i = TOTAL_PAGES - 4; i <= TOTAL_PAGES; i++) {
          pages.push(i);
        }
      } else {
        // Middle: 1, ..., page-1, page, page+1, ..., last
        pages.push('ellipsis');
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push('ellipsis');
        pages.push(TOTAL_PAGES);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <HStack justify="center" gap={2} mt={4}>
      <Button size="sm" variant="ghost" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      {pageNumbers.map((item, idx) => {
        if (item === 'ellipsis') {
          return <Text key={`sep-${idx}`}>...</Text>;
        }
        return (
          <Button
            key={item}
            size="sm"
            variant={item === page ? 'solid' : 'ghost'}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        );
      })}
      <Button size="sm" variant="ghost" disabled={page === TOTAL_PAGES} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </HStack>
  );
};

