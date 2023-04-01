import { Route, Routes } from 'react-router-dom'

import Audiocall from '~/views/Audiocall'
import AudiocallLevelSelect from '~/views/AudiocallLevelSelect'
import Home from '~/views/Home'
import { Logoff } from '~/views/Logoff'
import SignIn from '~/views/SignIn'
import SignUp from '~/views/SignUp'
import Sprint from '~/views/Sprint'
import Statistic from '~/views/Statistic'
import Textbook from '~/views/Textbook'

import { Path } from './Router.constants'

const RouteByPath: Record<Path, () => JSX.Element> = {
	[Path.HOME]: Home,
	[Path.TEXTBOOK]: Textbook,
	[Path.STATISTIC]: Statistic,
	[Path.AUDIOCALL]: AudiocallLevelSelect,
	[Path.AUDIOCALL_WITH_GROUP]: Audiocall,
	[Path.AUDIOCALL_WITH_GROUP_AND_PAGE]: Audiocall,
	[Path.SIGN_IN]: SignIn,
	[Path.SIGN_UP]: SignUp,
	[Path.LOGOFF]: Logoff,
	[Path.SPRINT]: Sprint,
}

const Router = () => (
	<Routes>
		{Object.entries(RouteByPath).map(([path, RouteElement]) => (
			<Route key={path} path={path} element={<RouteElement />} />
		))}
	</Routes>
)

export { Router }
