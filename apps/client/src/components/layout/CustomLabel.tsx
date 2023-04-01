import { Color } from '@mui/material'
import InputLabel, { InputLabelProps } from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'

interface CustomLabelProps {
	customcolor: Color
}

const CustomLabel = styled(InputLabel)<CustomLabelProps & InputLabelProps>(() => ({
	color: '#fff',
	'&.Mui-focused': {
		color: '#fff',
	},
}))

export default CustomLabel
