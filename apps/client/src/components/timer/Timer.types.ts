export type TimerProps = {
	duration: number
	onTimeout?: () => void
	onTimeAlmostUp?: (time: number) => void
}
