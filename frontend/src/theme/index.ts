import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
	// Chakra includes CSS reset; using default light mode
	initialColorMode: 'light',
	useSystemColorMode: false,
};

// Compact spacing scale and smaller component defaults
const theme = extendTheme({
	config,
	styles: {
		global: {
			'html, body, #app': {
				height: '100%',
			},
		},
	},
	space: {
		px: '1px',
		0.5: '0.125rem',
		1: '0.25rem',
		1.5: '0.375rem',
		2: '0.5rem',
		2.5: '0.625rem',
		3: '0.75rem',
		3.5: '0.875rem',
		4: '1rem',
		5: '1.25rem',
		6: '1.5rem',
		7: '1.75rem',
		8: '2rem',
		9: '2.25rem',
		10: '2.5rem',
	},
	fontSizes: {
		xs: '0.75rem',
		sm: '0.8125rem',
		md: '0.9rem',
		lg: '1rem',
		xl: '1.125rem',
		'2xl': '1.25rem',
		'3xl': '1.5rem',
		'4xl': '1.875rem',
	},
	lineHeights: {
		shorter: 1.2,
		short: 1.3,
		base: 1.35,
		tall: 1.5,
	},
	sizes: {
		container: {
			sm: '40rem',
			md: '48rem',
			lg: '56rem',
			xl: '64rem',
			'2xl': '72rem',
		},
	},
	components: {
		Button: {
			defaultProps: {
				size: 'sm',
				variant: 'solid',
				colorScheme: 'teal',
			},
			sizes: {
				sm: {
					h: '2.0rem',
					px: '0.75rem',
				},
			},
		},
		Input: {
			defaultProps: {
				size: 'sm',
			},
			sizes: {
				sm: {
					field: {
						h: '2.25rem',
						px: '0.5rem',
					},
				},
			},
		},
		Select: {
			defaultProps: {
				size: 'sm',
			},
		},
		Textarea: {
			defaultProps: {
				size: 'sm',
			},
		},
		Switch: {
			defaultProps: {
				size: 'sm',
			},
		},
		Checkbox: {
			defaultProps: {
				size: 'sm',
			},
		},
		Radio: {
			defaultProps: {
				size: 'sm',
			},
		},
		Tag: {
			defaultProps: {
				size: 'sm',
				variant: 'subtle',
			},
		},
		Badge: {
			defaultProps: {
				variant: 'subtle',
			},
		},
		Container: {
			baseStyle: {
				maxW: 'container.lg',
			},
		},
		FormControl: {
			baseStyle: {
				marginBottom: '0.5rem',
			},
		},
		Table: {
			defaultProps: {
				size: 'sm',
				variant: 'simple',
			},
		},
	},
});

export default theme;


