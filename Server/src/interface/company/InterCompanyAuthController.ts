import { Request,Response } from "express";

export interface InterCompanyAuthController {
    signUp(req: Request, res: Response): Promise<void>;
    verifyOtp(req:Request,res:Response):Promise<void>;
    signIn(req:Request,res:Response):Promise<void>;
    validateRefreshToken(req:Request,res:Response):Promise<void>
    logout(req:Request,res:Response):Promise<void>
    forgotPassword(req:Request,res:Response):Promise<void>
    changeNewPassword(req:Request,res:Response):Promise<void>
}