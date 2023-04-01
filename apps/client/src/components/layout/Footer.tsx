import { Theme } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

export default function Footer() {
	return (
		<footer className="footer" style={{ marginTop: '50px' }}>
			<Box px={{ xs: 3, sm: 3 }} py={{ xs: 3, sm: 3 }} bgcolor={(theme: Theme) => theme.palette.primary.main} color="white">
				<Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
					<Box display="flex" justifyContent="space-between" gap={2}>
						<Typography>
							<Link href="https://github.com/ElenaBezro" underline="hover" color="white">
								@ElenaBezro
							</Link>
						</Typography>

						<Typography>
							<Link href="https://github.com/liliyavoloshina" underline="hover" color="white">
								@liliyavoloshina
							</Link>
						</Typography>
					</Box>
					<Box display="flex" justifyContent="space-between" gap={2}>
						<Link href="https://rs.school/js/">
							<img src="/assets/svg/rslogo.svg" alt="RSS logo" width="50" />
						</Link>
						<Typography>© 2022</Typography>
					</Box>
				</Container>
			</Box>
		</footer>
	)
}
