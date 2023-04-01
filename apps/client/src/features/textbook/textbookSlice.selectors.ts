import { RootState } from '~/app/store'

export const selectTextbookWords = (state: RootState) => state.textbook.words
export const selectTextbookStatus = (state: RootState) => state.textbook.status
export const selectTextbookGroup = (state: RootState) => state.textbook.group
export const selectTextbookPage = (state: RootState) => state.textbook.page
export const selectTextbookIsAudioPlaying = (state: RootState) => state.textbook.isAudioPlaying
