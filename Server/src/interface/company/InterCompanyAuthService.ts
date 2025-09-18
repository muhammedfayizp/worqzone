import { InterCompany } from "../../models/CompanyModel"


export interface InterCompanyAuthService{
    companySignUp(companyName:string,email:string,phone:string,password:string,confirmPassword:string,proofUrl:Buffer,industry:string):Promise<{success:boolean,message:string}>
    verifyCompanyOtp(otpData:{otp:string,email:string}):Promise<{success:boolean,message:string}>
    companySignIn(userData:{email:string,password:string,role:string}):Promise<{success:boolean,message:string, data?:Partial<InterCompany>,accessToken?:string,refreshToken?:string}>
    validateRefreshToken(token:string):Promise<{accessToken?:string,refreshToken?:string}>   
    forgotPassword(email:string):Promise<{success:boolean,message:string}>
    setNewPassword(email:string,password:string):Promise<{success:boolean,message:string}>
}