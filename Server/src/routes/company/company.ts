import express from "express";
import { CompanyService } from "../../services/company/companyService";
import CompanyRepository from "../../repositories/implementaion/CompanyRepository";
import { CompanyController } from "../../controller/companyController/companyController";
import authenticateToken from "../../middleware/userAuth";
import upload from "../../middleware/upload";


const company_route = express.Router()

const companyService = new CompanyService(
    CompanyRepository
)

const companyController = new CompanyController(companyService)


company_route.get('/profile', authenticateToken, companyController.getProfileData.bind(companyController));
company_route.post('/updateProfile',authenticateToken,upload.single('profileImage'),companyController.updateProfile.bind(companyController))


export default company_route