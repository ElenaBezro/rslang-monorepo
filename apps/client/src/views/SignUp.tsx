import { ChangeEvent, SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { Path } from '~/components/router'
import { clearError, selectAuthIsLoggedIn, selectAuthIsSignUpInProcess, selectAuthLoading, selectAuthSignUpError, signIn, signUp } from '~/features/auth'
import { createNewStatistic } from '~/features/statistic/statisticSlice'
import { validateEmail } from '~/utils/helpers'

function SignUp() {
	const { t } = useTranslation()

	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const loading = useAppSelector(selectAuthLoading)
	const signUpError = useAppSelector(selectAuthSignUpError)
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)
	const isSignUpInProcess = useAppSelector(selectAuthIsSignUpInProcess)

	const [nameData, setNameData] = useState('')
	const [nameError, setNameError] = useState('')
	const [emailData, setEmailData] = useState('')
	const [emailError, setEmailError] = useState('')
	const [passwordData, setPasswordData] = useState('')
	const [passwordError, setPasswordError] = useState('')

	useEffect(() => {
		if (!nameData) return

		setNameError(nameData.length < 2 ? t('AUTH.NAME_TOO_SHORT') : '')
	}, [nameData, t])

	useEffect(() => {
		if (!emailData) return

		setEmailError(validateEmail(emailData) ? '' : t('AUTH.INVALID_EMAIL'))
	}, [emailData, t])

	useEffect(() => {
		if (!passwordData) return

		setPasswordError(passwordData.length < 8 ? t('AUTH.SHORT_PASSWORD') : '')
	}, [passwordData, t])

	useEffect(() => {
		dispatch(clearError())
	}, [dispatch, nameData, emailData, passwordData])

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault()

		if (!nameData || !passwordData || !emailData) {
			setNameError(t('AUTH.NAME_TOO_SHORT'))
			setEmailError(t('AUTH.INVALID_EMAIL'))
			setPasswordError(t('AUTH.SHORT_PASSWORD'))
		}

		await dispatch(signUp({ name: nameData, email: emailData, password: passwordData }))
	}

	const signInAfterSignUp = useCallback(async () => {
		await dispatch(signIn({ email: emailData, password: passwordData }))
		await dispatch(createNewStatistic())
	}, [dispatch, emailData, passwordData])

	useEffect(() => {
		if (!signUpError && isSignUpInProcess) {
			signInAfterSignUp()
		}
	}, [isSignUpInProcess, signInAfterSignUp, signUpError])

	// TODO: maybe it's a good idea to move this logic to store or app context
	// eslint-disable-next-line consistent-return
	useEffect(() => {
		if (isLoggedIn) {
			return navigate(Path.HOME)
		}
	}, [navigate, isLoggedIn])

	return (
		<Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
			<Box component="form" onSubmit={handleSubmit}>
				<Typography variant="h3" gutterBottom>
					{t('AUTH.SIGN_UP')}
				</Typography>
				{signUpError && (
					<Alert severity="error" sx={{ my: 2 }}>
						{signUpError}
					</Alert>
				)}
				<FormControl fullWidth sx={{ my: 1 }}>
					<TextField
						value={nameData}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setNameData(e.target.value)}
						label={t('AUTH.NAME')}
						name="name"
						error={!!nameError}
						helperText={nameError}
					/>
				</FormControl>
				<FormControl fullWidth sx={{ my: 1 }}>
					<TextField
						value={emailData}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setEmailData(e.target.value)}
						label={t('AUTH.EMAIL')}
						name="email"
						error={!!emailError}
						helperText={emailError}
					/>
				</FormControl>
				<FormControl fullWidth sx={{ my: 1 }}>
					<TextField
						value={passwordData}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordData(e.target.value)}
						label={t('AUTH.PASSWORD')}
						name="password"
						type="password"
						error={!!passwordError}
						helperText={passwordError}
					/>
				</FormControl>
				<LoadingButton
					sx={{ my: 1 }}
					fullWidth
					type="submit"
					disabled={!!passwordError || !!emailError}
					loading={loading}
					loadingIndicator={t('COMMON.LOADING')}
					variant="outlined"
				>
					{t('AUTH.SIGN_UP')}
				</LoadingButton>
				<Button sx={{ my: 1 }} fullWidth variant="text" component={RouterLink} to={Path.SIGN_IN}>
					{t('AUTH.SIGN_IN_PROMPT')}
				</Button>
			</Box>
		</Stack>
	)
}

export default SignUp
