import express from 'express'
import AuthController from '../../controller/companyController/authController'
import { AuthService } from '../../services/company/authService'
import CompanyRepository from '../../repositories/implementaion/CompanyRepository'
import OtpRepository  from '../../repositories/implementaion/otpRepositories'

const companyAuth_route=express.Router()

const companyAuthService=new AuthService(CompanyRepository,OtpRepository)
const companyAuthController=new AuthController(companyAuthService)



companyAuth_route.post('/register',companyAuthController.signUp.bind(companyAuthController))
companyAuth_route.post('/verifyOtp',companyAuthController.verifyOtp.bind(companyAuthController))


export default companyAuth_route