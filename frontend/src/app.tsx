import Router, { Route } from 'preact-router';
import { Layout } from './shared/components/Layout';
import { Navigation } from './shared/components/Navigation';

// Feature pages
import { IngredientsContainer } from './features/ingredients/containers/IngredientsContainer';
import { RecipesContainer } from './features/recipes/containers/RecipesContainer';
import { StorageContainer } from './features/storage/containers/StorageContainer';

export function App() {
  return (
    <Layout>
      <Navigation />
      <Router>
        <Route path="/" component={StorageContainer} />
        <Route path="/ingredients" component={IngredientsContainer} />
        <Route path="/recipes" component={RecipesContainer} />
      </Router>
    </Layout>
  );
}
