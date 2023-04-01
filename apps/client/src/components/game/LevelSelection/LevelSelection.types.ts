export type LevelSelectionProps = {
	title: string
	description: string
	controls: string[]
	type: 'audiocall' | 'sprint'
	onLevelSelected?: (group: number) => void
}
