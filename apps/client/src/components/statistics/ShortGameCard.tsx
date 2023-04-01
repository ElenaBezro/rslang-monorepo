import React from 'react'
import { useTranslation } from 'react-i18next'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

interface ShortGameCardProps {
	gameName: 'audiocall' | 'sprint'
	newWords: number
	correctPercent: string
	longestSeries: number
	bgColor: string
}

export default function ShortGameCard({ gameName, newWords, correctPercent, longestSeries, bgColor }: ShortGameCardProps) {
	const { t } = useTranslation()
	return (
		<Card style={{ backgroundColor: bgColor }}>
			<CardContent>
				<Typography variant="h4" textAlign="center" gutterBottom>
					{gameName === 'audiocall' ? t('AUDIOCALL.TITLE') : t('SPRINT.TITLE')}
				</Typography>
				<List>
					<ListItem disablePadding>
						<ListItemText
							primary={t('STATISTIC.NEW_WORDS', { words: `${newWords}` })}
							primaryTypographyProps={{
								fontSize: 18,
								textAlign: 'center',
							}}
						/>
					</ListItem>
					<ListItem disablePadding>
						<ListItemText
							primary={t('STATISTIC.CORRECT_WORDS_PERCENT', { percent: `${correctPercent}` })}
							primaryTypographyProps={{
								fontSize: 18,
								textAlign: 'center',
							}}
						/>
					</ListItem>
					<ListItem disablePadding>
						<ListItemText
							primary={t('STATISTIC.LONGEST_CORRECT_SERIES', { series: `${longestSeries}` })}
							primaryTypographyProps={{
								fontSize: 18,
								textAlign: 'center',
							}}
						/>
					</ListItem>
				</List>
			</CardContent>
		</Card>
	)
}
