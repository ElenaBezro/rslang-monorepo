import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/app/store'
import { Word } from '~/types/word'
import { getAllWords, getDifficultWords, getNotLearnedWord, getUserWords } from '~/utils/api'
import { DOMAIN_URL, SPRINT_BASE_CORRECT_ANSWER_POINTS, WORD_PER_PAGE_AMOUNT } from '~/utils/constants'
import { shuffleArray } from '~/utils/helpers'

type SprintState = {
	words: Word[]
	currentWord: Word | undefined
	suggestedTranslation: string | undefined
	currentIdx: number
	correctWords: Word[]
	incorrectWords: Word[]
	correctAnswersInRow: number
	maxCorrectAnswersSequence: number
	gameRound: number
	totalPoints: number
	audioPath: string
	isMute: boolean
	status: 'idle' | 'loading' | 'failed' | 'countdown' | 'game-running' | 'game-over'
}

const initialState: SprintState = {
	words: [],
	currentIdx: 0,
	currentWord: undefined,
	suggestedTranslation: undefined,
	correctWords: [],
	incorrectWords: [],
	correctAnswersInRow: 0,
	maxCorrectAnswersSequence: 0,
	gameRound: 1,
	totalPoints: 0,
	audioPath: '',
	isMute: false,
	status: 'idle',
}

const getSuggestedTranslation = (currentWord: Word, words: Word[]) => {
	const shouldSuggestCorrectOption = Math.random() > 0.5
	if (shouldSuggestCorrectOption) {
		return currentWord.wordTranslate
	}

	const otherWords = words.filter(word => word !== currentWord)
	return otherWords[Math.floor(Math.random() * otherWords.length)].wordTranslate
}

interface FetchWordsParams {
	group: number
	page: number
	isFromTextbook: boolean
}

const loadWords = createAsyncThunk<{ wordsForGame: Word[]; answers: string[] }, FetchWordsParams, { state: RootState }>(
	'sprint/loadWords',
	async ({ group, page, isFromTextbook }, { getState }) => {
		const state = getState()
		const { isLoggedIn, userInfo } = state.auth

		let wordsForGame

		// if there are possibly learned words
		if (userInfo && isLoggedIn) {
			if (group !== 6) {
				const allUserWordsResponse = await getUserWords(userInfo.userId, group, page)
				const allUserWords = allUserWordsResponse[0].paginatedResults

				if (isFromTextbook) {
					const addNotLearnedWordsFromPage = async (currentPage: number, words: Word[]): Promise<Word[]> => {
						const response = await getNotLearnedWord(userInfo.userId, group, currentPage)
						const wordsFromPage = response[0].paginatedResults
						words.unshift(...wordsFromPage)

						if (words.length < WORD_PER_PAGE_AMOUNT && currentPage !== 0) {
							return addNotLearnedWordsFromPage(currentPage - 1, words)
						}

						const sliced = words.slice(0, WORD_PER_PAGE_AMOUNT)
						return sliced
					}
					wordsForGame = await addNotLearnedWordsFromPage(page, [])
				} else {
					wordsForGame = allUserWords
				}
				// if from difficult page
			} else {
				const allWords = await getDifficultWords(userInfo!.userId)
				wordsForGame = allWords[0].paginatedResults
			}
		} else {
			wordsForGame = await getAllWords(group, page)
		}

		const answers = wordsForGame.map((word: Word) => word.wordTranslate)

		return { wordsForGame, answers }
	}
)

export const sprintSlice = createSlice({
	name: 'sprint',
	initialState,
	reducers: {
		answer: (state, action: PayloadAction<boolean>) => {
			const correctAnswerAudio = new Audio('/assets/audio/correct_answer2.mp3')
			const incorrectAnswerAudio = new Audio('/assets/audio/incorrect_answer2.mp3')
			const newRoundAudio = new Audio('/assets/audio/new_round.mp3')

			if (state.currentWord) {
				const correctOption = state.suggestedTranslation === state.currentWord.wordTranslate
				if (action.payload === correctOption) {
					state.correctWords = [...state.correctWords, state.currentWord]
					state.correctAnswersInRow += 1
					state.totalPoints += SPRINT_BASE_CORRECT_ANSWER_POINTS * state.gameRound
					if (!state.isMute) {
						correctAnswerAudio.play()
					}
					if (state.gameRound < 4 && state.correctAnswersInRow % 4 === 0 && state.correctAnswersInRow !== 0) {
						state.gameRound += 1
						if (!state.isMute) {
							newRoundAudio.play()
						}
					}
				} else {
					state.incorrectWords = [...state.incorrectWords, state.currentWord]
					state.maxCorrectAnswersSequence = Math.max(state.maxCorrectAnswersSequence, state.correctAnswersInRow)
					state.correctAnswersInRow = 0
					state.gameRound = 1
					if (!state.isMute) {
						incorrectAnswerAudio.play()
					}
				}
			}

			if (state.currentIdx < state.words.length - 1) {
				state.currentIdx += 1
				state.currentWord = state.words[state.currentIdx]
				state.suggestedTranslation = getSuggestedTranslation(state.currentWord!, state.words)
				state.audioPath = `${DOMAIN_URL}/${state.currentWord!.audio}`
			} else {
				state.status = 'game-over'

				// if all answers were correct
				if (state.maxCorrectAnswersSequence === 0) {
					state.maxCorrectAnswersSequence = state.correctAnswersInRow
				}
			}
		},
		reset: state => {
			Object.assign(state, initialState)
		},
		gameTimeout: state => {
			state.status = 'game-over'
		},
		gameTimeAlmostUp: state => {
			if (!state.isMute) {
				const audio = new Audio('/assets/audio/time_count.mp3')
				audio.play()
			}
		},
		playWordAudio: state => {
			const newAudio = new Audio(state.audioPath)
			newAudio.play()
		},
		toggleMute: state => {
			state.isMute = !state.isMute
		},
		startSprint: state => {
			state.status = 'game-running'
		},
	},
	extraReducers: builder => {
		builder
			.addCase(loadWords.pending, state => {
				state.status = 'loading'
			})
			.addCase(loadWords.fulfilled, (state, action) => {
				const { wordsForGame } = action.payload
				state.status = 'countdown'
				state.words = wordsForGame
				shuffleArray(state.words)
				state.currentWord = state.words[state.currentIdx]
				state.suggestedTranslation = getSuggestedTranslation(state.currentWord!, state.words)
				state.audioPath = `${DOMAIN_URL}/${state.currentWord!.audio}`
			})
	},
})

export const { answer, reset, gameTimeAlmostUp, gameTimeout, playWordAudio, toggleMute, startSprint } = sprintSlice.actions
export { loadWords }
export default sprintSlice.reducer
