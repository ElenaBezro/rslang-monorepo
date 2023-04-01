import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import { green, red, yellow } from '@mui/material/colors'

import { COUNTDOWN_BEFORE_SPRINT_START } from '~/utils/constants'

const CountdownToStart = ({ onComplete }: { onComplete: () => void }) => (
	<CountdownCircleTimer
		isPlaying
		duration={COUNTDOWN_BEFORE_SPRINT_START}
		colors={[green[400], yellow[400], red[500]]}
		colorsTime={[COUNTDOWN_BEFORE_SPRINT_START, 2, 0]}
		size={200}
		onComplete={onComplete}
	>
		{({ remainingTime }) => remainingTime}
	</CountdownCircleTimer>
)

export { CountdownToStart }
