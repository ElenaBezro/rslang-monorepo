import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

interface ShortWordCardProps {
	value: string
	text: string
	bgColor: string
}

export default function ShortWordCard({ value, text, bgColor }: ShortWordCardProps) {
	return (
		<Card style={{ backgroundColor: bgColor }}>
			<CardContent>
				<Typography variant="h3" gutterBottom align="center">
					{value}
				</Typography>
				<Typography sx={{ fontSize: 18 }} color="text.secondary" align="center">
					{text}
				</Typography>
			</CardContent>
		</Card>
	)
}
