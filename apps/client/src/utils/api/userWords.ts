import { GetUserWordsResponse } from '~/types/api'
import { UserWord, Word } from '~/types/word'

import { get, post, put } from './base'

export const getUserWords = (id: string, group: number, page: number) =>
	get<GetUserWordsResponse[]>(`users/${id}/aggregatedWords?filter={"group":${group},"page":${page}}&wordsPerPage=20`)

export const getNotLearnedWord = (id: string, group: number, page: number) =>
	get<GetUserWordsResponse[]>(
		`users/${id}/aggregatedWords?filter={"$and":[{"$or":[{"userWord.optional.isLearned":false},{"userWord":null}]},{"group":${group},"page":${page}}]}&wordsPerPage=600`
	)

export const getUserWord = (userId: string, wordId: string) => get<Word>(`users/${userId}/words/${wordId}`)

export const getDifficultWords = (id: string) => get<GetUserWordsResponse[]>(`users/${id}/aggregatedWords?filter={"$and":[{"userWord.difficulty":"difficult"}]}&wordsPerPage=600`)

export const addWordToDifficult = (userId: string, wordId: string, difficulty: string) => post<UserWord>(`users/${userId}/words/${wordId}`, { difficulty })

export const removeWordFromDifficult = (userId: string, wordId: string, difficulty: string) => put<UserWord>(`users/${userId}/words/${wordId}`, { difficulty })

export const addWordToLearned = async (userId: string, wordId: string, isLearned: boolean, isUpdateOperation: boolean) => {
	const data = { optional: { isLearned } }
	if (isUpdateOperation) {
		return put<UserWord>(`users/${userId}/words/${wordId}`, { data })
	}
	return post<UserWord>(`users/${userId}/words/${wordId}`, { data })
}

export const getLearnedWordsByGroup = async (userId: string, group: number, page: number) =>
	get<GetUserWordsResponse[]>(`users/${userId}/aggregatedWords?filter={"$and":[{"userWord.optional.isLearned":true},{"group":${group},"page":${page}}]}&wordsPerPage=600`)
