import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { config } from "dotenv";
import store from "../../redux/store";
import { loginSuccess, logout } from "../../redux/slice/authSlice";
const API_URL = import.meta.env.VITE_API_BASE_URL;


const publicApiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const state = store.getState()
        const token = state.auth.token;

        if (token) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bareer ${token}`
        }
        return config
    },
    (error: AxiosError) => {
        console.log('Request Error', error);
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
        if (originalRequest && error.response?.status == 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const state = store.getState()
                const role = state.auth.role

                const response = await axios.post<{ token: string, role: string }>(`${API_URL}/${role}/auth/refresh_token`,
                    {},
                    { withCredentials: true }
                )

                if (response.status == 200) {
                    console.log(response, 'resp');
                    store.dispatch(loginSuccess({
                        token: response.data.token,
                        role: response.data.role,
                        name: '',
                        email: '',
                        phone: ''
                      })) 
                    originalRequest.headers = originalRequest.headers || {}
                    originalRequest.headers['Authorization'] = `Bearer${response.data.token}`
                    return axiosInstance(originalRequest)

                }
            } catch (error) {
                console.log('Refresh token error', error);
                store.dispatch(logout())
                return Promise.reject()
            }
        }
        return Promise.reject(error)
    }
)

export { publicApiClient, axiosInstance } 