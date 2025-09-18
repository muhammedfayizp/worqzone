import { Request, response, Response } from "express";
import { InterCompanyAuthController } from "../../interface/company/InterCompanyAuthController";
import { InterCompanyAuthService } from "../../interface/company/InterCompanyAuthService";
import { HTTP_STATUS } from "../../enums/HttpStatus";


class AuthController implements InterCompanyAuthController   {

    constructor(private _companyAuthService: InterCompanyAuthService ) {}

    async signUp(req: Request, res: Response) {
        try {

            const {name,email,phone,password,confirmPassword,industry}=req.body
            const file= req.file
            
            if (!file) {
                res.status(400).json({ success: false, message: 'Proof file is required' });
                return; 
            }            
            
            
            const response=await this._companyAuthService.companySignUp(
                name,email,phone,password,confirmPassword,file.buffer,industry
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
    async signIn(req:Request,res:Response){

        const formData=req.body        
        
        try {
            const response=await this._companyAuthService.companySignIn(formData.userData)
            if(response.success){
                res.status(HTTP_STATUS.CREATED)
                .cookie('refreshToken',response.refreshToken,
                    {
                        httpOnly:true,
                        secure:true,
                        sameSite:'none',
                        maxAge:3*24*60*1000
                    }
                )
                .json({success:true,message:'You have logged in successfully',accessToken:response.accessToken,role:'company',data:response.data})
            }else{
                res.status(HTTP_STATUS.BAD_REQUEST).json(response)
            }
            
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:'Internal server Error'})
        }
    }
    
    async validateRefreshToken(req:Request,res:Response){
        try {
            
            if (!req.cookies.refreshToken) {
                
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success:false,
                    message:"Refresh token not found"
                })
                return
            }
            
            const {accessToken,refreshToken}=await this._companyAuthService.validateRefreshToken(req.cookies.refreshToken)

            res.cookie('refreshToken',refreshToken,{
                httpOnly:true,
                secure:true,
                maxAge:3*24*60*1000,
                sameSite:'none'
            });
            res.status(HTTP_STATUS.OK).json({
                success:true,
                message:'Token Created',
                token:accessToken,
                role:'company'
            })

        } catch (error:any) {
            if(error.status==401){
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success:false,
                    message:error.message||'Internal server error occurred'
                })
            }
        }
    }
    async logout(req:Request,res:Response){
        try {
            res.clearCookie('refreshToken',{
                httpOnly: true,
                sameSite: 'strict',
                secure: true
            })
            res.json({message:'Logout successful'})
            return
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:'controller error'})
        }
    }
    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            
            const {email}=req.body
            const response=await this._companyAuthService.forgotPassword(email)

            if(response.success){
                res.status(HTTP_STATUS.OK).json(response);
            }

        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:'internal server error'})
        }
    }
    async changeNewPassword(req: Request, res: Response): Promise<void> {
        try {
            const {email,password}=req.body
            const response=await this._companyAuthService.setNewPassword(email,password)
            if (response.success) {
                res.status(200).json({ success: true, message: 'Your password is changed' })
            } else {
                res.status(400).json({ success: false, message: 'Failed to change password' })
            }
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:'internal server error'})
        }
    }
}
export default AuthController