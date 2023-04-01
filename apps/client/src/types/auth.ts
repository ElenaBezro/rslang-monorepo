interface SignInResponse {
	message: string
	token: string
	refreshToken: string
	userId: string
	name: string
}

interface SignUpResponse {
	id: string
	name: string
	email: string
}

interface SignInData {
	email: string
	password: string
}

interface SignUpData {
	name: string
	email: string
	password: string
}

interface UserInfo {
	token: string
	refreshToken: string
	userId: string
	name: string
	expirationDate?: number
}

export type { SignInResponse, SignInData, UserInfo, SignUpData, SignUpResponse }
