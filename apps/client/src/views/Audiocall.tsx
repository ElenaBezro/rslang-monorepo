import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useMatch, useNavigate } from 'react-router-dom'

import CloseIcon from '@mui/icons-material/Close'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import MusicOffIcon from '@mui/icons-material/MusicOff'
import VolumeUp from '@mui/icons-material/VolumeUp'
import { styled, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { deepPurple, lightGreen, purple, red, yellow } from '@mui/material/colors'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { GameResultDialog } from '~/components/game'
import CustomButton from '~/components/layout/CustomButton'
import { Path } from '~/components/router'
import {
	checkAnswer,
	fetchAudiocallWords,
	resetGame,
	selectAudiocallAnsweredWord,
	selectAudiocallAnswers,
	selectAudiocallCorrectAnswers,
	selectAudiocallCurrentWord,
	selectAudiocallIncorrectAnswers,
	selectAudiocallIsFinished,
	selectAudiocallIsWithSounds,
	selectAudiocallLongestSeries,
	selectAudiocallProgress,
	selectAudiocallWords,
	showNextWord,
	toggleAudiocallAudio,
	toggleSounds,
} from '~/features/audiocall'
import { selectAuthIsLoggedIn } from '~/features/auth'
import { sendUpdatedStatistic, toggleIsUpdating, updateCompletedPagesAfterGame, updateGameStatistic, updateWordStatistic } from '~/features/statistic'
import { DOMAIN_URL, PAGES_PER_GROUP } from '~/utils/constants'

interface LocationState {
	fromTextbook: boolean
}

const CustomLinearProgress = styled(LinearProgress)(() => ({
	height: 10,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: '#fff',
	},
	[`& .${linearProgressClasses.bar}`]: {
		backgroundColor: yellow.A700,
	},
}))

