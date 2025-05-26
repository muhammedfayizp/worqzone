import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()


export class MailService {
    private company //this one is default , it does't depend anyone
    constructor() {
        this.company=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.NODEMAILER_EMAIL,
                pass:process.env.NODEMAILER_PASSWORD
            }
        })
    }
    
    async sendOtpEmail(recipientEmail:string,otp:string){
        try {
            const mailOptions={
                from:process.env.NODEMAILER_EMAIL,
                to:recipientEmail,
                subject:'Your otp for Registration',
                text:  `otp${otp}`,
                html: `<p>Your OTP is <b>${otp}</b>. It is valid for 2 minutes.</p>`,

            }
            await this.company.sendMail(mailOptions)
            
        } catch (error) {
            console.log(error);
            throw new Error('Failed to send otp')
        }
    }
}