import { InterCompanyAuthService } from "../../interface/company/InterCompanyAuthService";
import bcrypt from 'bcrypt';
import { IntercompanyRepository } from "../../repositories/interface/InterCompanyRepository";
import { OtpRepository } from "../../repositories/implementaion/otpRepositories";
import { InterOtp } from "../../models/otpModel";
import { MailService } from "../../utils/mailer";
import { InterCompany } from "../../models/CompanyModel";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../../utils/token";
import { uploadToCloudinary } from "./uploadService";
import { HTTP_STATUS } from "../../enums/HttpStatus";

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

  async companySignUp(companyName: string, email: string, phone: string, password: string, confirmPassword: string, proofUrl: Buffer, industry: string): Promise<{ success: boolean; message: string; }> {

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
      } else {
        const newOtp = generateOtp()
        await this._otpRepository.createOtp({ email, otp: newOtp } as unknown as InterOtp)
        await mailService.sendOtpEmail(email, newOtp)
        return { success: true, message: 'No OTP found. A new OTP has been sent to your email' }
      }
    }


    const hashedPassword = await hashPassword(password)

    let proof = '';
    try {
      proof = await uploadToCloudinary(proofUrl)

    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      return { success: false, message: 'Proof upload failed' };
    }

    const saveCompany = await this._companyRepository.createCompany({
      companyName: companyName,
      email: email,
      password: hashedPassword,
      phone: phone,
      proofUrl: proof,
      industry: industry
    })


    const newOtp = generateOtp()
    await this._otpRepository.createOtp({ email, otp: newOtp } as unknown as InterOtp)
    await mailService.sendOtpEmail(email, newOtp)
    return {
      success: true,
      message: "Company registered successfully",
    };
  }


  async verifyCompanyOtp(otpData: { otp: string; email: string; }): Promise<{ success: boolean; message: string }> {

    const { otp, email } = otpData
    const validUser = await this._companyRepository.findCompanyByEmail(email)

    if (!validUser) {
      return { success: false, message: 'This email is not registerd' }
    }

    const currentOtp = await this._otpRepository.findOtpByEmail(email)
    if (!currentOtp?.otp) return { success: false, message: 'resend the otp' }

    if (currentOtp.otp === otp) {
      await this._companyRepository.verifyCompany(email, true)
      await this._otpRepository.deleteOtpByEmail(email)
      return { success: true, message: 'OTP verification completed' }
    } else {
      return { success: false, message: 'Please Enter Valid OTP' }
    }

  }

  async companySignIn(userData: { email: string, password: string, role: string }): Promise<{ success: boolean, message: string, data?: Partial<InterCompany>, accessToken?: string, refreshToken?: string }> {
    const { email, password, role } = userData

    const existingCompany = await this._companyRepository.findCompanyByEmail(email)

    if (!existingCompany) {
      return { success: false, message: "Invalid credentials. The user does not exist." };
    }

    const validPassword = await bcrypt.compare(password, existingCompany.password)
    if (!validPassword) {
      return { success: false, message: 'Invalid password' }
    }


    if (existingCompany && existingCompany.isBlocked) {
      return { success: false, message: 'The Company is Blocked' }
    }

    const companyData: Partial<InterCompany> = {
      companyName: existingCompany.companyName,
      email: existingCompany.email
    }
    const { ...data } = existingCompany

    const accessToken = await generateAccessToken(data._id as string, 'company')
    const refreshToken = await generateRefreshToken(data._id as string, 'company')


    return { success: true, message: "Logged SuccessFully", data: companyData, accessToken, refreshToken }
  }
  async validateRefreshToken(token: string): Promise<{ accessToken?: string, refreshToken?: string }> {
    try {

      const decoded = verifyToken(token)
      console.log(decoded, 'deco');

      const company = await this._companyRepository.findCompanyById(decoded.companyId)
      console.log(company);

      if (!company) {
        const error: any = new Error('company not found')
        error.status = HTTP_STATUS.NOT_FOUND
        throw error
      }

      const accessToken = await generateAccessToken(company._id as string, 'company')
      const refreshToken = await generateRefreshToken(company._id as string, 'company')

      return { accessToken: accessToken, refreshToken: refreshToken }

    } catch (error) {
      console.error('error while storing refreshToken', error);
      throw error
    }
  }
  async forgotPassword(email: string): Promise<{ success: boolean; message: string; }> {
    try {

      const company = await this._companyRepository.findCompanyByEmail(email)

      if (!company) {
        return { success: false, message: 'Company not Registered' }
      }

      const newOtp = generateOtp()

      await this._otpRepository.createOtp({ email, otp: newOtp } as unknown as InterOtp)
      await mailService.sendOtpEmail(email, newOtp)
      return { success: true, message: 'Otp send successfull' }

    } catch (error) {
      console.log(error);
      return { success: false, message: 'Error in service' }

    }
  }
  async setNewPassword(email: string, password: string): Promise<{ success: boolean; message: string; }> {
    try {
      const company=await this._companyRepository.findCompanyByEmail(email)

      const hashedPassword=await hashPassword(password)
      const id=String(company?._id)
      const response=await this._companyRepository.updateCompanyById(id,{password:hashedPassword})
      return {success:true,message:'Password changed seccessfully'}
    } catch (error) {
      console.log(error);
      return {success:true,message:'New password changing is failed'}
      
    }
  }
}

