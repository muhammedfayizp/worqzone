import { InterOtp } from "../../models/otpModel";
import { InterBaseRepository } from "./interBaseRepository";


export interface InterOtpRepository extends InterBaseRepository <InterOtp>{
    createOtp(otpData:InterOtp): Promise <InterOtp>
    findOtpByEmail(email:string):Promise <InterOtp|null>
    deleteOtpByEmail(email:string):Promise<void>
}