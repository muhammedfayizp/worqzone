import { publicApiClient,axiosInstance } from "../axiosInstance/AxiosInstance";
import type { editProfileForm, OrpVerifyResponse, userSignIn, userSignUp } from "../../interface/Interface";
import type { ApiResponse } from "../../types/common";
import { User } from "lucide-react";


const publicApi = publicApiClient
const apiClient = axiosInstance

export const companySignUp = async (userData: userSignUp) => {    
    const formData = new FormData();

    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('phone', userData.phone);
    formData.append('password', userData.password);
    formData.append('confirmPassword', userData.confirmPassword);
    formData.append('industry', userData.industry);
    formData.append('proof', userData.proof);
    
    const response = await publicApi.post <ApiResponse>(`/company/auth/register`, formData)
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

export const getCompanyProfile= async ()=>{
    const response=await apiClient.get('/company/profile')
    return response.data
}

export const updateProfile = async(userData:editProfileForm)=>{
    const formData= new FormData() 
    formData.append('companyName',userData.companyName)
    formData.append('email',userData.email)
    formData.append('phone',userData.phone)
    formData.append('industry',userData.industry)

    if(userData.profileImage){
        formData.append('profileImage',userData.profileImage)
    }

    const response=await apiClient.post('/company/updateProfile',formData)
    return response.data
}

export const companyLogout=async()=>{
    const response= await publicApi.post('/company/auth/logout')
   return response.data
}

export const  companyForgotPassEmailSubmit=async(email:string)=>{
    const response=await publicApi.post('/company/auth/forgotPassword',{email})
    return response.data
}

export const companyNewPasswordSet=async(email:string,password:string)=>{
    const response=await publicApi.post('/company/auth/changePassword',{email,password})
    return response.data
}
