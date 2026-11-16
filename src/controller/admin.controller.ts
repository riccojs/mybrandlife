import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import fileProtocol from "./fileProtocol.js";
import activityLog from "../middelware/activity.log.js";
const SecretKey = process.env.SECRET_KEY ?? "";
const { SUCCESS_STATUS, ERROR_STATUS, LOG_SUCCESS, LOG_FAILED } = status;
const {
  DATA_NOT_FOUND_MESSAGE,
  INVALID_SECURE_KEY_MESSAGE,
  PASSWORD_NOT_MATCH_MESSAGE,
  LOGIN_SUCCESS_MESSAGE,
  UNAUTHORIZE_ERROR_MESSAGE,
  QUERY_SUCCESSFUL_MESSAGE,
  INVALID_TOKEN_MESSAGE,
  LOGOUT_SUCCESSFUL_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} = response;

// get all pulsetrack
export async function getAllActivities(req: Request, res: Response) {
  const { searchBy = "", statusBy = "", methodBy = "" } = req.query;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const skip = (page - 1) * limit;
  let filter: any = {};
  if (searchBy) {
    filter.userId = {
      contains: searchBy,
      mode: "insensitive",
    };
  }
  if (statusBy) {
    filter.status = statusBy;
  }
  if (methodBy) {
    filter.method = methodBy;
  }
  try {
    const activities = await Prisma.activityLog.findMany({
      skip: skip,
      take: limit,
      where: filter,
    });
    const totalActivities = await Prisma.activityLog.count({ where: filter });
    const totalPage = Math.ceil(totalActivities / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        activities,
        totalPage,
        totalActivities,
        currentPage: page,
      },
    });
    await activityLog({
      userId: "",
      action: "Get all activities",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get one referral
export async function getOneActivities(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existActivities = await Prisma.activityLog.findUnique({
      where: {
        id: id,
      },
    });
    if (!existActivities) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      activities: existActivities,
    });
    await activityLog({
      userId: existActivities?.userId ? existActivities?.userId : "",
      action: "Get one activities",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// admin registers
export async function register(req: Request, res: Response) {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  try {
    bcrypt.hash(password, 10, async function (err, hash) {
      await Prisma.admin.create({
        data: {
          username: "ricco",
          firstName: "Jhon",
          lastName: "Troemel",
          email: normalizedEmail,
          phone: "+1715574-6890",
          address: "United State",
          password: hash || "",
          secureKey: "riccojs@89#",
        },
      });
      await activityLog({
        userId: "",
        action: "Register admin",
        status: LOG_SUCCESS,
        endpoint: req.originalUrl,
        method: req.method,
      });
      return res.status(201).json({
        status: SUCCESS_STATUS,
        message: QUERY_SUCCESSFUL_MESSAGE,
      });
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get setting
export async function getSetting(req: Request, res: Response) {
  try {
    const setting = await Prisma.setting.findFirst();
    res.status(200).json({
      status: QUERY_SUCCESSFUL_MESSAGE,
      setting,
    });
    await activityLog({
      userId: "",
      action: "Get app settings",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// login admin
export async function login(req: Request, res: Response) {
  const { email, password, secureKey } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const existAdmin = await Prisma.admin.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!existAdmin) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }

    if (existAdmin?.secureKey !== secureKey) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: INVALID_SECURE_KEY_MESSAGE,
      });
    }
    const matchPassword = await bcrypt.compare(password, existAdmin.password);
    const token = jwt.sign(
      { email: existAdmin.email, id: existAdmin.id, role: "ADMIN" },
      SecretKey,
      { expiresIn: "7d" },
    );
    if (!matchPassword) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: PASSWORD_NOT_MATCH_MESSAGE,
      });
    }
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: LOGIN_SUCCESS_MESSAGE,
    });
    await activityLog({
      userId: existAdmin?.id,
      action: "Login admin",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// looged admin
export async function logged(req: Request, res: Response) {
  interface AuthTokenPayload extends JwtPayload {
    id: string;
    email: string;
  }
  const token = req.cookies.adminToken;
  if (!token)
    return res.status(401).json({
      status: ERROR_STATUS,
      message: UNAUTHORIZE_ERROR_MESSAGE,
    });

  try {
    const decoded = jwt.verify(token, SecretKey) as AuthTokenPayload;
    const user = await Prisma.admin.findUnique({
      where: { id: decoded.id },
    });
    await activityLog({
      userId: user ? user?.id : "",
      action: "Logged admin",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    return res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      user: user,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(401).json({ message: INVALID_TOKEN_MESSAGE });
  }
}

// logout admin
export async function logout(req: Request, res: Response) {
  const { email } = req.body;
  try {
    const existUser = await Prisma.admin.findUnique({
      where: {
        email: email,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: LOGOUT_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Logout admin",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update admin
export async function update(req: Request, res: Response) {
  const { username, firstName, lastName, secureKey, email, phone, address } =
    req.body;
  const id = req.params.id as string;
  try {
    const existAdmin = await Prisma.admin.findUnique({
      where: {
        id: id,
      },
    });
    if (!existAdmin) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const basePath = fileProtocol(req);
    const profileFile = req.file?.filename.split(" ").join("-");
    await Prisma.admin.update({
      where: {
        id: id,
      },
      data: {
        username,
        firstName,
        lastName,
        secureKey,
        email,
        phone,
        address,
        profile: profileFile
          ? `${basePath}${profileFile}`
          : existAdmin?.profile,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: existAdmin?.id,
      action: "Update admin",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update setting
export async function updateSetting(req: Request, res: Response) {
  const { maintenance } = req.body;
  try {
    const existsetting = await Prisma.setting.findFirst();
    if (existsetting) {
      await Prisma.setting.update({
        where: {
          id: existsetting?.id,
        },
        data: {
          maintenance: maintenance,
        },
      });
    } else {
      await Prisma.setting.create({
        data: {
          maintenance: maintenance,
        },
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: "",
      action: "Update app setting",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// delete admin
export async function deleteAdmin(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existAdmin = await Prisma.admin.findUnique({
      where: {
        id: id,
      },
    });
    if (!existAdmin) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.admin.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
    });
    await activityLog({
      userId: existAdmin?.id,
      action: "Delete admin account",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// delete admin
export async function deleteActivities(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existActivities = await Prisma.activityLog.findUnique({
      where: {
        id: id,
      },
    });
    if (!existActivities) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.activityLog.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
    });
    await activityLog({
      userId: existActivities?.userId ? existActivities?.userId : "",
      action: "Delete activities",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}
