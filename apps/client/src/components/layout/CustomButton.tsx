import { Color } from '@mui/material'
import Button, { ButtonProps } from '@mui/material/Button'
import { styled } from '@mui/material/styles'

interface CustomButtonProps {
	customcolor: Color
	isbright?: boolean
}

const CustomButton = styled(Button)<CustomButtonProps & ButtonProps>(({ customcolor, isbright }) => ({
	color: '#fff',
	backgroundColor: isbright ? customcolor[300] : customcolor[900],
	border: `1px solid ${customcolor[800]}`,
	'&:hover': {
		backgroundColor: isbright ? customcolor[500] : customcolor[700],
	},
}))

export default CustomButton
