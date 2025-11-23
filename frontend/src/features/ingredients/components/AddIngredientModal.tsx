import {
  Box,
  Button,
  Dialog,
  Field,
  Flex,
  Input,
  NumberInput,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useCreateIngredient } from '../hooks/useCreateIngredient'
import { ingredientService } from '../../../shared/services/ingredients'
import type { Ingredient } from '../../../shared/types'

interface AddIngredientModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddIngredientModal({ isOpen, onClose }: AddIngredientModalProps) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState<number>(0)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [suggestedIngredient, setSuggestedIngredient] = useState<Ingredient | null>(null)
  const createMutation = useCreateIngredient()

  const handleSuggest = async () => {
    if (!name || quantity <= 0) {
      return
    }

    setIsSuggesting(true)
    try {
      const response = await ingredientService.suggest({
        ingredient: {
          name,
          quantity,
        },
        prompt:
          'Complete this ingredient with appropriate category, storage location, expiry date based on the storage location (must be in the future), and any relevant notes.',
        n_completions: 1,
      })

      if (response.ingredients && response.ingredients.length > 0) {
        const suggested = response.ingredients[0]
        setSuggestedIngredient({
          name: suggested.name,
          quantity: suggested.quantity,
          category: suggested.category,
          storage_location: suggested.storage_location,
          expiry_date: suggested.expiry_date,
          notes: suggested.notes,
        })
      }
    } catch (error) {
      console.error('Failed to get suggestion:', error)
    } finally {
      setIsSuggesting(false)
    }
  }

  const handleSave = async () => {
    if (!name || quantity <= 0) {
      return
    }

    const ingredientToSave = suggestedIngredient || {
      name,
      quantity,
    }

    try {
      await createMutation.mutateAsync({
        ingredient: ingredientToSave,
      })
      handleClose()
    } catch (error) {
      console.error('Failed to create ingredient:', error)
    }
  }

  const handleClose = () => {
    setName('')
    setQuantity(0)
    setSuggestedIngredient(null)
    onClose()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="md" bg="bg" borderRadius="lg" boxShadow="xl">
          <Dialog.Header pb={4} borderBottomWidth="1px" borderColor="border">
            <Text fontSize="xl" fontWeight="semibold">Add Ingredient</Text>
          </Dialog.Header>
          <Dialog.Body pt={6}>
            <Field.Root mb={6}>
              <Field.Label mb={2} fontWeight="medium">Name</Field.Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter ingredient name"
                size="md"
              />
            </Field.Root>

            <Field.Root mb={6}>
              <Field.Label mb={2} fontWeight="medium">Quantity (grams)</Field.Label>
              <NumberInput.Root
                value={quantity.toString()}
                onValueChange={(e) => setQuantity(Number(e.value) || 0)}
                min={0}
                step={1}
                size="md"
              >
                <NumberInput.Control />
                <NumberInput.Input />
              </NumberInput.Root>
            </Field.Root>

            {suggestedIngredient && (
              <Box mb={6} p={4} bg="bg.muted" borderRadius="md" borderWidth="1px" borderColor="border">
                <Text fontWeight="semibold" mb={3} fontSize="md">
                  Suggested Details:
                </Text>
                <Box as="dl" display="grid" gridTemplateColumns="auto 1fr" gap={2}>
                  <Text as="dt" fontWeight="medium" color="fg.muted">Category:</Text>
                  <Text as="dd">{suggestedIngredient.category || '-'}</Text>
                  <Text as="dt" fontWeight="medium" color="fg.muted">Storage:</Text>
                  <Text as="dd">{suggestedIngredient.storage_location || '-'}</Text>
                  {suggestedIngredient.expiry_date && (
                    <>
                      <Text as="dt" fontWeight="medium" color="fg.muted">Expiry:</Text>
                      <Text as="dd">{suggestedIngredient.expiry_date}</Text>
                    </>
                  )}
                  {suggestedIngredient.notes && (
                    <>
                      <Text as="dt" fontWeight="medium" color="fg.muted">Notes:</Text>
                      <Text as="dd">{suggestedIngredient.notes}</Text>
                    </>
                  )}
                </Box>
              </Box>
            )}

            <Flex gap={3} justify="flex-end" pt={4} borderTopWidth="1px" borderColor="border">
              <Button onClick={handleClose} variant="ghost">Cancel</Button>
              {!suggestedIngredient && (
                <Button
                  onClick={handleSuggest}
                  loading={isSuggesting}
                  colorPalette="blue"
                >
                  Get Suggestion
                </Button>
              )}
              <Button
                onClick={handleSave}
                loading={createMutation.isPending}
                colorPalette="blue"
              >
                Save
              </Button>
            </Flex>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
