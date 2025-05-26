import { InterCompany } from "../../models/CompanyModel"


export interface InterCompanyAuthService{
    companySignUp(companyName:string,email:string,phone:string,password:string,confirmPassword:string):Promise<{success:boolean,message:string}>
    verifyCompanyOtp(otpData:{otp:string,email:string}):Promise<{success:boolean,message:string}>
}