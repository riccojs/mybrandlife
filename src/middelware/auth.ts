import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import status from "../utils/status.js";
import response from "../utils/response.js";
const { ERROR_STATUS } = status;
const { UNAUTHORIZE_ERROR_MESSAGE } = response;
const secretKey = process.env.SECRET_KEY || "default_secret";

interface JwtPayload {
  id: string;
  [key: string]: any;
}

declare module "express-serve-static-core" {
  interface Request {
    userId: string;
  }
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: UNAUTHORIZE_ERROR_MESSAGE,
      });
    }
    const user = jwt.verify(token, secretKey) as JwtPayload;
    req.userId = user.id;
    next();
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: UNAUTHORIZE_ERROR_MESSAGE,
      error: error.message,
    });
  }
};

export default auth;
