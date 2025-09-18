
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../enums/HttpStatus";

export interface CustomRequest extends Request {
  user?: JwtPayload;
  userId?: string;
}

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  try {
    
    const token = req.headers['authorization'];    

    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Access denied. No Token' });
      return;
    }

    const newToken = token.split(' ')[1];
    const secret = process.env.JWT_ACCESS_TOKEN;
    

    if (!secret) {
      throw new Error('Access token secret is not defined');
    }

    jwt.verify(newToken, secret, (error, payload) => {
      if (error || !payload) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid Token' });
        return;
      }

      req.user = payload as JwtPayload;
      next();
    });

  } catch (error) {
    console.error('Error occurred in authenticateToken middleware:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  }
};

export default authenticateToken;


