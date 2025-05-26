export interface userSignUp {
    name:string,
    email:string,
    phone:string,
    role:string,
    password:string,
    confirmPassword:string
}

export interface formError {
    name?:string,
    email?:string,
    phone?:string,
    role?:string,
    password?:string,
    confirmPassword?:string
}

export interface OrpVerifyResponse{
    success:boolean;
    message:string;
}
export interface userSignIn{
    email:string,
    role:string,
    password:string
}