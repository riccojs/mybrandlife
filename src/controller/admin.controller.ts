import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import fileProtocol from "./fileProtocol.js";
const SecretKey = process.env.SECRET_KEY ?? "";
const { SUCCESS_STATUS, ERROR_STATUS } = status;
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
      return res.status(201).json({
        status: SUCCESS_STATUS,
        message: QUERY_SUCCESSFUL_MESSAGE,
      });
    });
  } catch (error: any) {
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
    const existUser = await Prisma.admin.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }

    if (existUser?.secureKey !== secureKey) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: INVALID_SECURE_KEY_MESSAGE,
      });
    }
    const matchPassword = await bcrypt.compare(password, existUser.password);
    const token = jwt.sign(
      { email: existUser.email, id: existUser.id, role: "ADMIN" },
      SecretKey,
      { expiresIn: "7d" },
    );
    if (!matchPassword) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: PASSWORD_NOT_MATCH_MESSAGE,
      });
    }
    res.cookie("token", token, {
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
  } catch (error: any) {
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
  const token = req.cookies.token;
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
    return res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      user: user,
    });
  } catch (err) {
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
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: LOGOUT_SUCCESSFUL_MESSAGE,
    });
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}
