import { StrictMode } from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import './app/setupAxios'
import './app/setupI18n'
import { store } from './app/store'
import './index.css'

const root = ReactDOMClient.createRoot(document.getElementById('root')!)

root.render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</StrictMode>
)
