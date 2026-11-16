import { Request, Response, NextFunction } from "express";
import AppError from "../middelware/app.error.js";
import response from "../utils/response.js";
const { ERROR_MESSAGE } = response;

interface ErrorWithExtras extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  errors?: { message: string }[];
}

const sendErrorDev = (error: ErrorWithExtras, res: Response) => {
  const statusCode = error.statusCode ?? 500;
  const status = error.status ?? "error";

  res.status(statusCode).json({
    status,
    message: error.message,
    stack: error.stack,
    error,
  });
};

const sendErrorProd = (error: ErrorWithExtras, res: Response) => {
  const statusCode = error.statusCode ?? 500;
  const status = error.status ?? "error";
  if (error.isOperational) {
    return res.status(statusCode).json({
      status,
      message: error.message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: ERROR_MESSAGE,
  });
};

const errorHandler = (
  err: ErrorWithExtras,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let error: ErrorWithExtras = err;
  if (error.name === "JsonWebTokenError") {
    error = new AppError("Invalid token", 401);
  }
  if (error.name === "SequelizeValidationError" && error.errors?.length) {
    error = new AppError(error.errors[0].message, 400);
  }
  if (error.name === "SequelizeUniqueConstraintError" && error.errors?.length) {
    error = new AppError(error.errors[0].message, 400);
  }
  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(error, res);
  }
  sendErrorProd(error, res);
};

export default errorHandler;
