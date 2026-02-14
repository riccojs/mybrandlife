import { Request, Response, NextFunction } from "express";
import status from "../utils/status.js";
import response from "../utils/response.js";
const { ERROR_STATUS } = status;
const { UNAUTHORIZE_ERROR_MESSAGE } = response;

function publicSecretAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.PUBLIC_API_KEY) {
    return res.status(500).json({
      status: ERROR_STATUS,
      message: UNAUTHORIZE_ERROR_MESSAGE,
    });
  }
  next();
}

export default publicSecretAuth;
