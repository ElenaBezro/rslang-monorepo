import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/app/store'
import { Word } from '~/types/word'
import { getDifficultWords, getNotLearnedWord, getUserWords } from '~/utils/api/userWords'
import { getAllWords } from '~/utils/api/words'
import { DOMAIN_URL, MAX_AUDIOCALL_ANSWERS_AMOUNT, WORD_PER_PAGE_AMOUNT } from '~/utils/constants'
import { shuffleArray } from '~/utils/helpers'

export interface AudiocallState {
	words: Word[]
	answers: string[]
	currentIdx: number
	currentWord: null | Word
	answeredWord: string | null
	incorrectAnswers: Word[]
	correctAnswers: Word[]
	longestSeries: {
		correctAnswers: number[]
		stopped: boolean
	}
	isLevelSelection: boolean
	isFinished: boolean
	audioPath: string
	status: 'idle' | 'loading' | 'failed' | 'success'
	isWithSounds: boolean
	progress: number
}

const initialState: AudiocallState = {
	words: [],
	answers: [],
	currentIdx: 0,
	currentWord: null,
	answeredWord: null,
	incorrectAnswers: [],
	correctAnswers: [],
	longestSeries: {
		correctAnswers: [0],
		stopped: false,
	},
	isLevelSelection: false,
	isFinished: false,
	audioPath: '',
	status: 'idle',
	isWithSounds: true,
	progress: 0,
}

interface FetchWordsParams {
	group: number
	page: number
	isFromTextbook: boolean
}

