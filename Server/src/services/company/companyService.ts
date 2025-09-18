import { InterCompanyService } from "../../interface/company/InterCompanyService";
import { InterCompany } from "../../models/CompanyModel";
import { IntercompanyRepository } from "../../repositories/interface/InterCompanyRepository";
import { uploadToCloudinary } from "./uploadService";


export class CompanyService implements InterCompanyService {
    constructor(
        private _companyRepository: IntercompanyRepository
    ) { }

    async getProfileData(id: string): Promise<{ success: boolean, message: string, companyData?: Partial<InterCompany> }> {

        const companyData = await this._companyRepository.findById(id);

        if (!companyData) {
            return { success: false, message: 'Company not found' }
        }

        return { success: true, message: 'success', companyData: companyData }
    }
    async updateProfile(id: string, companyName: string, email: string, phone: string, industry: string, profileImage?: Buffer): Promise<{ success: boolean; message: string; companyData?: Partial<InterCompany>; }> {

        const data: Partial<InterCompany> = {
            companyName: companyName,
            email: email,
            phone: phone,
            industry: industry
        }

        if (profileImage) {
            try {
                const profile = await uploadToCloudinary(profileImage);
                data.profileImage = profile;
            } catch (error) {
                return { success: false, message: "Profile image uploading failed" };
            }
        }

        const updateCompany = await this._companyRepository.updateById(id, data)

        if (!updateCompany) {
            return { success: false, message: 'update failed or company not found' }
        }
        return { success: true, message: 'profile updated successfully' }
    }
}  