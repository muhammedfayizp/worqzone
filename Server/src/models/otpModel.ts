import mongoose,{Document,Schema} from "mongoose";

export interface InterOtp extends Document {
    email:string,
    otp:string,
    createdAt:Date;
}

const OtpSchema:Schema=new Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expire:'2m'
    }
    
})

const Otp=mongoose.model <InterOtp>('Otp',OtpSchema)
export default Otp