import { Word } from '~/types/word'

import { get } from './base'

export const getAllWords = (group: number, page?: number) => get<Word[]>('words', { params: { group, page } })
