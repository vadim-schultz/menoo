import type { IngredientRead } from '../../../shared/types/ingredient';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@chakra-ui/react';
import { StorageLocationMiniTable } from './StorageLocationMiniTable';
import { formatLocationName } from '../services';
import { CardRoot as Card, CardHeader, CardBody, CardFooter, Heading, Text, HStack } from '@chakra-ui/react';

interface StorageLocationCardProps {
  location: string;
  ingredients: IngredientRead[];
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
}

export function StorageLocationCard({ location, ingredients, onEdit: _onEdit, onDelete: _onDelete }: StorageLocationCardProps) {
  const navigate = useNavigate();
  const handleViewInIngredients = () => {
    const params = new URLSearchParams({ storage_location: location });
    navigate(`/ingredients?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader p={6}>
        <HStack justify="space-between" align="center">
          <Box>
            <Heading as="h3" size="md">
              {formatLocationName(location)}
            </Heading>
            <Text fontSize="sm" color="fg.muted" mt={1}>
              {ingredients.length} items
            </Text>
          </Box>
        </HStack>
      </CardHeader>
      <CardBody p={6}>
        <StorageLocationMiniTable ingredients={ingredients} />
      </CardBody>
      <CardFooter justifyContent="flex-end" p={6}>
        <Button size="sm" variant="ghost" onClick={handleViewInIngredients}>
          View in Ingredients
        </Button>
      </CardFooter>
    </Card>
  );
}


