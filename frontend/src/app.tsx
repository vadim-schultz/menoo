import Router, { Route } from 'preact-router';
import { Layout } from './shared/components/Layout';
import { Navigation } from './shared/components/Navigation';

// Feature pages
import { IngredientsContainer } from './features/ingredients/containers/IngredientsContainer';
import { RecipesPage } from './features/recipes/pages/RecipesPage';
import { SuggestionsPage } from './features/suggestions/pages/SuggestionsPage';
import { HomePage } from './features/home/HomePage';

export function App() {
  return (
    <Layout>
      <Navigation />
      <Router>
        <Route path="/" component={HomePage} />
        <Route path="/ingredients" component={IngredientsContainer} />
        <Route path="/recipes" component={RecipesPage} />
        <Route path="/suggestions" component={SuggestionsPage} />
      </Router>
    </Layout>
  );
}
