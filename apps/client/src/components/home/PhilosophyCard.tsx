import { Card, CardContent, Typography } from '@mui/material'
import { amber, blue, pink, teal } from '@mui/material/colors'

interface PhilosophyCardProps {
	title: string
	desc: string
	textColor: string
}

const PHILOSOPHY_COLORS: Record<string, string> = {
	textbook: amber[500],
	dictionary: pink[300],
	statistic: teal[300],
	games: blue[300],
}

export default function PhilosophyCard({ title, desc, textColor }: PhilosophyCardProps) {
	return (
		<Card sx={{ maxWidth: 270, height: 215, textAlign: 'center', bgColor: '#38c4c1' }}>
			<CardContent>
				<Typography gutterBottom variant="h5" component="div" sx={{ color: `${PHILOSOPHY_COLORS[textColor]}` }}>
					{title}
				</Typography>
				<Typography variant="body2" color="text.secondary" fontStyle="italic">
					{desc}
				</Typography>
			</CardContent>
		</Card>
	)
}
