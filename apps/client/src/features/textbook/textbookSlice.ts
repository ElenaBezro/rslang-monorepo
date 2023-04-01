import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/app/store'
import { Word, WordDifficulty } from '~/types/word'
import { getDifficultWords, getUserWords } from '~/utils/api/userWords'
import { getAllWords } from '~/utils/api/words'
import { localStorageSetPagination } from '~/utils/localStorage'

export interface TextbookState {
	words: Word[]
	page: number
	group: number
	status: 'idle' | 'loading' | 'failed' | 'success'
	isAudioPlaying: boolean
}

const initialState: TextbookState = {
	words: [],
	page: 0,
	group: 0,
	status: 'idle',
	isAudioPlaying: false,
}

export const fetchTextbookWords = createAsyncThunk<Word[], void, { state: RootState }>('textbook/fetchWords', async (_arg, { getState }) => {
	const state = getState()
	const { page, group } = state.textbook
	const { userInfo } = state.auth
	const userId = userInfo?.userId as string

	if (userId) {
		const response = await getUserWords(userId, group, page)

		// eslint-disable-next-line no-underscore-dangle
		const modified = response[0].paginatedResults.map((word: Word) => ({ ...word, id: word._id! }))
		return modified
	}

	return getAllWords(group, page)
})

export const fetchDifficultWords = createAsyncThunk<Word[], void, { state: RootState }>('textbook/fetchDifficultWords', async (arg, { getState }) => {
	const state = getState()
	const { userInfo } = state.auth
	if (!userInfo) {
		throw new Error('Not permitted')
	}

	const response = await getDifficultWords(userInfo.userId as string)
	// TODO: refactor duplicated code
	// eslint-disable-next-line no-underscore-dangle
	return response[0].paginatedResults.map((word: Word) => ({ ...word, id: word._id! }))
})

export const textbookSlice = createSlice({
	name: 'textbook',
	initialState,
	reducers: {
		changePage: (state, action) => {
			const newPage = action.payload
			state.page = newPage
			localStorageSetPagination({ name: 'page', value: newPage })
		},
		toggleAudioStatus: (state, action) => {
			state.isAudioPlaying = action.payload
		},
		changeGroup: (state, action) => {
			const newGroup = action.payload
			state.group = newGroup
			localStorageSetPagination({ name: 'group', value: newGroup })
		},
		changeWordDifficulty: (state, action: PayloadAction<{ passedWord: Word; difficulty: WordDifficulty }>) => {
			const { passedWord, difficulty } = action.payload
			const { id: passedWordId } = passedWord

			state.words = state.words.map(word => {
				if (word.id === passedWordId) {
					const updatedWord = word

					if (updatedWord.userWord) {
						updatedWord.userWord = {
							...updatedWord.userWord,
							difficulty,
						}
					} else {
						updatedWord.userWord = {
							difficulty,
							optional: { correctAnswers: 0, incorrectAnswers: 0, correctStrike: 0, isLearned: false },
						}
					}
					return updatedWord
				}

				return word
			})

			if (difficulty === WordDifficulty.Normal) {
				state.words = state.words.filter(word => word.id !== passedWordId)
			}
		},
		markWordAsLearned: (state, action) => {
			const wordId = action.payload

			state.words = state.words.map(word => {
				if (word.id === wordId) {
					const updatedWord = word

					if (updatedWord.userWord) {
						updatedWord.userWord = {
							...updatedWord.userWord,
							optional: { ...updatedWord.userWord.optional!, isLearned: true },
						}
					} else {
						updatedWord.userWord = {
							difficulty: WordDifficulty.Normal,
							optional: { correctAnswers: 0, incorrectAnswers: 0, correctStrike: 0, isLearned: true },
						}
					}
					return updatedWord
				}

				return word
			})

			if (state.group === 6) {
				state.words = state.words.filter(word => word.id !== wordId)
			}

			state.words = state.words.map(word => {
				if (word.id === wordId) {
					word.userWord = {
						optional: word.userWord!.optional,
						difficulty: WordDifficulty.Normal,
					}
				}

				return word
			})
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchTextbookWords.pending, state => {
				state.status = 'loading'
			})
			.addCase(fetchTextbookWords.fulfilled, (state, action) => {
				state.status = 'success'
				state.words = action.payload
			})
			.addCase(fetchDifficultWords.pending, state => {
				state.status = 'loading'
			})
			.addCase(fetchDifficultWords.fulfilled, (state, action) => {
				state.status = 'success'
				state.words = action.payload
			})
	},
})

export const { changePage, changeGroup, changeWordDifficulty, markWordAsLearned, toggleAudioStatus } = textbookSlice.actions
export default textbookSlice.reducer
