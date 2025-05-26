import { InterCompanyAuthService } from "../../interface/company/InterCompanyAuthService";
import bcrypt from 'bcrypt';
import { IntercompanyRepository } from "../../repositories/interface/InterCompanyRepository";
import { OtpRepository } from "../../repositories/implementaion/otpRepositories";
import { InterOtp } from "../../models/otpModel";
import { MailService } from "../../utils/mailer";


const mailService = new MailService();

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  console.log(otp);
  
  return otp;
}

export class AuthService implements InterCompanyAuthService {

  constructor(
    private _companyRepository: IntercompanyRepository,
    private _otpRepository: OtpRepository
  ) { }

  async companySignUp(companyName: string, email: string, phone: string, password: string, confirmPassword: string): Promise<{ success: boolean; message: string; }> {

    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match",
      };
    }
    const existingCompany = await this._companyRepository.findCompanyByEmail(email)    

    if (existingCompany && existingCompany.isVerified) {
      return { success: false, message: 'User Already Exists' }
    }

    if (existingCompany && !existingCompany.isVerified) { 
      const getOtp = await this._otpRepository.findOtpByEmail(email)
      if (getOtp) {
        const currentTime = new Date().getTime()
        const expirationTime = new Date(getOtp.createdAt).getTime() + 2 * 60 * 1000;
        if (currentTime < expirationTime) {
          return { success: true, message: 'OTP is still valid. Please verify using the same OTP!.' }
        } else {
          const newOtp = generateOtp()
          await this._otpRepository.createOtp({ email, otp: newOtp } as unknown as InterOtp)
          await mailService.sendOtpEmail(email, newOtp)
          return { success: true, message: 'OTP expired. A new OTP has been sent to your email' }
        }
      }else {
        const newOtp = generateOtp()
        await this._otpRepository.createOtp({ email, otp: newOtp } as unknown as InterOtp)
        await mailService.sendOtpEmail(email, newOtp)
        return { success: true, message: 'No OTP found. A new OTP has been sent to your email' }
      }    
    } 


    const hashedPassword= await hashPassword(password)
    const saveCompany=await this._companyRepository.createCompany({
      companyName:companyName,
      email:email,
      password:hashedPassword,
      phone:phone
    })


    const newOtp=generateOtp()
    await this._otpRepository.createOtp({email,otp:newOtp}as unknown as InterOtp)
    await mailService.sendOtpEmail(email,newOtp)
    return {
      success: true,
      message: "Company registered successfully",
    };
  }


  async verifyCompanyOtp(otpData: { otp: string; email: string; }): Promise<{ success: boolean; message: string }> {   

    const {otp,email}=otpData
    const validUser= await this._companyRepository.findCompanyByEmail(email)
    
    if(!validUser){
      return {success:false,message:'This email is not registerd'}
    }

    const currentOtp=await this._otpRepository.findOtpByEmail(email)    
    if (!currentOtp?.otp) return {success:false,message:'resend the otp'}

    if(currentOtp.otp===otp){      
      await this._companyRepository.verifyCompany(email,true)
      await this._otpRepository.deleteOtpByEmail(email)
      return {success:true,  message:'OTP verification completed'}
    }else{
      return {success:false, message:'Please Enter Valid OTP'}
    }

  }
}

