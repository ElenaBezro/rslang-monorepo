import { Color } from '@mui/material'
import Select, { SelectProps } from '@mui/material/Select'
import { styled } from '@mui/material/styles'

interface CustomSelectProps {
	customcolor: Color
}

const CustomSelect = styled(Select)<CustomSelectProps & SelectProps>(({ customcolor }) => ({
	color: '#fff',

	'& .MuiOutlinedInput-notchedOutline': {
		borderColor: '#fff',
	},

	'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
		borderColor: customcolor[900],
	},

	'& .MuiSvgIcon-root': {
		color: '#fff',
	},
}))

export default CustomSelect
