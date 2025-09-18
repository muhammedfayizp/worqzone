import dotenv from 'dotenv'

dotenv.config()

const config={
    port: parseInt(process.env.PORT || '3000', 10),
    mongoURL:process.env.MONGO_URL||"mongodb://localhost:27017/worqzone"
}

export default config