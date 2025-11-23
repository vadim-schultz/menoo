import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { IngredientsPage } from '../features/ingredients/pages/IngredientsPage'
import { RecipesPage } from '../features/recipes/pages/RecipesPage'
import { RecipeDetailPage } from '../features/recipes/pages/RecipeDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'ingredients',
        element: <IngredientsPage />,
      },
      {
        path: 'recipes',
        element: <RecipesPage />,
      },
      {
        path: 'recipes/:id',
        element: <RecipeDetailPage />,
      },
    ],
  },
])

