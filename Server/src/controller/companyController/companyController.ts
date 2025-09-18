import { InterCompanyService } from "../../interface/company/InterCompanyService";
import { CompanyService } from "../../services/company/companyService";
import { InterCompanyController } from "../../interface/company/InterCompanyController";
import { HTTP_STATUS } from "../../enums/HttpStatus";
import { Response } from "express";
import { CustomRequest } from "../../middleware/userAuth";
import { InterCompany } from "../../models/CompanyModel";


export class CompanyController implements InterCompanyController {
    constructor(private _companyService: InterCompanyService) { }
    async getProfileData(req: CustomRequest, res: Response): Promise<void> {
        try {

            const companyId = req.user?.id

            const response = await this._companyService.getProfileData(companyId)

            if (!response.success) {
                res.status(HTTP_STATUS.BAD_REQUEST).json(response)
            }
            res.status(HTTP_STATUS.OK).json(response)

        } catch (error) {
            console.log(error);
        }
    }
    async updateProfile(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { companyName, email, phone, industry } = req.body
            const file = req.file

            const id = req.user?.id

            if (!id) {
                res.status(400).json({ success: false, message: 'Unauthorized' })
                return
            }

            const response = await this._companyService.updateProfile(
                id, companyName, email, phone, industry, file?.buffer
            )

            if (!response.success) {
                res.status(HTTP_STATUS.BAD_REQUEST).json(response)
            } else {
                res.status(response.success ? 200 : 400).json(response)
            }
        } catch (error) {
            console.log(error);

        }
    }
}