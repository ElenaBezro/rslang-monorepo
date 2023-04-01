import { RootState } from '~/app/store'

export const selectAudiocallWords = (state: RootState) => state.audiocall.words
export const selectAudiocallAnswers = (state: RootState) => state.audiocall.answers
export const selectAudiocallCurrentIdx = (state: RootState) => state.audiocall.currentIdx
export const selectAudiocallCurrentWord = (state: RootState) => state.audiocall.currentWord
export const selectAudiocallStatus = (state: RootState) => state.audiocall.status
export const selectAudiocallIsLevelSelection = (state: RootState) => state.audiocall.isLevelSelection
export const selectAudiocallIsFinished = (state: RootState) => state.audiocall.isFinished
export const selectAudiocallAuduoPath = (state: RootState) => state.audiocall.audioPath
export const selectAudiocallCorrectAnswers = (state: RootState) => state.audiocall.correctAnswers
export const selectAudiocallIncorrectAnswers = (state: RootState) => state.audiocall.incorrectAnswers
export const selectAudiocallAnsweredWord = (state: RootState) => state.audiocall.answeredWord
export const selectAudiocallLongestSeries = (state: RootState) => state.audiocall.longestSeries
export const selectAudiocallIsWithSounds = (state: RootState) => state.audiocall.isWithSounds
export const selectAudiocallProgress = (state: RootState) => state.audiocall.progress
