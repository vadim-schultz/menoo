import { useState, useEffect } from 'react';
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  IconButton,
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
  Flex,
  HStack,
  Text,
  Box,
  VStack,
  TableRoot as Table,
  TableHeader as Thead,
  TableBody as Tbody,
  TableRow as Tr,
  TableColumnHeader as Th,
  TableCell as Td,
} from '@chakra-ui/react';
import { ingredientService } from '../../ingredients/services/ingredientService';
import type { IngredientRead } from '../../../shared/types/ingredient';
import { Sparkles, CircleX, Leaf, Fish, WheatOff, Milk, Nut, Bean, Egg, Beef, Apple } from 'lucide-react';
import { Select } from '../../../shared/components';

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

// Cuisine options with flag emojis
const cuisineOptions = [
  { value: '', label: 'Select Cuisine' },
  { value: 'italian', label: '🇮🇹 Italian' },
  { value: 'indian', label: '🇮🇳 Indian' },
  { value: 'japanese', label: '🇯🇵 Japanese' },
  { value: 'chinese', label: '🇨🇳 Chinese' },
  { value: 'french', label: '🇫🇷 French' },
  { value: 'mexican', label: '🇲🇽 Mexican' },
  { value: 'thai', label: '🇹🇭 Thai' },
  { value: 'mediterranean', label: '🇬🇷 Mediterranean' },
  { value: 'american', label: '🇺🇸 American' },
  { value: 'middle_eastern', label: '🇱🇧 Middle Eastern' },
  { value: 'korean', label: '🇰🇷 Korean' },
  { value: 'vietnamese', label: '🇻🇳 Vietnamese' },
  { value: 'greek', label: '🇬🇷 Greek' },
  { value: 'spanish', label: '🇪🇸 Spanish' },
  { value: 'turkish', label: '🇹🇷 Turkish' },
  { value: 'moroccan', label: '🇲🇦 Moroccan' },
  { value: 'ethiopian', label: '🇪🇹 Ethiopian' },
  { value: 'fusion', label: '🌍 Fusion' },
  { value: 'other', label: '🌐 Other' },
];

// Dietary preference options with icons
const dietaryOptions = [
  { value: 'vegetarian', label: 'Vegetarian', icon: Leaf },
  { value: 'vegan', label: 'Vegan', icon: Leaf },
  { value: 'pescatarian', label: 'Pescatarian', icon: Fish },
  { value: 'gluten_free', label: 'Gluten Free', icon: WheatOff },
  { value: 'dairy_free', label: 'Dairy Free', icon: Milk },
  { value: 'nut_free', label: 'Nut Free', icon: Nut },
  { value: 'soy_free', label: 'Soy Free', icon: Bean },
  { value: 'egg_free', label: 'Egg Free', icon: Egg },
  { value: 'low_carb', label: 'Low Carb', icon: Apple },
  { value: 'keto', label: 'Keto', icon: Beef },
  { value: 'paleo', label: 'Paleo', icon: Apple },
];

export function RecipeCreationDialog({ isOpen, onClose, onGenerate, loading }: RecipeCreationDialogProps) {
  const [ingredients, setIngredients] = useState<IngredientRead[]>([]);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<Set<number>>(new Set());
  const [cuisine, setCuisine] = useState<string>('');
  const [dietaryRequirements, setDietaryRequirements] = useState<Set<string>>(new Set());
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
      setDietaryRequirements(new Set());
    }
  }, [isOpen]);

  const handleIngredientToggle = (id: number) => {
    const newSet = new Set(selectedIngredientIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIngredientIds(newSet);
  };

  const handleDietaryToggle = (value: string) => {
    const newSet = new Set(dietaryRequirements);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setDietaryRequirements(newSet);
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
      dietaryRequirements: Array.from(dietaryRequirements),
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
          <DialogTitle>Create Recipe</DialogTitle>
        </DialogHeader>
        <IconButton
          aria-label="Close"
          variant="ghost"
          size="sm"
          onClick={onClose}
          position="absolute"
          top={3}
          right={3}
          zIndex={1}
          disabled={loading}
        >
          <CircleX size={16} />
        </IconButton>
        <DialogBody p={6}>
          <VStack align="stretch" gap={4}>
        {/* Cuisine Selection */}
        <Box>
          <Select
            label="Cuisine"
            name="cuisine"
            value={cuisine}
            onChange={setCuisine}
            options={cuisineOptions}
            placeholder="Select Cuisine"
          />
        </Box>

        {/* Dietary Preferences */}
        <Box>
          <Text fontWeight={500} mb={2}>
            Dietary Preferences
          </Text>
          <HStack wrap="wrap" gap={2}>
            {dietaryOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = dietaryRequirements.has(option.value);
              return (
                <IconButton
                  key={option.value}
                  aria-label={option.label}
                  variant={isSelected ? 'solid' : 'outline'}
                  onClick={() => handleDietaryToggle(option.value)}
                  size="sm"
                >
                  <Icon size={16} />
                </IconButton>
              );
            })}
          </HStack>
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
                <Text color="gray.600">Loading ingredients...</Text>
              ) : ingredients.length === 0 ? (
                <Text color="gray.600">No ingredients available.</Text>
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
                            <input
                              type="checkbox"
                              checked={selectedIngredientIds.has(ingredient.id)}
                              onChange={() => handleIngredientToggle(ingredient.id)}
                            />
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
          <IconButton
            aria-label="Cancel"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            <CircleX size={16} />
          </IconButton>
          <IconButton
            aria-label="Generate Recipe"
            variant="ghost"
            onClick={handleGenerate}
            disabled={loading || selectedIngredientIds.size === 0}
          >
            <Sparkles size={16} />
          </IconButton>
        </Flex>
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}

