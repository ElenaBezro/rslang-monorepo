import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { ThemeProvider } from '@mui/material/styles'

import Footer from '~/components/layout/Footer'
import Header from '~/components/layout/Header'
import { Path, Router } from '~/components/router'
import theme from '~/utils/theme'

function App() {
	const location = useLocation().pathname

	const isFooter = useMemo(() => [Path.AUDIOCALL, Path.SPRINT].every(pattern => !location.startsWith(pattern)), [location])

	return (
		<ThemeProvider theme={theme}>
			<Header />
			<main className="main">
				<Router />
			</main>
			{isFooter && <Footer />}
		</ThemeProvider>
	)
}

export default App
