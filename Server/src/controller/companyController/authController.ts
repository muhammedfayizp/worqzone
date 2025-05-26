import { Request, Response } from "express";
import { InterCompanyAuthController } from "../../interface/company/InterCompanyAuthController";
import { InterCompanyAuthService } from "../../interface/company/InterCompanyAuthService";
import { HTTP_STATUS } from "../../enums/HttpStatus";


class AuthController implements InterCompanyAuthController   {

    constructor(private _companyAuthService: InterCompanyAuthService ) {}

    async signUp(req: Request, res: Response) {
        try {

            const {name,email,phone,password,confirmPassword}=req.body

            const response=await this._companyAuthService.companySignUp(
                name,email,phone,password,confirmPassword,
            )

            if(!response.success){
                res.status(HTTP_STATUS.BAD_REQUEST).json(response)
            }else{
                res.status(HTTP_STATUS.CREATED).json(response)
            }
            
        } catch (error) {
            console.log('error',error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:'internal server error'})
        }
    }
    async verifyOtp(req:Request,res:Response){
        try {
            
            let otp= req.body
            const response = await this._companyAuthService.verifyCompanyOtp(otp)
            
            if (typeof response==='string') {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response)
            }else if(response?.success){                
                res.status(HTTP_STATUS.CREATED).json(response)
            }else{
                res.status(HTTP_STATUS.BAD_REQUEST).json(response)
            }

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:'OTP verification failed'})
            return            
        }
    }

}
export default AuthController