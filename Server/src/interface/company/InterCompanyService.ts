import { InterCompany } from "../../models/CompanyModel";

export interface InterCompanyService {
    getProfileData(id:string):Promise<{success:boolean,message:string,companyData?:Partial<InterCompany>}>
    updateProfile(id:string,companyName:string,email:string,phone:string,industry:string,profileImage?:Buffer):Promise<{success:boolean,message:string,companyData?:Partial<InterCompany>}>
}