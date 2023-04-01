import { RootState } from '~/app/store'

export const selectStatisticOptional = (state: RootState) => state.statistic.statistics.optional
export const selectStatisticCalculated = (state: RootState) => state.statistic.statisticsCalculated
export const selectStatisticResetStatus = (state: RootState) => state.statistic.resetStatus
export const selectStatisticIsUpdating = (state: RootState) => state.statistic.isUpdating
