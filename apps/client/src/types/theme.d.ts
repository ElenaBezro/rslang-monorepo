import { Theme as MUITheme, ThemeOptions as MUIThemeOptions } from '@mui/material/styles'

declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		correct: true
		incorrect: true
	}
}

declare module '@mui/material/styles' {
	interface Theme extends MUITheme {
		text: {
			secondary: string
			success: string
			danger: string
		}
	}

	interface Palette {
		correct: PaletteColorOptions
		incorrect: PaletteColorOptions
	}

	interface PaletteOptions {
		correct?: PaletteColorOptions
		incorrect?: PaletteColorOptions
	}

	// allow configuration using `createTheme`
	interface ThemeOptions extends MUIThemeOptions {
		text?: {
			secondary?: string
			success?: string
			danger?: string
		}
	}
	// eslint-disable-next-line import/prefer-default-export
	export function createTheme(options?: ThemeOptions): Theme
}
