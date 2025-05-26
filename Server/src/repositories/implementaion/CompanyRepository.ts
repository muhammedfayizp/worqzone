import Company,{InterCompany} from "../../models/CompanyModel";
import { IntercompanyRepository } from "../interface/InterCompanyRepository";
import { BaseRepositories } from "./BaseRepository";


class CompanyRepository extends BaseRepositories<InterCompany> implements IntercompanyRepository {
    
    constructor() {
        super(Company)
    }
    async createCompany(data:Partial<InterCompany>): Promise<InterCompany|null>{        
        try {
            return await Company.create(data)
            
        } catch (error) {
            throw new Error(error instanceof Error?error.message:String(error))
        }
    }
    async findCompanyByEmail(email: string): Promise<InterCompany | null> {
        try {
            const data=await Company.findOne({email})
            const userData=data?.toObject()
            return userData as  InterCompany
        } catch (error) {
            throw new Error(error instanceof Error?error.message:String(error))
        }
    }
    async verifyCompany(email:string,isVerified:boolean):Promise<InterCompany|null>{
        try {
            await Company.updateOne({email},{isVerified})            
            return await Company.findOne({email})
        } catch (error) {
            throw new Error(error instanceof Error?error.message:String(error))
        }
    }
}

export default new CompanyRepository()