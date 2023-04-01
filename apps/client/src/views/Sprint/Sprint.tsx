import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { CloseOutlined, MusicNote, MusicOff, VolumeUp } from '@mui/icons-material'
import NoIcon from '@mui/icons-material/Cancel'
import YesIcon from '@mui/icons-material/CheckCircle'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { green, red, teal } from '@mui/material/colors'

import { CountdownToStart, GameResultDialog, LevelSelection } from '~/components/game'
import CustomButton from '~/components/layout/CustomButton'
import { Path } from '~/components/router'
import { Timer } from '~/components/timer'
import { playWordAudio, toggleMute } from '~/features/sprint'
import { SPRINT_BASE_CORRECT_ANSWER_POINTS, SPRINT_GAME_TIME } from '~/utils/constants'

import { useSprintGame } from './useSprintGame'

const Sprint = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const theme = useTheme()
	const questionBlockRef = useRef<HTMLDivElement>(null)
	const answerAnimationTimeout = useRef<NodeJS.Timeout>()

	const {
		startGame,
		group,
		status,
		word,
		suggestedTranslation,
		selectOption,
		correctWords,
		incorrectWords,
		correctAnswersInRow,
		gameRound,
		totalPoints,
		onTimeout,
		onTimeAlmostUp,
		isMute,
	} = useSprintGame()

	const animateAnswer = useCallback(
		(color: string) => {
			if (!questionBlockRef.current) {
				return
			}

			const clearAnimationTimeout = () => {
				if (answerAnimationTimeout.current) {
					clearTimeout(answerAnimationTimeout.current)
				}
			}

			clearAnimationTimeout()

			questionBlockRef.current.style.borderColor = color

			answerAnimationTimeout.current = setTimeout(() => {
				if (questionBlockRef.current) {
					questionBlockRef.current.style.borderColor = '#fff'
				}
			}, 400)

			// eslint-disable-next-line consistent-return
			return () => clearAnimationTimeout()
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[theme]
	)

	useEffect(() => {
		if (status === 'game-running' && questionBlockRef.current && correctWords.length !== 0) {
			animateAnswer(theme.palette.success.light)
		}
	}, [status, correctWords, animateAnswer, theme])

	useEffect(() => {
		if (status === 'game-running' && questionBlockRef.current && incorrectWords.length !== 0) {
			animateAnswer(theme.palette.error.light)
		}
	}, [status, incorrectWords, animateAnswer, theme])

	if (Number.isNaN(group)) {
		const controls = [t('SPRINT.CONTROLS_1'), t('SPRINT.CONTROLS_2')]
		return (
			<LevelSelection
				title={t('SPRINT.TITLE')}
				description={t('SPRINT.DESCRIPTION', { count: SPRINT_GAME_TIME })}
				type="sprint"
				controls={controls}
				onLevelSelected={value => navigate(`${Path.SPRINT}?group=${value}`)}
			/>
		)
	}

	return (
		<Box sx={{ height: '100%', background: `linear-gradient(to right top, ${green[500]}, ${teal[500]})` }}>
			<Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
				{status === 'countdown' && (
					<Box maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: 'Open Sans', fontSize: '36px', color: '#fff' }}>
						<CountdownToStart onComplete={startGame} />
					</Box>
				)}
				{status === 'game-running' && word && (
					<Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
						<Box sx={{ width: 50, height: 50, alignSelf: 'start', marginTop: 3, fontFamily: 'Open Sans', fontSize: '36px', color: '#fff' }}>
							{status === 'game-running' && <Timer duration={SPRINT_GAME_TIME} onTimeout={onTimeout} onTimeAlmostUp={onTimeAlmostUp} />}
						</Box>
						<Box maxWidth="sm" sx={{ width: '100%' }}>
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
								<IconButton aria-label="play audio" size="large" onClick={() => dispatch(playWordAudio())} sx={{ width: 40, height: 40, borderRadius: 5 }}>
									<VolumeUp
										fontSize="large"
										color="secondary"
										sx={{
											color: '#fff',
										}}
									/>
								</IconButton>
								<Typography variant="h3" style={{ textAlign: 'center', padding: 20, color: '#fff' }}>
									{totalPoints}
								</Typography>
								{isMute ? (
									<IconButton aria-label="volume" size="large" onClick={() => dispatch(toggleMute())} sx={{ width: 40, height: 40, borderRadius: 5 }}>
										<MusicOff
											fontSize="large"
											color="secondary"
											sx={{
												color: '#fff',
											}}
										/>
									</IconButton>
								) : (
									<IconButton aria-label="volume" size="large" onClick={() => dispatch(toggleMute())} sx={{ width: 40, height: 40, borderRadius: 5 }}>
										<MusicNote
											fontSize="large"
											color="secondary"
											sx={{
												color: '#fff',
											}}
										/>
									</IconButton>
								)}
							</Box>
							<Box
								ref={questionBlockRef}
								sx={{
									width: '100%',
									height: 450,
									border: `4px solid #fff`,
									borderRadius: 5,
									transition: 'border-color 400ms',
								}}
							>
								<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, padding: 3 }}>
									<Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: !(correctAnswersInRow % 4 === 0) ? '#2e7d32' : '#cccccc' }} />
									<Box
										sx={{
											width: 15,
											height: 15,
											borderRadius: '50%',
											backgroundColor: (correctAnswersInRow - 2) % 4 === 0 || (correctAnswersInRow - 3) % 4 === 0 ? '#2e7d32' : '#cccccc',
										}}
									/>
									<Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: (correctAnswersInRow - 3) % 4 === 0 ? '#2e7d32' : '#cccccc' }} />
								</Box>
								<Typography variant="subtitle1" color="GrayText" style={{ textAlign: 'center', color: '#fff' }}>
									{t('SPRINT.SCORE_PER_WORD', { count: gameRound * SPRINT_BASE_CORRECT_ANSWER_POINTS })}
								</Typography>
								<Box sx={{ width: '50%', height: 100, margin: '0 auto', padding: '10px 0' }}>
									<img
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
										}}
										src={`/assets/${gameRound}birds_sprint.png`}
										alt=""
									/>
								</Box>
								<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
									<Typography variant="h3" textTransform="capitalize" sx={{ color: '#fff' }}>
										{word}
									</Typography>
									<Typography variant="h4" textTransform="capitalize" sx={{ color: '#fff' }}>
										{suggestedTranslation}
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 7 }}>
									<CustomButton onClick={() => selectOption(false)} customcolor={red} isbright sx={{ minWidth: '100px', gap: 1 }}>
										<NoIcon />
										{t('COMMON.BUTTON.NO')}
									</CustomButton>
									<CustomButton onClick={() => selectOption(true)} customcolor={green} isbright sx={{ minWidth: '100px', gap: 1 }}>
										<YesIcon /> {t('COMMON.BUTTON.YES')}
									</CustomButton>
								</Box>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'center', gap: 15, mt: 2 }}>
								<img style={{ width: 30, height: 10, objectFit: 'contain', transform: 'rotate(180deg)' }} src="/assets/svg/arrow.png" alt="" />
								<img style={{ width: 30, height: 10, objectFit: 'contain' }} src="/assets/svg/arrow.png" alt="" />
							</Box>
						</Box>
						<IconButton size="large" color="secondary" onClick={() => navigate(Path.HOME)} sx={{ width: 40, height: 40, alignSelf: 'start', marginTop: '20px', color: '#fff' }}>
							<CloseOutlined fontSize="large" />
						</IconButton>
					</Container>
				)}
				<GameResultDialog isOpen={status === 'game-over'} incorrectWords={incorrectWords} correctWords={correctWords} />
			</Container>
		</Box>
	)
}

export { Sprint }
