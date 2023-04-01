import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import Alert from '@mui/lab/Alert'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { Path } from '~/components/router'
import { clearError, selectAuthIsLoggedIn, selectAuthLoading, selectAuthSignInError, signIn } from '~/features/auth'
import { validateEmail } from '~/utils/helpers'

function SignIn() {
	const { t } = useTranslation()

	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const loading = useAppSelector(selectAuthLoading)
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)
	const signInError = useAppSelector(selectAuthSignInError)

	const [emailData, setEmailData] = useState('')
	const [emailError, setEmailError] = useState('')
	const [passwordData, setPasswordData] = useState('')
	const [passwordError, setPasswordError] = useState('')

	useEffect(() => {
		if (!emailData) return

		setEmailError(validateEmail(emailData) ? '' : t('AUTH.INVALID_EMAIL')!)
	}, [emailData, t])

	useEffect(() => {
		if (!passwordData) return

		setPasswordError(passwordData.length < 8 ? t('AUTH.SHORT_PASSWORD')! : '')
	}, [passwordData, t])

	useEffect(() => {
		dispatch(clearError())
	}, [dispatch, emailData, passwordData])

	const handleSubmit = (e: SyntheticEvent) => {
		e.preventDefault()

		if (!passwordData || !emailData) {
			setEmailError(t('AUTH.INVALID_EMAIL')!)
			setPasswordError(t('AUTH.SHORT_PASSWORD')!)
		}

		dispatch(signIn({ email: emailData, password: passwordData }))
	}

	// TODO: maybe it's a good idea to move this logic to store or app context
	// eslint-disable-next-line consistent-return
	useEffect(() => {
		if (isLoggedIn) {
			navigate(Path.HOME)
		}
	}, [navigate, isLoggedIn])

	return (
		<Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
			<Box component="form" onSubmit={handleSubmit}>
				<Typography variant="h3" gutterBottom>
					{t('AUTH.SIGN_IN')}
				</Typography>
				{signInError && (
					<Alert severity="error" sx={{ my: 2 }}>
						{signInError}
					</Alert>
				)}
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
						type="password"
						name="password"
						error={!!passwordError}
						helperText={passwordError}
					/>
				</FormControl>
				<LoadingButton fullWidth type="submit" disabled={!!passwordError || !!emailError} loading={loading} loadingIndicator={t('COMMON.LOADING')} variant="outlined">
					{t('AUTH.SIGN_IN')}
				</LoadingButton>
				<Button sx={{ my: 1 }} fullWidth variant="text" component={RouterLink} to={Path.SIGN_UP}>
					{t('AUTH.SIGN_UP_PROMPT')}
				</Button>
			</Box>
		</Stack>
	)
}

export default SignIn
