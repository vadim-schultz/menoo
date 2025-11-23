import { createSystem, defaultConfig, defineConfig, defineRecipe } from '@chakra-ui/react'

// Define component recipes for polished look
const cardRecipe = defineRecipe({
  base: {
    borderRadius: 'lg',
    borderWidth: '1px',
    borderColor: 'border',
    bg: 'bg',
    boxShadow: 'sm',
  },
})

const tableRecipe = defineRecipe({
  base: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
  },
})

const customConfig = defineConfig({
  theme: {
    recipes: {
      card: cardRecipe,
      table: tableRecipe,
    },
    semanticTokens: {
      colors: {
        // Background colors - these will automatically adapt to dark mode
        bg: {
          value: { 
            base: '{colors.white}', 
            _dark: '{colors.gray.950}' 
          },
        },
        'bg.muted': {
          value: { 
            base: '{colors.gray.50}', 
            _dark: '{colors.gray.900}' 
          },
        },
        'bg.subtle': {
          value: { 
            base: '{colors.gray.100}', 
            _dark: '{colors.gray.800}' 
          },
        },
        'bg.emphasized': {
          value: { 
            base: '{colors.gray.50}', 
            _dark: '{colors.gray.800}' 
          },
        },
        // Foreground colors
        fg: {
          value: { 
            base: '{colors.gray.900}', 
            _dark: '{colors.gray.50}' 
          },
        },
        'fg.muted': {
          value: { 
            base: '{colors.gray.600}', 
            _dark: '{colors.gray.400}' 
          },
        },
        'fg.subtle': {
          value: { 
            base: '{colors.gray.500}', 
            _dark: '{colors.gray.500}' 
          },
        },
        'fg.disabled': {
          value: { 
            base: '{colors.gray.400}', 
            _dark: '{colors.gray.600}' 
          },
        },
        // Border colors
        border: {
          value: { 
            base: '{colors.gray.200}', 
            _dark: '{colors.gray.700}' 
          },
        },
        'border.subtle': {
          value: { 
            base: '{colors.gray.100}', 
            _dark: '{colors.gray.800}' 
          },
        },
        'border.emphasized': {
          value: { 
            base: '{colors.gray.300}', 
            _dark: '{colors.gray.600}' 
          },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: 'bg',
      color: 'fg',
      fontFamily: 'body',
      lineHeight: 'base',
    },
  },
})

// Use defaultConfig which includes Chakra's default theme (colors, typography, spacing, etc.)
// This gives us all the default tokens, colors, typography, spacing, etc.
export const system = createSystem(defaultConfig, customConfig)

