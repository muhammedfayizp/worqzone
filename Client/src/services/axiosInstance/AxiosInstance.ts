import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL;

// const axiosInstance=axios.create({
//     baseURL:API_URL,
//     withCredentials:true
// })


const publicApiClient=axios.create({
    baseURL:API_URL,
    withCredentials:true
})

export {publicApiClient} 