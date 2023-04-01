import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'

import { useAppSelector } from '~/app/hooks'
import { Path } from '~/components/router'
import { selectAuthIsLoggedIn, signOut } from '~/features/auth'
import { localStorageRemoveUser } from '~/utils/localStorage'

const Logoff = () => {
	const dispatch = useDispatch()
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)

	useEffect(() => {
		if (isLoggedIn) {
			dispatch(signOut())
			localStorageRemoveUser()
		} else {
			window.location.href = Path.HOME
		}
	}, [isLoggedIn, dispatch])

	return (
		<Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
			<CircularProgress />
		</Container>
	)
}

export { Logoff }
