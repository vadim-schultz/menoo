import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Box } from '@chakra-ui/react';
import { Navigation } from './shared/components/Navigation';

// Feature pages
import { IngredientsContainer } from './features/ingredients/containers/IngredientsContainer';
import { RecipesContainer } from './features/recipes/containers/RecipesContainer';
import { RecipeDetailContainer } from './features/recipes/containers/RecipeDetailContainer';
import { StorageContainer } from './features/storage/containers/StorageContainer';

export function App() {
  return (
    <BrowserRouter>
      <Box px={6} py={8} width="100%">
        <Container maxW="container.lg" margin="0 auto">
          <Navigation />
          <Routes>
            <Route path="/" element={<StorageContainer />} />
            <Route path="/ingredients" element={<IngredientsContainer />} />
            <Route path="/recipes" element={<RecipesContainer />} />
            <Route path="/recipes/:recipeId" element={<RecipeDetailContainer />} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  );
}
