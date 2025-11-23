import { Pagination, ButtonGroup, IconButton, Box } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface IngredientPaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void; // Kept for API compatibility but not used
}

export const IngredientPagination = ({ 
  page, 
  pageSize, 
  totalCount,
  onPageChange 
}: IngredientPaginationProps) => {
  return (
    <Box display="flex" justifyContent="center" py={4}>
      <Pagination.Root 
        count={totalCount} 
        pageSize={pageSize} 
        page={page}
        onPageChange={(details) => onPageChange(details.page)}
      >
        <ButtonGroup variant="ghost" size="sm">
          <Pagination.PrevTrigger asChild>
            <IconButton>
              <ChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>
          <Pagination.Items
            render={(page) => (
              <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                {page.value}
              </IconButton>
            )}
          />
          <Pagination.NextTrigger asChild>
            <IconButton>
              <ChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Box>
  );
};
