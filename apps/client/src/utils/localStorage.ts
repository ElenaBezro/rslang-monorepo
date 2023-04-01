import { UserInfo } from '~/types/auth'

const LS_KEYWORD = 'soberkoala'

const localStorageSetUser = (value: UserInfo) => {
	const valueToStore = JSON.stringify(value)
	localStorage.setItem(`${LS_KEYWORD}-userinfo`, valueToStore)
}

const localStorageGetUser = (): UserInfo | null => {
	const storedUser = localStorage.getItem(`${LS_KEYWORD}-userinfo`)
	if (storedUser) {
		return JSON.parse(storedUser)
	}

	return null
}

const localStorageRemoveUser = () => {
	localStorage.removeItem(`${LS_KEYWORD}-userinfo`)
}

interface LSPaginationParams {
	name: 'group' | 'page'
	value: number
}

const localStorageSetPagination = ({ value, name }: LSPaginationParams) => {
	const valueToStore = JSON.stringify(value)
	localStorage.setItem(`${LS_KEYWORD}-${name}`, valueToStore)
}

const localStorageGetPagination = () => {
	const storedGroup = localStorage.getItem(`${LS_KEYWORD}-group`)
	const storedPage = localStorage.getItem(`${LS_KEYWORD}-page`)

	if (storedGroup && storedPage) {
		return { group: JSON.parse(storedGroup), page: JSON.parse(storedPage) }
	}

	return { group: 0, page: 0 }
}

const localStorageClear = () => {
	localStorage.clear()
}

export { localStorageSetUser, localStorageGetUser, localStorageRemoveUser, localStorageSetPagination, localStorageGetPagination, localStorageClear }
