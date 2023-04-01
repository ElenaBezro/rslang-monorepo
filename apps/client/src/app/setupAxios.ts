import axios, { AxiosRequestHeaders } from 'axios'

import { Path } from '~/components/router'
import { TokenResponse } from '~/types/api'
import { DOMAIN_URL } from '~/utils/constants'
import { localStorageGetUser, localStorageSetUser } from '~/utils/localStorage'

axios.defaults.baseURL = DOMAIN_URL

axios.interceptors.request.use(async requestConfig => {
	const userInfo = localStorageGetUser()

	const headers: AxiosRequestHeaders = {
		...requestConfig.headers,
		'Content-Type': 'application/json',
	}

	if (userInfo && userInfo.token) {
		const refreshURL = `users/${userInfo.userId}/tokens`
		if (requestConfig.url === refreshURL) {
			// skip sending new refresh request while sending another refresh request
			return requestConfig
		}

		const singinDate = userInfo.expirationDate!
		const currentDate = new Date().getTime()
		const isExpired = singinDate < currentDate

		if (isExpired) {
			const refreshHeaders: AxiosRequestHeaders = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.refreshToken}`,
			}
			try {
				const { data } = await axios.get<TokenResponse>(refreshURL, { headers: refreshHeaders })
				const updatedUserInfo = {
					name: data.name,
					refreshToken: data.refreshToken,
					token: data.token,
					userId: data.userId,
				}

				localStorageSetUser(updatedUserInfo)

				userInfo.token = updatedUserInfo.token
				headers.Authorization = `Bearer ${updatedUserInfo.token}`
			} catch {
				window.location.pathname = Path.LOGOFF
			}
		} else {
			headers.Authorization = `Bearer ${userInfo.token}`
		}
	}

	return { ...requestConfig, headers }
})

axios.interceptors.response.use(response => {
	if (response.status === 401) {
		window.location.hash = Path.LOGOFF
	}
	return response
})