export default function Audiocall() {
	const { t } = useTranslation()
	const theme = useTheme()

	const location = useLocation()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const currentWord = useAppSelector(selectAudiocallCurrentWord)
	const answers = useAppSelector(selectAudiocallAnswers)
	const isFinished = useAppSelector(selectAudiocallIsFinished)
	const incorrectWords = useAppSelector(selectAudiocallIncorrectAnswers)
	const correctWords = useAppSelector(selectAudiocallCorrectAnswers)
	const answeredWord = useAppSelector(selectAudiocallAnsweredWord)
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)
	const audiocallWords = useAppSelector(selectAudiocallWords)
	const bestSeries = useAppSelector(selectAudiocallLongestSeries)
	const isWithSounds = useAppSelector(selectAudiocallIsWithSounds)
	const progress = useAppSelector(selectAudiocallProgress)

	const groupMatch = useMatch(Path.AUDIOCALL_WITH_GROUP)
	const pageMatch = useMatch(Path.AUDIOCALL_WITH_GROUP_AND_PAGE)

	const group = useMemo(() => parseInt((groupMatch ?? pageMatch)?.params.group ?? '', 10), [groupMatch, pageMatch])
	const page = useMemo(() => (pageMatch?.params.page ? parseInt(pageMatch.params.page, 10) : undefined), [pageMatch])

	const isFromTextbook = !!(location.state as LocationState)?.fromTextbook

	if (Number.isNaN(group)) {
		navigate(Path.AUDIOCALL)
	}

	const handleKeyAnswers = useCallback(
		(event: KeyboardEvent) => {
			event.preventDefault()

			const { key } = event
			if (['1', '2', '3', '4', '5'].includes(key)) {
				dispatch(checkAnswer({ answer: key, isKeyboard: true }))
				window.removeEventListener('keydown', handleKeyAnswers)
			}
		},
		[dispatch]
	)

	const nextWord = useCallback(() => {
		dispatch(showNextWord())
		window.addEventListener('keydown', handleKeyAnswers)
	}, [dispatch, handleKeyAnswers])

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			event.preventDefault()
			const { key } = event

			if (key === ' ') {
				dispatch(toggleAudiocallAudio())
			} else if (key === 'Enter') {
				nextWord()
			}
		},
		[dispatch, nextWord]
	)

	const fetchWords = useCallback(
		() => dispatch(fetchAudiocallWords({ group, page: page ?? Math.floor(Math.random() * PAGES_PER_GROUP), isFromTextbook })),
		[dispatch, group, isFromTextbook, page]
	)

	useEffect(() => {
		dispatch(resetGame())

		fetchWords()

		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keydown', handleKeyAnswers)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keydown', handleKeyAnswers)
			dispatch(resetGame())
		}
	}, [dispatch, fetchWords, handleKeyDown, handleKeyAnswers])

	const getAudiocallGameStatistic = () => {
		const newWords = audiocallWords.filter(word => !word.userWord?.optional.correctAnswers && !word.userWord?.optional.incorrectAnswers).length
		const correctWordsPercent = (correctWords.length / audiocallWords.length) * 100
		const longestSeries = Math.max(...bestSeries.correctAnswers)

		const newStatistic = {
			newWords,
			correctWordsPercent: [correctWordsPercent],
			longestSeries,
		}

		return newStatistic
	}

	const updateEveryWordStatistic = async () => {
		// update word statistic

		const correctPromises = correctWords.map(word => dispatch(updateWordStatistic({ wordToUpdate: word, newFields: { correctAnswers: 1 } })))
		const incorrectPromises = incorrectWords.map(word => dispatch(updateWordStatistic({ wordToUpdate: word, newFields: { incorrectAnswers: 1 } })))

		await Promise.all([...correctPromises, ...incorrectPromises])
	}

	const finish = async () => {
		window.removeEventListener('keydown', handleKeyDown)
		window.removeEventListener('keydown', handleKeyAnswers)

		// dipatch
		if (isLoggedIn) {
			dispatch(toggleIsUpdating(true))
			// update every word statistic and learned words in short stat if necessary
			await updateEveryWordStatistic()
			// set to completed page field store
			await dispatch(updateCompletedPagesAfterGame({ correctWords, incorrectWords }))

			// caluclate and set new game statistic
			const gameStatistic = getAudiocallGameStatistic()
			await dispatch(updateGameStatistic({ gameName: 'audiocall', newStatistic: gameStatistic }))

			// send updated stat to the server
			await dispatch(sendUpdatedStatistic())
			dispatch(toggleIsUpdating(false))
		}
	}

	useEffect(() => {
		if (isFinished) {
			finish()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFinished])

	return (
		<Box sx={{ position: 'relative', height: '100%', background: `linear-gradient(to right top, ${purple[500]}, ${deepPurple[500]})` }}>
			<Box sx={{ position: 'absolute', width: '100%' }}>
				<CustomLinearProgress variant="determinate" value={progress} />
			</Box>
			<Container maxWidth="lg" sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
				<Box justifyContent="space-between" sx={{ alignSelf: 'flex-start', display: 'flex', width: '100%', marginTop: '20px' }}>
					<IconButton aria-label="switch sounds" title="switch sounds" size="large" onClick={() => dispatch(toggleSounds())}>
						{isWithSounds ? (
							<MusicNoteIcon
								fontSize="large"
								color="secondary"
								sx={{
									color: '#fff',
								}}
							/>
						) : (
							<MusicOffIcon
								fontSize="large"
								color="secondary"
								sx={{
									color: '#fff',
								}}
							/>
						)}
					</IconButton>
					<IconButton
						aria-label="exit game"
						title="exit game"
						size="large"
						color="secondary"
						component={Link}
						to={Path.HOME}
						onClick={() => dispatch(resetGame())}
						sx={{
							color: '#fff',
						}}
					>
						<CloseIcon fontSize="large" />
					</IconButton>
				</Box>

				<Stack alignItems="center" justifyContent="center" gap="20px" marginBottom="150px">
					<Stack
						alignItems="center"
						sx={{
							visibility: answeredWord ? 'visible' : 'hidden',
						}}
					>
						<IconButton
							aria-label="play audio"
							size="small"
							onClick={() => dispatch(toggleAudiocallAudio())}
							sx={{
								color: '#fff',
							}}
						>
							<VolumeUp fontSize="inherit" />
						</IconButton>
						<Typography variant="subtitle1" sx={{ fontWeight: '700', color: '#fff' }}>
							{currentWord?.word ?? ''}
						</Typography>
					</Stack>

					<Box marginBottom="30px">
						{!answeredWord ? (
							<Button
								variant="outlined"
								onClick={() => dispatch(toggleAudiocallAudio())}
								sx={{
									width: 150,
									height: 150,
									borderRadius: '100%',
									color: '#fff',
									borderColor: '#fff',
								}}
							>
								<VolumeUp sx={{ fontSize: 80 }} />
							</Button>
						) : (
							<Box
								sx={{
									width: 150,
									height: 150,
								}}
							>
								<img
									style={{
										width: '100%',
										height: '100%',
										borderRadius: '100%',
										borderWidth: '2px',
										borderStyle: 'solid',
										borderColor: theme.palette.primary.main,
										objectFit: 'cover',
									}}
									src={`${DOMAIN_URL}/${currentWord!.image}`}
									alt=""
								/>
							</Box>
						)}
					</Box>

					<Grid container spacing={2}>
						{answers.map(answer => (
							<Grid key={answer} item>
								<CustomButton
									onClick={() => dispatch(checkAnswer({ answer, isKeyboard: false }))}
									variant="contained"
									sx={{ pointerEvents: answeredWord ? 'none' : 'all', color: '#fff' }}
									customcolor={
										answer === currentWord!.wordTranslate && answeredWord
											? lightGreen
											: answeredWord === answer
											? answer === currentWord!.wordTranslate
												? lightGreen
												: red
											: purple
									}
									isbright
								>
									{answer}
								</CustomButton>
							</Grid>
						))}
					</Grid>

					<CustomButton onClick={() => nextWord()} tabIndex={0} variant="contained" color="secondary" fullWidth customcolor={purple}>
						{t(answeredWord ? 'AUDIOCALL.NEXT' : 'AUDIOCALL.SKIP')}
					</CustomButton>
				</Stack>

				<GameResultDialog isOpen={isFinished} correctWords={correctWords} incorrectWords={incorrectWords} />
			</Container>
		</Box>
	)
}
