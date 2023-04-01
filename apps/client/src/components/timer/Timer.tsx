import { useCallback } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import { green, orange, red, yellow } from '@mui/material/colors'

import { SPRINT_TIME_ALMOST_UP_THRESHOLD } from '~/utils/constants'

import { TimerProps } from './Timer.types'

const Timer = ({ duration, onTimeout, onTimeAlmostUp }: TimerProps) => {
	const onUpdate = useCallback(
		(timeLeft: number) => {
			if (timeLeft > 0 && timeLeft <= SPRINT_TIME_ALMOST_UP_THRESHOLD) {
				onTimeAlmostUp?.(timeLeft)
			}
		},
		[onTimeAlmostUp]
	)

	return (
		<CountdownCircleTimer
			isPlaying
			duration={duration}
			colors={[green[400], yellow[500], orange[500], red[500]]}
			colorsTime={[60, 30, 20, 0]}
			size={100}
			onUpdate={onUpdate}
			onComplete={onTimeout}
		>
			{({ remainingTime }) => remainingTime}
		</CountdownCircleTimer>
	)
}

export { Timer }
