import { RootState } from '~/app/store'

export const selectSprintState = ({ sprint }: RootState) => ({
	words: sprint.words,
	word: sprint.currentWord?.word,
	suggestedTranslation: sprint.suggestedTranslation,
	correctOption: sprint.currentWord && sprint.suggestedTranslation === sprint.currentWord?.word,
	correctWords: sprint.correctWords,
	incorrectWords: sprint.incorrectWords,
	status: sprint.status,
	correctAnswersInRow: sprint.correctAnswersInRow,
	gameRound: sprint.gameRound,
	bestSeries: sprint.maxCorrectAnswersSequence,
	// bestSeries: sprint.correctAnswersInRow,
	totalPoints: sprint.totalPoints,
	isMute: sprint.isMute,
})
