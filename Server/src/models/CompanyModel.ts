import mongoose, { Schema , Document} from "mongoose";


export interface InterCompany extends Document{
    companyName:string,
    email:string,
    password:string,
    isBlocked:boolean,
    isVerified:boolean,
    phone:string
}

const companySchema:Schema= new Schema({
    companyName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isVerified:{
        type:Boolean,
        default:false
    }
})

export default mongoose.model<InterCompany>('Company',companySchema)