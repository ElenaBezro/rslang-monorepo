import { useCallback, useEffect, useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { selectAuthIsLoggedIn } from '~/features/auth'
import { answer, gameTimeAlmostUp, gameTimeout, loadWords, reset, selectSprintState, startSprint } from '~/features/sprint'
import { sendUpdatedStatistic, toggleIsUpdating, updateCompletedPagesAfterGame, updateGameStatistic, updateWordStatistic } from '~/features/statistic'
import { PAGES_PER_GROUP } from '~/utils/constants'

interface LocationState {
	fromTextbook?: boolean
}

const useSprintGame = () => {
	const dispatch = useAppDispatch()
	const location = useLocation()

	const [searchParams] = useSearchParams()
	const { group: groupStr, page: pageStr } = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams])

	const group = useMemo(() => parseInt(groupStr ?? pageStr ?? '', 10), [groupStr, pageStr])
	const page = useMemo(() => (pageStr ? parseInt(pageStr, 10) : undefined), [pageStr])

	const { words, status, word, suggestedTranslation, correctWords, incorrectWords, correctAnswersInRow, gameRound, totalPoints, bestSeries, isMute } =
		useAppSelector(selectSprintState)

	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)

	const isFromTextbook = !!(location.state as LocationState)?.fromTextbook

	const getSprintGameStatistic = useCallback(async () => {
		const newWords = words.filter(newWord => !newWord.userWord?.optional.correctAnswers && !newWord.userWord?.optional.incorrectAnswers).length
		const correctWordsPercent = (correctWords.length / words.length) * 100

		const newStatistic = {
			newWords,
			correctWordsPercent: [correctWordsPercent],
			longestSeries: bestSeries,
		}

		return newStatistic
	}, [bestSeries, correctWords.length, words])

	const updateEveryWordStatistic = useCallback(async () => {
		// update word statistic
		const correctPromises = correctWords.map(wordToSend => dispatch(updateWordStatistic({ wordToUpdate: wordToSend, newFields: { correctAnswers: 1 } })))
		const incorrectPromises = incorrectWords.map(wordToSend => dispatch(updateWordStatistic({ wordToUpdate: wordToSend, newFields: { incorrectAnswers: 1 } })))

		await Promise.all([...correctPromises, ...incorrectPromises])
	}, [correctWords, dispatch, incorrectWords])

	const finish = useCallback(async () => {
		if (isLoggedIn) {
			dispatch(toggleIsUpdating(true))
			// update every word statistic and learned words in short stat if necessary
			await updateEveryWordStatistic()
			// set to completed page field store
			await dispatch(updateCompletedPagesAfterGame({ correctWords, incorrectWords }))

			// caluclate and set new game statistic
			const gameStatistic = await getSprintGameStatistic()
			await dispatch(updateGameStatistic({ gameName: 'sprint', newStatistic: gameStatistic }))

			// send updated stat to the server
			await dispatch(sendUpdatedStatistic())
			dispatch(toggleIsUpdating(false))
		}
	}, [correctWords, dispatch, getSprintGameStatistic, incorrectWords, isLoggedIn, updateEveryWordStatistic])

	useEffect(() => {
		if (status === 'game-over') {
			finish()
		}
	}, [status, finish])

	// start on mount or when group/page changes
	useEffect(() => {
		if (!Number.isNaN(group)) {
			dispatch(loadWords({ group, page: page ?? Math.floor(Math.random() * PAGES_PER_GROUP), isFromTextbook }))
		}
	}, [dispatch, group, page, isFromTextbook])

	// reset game on unmount
	useEffect(
		() => () => {
			dispatch(reset())
		},
		[dispatch]
	)

	const selectOption = useCallback((option: boolean) => dispatch(answer(option)), [dispatch])

	// eslint-disable-next-line consistent-return
	useEffect(() => {
		if (status === 'game-running') {
			const onKeyDown = (e: KeyboardEvent) => {
				switch (e.key) {
					case 'Left':
					case 'ArrowLeft':
					case 'a':
						selectOption(false)
						break

					case 'Right':
					case 'ArrowRight':
					case 'd':
						selectOption(true)
						break

					default: // no op
				}
			}

			window.addEventListener('keydown', onKeyDown)

			return () => window.removeEventListener('keydown', onKeyDown)
		}
	}, [status, selectOption])

	const startGame = useCallback(() => {
		dispatch(startSprint())
	}, [dispatch])

	const onTimeout = useCallback(() => {
		dispatch(gameTimeout())
	}, [dispatch])

	const onTimeAlmostUp = useCallback(() => {
		dispatch(gameTimeAlmostUp())
	}, [dispatch])

	return {
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
	}
}

export { useSprintGame }
