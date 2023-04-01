import { useTranslation } from 'react-i18next'

import { SelectChangeEvent } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { selectAuthIsLoggedIn } from '~/features/auth'
import { changeGroup, fetchDifficultWords, fetchTextbookWords, selectTextbookGroup } from '~/features/textbook'

export default function SectionDropdown() {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const group = useAppSelector(selectTextbookGroup)
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)

	const handleChange = (event: SelectChangeEvent) => {
		const selectedGroup = +event.target.value

		if (selectedGroup === 6) {
			dispatch(changeGroup(selectedGroup))
			dispatch(fetchDifficultWords())
		} else {
			dispatch(changeGroup(selectedGroup))
			dispatch(fetchTextbookWords())
		}
	}

	return (
		<FormControl>
			<InputLabel>{t('LEVEL_SELECTION.SELECT_LEVEL')}</InputLabel>
			<Select value={`${group}`} label={t('LEVEL_SELECTION.SELECT_LEVEL')} onChange={handleChange}>
				<MenuItem value={0}>{t('LEVEL_SELECTION.GROUP', { count: 1 })}</MenuItem>
				<MenuItem value={1}>{t('LEVEL_SELECTION.GROUP', { count: 2 })}</MenuItem>
				<MenuItem value={2}>{t('LEVEL_SELECTION.GROUP', { count: 3 })}</MenuItem>
				<MenuItem value={3}>{t('LEVEL_SELECTION.GROUP', { count: 4 })}</MenuItem>
				<MenuItem value={4}>{t('LEVEL_SELECTION.GROUP', { count: 5 })}</MenuItem>
				<MenuItem value={5}>{t('LEVEL_SELECTION.GROUP', { count: 6 })}</MenuItem>
				{isLoggedIn && <MenuItem value={6}>{t('LEVEL_SELECTION.DIFFICULT')}</MenuItem>}
			</Select>
		</FormControl>
	)
}
