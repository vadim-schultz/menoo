import { useState, useEffect } from 'react';
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  Button,
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
  Flex,
  Text,
  Box,
  VStack,
  TableRoot as Table,
  TableHeader as Thead,
  TableBody as Tbody,
  TableRow as Tr,
  TableColumnHeader as Th,
  TableCell as Td,
  Spinner,
  Checkbox,
  Field,
  chakra,
} from '@chakra-ui/react';
import { ingredientService } from '../../ingredients/services/ingredientService';
import type { IngredientRead } from '../../../shared/types/ingredient';

const NativeSelect = chakra('select');

interface RecipeCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (payload: {
    ingredientIds: number[];
    cuisine?: string;
    dietaryRequirements: string[];
  }) => Promise<void>;
  loading: boolean;
}

// Cuisine options
const cuisineOptions = [
  { value: '', label: 'Select Cuisine' },
  { value: 'italian', label: 'Italian' },
  { value: 'indian', label: 'Indian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'french', label: 'French' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'thai', label: 'Thai' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'american', label: 'American' },
  { value: 'middle_eastern', label: 'Middle Eastern' },
  { value: 'korean', label: 'Korean' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'greek', label: 'Greek' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'turkish', label: 'Turkish' },
  { value: 'moroccan', label: 'Moroccan' },
  { value: 'ethiopian', label: 'Ethiopian' },
  { value: 'fusion', label: 'Fusion' },
  { value: 'other', label: 'Other' },
];

// Dietary preference options with descriptions
const dietaryOptions = [
  { value: '', label: 'Select Dietary Preference' },
  { value: 'vegetarian', label: 'Vegetarian - No meat or fish' },
  { value: 'vegan', label: 'Vegan - No animal products' },
  { value: 'pescatarian', label: 'Pescatarian - Fish but no meat' },
  { value: 'gluten_free', label: 'Gluten Free - No wheat or gluten-containing grains' },
  { value: 'dairy_free', label: 'Dairy Free - No milk or dairy products' },
  { value: 'nut_free', label: 'Nut Free - No tree nuts' },
  { value: 'soy_free', label: 'Soy Free - No soy products' },
  { value: 'egg_free', label: 'Egg Free - No eggs' },
  { value: 'low_carb', label: 'Low Carb - Minimal carbohydrates' },
  { value: 'keto', label: 'Keto - Very low carb, high fat' },
  { value: 'paleo', label: 'Paleo - Whole foods, no processed ingredients' },
];

export function RecipeCreationDialog({ isOpen, onClose, onGenerate, loading }: RecipeCreationDialogProps) {
  const [ingredients, setIngredients] = useState<IngredientRead[]>([]);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<Set<number>>(new Set());
  const [cuisine, setCuisine] = useState<string>('');
  const [dietaryPreference, setDietaryPreference] = useState<string>('');
  const [loadingIngredients, setLoadingIngredients] = useState(false);

  // Fetch ingredients when dialog opens
  useEffect(() => {
    if (isOpen) {
      setLoadingIngredients(true);
      ingredientService
        .list({ page_size: 1000 } as any)
        .then((data) => {
          setIngredients(data);
          // Default all ingredients to selected
          setSelectedIngredientIds(new Set(data.map((ing) => ing.id)));
        })
        .catch((err) => {
          console.error('Failed to load ingredients:', err);
        })
        .finally(() => {
          setLoadingIngredients(false);
        });
    } else {
      // Reset state when dialog closes
      setSelectedIngredientIds(new Set());
      setCuisine('');
      setDietaryPreference('');
    }
  }, [isOpen]);

  const handleIngredientToggle = (id: number, isChecked: boolean) => {
    setSelectedIngredientIds((prev) => {
      const next = new Set(prev);
      if (isChecked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };


  const handleGenerate = async () => {
    const ingredientIds = Array.from(selectedIngredientIds);
    if (ingredientIds.length === 0) {
      // Could show error toast here
      return;
    }
    await onGenerate({
      ingredientIds,
      cuisine: cuisine || undefined,
      dietaryRequirements: dietaryPreference ? [dietaryPreference] : [],
    });
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) {
          onClose();
        }
      }}
      size="lg"
    >
      <DialogBackdrop />
      <DialogContent
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        maxW="lg"
        w="90%"
        maxH="90vh"
      >
        <DialogHeader p={6}>
          <Flex justify="space-between" align="center">
            <DialogTitle>Create Recipe</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
              Close
            </Button>
          </Flex>
        </DialogHeader>
        <DialogBody p={6}>
          <VStack align="stretch" gap={4}>
        {/* Cuisine Selection */}
        <Box>
          <Field.Root>
            <Field.Label htmlFor="cuisine">Cuisine</Field.Label>
            <NativeSelect
              id="cuisine"
              name="cuisine"
              value={cuisine}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCuisine(e.target.value)}
              w="100%"
              p={2}
              borderRadius="md"
              borderWidth="1px"
              borderColor="border.emphasized"
              bg="bg.surface"
              fontSize="md"
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px {colors.blue.500}',
                outline: 'none',
              }}
            >
              {cuisineOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
          </Field.Root>
        </Box>

        {/* Dietary Preferences */}
        <Box>
          <Field.Root>
            <Field.Label htmlFor="dietaryPreference">Dietary Preferences</Field.Label>
            <NativeSelect
              id="dietaryPreference"
              name="dietaryPreference"
              value={dietaryPreference}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDietaryPreference(e.target.value)}
              w="100%"
              p={2}
              borderRadius="md"
              borderWidth="1px"
              borderColor="border.emphasized"
              bg="bg.surface"
              fontSize="md"
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px {colors.blue.500}',
                outline: 'none',
              }}
            >
              {dietaryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
          </Field.Root>
        </Box>

        {/* Ingredients Accordion */}
        <AccordionRoot defaultValue={[]} collapsible>
          <AccordionItem value="ingredients">
            <AccordionItemTrigger>
              <Text fontWeight={500}>
                Ingredients ({selectedIngredientIds.size} selected)
              </Text>
            </AccordionItemTrigger>
            <AccordionItemContent>
              {loadingIngredients ? (
                <Text color="fg.muted">Loading ingredients...</Text>
              ) : ingredients.length === 0 ? (
                <Text color="fg.muted">No ingredients available.</Text>
              ) : (
                <Box overflowX="auto">
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Quantity</Th>
                        <Th>Select</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {ingredients.map((ingredient) => (
                        <Tr key={ingredient.id}>
                          <Td>{ingredient.name}</Td>
                          <Td>
                            {ingredient.quantity ?? '-'}
                            {ingredient.unit ? ` ${ingredient.unit}` : ''}
                          </Td>
                          <Td>
                            <Checkbox.Root
                              checked={selectedIngredientIds.has(ingredient.id)}
                              onCheckedChange={(details) => {
                                handleIngredientToggle(ingredient.id, details.checked === true);
                              }}
                            >
                              <Checkbox.HiddenInput />
                              <Checkbox.Control>
                                <Checkbox.Indicator />
                              </Checkbox.Control>
                            </Checkbox.Root>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </AccordionItemContent>
          </AccordionItem>
        </AccordionRoot>

        {/* Action Buttons */}
        <Flex justify="flex-end" gap={2}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          {loading ? (
            <Button disabled>
              <Spinner size="sm" mr={2} />
              Generating...
            </Button>
          ) : (
            <Button onClick={handleGenerate} disabled={selectedIngredientIds.size === 0}>
              Generate Recipe
            </Button>
          )}
        </Flex>
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}

