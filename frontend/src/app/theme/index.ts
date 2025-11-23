import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Use default Chakra colors
      },
    },
    semanticTokens: {
      colors: {
        // Background colors - these will automatically adapt to dark mode
        bg: {
          value: { base: '{colors.white}', _dark: '{colors.gray.950}' },
        },
        // Foreground colors
        fg: {
          value: { base: '{colors.gray.900}', _dark: '{colors.gray.50}' },
        },
        // Border colors
        border: {
          value: { base: '{colors.gray.200}', _dark: '{colors.gray.700}' },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: 'bg',
      color: 'fg',
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)

