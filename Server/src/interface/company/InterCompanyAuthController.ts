import { Request,Response } from "express";

export interface InterCompanyAuthController {
    signUp(req: Request, res: Response): Promise<void>;
}