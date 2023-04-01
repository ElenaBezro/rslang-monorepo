import { ChangeEvent } from 'react'

import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Stack from '@mui/material/Stack'
import { lightGreen } from '@mui/material/colors'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { selectStatisticOptional } from '~/features/statistic'
import { changePage, fetchTextbookWords, selectTextbookGroup, selectTextbookPage } from '~/features/textbook'
import { PAGES_PER_GROUP } from '~/utils/constants'

export default function TextbookPagination() {
	const dispatch = useAppDispatch()
	const page = useAppSelector(selectTextbookPage) + 1
	const group = useAppSelector(selectTextbookGroup)
	const { completedPages } = useAppSelector(selectStatisticOptional)

	const handleChange = (event: ChangeEvent<unknown>, value: number) => {
		dispatch(changePage(value - 1))
		dispatch(fetchTextbookWords())
	}

	return (
		<Stack spacing={2} sx={{ alignItems: 'center' }}>
			<Pagination
				count={PAGES_PER_GROUP}
				variant="outlined"
				page={page}
				color="primary"
				onChange={handleChange}
				renderItem={item => {
					let isCompleted = false
					if (Object.keys(completedPages).length !== 0) {
						if (completedPages[group]) {
							const completed = item.type === 'page' && completedPages[group][item.page ?? 1 - 1]
							isCompleted = !!completed
						}
					}

					item.color = isCompleted ? 'standard' : 'primary'

					return <PaginationItem {...item} sx={{ backgroundColor: isCompleted ? `${lightGreen[100]}` : '' }} />
				}}
			/>
		</Stack>
	)
}
