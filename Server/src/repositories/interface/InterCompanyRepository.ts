import { InterBaseRepository } from "./interBaseRepository";
import { InterCompany } from "../../models/CompanyModel";


export interface IntercompanyRepository extends InterBaseRepository<InterCompany> {
    createCompany(data: Partial<InterCompany>): Promise<InterCompany | null>;
    findCompanyByEmail(email:string):Promise <InterCompany|null>;
    verifyCompany(email:string ,isVerified:boolean):Promise <InterCompany|null>
}