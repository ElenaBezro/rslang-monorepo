import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { TFuncKey } from 'i18next'

import { resources } from '~/app/setupI18n'

const LANGUAGES: Record<keyof typeof resources, TFuncKey> = {
	en: 'LANGUAGES.EN',
	ru: 'LANGUAGES.RU',
}

const LanguageMenu = () => {
	const { i18n, t } = useTranslation()

	const [anchorEl, setAnchorEl] = useState<Element | undefined>()

	const handleLanguageSelect = (language: string) => {
		i18n.changeLanguage(language)
		setAnchorEl(undefined)
	}

	return (
		<>
			<IconButton sx={{ width: 48, height: 48, mr: 2 }} onClick={e => setAnchorEl(e.currentTarget)}>
				<img src={`/assets/flags/${i18n.language.split('-')[0]}.png`} alt={i18n.language} style={{ width: '100%', height: '100%' }} />
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(undefined)}
			>
				{Object.entries(LANGUAGES).map(([language, translationKey]) => (
					<MenuItem key={language} onClick={() => handleLanguageSelect(language)}>
						<Typography fontWeight={language === i18n.language ? '700' : '400'} textAlign="center">
							{t(translationKey)}
						</Typography>
					</MenuItem>
				))}
			</Menu>
		</>
	)
}

export { LanguageMenu }
