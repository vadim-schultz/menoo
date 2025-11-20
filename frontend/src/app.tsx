import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './shared/components/Layout';
import { Navigation } from './shared/components/Navigation';

// Feature pages
import { IngredientsContainer } from './features/ingredients/containers/IngredientsContainer';
import { RecipesContainer } from './features/recipes/containers/RecipesContainer';
import { RecipeDetailContainer } from './features/recipes/containers/RecipeDetailContainer';
import { StorageContainer } from './features/storage/containers/StorageContainer';

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Navigation />
        <Routes>
          <Route path="/" element={<StorageContainer />} />
          <Route path="/ingredients" element={<IngredientsContainer />} />
          <Route path="/recipes" element={<RecipesContainer />} />
          <Route path="/recipes/:recipeId" element={<RecipeDetailContainer />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
