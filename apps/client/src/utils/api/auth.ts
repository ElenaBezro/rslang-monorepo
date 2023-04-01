import { SignInData, SignInResponse, SignUpData, SignUpResponse } from '~/types/auth'

import { post } from './base'

export const signIn = (signinData: SignInData) => post<SignInResponse>(`signin`, signinData)

export const signUp = (signupData: SignUpData) => post<SignUpResponse>(`users`, signupData)
