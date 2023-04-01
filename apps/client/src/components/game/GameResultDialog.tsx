import { Ref, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import VolumeUp from '@mui/icons-material/VolumeUp'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Slide from '@mui/material/Slide'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { lightGreen, red } from '@mui/material/colors'
import { TransitionProps } from '@mui/material/transitions'

import { useAppSelector } from '~/app/hooks'
import { selectStatisticIsUpdating } from '~/features/statistic'
import { Word } from '~/types/word'
import { DOMAIN_URL } from '~/utils/constants'

import { Path } from '../router'

export interface GameResultDialogProps {
	isOpen: boolean
	incorrectWords: Word[]
	correctWords: Word[]
}

const Transition = forwardRef(
	(
		props: TransitionProps & {
			children: JSX.Element
		},
		ref: Ref<unknown>
	) => <Slide direction="up" ref={ref} {...props} />
)
Transition.displayName = 'Transition'

export function GameResultDialog({ isOpen, incorrectWords, correctWords }: GameResultDialogProps) {
	const { t } = useTranslation()

	const isUpdating = useAppSelector(selectStatisticIsUpdating)

	const toggleAudio = (word: Word) => {
		const audio = new Audio(`${DOMAIN_URL}/${word.audio}`)
		audio.play()
	}

	return (
		<div>
			<Dialog open={isOpen} TransitionComponent={Transition} keepMounted maxWidth="sm" fullWidth aria-describedby="popup with game results">
				<DialogTitle>{t('GAME_RESULT_DIALOG.TITLE')}</DialogTitle>
				<DialogContent>
					<Box display="flex" justifyContent="space-between">
						<Box>
							<Stack direction="row" spacing={2} alignItems="center">
								<Typography color="success">{t('GAME_RESULT_DIALOG.CORRECT')}</Typography>
								<Chip label={correctWords.length} color="success" style={{ backgroundColor: lightGreen[400] }} />
							</Stack>
							<List dense>
								{correctWords.map(word => (
									<ListItem key={word.id} sx={{ paddingLeft: '0' }}>
										<IconButton aria-label="play audio" size="small" onClick={() => toggleAudio(word)}>
											<VolumeUp fontSize="inherit" />
										</IconButton>
										<ListItemText primary={word.word} />
									</ListItem>
								))}
							</List>
						</Box>
						<Box>
							<Stack direction="row" spacing={2} alignItems="center">
								<Typography color="error">{t('GAME_RESULT_DIALOG.INCORRECT')}</Typography>
								<Chip label={incorrectWords.length} color="error" style={{ backgroundColor: red[400] }} />
							</Stack>

							<List dense>
								{incorrectWords.map(word => (
									<ListItem key={word.id} sx={{ paddingLeft: '0' }}>
										<IconButton aria-label="play audio" size="small" onClick={() => toggleAudio(word)}>
											<VolumeUp fontSize="inherit" />
										</IconButton>
										<ListItemText primary={word.word} />
									</ListItem>
								))}
							</List>
						</Box>
					</Box>
				</DialogContent>
				<DialogActions>
					<LoadingButton component={RouterLink} to={Path.HOME} disabled={isUpdating} loading={isUpdating} variant="contained">
						{t('HEADER.HOME')}
					</LoadingButton>
				</DialogActions>
			</Dialog>
		</div>
	)
}
