import type { IngredientRead } from '../../../shared/types/ingredient';
import { useNavigate } from 'react-router-dom';
import { CircleArrowRight } from 'lucide-react';
import { IconButton, Box } from '@chakra-ui/react';
import { StorageLocationMiniTable } from './StorageLocationMiniTable';
import { formatLocationName } from '../services';
import { Card, CardHeader, CardBody, CardFooter } from '../../../shared/components/ui/Card';
import { Heading, Text } from '../../../shared/components/ui/Typography';
import { HStack } from '../../../shared/components/ui/Layout';

interface StorageLocationCardProps {
  location: string;
  ingredients: IngredientRead[];
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
}

export function StorageLocationCard({ location, ingredients, onEdit, onDelete }: StorageLocationCardProps) {
  const navigate = useNavigate();
  const handleViewInIngredients = () => {
    const params = new URLSearchParams({ storage_location: location });
    navigate(`/ingredients?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader pb={2}>
        <HStack justify="space-between" align="center">
          <Box>
            <Heading as="h3" size="md">
              {formatLocationName(location)}
            </Heading>
            <Text fontSize="sm" color="gray.600">
              {ingredients.length} items
            </Text>
          </Box>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <StorageLocationMiniTable ingredients={ingredients} />
      </CardBody>
      <CardFooter pt={2} justifyContent="flex-end">
        <IconButton
          aria-label="View in ingredients"
          size="sm"
          variant="ghost"
          onClick={handleViewInIngredients}
        >
          <CircleArrowRight size={16} />
        </IconButton>
      </CardFooter>
    </Card>
  );
}


