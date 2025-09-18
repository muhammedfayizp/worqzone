export interface userSignUp {
    name: string,
    email: string,
    phone: string,
    role: string,
    password: string,
    confirmPassword: string,
    industry: string,
    proof: File,
}

export interface formError {
    name?: string,
    email?: string,
    phone?: string,
    role?: string,
    password?: string,
    confirmPassword?: string,
    industry?: string,
    proof?: string,
}

export interface OrpVerifyResponse {
    success: boolean;
    message: string;
}

export interface userSignIn {
    email: string,
    role: string,
    password: string
}

export interface editProfileForm {
    companyName:string,
    email:string,
    phone:string,
    industry:string,
    profileImage?:File
}

export interface editProfileError{
    companyName?:string,
    email?:string,
    phone?:string,
    industry?:string,
    profileImage?:string,
}