import { HStack, Text, IconButton } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  page: number;
  canPrevious?: boolean;
  canNext?: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function Pagination({ page, canPrevious = true, canNext = true, onPrevious, onNext }: PaginationProps) {
  return (
    <HStack gap={3} justify="center" align="center" py={4} mt={4}>
      <IconButton
        aria-label="Previous page"
        size="sm"
        variant="ghost"
        onClick={onPrevious}
        disabled={!canPrevious}
      >
        <ChevronLeft size={16} />
      </IconButton>
      <Text minW="80px" textAlign="center">
        Page {page}
      </Text>
      <IconButton
        aria-label="Next page"
        size="sm"
        variant="ghost"
        onClick={onNext}
        disabled={!canNext}
      >
        <ChevronRight size={16} />
      </IconButton>
    </HStack>
  );
}



