import express from 'express'
import AuthController from '../../controller/companyController/authController'
import { AuthService } from '../../services/company/authService'
import CompanyRepository from '../../repositories/implementaion/CompanyRepository'
import OtpRepository  from '../../repositories/implementaion/otpRepositories'
import multer from 'multer' 


const upload=multer()
const companyAuth_route=express.Router()

const companyAuthService=new AuthService(CompanyRepository,OtpRepository)
const companyAuthController=new AuthController(companyAuthService)



companyAuth_route.post('/register',upload.single("proof"),companyAuthController.signUp.bind(companyAuthController))
companyAuth_route.post('/verifyOtp',companyAuthController.verifyOtp.bind(companyAuthController))
companyAuth_route.post('/login',companyAuthController.signIn.bind(companyAuthController))
companyAuth_route.post('/refresh_token',companyAuthController.validateRefreshToken.bind(companyAuthController))
companyAuth_route.post('/logout',companyAuthController.logout.bind(companyAuthController))
companyAuth_route.post('/forgotPassword',companyAuthController.forgotPassword.bind(companyAuthController))
companyAuth_route.post('/changePassword',companyAuthController.changeNewPassword.bind(companyAuthController))

export default companyAuth_route