import { green, grey, indigo, lightBlue, lightGreen, red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

const { palette } = createTheme()

const theme = createTheme({
	typography: {
		fontFamily: `'Open Sans', sans-serif`,
		h1: {
			fontFamily: `'Oswald', sans-serif`,
		},
		h2: {
			fontFamily: `'Oswald', sans-serif`,
		},
		h3: {
			fontFamily: `'Oswald', sans-serif`,
		},
		h4: {
			fontFamily: `'Oswald', sans-serif`,
		},
		h5: {
			fontFamily: `'Oswald', sans-serif`,
		},
	},
	text: {
		secondary: grey[500],
		success: green[600],
		danger: red[600],
	},
	palette: {
		primary: {
			main: lightBlue[600],
		},
		secondary: {
			main: indigo[300],
		},
		correct: palette.augmentColor({ color: lightGreen, mainShade: 400 }),
		incorrect: palette.augmentColor({ color: red, mainShade: 400 }),
	},
})

export default theme
