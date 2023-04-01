import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const getData = <T>(response: AxiosResponse<T>) => response.data

const get = <T>(url: string, config?: AxiosRequestConfig) => axios.get<T>(url, config).then(getData)
const put = <T, Payload = unknown>(url: string, payload?: Payload, config?: AxiosRequestConfig<Payload>) => axios.put<T>(url, payload, config).then(getData)
const post = <T, Payload = unknown>(url: string, payload?: Payload, config?: AxiosRequestConfig<Payload>) => axios.post<T>(url, payload, config).then(getData)

export { get, put, post }
