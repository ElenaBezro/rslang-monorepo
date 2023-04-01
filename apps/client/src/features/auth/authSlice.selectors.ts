import { RootState } from '~/app/store'

export const selectAuthLoading = (state: RootState) => state.auth.loading
export const selectAuthIsLoggedIn = (state: RootState) => state.auth.isLoggedIn
export const selectAuthSignInError = (state: RootState) => state.auth.signInError
export const selectAuthSignUpError = (state: RootState) => state.auth.signUpError
export const selectAuthIsSignUpInProcess = (state: RootState) => state.auth.isSignUpInProcess
export const selectAuthUserInfo = (state: RootState) => state.auth.userInfo
