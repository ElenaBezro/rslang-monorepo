import { MouseEvent, useState } from 'react'
import { TFuncKey, useTranslation } from 'react-i18next'
import { Link, NavigateOptions, useNavigate } from 'react-router-dom'

import MenuIcon from '@mui/icons-material/Menu'
import PersonIcon from '@mui/icons-material/Person'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { useAppSelector } from '~/app/hooks'
import { LanguageMenu } from '~/components/LanguageMenu'
import { Path } from '~/components/router'
import { selectAuthUserInfo } from '~/features/auth'

const PAGES: { name: TFuncKey; path: Path }[] = [
	{
		name: 'HEADER.HOME',
		path: Path.HOME,
	},
	{
		name: 'HEADER.TEXTBOOK',
		path: Path.TEXTBOOK,
	},
	{
		name: 'HEADER.STATISTIC',
		path: Path.STATISTIC,
	},
]

const GAMES: { name: TFuncKey; path: Path }[] = [
	{
		name: 'HEADER.GAME.SPRINT',
		path: Path.SPRINT,
	},
	{
		name: 'HEADER.GAME.AUDIOCALL',
		path: Path.AUDIOCALL,
	},
]

const SETTINGS: { name: TFuncKey; path: Path }[] = [
	{
		name: 'AUTH.SIGN_UP',
		path: Path.SIGN_UP,
	},
	{
		name: 'AUTH.SIGN_IN',
		path: Path.SIGN_IN,
	},
]

export default function Header() {
	const { t } = useTranslation()

	const navigate = useNavigate()

	const userInfo = useAppSelector(selectAuthUserInfo)

	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
	const [anchorElGames, setAnchorElGames] = useState<null | HTMLElement>(null)

	const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget)
	}

	const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget)
	}

	const handleOpenGamesMenu = (event: MouseEvent<HTMLElement>) => {
		setAnchorElGames(event.currentTarget)
	}

	const handleCloseNavMenu = () => {
		setAnchorElNav(null)
	}

	const handleCloseUserMenu = () => {
		setAnchorElUser(null)
	}

	const handleCloseGamesMenu = () => {
		setAnchorElGames(null)
	}

	const openPage = (path: Path, options?: NavigateOptions) => {
		handleCloseNavMenu()
		handleCloseGamesMenu()
		handleCloseUserMenu()
		navigate(path, options)
	}

	return (
		<AppBar position="static" color="primary" className="header" sx={{ boxShadow: 2 }}>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Box sx={{ height: '100px', width: '200px' }}>
						<img src="/assets/images/logo.png" alt="logo" className="logo" />
					</Box>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{PAGES.map(page => (
								<MenuItem key={page.name} onClick={() => openPage(page.path)}>
									<Typography textAlign="center">{t(page.name)}</Typography>
								</MenuItem>
							))}
							{GAMES.map(page => (
								<MenuItem key={page.name} onClick={() => openPage(page.path)}>
									<Typography textAlign="center">{t(page.name)}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>

					{/* desktop  */}
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{PAGES.map(page => (
							<Button component={Link} to={page.path} key={page.path} onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
								{t(page.name)}
							</Button>
						))}

						<Tooltip title="Open Games">
							<Button onClick={handleOpenGamesMenu} sx={{ display: 'block', color: 'white' }}>
								{t('HEADER.GAMES')}
							</Button>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id="games-menu-appbar"
							anchorEl={anchorElGames}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElGames)}
							onClose={handleCloseGamesMenu}
						>
							{GAMES.map(game => (
								<MenuItem key={game.name} onClick={() => openPage(game.path, { state: { fromTextbook: false } })}>
									<Typography textAlign="center">{t(game.name)}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>

					<LanguageMenu />

					<Stack flexDirection="row" alignItems="center" sx={{ flexGrow: 0 }}>
						{userInfo?.token && (
							<Typography variant="h6" color="white">
								{t('HEADER.WELCOME', { name: userInfo.name })}
							</Typography>
						)}
						<Tooltip title={t('HEADER.OPEN_ACCOUNT')}>
							<IconButton onClick={handleOpenUserMenu} sx={{ color: 'white' }}>
								<PersonIcon />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{userInfo?.token ? (
								<Button onClick={() => openPage(Path.LOGOFF)}>{t('AUTH.SIGN_OUT')}</Button>
							) : (
								SETTINGS.map(setting => (
									<MenuItem key={setting.name} onClick={() => openPage(setting.path)}>
										<Typography textAlign="center">{t(setting.name)}</Typography>
									</MenuItem>
								))
							)}
						</Menu>
					</Stack>
				</Toolbar>
			</Container>
		</AppBar>
	)
}
