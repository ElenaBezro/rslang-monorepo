import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { Alert, Box, Color, Container, Grid, Typography } from '@mui/material'
import Button, { ButtonProps } from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { deepPurple, indigo, lightBlue, lightGreen, orange, pink, red, yellow } from '@mui/material/colors'
import { styled } from '@mui/material/styles'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { Path } from '~/components/router'
import TextbookCard from '~/components/textbook/TextbookCard'
import TextbookGroupDropdown from '~/components/textbook/TextbookGroupDropdown'
import TextbookPagination from '~/components/textbook/TextbookPagination'
import { selectAuthIsLoggedIn } from '~/features/auth'
import { fetchUserStatistics, selectStatisticOptional } from '~/features/statistic'
import {
	changeGroup,
	changePage,
	fetchDifficultWords,
	fetchTextbookWords,
	selectTextbookGroup,
	selectTextbookPage,
	selectTextbookStatus,
	selectTextbookWords,
} from '~/features/textbook'
import { localStorageGetPagination } from '~/utils/localStorage'

interface GameButtonProps {
	customcolor: Color
	component: typeof RouterLink
	to: string
	state?: { fromTextbook: true }
}

const GameButton = styled(Button)<GameButtonProps & ButtonProps>(({ theme, customcolor }) => ({
	color: theme.palette.getContrastText(customcolor[100]),
	backgroundColor: customcolor[100],
	'&:hover': {
		backgroundColor: customcolor[300],
	},
}))

function Textbook() {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()

	const words = useAppSelector(selectTextbookWords)
	const group = useAppSelector(selectTextbookGroup)
	const page = useAppSelector(selectTextbookPage)
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)
	const status = useAppSelector(selectTextbookStatus)
	const { completedPages } = useAppSelector(selectStatisticOptional)

	const groupColors = [indigo, pink, orange, lightBlue, yellow, deepPurple, red]
	const activeColor = groupColors[group]

	const isPageCompleted = group in completedPages && completedPages[group][page]
	const isDifficultWordsEmpty = group === 6 && words.length < 1

	useEffect(() => {
		const storedPagination = localStorageGetPagination()
		const storedGroup = storedPagination.group
		const storedPage = storedPagination.page
		dispatch(changeGroup(storedGroup))
		dispatch(changePage(storedPage))

		if (storedGroup === 6) {
			dispatch(fetchDifficultWords())
		} else {
			dispatch(fetchTextbookWords())
		}

		dispatch(fetchUserStatistics())
	}, [dispatch])

	return (
		<Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Typography variant="h3" sx={{ mt: 3, mb: 3 }}>
				{t('TEXTBOOK.TITLE')}
			</Typography>

			<Stack spacing={2} direction="row" justifyContent="space-between" sx={{ marginBottom: '50px' }}>
				<TextbookGroupDropdown />

				{isPageCompleted && (
					<Box>
						<Typography variant="h5" sx={{ color: lightGreen[500] }}>
							{t('TEXTBOOK.FULLY_LEARNED_SECTION')}
						</Typography>
					</Box>
				)}

				<Stack spacing={2} direction="row" justifyContent="space-between">
					<GameButton
						component={RouterLink}
						to={`${Path.SPRINT}?group=${group}&page=${page}`}
						disabled={isPageCompleted || status === 'loading' || isDifficultWordsEmpty}
						customcolor={activeColor}
					>
						{t('TEXTBOOK.OPEN_SPRTING_GAME')}
					</GameButton>
					<GameButton
						component={RouterLink}
						to={`${Path.AUDIOCALL}/${group}/${page}`}
						state={{ fromTextbook: true }}
						disabled={isPageCompleted || status === 'loading' || isDifficultWordsEmpty}
						customcolor={activeColor}
					>
						{t('TEXTBOOK.OPEN_AUDIO_CALL_GAME')}
					</GameButton>
				</Stack>
			</Stack>

			{isDifficultWordsEmpty && <Alert severity="info">{t('STATISTIC.DIFFICULT_WORDS_EMPTY_PAGE')}</Alert>}

			<Grid container spacing={2} sx={{ flex: '1 0 auto', marginBottom: '50px' }}>
				{status === 'loading'
					? [...Array(20)].map((_, idx) => (
							<Grid key={idx} item xs={12}>
								<Skeleton variant="rectangular" height={300} />
							</Grid>
					  ))
					: words.map(word => (
							<Grid key={word.id} item xs={12}>
								<TextbookCard activeColor={activeColor} passedWord={word} isLoggedIn={isLoggedIn} />
							</Grid>
					  ))}
			</Grid>

			{group !== 6 && (
				<Box sx={{ flex: '0 0 auto' }}>
					<TextbookPagination />
				</Box>
			)}
		</Container>
	)
}

export default Textbook
