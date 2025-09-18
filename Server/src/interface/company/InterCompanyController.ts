import { Response } from "express";
import { CustomRequest } from "../../middleware/userAuth";


export interface InterCompanyController{
    getProfileData(req:CustomRequest,res:Response):Promise<void>
    updateProfile(req:CustomRequest,res:Response):Promise<void>
}