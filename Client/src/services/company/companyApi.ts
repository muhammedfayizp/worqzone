import { publicApiClient } from "../axiosInstance/AxiosInstance";
import type { OrpVerifyResponse, userSignIn, userSignUp } from "../../interface/Interface";


const publicApi = publicApiClient

export const companySignUp = async (userData: userSignUp) => {
    const response = await publicApi.post(`/company/auth/register`, userData)
    return response.data;
}

export const companyOtpVerify = async (otp: string, email: string): Promise<OrpVerifyResponse> => {
    const response = await publicApi.post('/company/auth/verifyOtp', { otp, email })
    return response.data
}

export const companySignIn = async (userData:userSignIn) => {
    const response = await publicApi.post('/company/auth/login',{userData})
    return response.data
}