import { createSystem, defineConfig, defaultConfig } from '@chakra-ui/react';

// Define custom theme configuration aligned with Chakra UI Pro aesthetics
const customConfig = defineConfig({
  // Global styles
  globalCss: {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },
    'html, body': {
      height: '100%',
      fontFamily: 'var(--chakra-fonts-sans)',
      color: 'fg.default',
      backgroundColor: 'bg.canvas',
      lineHeight: 1.5,
    },
  },
  
  // Theme tokens
  theme: {
    // Typography - using Inter font (matching Chakra UI Pro)
    tokens: {
      fonts: {
        sans: {
          value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        mono: {
          value: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
        },
      },
      // Spacing scale (multiples of 4px)
      spacing: {
        0: { value: '0' },
        1: { value: '0.25rem' }, // 4px
        2: { value: '0.5rem' },  // 8px
        3: { value: '0.75rem' }, // 12px
        4: { value: '1rem' },    // 16px
        5: { value: '1.25rem' }, // 20px
        6: { value: '1.5rem' },  // 24px
        8: { value: '2rem' },    // 32px
        10: { value: '2.5rem' }, // 40px
        12: { value: '3rem' },   // 48px
        16: { value: '4rem' },   // 64px
        20: { value: '5rem' },   // 80px
        24: { value: '6rem' },   // 96px
      },
      // Border radius scale
      radii: {
        none: { value: '0' },
        sm: { value: '0.25rem' },  // 4px
        md: { value: '0.375rem' }, // 6px
        lg: { value: '0.5rem' },   // 8px
        xl: { value: '0.75rem' },  // 12px
        '2xl': { value: '1rem' },  // 16px
        '3xl': { value: '1.5rem' }, // 24px
        full: { value: '9999px' },
      },
    },
    
    // Semantic tokens for colors
    semanticTokens: {
      colors: {
        // Background colors
        'bg.canvas': {
          value: { base: '{colors.gray.50}', _dark: '{colors.gray.950}' },
        },
        'bg.surface': {
          value: { base: '{colors.white}', _dark: '{colors.gray.900}' },
        },
        'bg.subtle': {
          value: { base: '{colors.gray.100}', _dark: '{colors.gray.800}' },
        },
        'bg.muted': {
          value: { base: '{colors.gray.50}', _dark: '{colors.gray.900}' },
        },
        // Foreground colors
        'fg.default': {
          value: { base: '{colors.gray.900}', _dark: '{colors.gray.50}' },
        },
        'fg.muted': {
          value: { base: '{colors.gray.600}', _dark: '{colors.gray.400}' },
        },
        'fg.subtle': {
          value: { base: '{colors.gray.500}', _dark: '{colors.gray.500}' },
        },
        'fg.inverted': {
          value: { base: '{colors.white}', _dark: '{colors.gray.900}' },
        },
        // Border colors
        'border.emphasized': {
          value: { base: '{colors.gray.200}', _dark: '{colors.gray.700}' },
        },
        'border.subtle': {
          value: { base: '{colors.gray.100}', _dark: '{colors.gray.800}' },
        },
        // Focus ring
        'focus.ring': {
          value: { base: '{colors.blue.500}', _dark: '{colors.blue.400}' },
        },
      },
    },
    
    
    // Text styles
    textStyles: {
      h1: {
        fontSize: { base: '3xl', md: '4xl' },
        fontWeight: '700',
        lineHeight: '1.2',
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: { base: '2xl', md: '3xl' },
        fontWeight: '700',
        lineHeight: '1.3',
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: { base: 'xl', md: '2xl' },
        fontWeight: '600',
        lineHeight: '1.4',
      },
      h4: {
        fontSize: { base: 'lg', md: 'xl' },
        fontWeight: '600',
        lineHeight: '1.5',
      },
      body: {
        fontSize: 'md',
        fontWeight: '400',
        lineHeight: '1.6',
      },
      'body.sm': {
        fontSize: 'sm',
        fontWeight: '400',
        lineHeight: '1.5',
      },
    },
  },
});

// Merge with default config and create system
const system = createSystem(defaultConfig, customConfig);

export default system;
