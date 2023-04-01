import { UserStatistic } from '~/types/statistic'
import { UserWord } from '~/types/word'

import { get, post, put } from './base'

export const setNewStatistic = (userId: string, newStatistic: UserStatistic) => put<UserStatistic>(`users/${userId}/statistics`, newStatistic)

export const getUserStatistics = (userId: string) => get<UserStatistic>(`users/${userId}/statistics`)

export const updateCompletedPages = (userId: string, updatedStatistic: UserStatistic['optional']) =>
	put<UserStatistic>(`users/${userId}/statistics`, { optional: updatedStatistic })

export const updateWordStatistic = (userId: string, wordId: string, updatedWord: UserWord) => put<UserWord>(`users/${userId}/words/${wordId}`, updatedWord)

export const addWordStatistic = (userId: string, wordId: string, statistic: UserWord) => post<UserWord>(`users/${userId}/words/${wordId}`, statistic)
