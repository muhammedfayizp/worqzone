import Otp, {InterOtp} from "../../models/otpModel";
import { InterOtpRepository } from "../interface/InterOtpRepository";
import { BaseRepositories } from "./BaseRepository";


export interface IRepository<T>{
    create(item:T):Promise<T>
}

export class OtpRepository extends BaseRepositories <InterOtp> implements InterOtpRepository {
    constructor() {
        super(Otp)
    }
    async createOtp(otpData: InterOtp): Promise<InterOtp> {
        try {
            const newOtp=new this.model(otpData)
            return await newOtp.save()
        } catch (error) {
            console.log(error);
            throw new Error(error instanceof Error?error.message:String(error))
        }
    }
    async findOtpByEmail(email: string): Promise<InterOtp | null> {
        try {
            return await this.model.findOne({email})
        } catch (error) {
            console.log(error);
            return null      
        }
    }
    async deleteOtpByEmail(email:string):Promise<void>{
        try {
            await Otp.deleteOne({email})
        } catch (error) {
            throw new Error(error instanceof Error?error.message:String(error))
        }
    }
}


export default new OtpRepository()