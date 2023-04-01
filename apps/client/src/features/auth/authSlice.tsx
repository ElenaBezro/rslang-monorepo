import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { SignInData, SignUpData, UserInfo } from '~/types/auth'
import { signIn as signInApi, signUp as signUpApi } from '~/utils/api'
import { handleError } from '~/utils/helpers'
import { localStorageClear, localStorageGetUser, localStorageSetUser } from '~/utils/localStorage'

export const signIn = createAsyncThunk('auth/signin', (signInData: SignInData, { rejectWithValue }) => {
	try {
		return signInApi(signInData)
	} catch (e) {
		const errorToShow = handleError(e)
		return rejectWithValue(errorToShow)
	}
})

export const signUp = createAsyncThunk('auth/signup', async (signUpData: SignUpData, { rejectWithValue }) => {
	try {
		await signUpApi(signUpData)
		return { email: signUpData.email, password: signUpData.password }
	} catch (e) {
		const errorToShow = handleError(e)
		return rejectWithValue(errorToShow)
	}
})

const initialUser = localStorageGetUser() || undefined

interface AuthState {
	userInfo: UserInfo | undefined
	isLoggedIn: boolean
	isSignUpInProcess: boolean
	signUpError: string
	signInError: string
	loading: boolean
}

const initialState: AuthState = {
	userInfo: initialUser,
	isLoggedIn: !!initialUser?.token,
	isSignUpInProcess: false,
	signUpError: '',
	signInError: '',
	loading: false,
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError: state => {
			state.signInError = ''
			state.signUpError = ''
		},
		setUser: (state, action) => {
			state.userInfo = action.payload
			state.isLoggedIn = !!state.userInfo?.token
		},
		signOut: state => {
			state.userInfo = undefined
			state.isLoggedIn = false
			localStorageClear()
		},
	},
	extraReducers: builder => {
		builder
			.addCase(signIn.pending, state => {
				state.loading = true
			})
			.addCase(signIn.fulfilled, (state, action) => {
				const { token, refreshToken, userId, name } = action.payload
				state.userInfo = { token, userId, name, refreshToken }
				state.loading = false
				state.isLoggedIn = true
				state.signInError = ''
				state.signUpError = ''
				state.isSignUpInProcess = false

				const currentTime = new Date()
				currentTime.setHours(currentTime.getHours() + 3)
				const expirationDate = currentTime.getTime()

				const infoToStore = {
					token,
					userId,
					name,
					refreshToken,
					expirationDate,
				}
				localStorageSetUser(infoToStore)
			})
			.addCase(signIn.rejected, (state, action) => {
				state.signInError = action.payload as string
				state.loading = false
			})
			.addCase(signUp.pending, state => {
				state.loading = true
			})
			.addCase(signUp.fulfilled, state => {
				state.signUpError = ''
				state.isSignUpInProcess = true
				state.loading = false
			})
			.addCase(signUp.rejected, (state, action) => {
				state.signUpError = action.payload as string
				state.isSignUpInProcess = false
				state.loading = false
			})
	},
})

export const { clearError, setUser, signOut } = authSlice.actions
export default authSlice.reducer
