import jwt, { JwtPayload } from 'jsonwebtoken'
import { InterCompany } from "../models/CompanyModel";
import { HTTP_STATUS } from "../enums/HttpStatus";

export const generateAccessToken = async (id: string, role: string) => {
    const secret = process.env.JWT_ACCESS_TOKEN
    if (!secret) {
        throw new Error('Access Token is not working')
    }
    const token = jwt.sign({ id, role }, secret, { expiresIn: '2h' })
    return token
}

export const generateRefreshToken = async (id: string, role: string) => {
    const secret = process.env.JWT_REFRESH_TOKEN
    if (!secret) {
        throw new Error('Refresh Token is not working')
    }
    const token = jwt.sign({ id, role }, secret, { expiresIn: '3d' })
    return token
}

export const verifyToken=(token:string):JwtPayload=>{
    try {

        const decoded=jwt.verify(token,process.env.JWT_REFRESH_TOKEN as string)as JwtPayload;
        console.log('decoded in util',decoded);
        return decoded

    } catch (err) {
        const error:any=new Error('Token_expired')
        error.status=HTTP_STATUS.UNAUTHORIZED
        throw error
    }
}