export const fetchAudiocallWords = createAsyncThunk<{ wordsForGame: Word[]; answers: string[] }, FetchWordsParams, { state: RootState }>(
	'audiocall/fetchWords',
	async ({ group, page, isFromTextbook }, { getState }) => {
		const state = getState()
		const { isLoggedIn, userInfo } = state.auth

		let wordsForGame

		if (userInfo && isLoggedIn) {
			const allUserWordsResponse = await getUserWords(userInfo.userId, group, page)
			const allUserWords = allUserWordsResponse[0].paginatedResults

			if (group !== 6) {
				if (isFromTextbook) {
					const addNotLearnedWordsFromPage = async (currentPage: number, words: Word[]): Promise<Word[]> => {
						const response = await getNotLearnedWord(userInfo.userId, group, currentPage)
						const wordsFromPage = response[0].paginatedResults
						words.unshift(...wordsFromPage)

						if (words.length < WORD_PER_PAGE_AMOUNT && currentPage !== 0) {
							return addNotLearnedWordsFromPage(currentPage - 1, words)
						}

						return words.slice(0, WORD_PER_PAGE_AMOUNT)
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
			const allWords = await getAllWords(group, page)
			wordsForGame = allWords
		}

		const answers = wordsForGame.map((word: Word) => word.wordTranslate)

		return { wordsForGame, answers }
	}
)

const calulateProgress = (totalLength: number, currentNumber: number) => Math.floor((currentNumber / totalLength) * 100)

const getRandomAnswers = (correctAnswer: string, answers: string[]) => {
	shuffleArray(answers)

	const randomAnswers: string[] = [correctAnswer]

	const answersAmount = answers.length < MAX_AUDIOCALL_ANSWERS_AMOUNT ? answers.length : MAX_AUDIOCALL_ANSWERS_AMOUNT

	for (let i = 0; randomAnswers.length < answersAmount; i += 1) {
		const possibleAnswer = answers[i]
		if (possibleAnswer !== correctAnswer && !randomAnswers.includes(possibleAnswer)) {
			randomAnswers.push(possibleAnswer)
		}
	}

	shuffleArray(randomAnswers)

	return randomAnswers
}

export const audiocallSlice = createSlice({
	name: 'audiocall',
	initialState,
	reducers: {
		showNextWord: state => {
			const currentWord = state.currentWord!

			if (!state.answeredWord) {
				// eslint-disable-next-line no-underscore-dangle
				const updatedWord = { ...currentWord, id: currentWord._id! }
				state.incorrectAnswers = [...state.incorrectAnswers, updatedWord]
				state.longestSeries.stopped = true

				const incorrectAnswerAudio = new Audio('/assets/audio/incorrect_answer_audiocall.mp3')

				if (state.isWithSounds) {
					incorrectAnswerAudio.play()
				}
			}

			state.progress = calulateProgress(state.words.length, state.currentIdx + 1)

			if (state.currentIdx === state.words.length - 1) {
				state.isFinished = true
				return
			}

			state.currentIdx += 1
			const newCurrentWord = state.words[state.currentIdx]
			const audioPath = `${DOMAIN_URL}/${newCurrentWord.audio}`
			const correctAnswer = state.words[state.currentIdx].wordTranslate
			const onlyAnswers = state.words.map(word => word.wordTranslate)
			const randomAnswers = getRandomAnswers(correctAnswer, onlyAnswers)

			state.currentWord = newCurrentWord

			state.answers = randomAnswers
			state.audioPath = audioPath
			const newAudio = new Audio(audioPath)
			newAudio.play()
			state.answeredWord = null
		},
		toggleLevelSelection: (state, action) => {
			state.isLevelSelection = action.payload
		},
		toggleAudiocallAudio: state => {
			const newAudio = new Audio(state.audioPath)
			newAudio.play()
		},
		resetGame: state => {
			Object.assign(state, initialState)
		},
		checkAnswer: (state, action) => {
			const correctAnswerAudio = new Audio('/assets/audio/correct_answer_audiocall.mp3')
			const incorrectAnswerAudio = new Audio('/assets/audio/incorrect_answer_audiocall.mp3')

			const { answer, isKeyboard } = action.payload
			const { currentWord } = state
			let actualWord

			if (isKeyboard) {
				actualWord = state.answers[answer - 1]
			} else {
				actualWord = answer
			}

			state.answeredWord = actualWord

			// eslint-disable-next-line no-underscore-dangle
			const updatedWord = { ...currentWord!, id: currentWord!._id! }

			if (actualWord !== currentWord!.wordTranslate) {
				state.incorrectAnswers = [...state.incorrectAnswers, updatedWord]
				state.longestSeries.stopped = true

				if (state.isWithSounds) {
					incorrectAnswerAudio.play()
				}
			} else {
				if (state.longestSeries.stopped) {
					state.longestSeries.correctAnswers = [...state.longestSeries.correctAnswers, 1]
					state.longestSeries.stopped = false
				} else {
					state.longestSeries.correctAnswers[state.longestSeries.correctAnswers.length - 1] += 1
				}

				state.correctAnswers = [...state.correctAnswers, updatedWord]

				if (state.isWithSounds) {
					correctAnswerAudio.play()
				}
			}
		},
		toggleSounds: state => {
			state.isWithSounds = !state.isWithSounds
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchAudiocallWords.pending, state => {
				state.status = 'loading'
				state.isFinished = false
			})
			.addCase(fetchAudiocallWords.fulfilled, (state, action) => {
				state.status = 'success'
				const { wordsForGame, answers } = action.payload
				state.words = wordsForGame
				const correctAnswer = state.words[state.currentIdx].wordTranslate

				const randomAnswers = getRandomAnswers(correctAnswer, answers)
				state.answers = randomAnswers

				// eslint-disable-next-line prefer-destructuring
				state.currentWord = state.words[0]

				state.audioPath = `${DOMAIN_URL}/${state.currentWord!.audio}`
				const newAudio = new Audio(state.audioPath)
				newAudio.play()
			})
	},
})

export const { showNextWord, toggleAudiocallAudio, toggleLevelSelection, resetGame, checkAnswer, toggleSounds } = audiocallSlice.actions
export default audiocallSlice.reducer
