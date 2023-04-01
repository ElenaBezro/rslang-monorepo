import { Word } from './word'

interface GetUserWordsResponse {
	paginatedResults: Word[]
	totalCount: [
		{
			count: number
		}
	]
}

interface TokenResponse {
	message: string
	token: string
	refreshToken: string
	userId: string
	name: string
}

export type { GetUserWordsResponse, TokenResponse }
