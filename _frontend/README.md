# Menoo Frontend

Lightweight recipe management system built with Preact, TypeScript, and Vite.

## Features

- 🥗 **Ingredient Management**: Track your ingredients with quantities, storage locations, and expiry dates
- 📖 **Recipe Management**: Create and organize recipes (coming soon)
- 💡 **AI Suggestions**: Get cooking suggestions based on available ingredients (coming soon)
- ⚡ **Lightweight**: Built with Preact for minimal bundle size
- 🎨 **Modern UI**: Clean, responsive interface with CSS variables
- 🔒 **Type-Safe**: Full TypeScript coverage

## Tech Stack

- **Framework**: [Preact](https://preactjs.com/) - 3kb React alternative
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast, modern build tool
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type safety
- **State Management**: [@preact/signals](https://preactjs.com/guide/v10/signals/) - Reactive state
- **Routing**: [preact-router](https://github.com/preactjs/preact-router) - Client-side routing
- **Testing**: [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)
- **Code Quality**: ESLint + Prettier

## Project Structure

```
frontend/
├── src/
│   ├── shared/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API client and services
│   │   └── types/           # TypeScript type definitions
│   ├── features/
│   │   ├── home/            # Home page
│   │   ├── ingredients/     # Ingredient feature module
│   │   ├── recipes/         # Recipe feature module
│   │   └── suggestions/     # Suggestions feature module
│   ├── styles/              # Global styles
│   ├── app.tsx              # Main app component with routing
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── vitest.config.ts         # Vitest configuration
└── playwright.config.ts     # Playwright configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` with hot module replacement.

### Building

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

### Testing

Run unit tests:

```bash
npm run test
```

Run unit tests in watch mode:

```bash
npm run test:watch
```

Run unit tests with coverage:

```bash
npm run test:coverage
```

Run end-to-end tests:

```bash
npm run test:e2e
```

### Code Quality

Format code:

```bash
npm run format
```

Lint code:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

Type check:

```bash
npm run typecheck
```

## Architecture

### Component Hierarchy

```
App
├── Layout
│   └── Navigation
└── Router
    ├── HomePage
    ├── IngredientsPage
    │   ├── IngredientList
    │   ├── IngredientForm (in Modal)
    │   └── uses: useApi, useApiMutation
    ├── RecipesPage (coming soon)
    └── SuggestionsPage (coming soon)
```

### Data Flow

1. **API Services** (`src/shared/services/`): Handle HTTP requests to backend
2. **Custom Hooks** (`src/shared/hooks/`): Manage state and side effects
3. **Components** (`src/shared/components/`, `src/features/`): Render UI
4. **Types** (`src/shared/types/`): Type definitions matching backend schemas

### Key Patterns

- **Feature-based organization**: Each feature has its own directory with pages, components, and hooks
- **Separation of concerns**: API logic, state management, and UI are separated
- **Type safety**: TypeScript types match backend Pydantic schemas exactly
- **Reusable hooks**: `useApi` for fetching, `useApiMutation` for mutations, `useForm` for forms
- **Shared components**: UI components are presentation-only and reusable

## API Integration

The frontend communicates with the backend API at `http://localhost:8000`. The API client automatically:

- Handles request/response serialization
- Manages error states
- Converts query parameters
- Provides typed responses

Example usage:

```typescript
import { useApi } from '../shared/hooks';
import { ingredientService } from '../shared/services';

// In a component
const { data, loading, error, refetch } = useApi(() => ingredientService.list(), []);
```

## Styling

The app uses a custom CSS design system with CSS variables defined in `src/styles/main.css`:

- **Colors**: Primary, secondary, success, danger
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl)
- **Typography**: System font stack
- **Components**: Styled with BEM-like class naming

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features required
- No IE11 support

## Performance

- Bundle size: ~20kb (gzipped) - Thanks to Preact!
- Code splitting: Automatic with Vite
- Lazy loading: Routes are code-split
- Optimistic updates: Implemented in forms

## Contributing

1. Follow the TypeScript strict mode rules
2. Use the custom hooks for API calls and forms
3. Keep components small and focused
4. Add tests for new features
5. Run linting and formatting before committing

## License

See LICENSE file in the root directory.
