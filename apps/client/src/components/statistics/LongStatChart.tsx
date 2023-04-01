import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { LongStat } from '~/types/statistic'

type ChartData = {
	name: string
	learnedWords: number
	newWords: number
}[]

export default function LongStatChart({ longStat }: { longStat: LongStat }) {
	const { t } = useTranslation()
	const chartData = useMemo<ChartData>(() => {
		const { learnedWords, newWords } = longStat
		const dates = Object.keys(longStat.learnedWords)
		return dates.map((date, i) => {
			const transformedDate = i === 0 ? t('STATISTIC.START_DATE') : new Date(+date).toLocaleDateString()
			const totalLearnedWords = learnedWords[+date].length
			const totalNewWords = newWords[+date].length
			return { name: transformedDate, learnedWords: totalLearnedWords, newWords: totalNewWords }
		})
	}, [longStat, t])

	return (
		<ResponsiveContainer width="95%" height={400}>
			<LineChart
				width={500}
				height={300}
				data={chartData}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line type="monotone" name={t('STATISTIC.TOTAL_NEW_WORDS')!} dataKey="newWords" stroke="#651fff" activeDot={{ r: 8 }} />
				<Line type="monotone" name={t('STATISTIC.TOTAL_LEARNED_WORDS')!} dataKey="learnedWords" stroke="#ff9100" />
			</LineChart>
		</ResponsiveContainer>
	)
}
