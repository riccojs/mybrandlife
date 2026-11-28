import { Request, Response } from "express";
import { Prisma } from "../../utils/prisma.js";
import status from "../../utils/status.js";
import response from "../../utils/response.js";
import activityLog from "../../middelware/activity.log.js";
import notificationCreator from "../../middelware/notification.createor.js";
import bcrypt from "bcryptjs";
import alertEmail from "../../lib/alert.email.js";
import fileProtocol from "../fileProtocol.js";
import { setAuthCookie, ROLES } from "../../middelware/auth.js";

// Never send these back to the client.
const staffOmit = { password: true, secretKey: true } as const;
const { SUCCESS_STATUS, ERROR_STATUS, LOG_SUCCESS, LOG_FAILED } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  USER_ALREADY_EXIST_MESSAGE,
  BPS_STAFF_REGISTER_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  PASSWORD_NOT_MATCH_MESSAGE,
  LOGIN_SUCCESS_MESSAGE,
  UNAUTHORIZE_ERROR_MESSAGE,
  INVALID_TOKEN_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  USER_ACTIVATE_UNVERIFIED_MESSAGE,
} = response;

// get one bps staff
export async function getAllBpsStaff(req: Request, res: Response) {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const statusBy = (req.query.statusBy as string) || "";
    const searchBy = (req.query.searchBy as string) || "";
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (statusBy) {
      filter.status = statusBy;
    }
    if (searchBy) {
      filter.firstName = {
        contains: searchBy,
        mode: "insensitive",
      };
    }
    const staff = await Prisma.bpsStaff.findMany({
      skip,
      take: limit,
      where: filter,
      omit: staffOmit,
    });
    const totalStaff = await Prisma.bpsStaff.count({ where: filter });
    const totalPage = Math.ceil(totalStaff / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        staff,
        totalPage,
        totalStaff,
        currentPage: page,
      },
    });
    await activityLog({
      userId: "",
      action: "Get All User",
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

// registers bps staff
export async function registerBpsStaff(req: Request, res: Response) {
  const {
    firstName,
    lastName,
    userName,
    email,
    password,
    role,
    phone,
    status,
  } = req.body;
  try {
    const normalizedEmail = String(email ?? "")
      .trim()
      .toLowerCase();
    const existStaff = await Prisma.bpsStaff.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existStaff) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: USER_ALREADY_EXIST_MESSAGE,
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const newStaff = await Prisma.bpsStaff.create({
      data: {
        email: normalizedEmail,
        firstName: firstName,
        userName: userName,
        lastName: lastName,
        password: hash,
        phone: phone,
        role: role,
        status: status,
      },
      omit: staffOmit,
    });

    await notificationCreator({
      title: `${newStaff?.firstName} has been register successfully`,
      redirectUrl: `/staff/${newStaff?.id}`,
      profile: newStaff?.profile ? newStaff?.profile : null,
      seen: false,
      userId: newStaff?.id,
    });
    await activityLog({
      userId: newStaff?.id,
      action: "Register BPS Staff",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: BPS_STAFF_REGISTER_SUCCESSFUL_MESSAGE,
      user: newStaff,
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

// login bps staff
export async function loginBpsStaff(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const normalizedEmail = String(email ?? "")
      .trim()
      .toLowerCase();
    const existUser = await Prisma.bpsStaff.findUnique({
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
    const matchPassword = await bcrypt.compare(password, existUser.password);
    if (!matchPassword) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: PASSWORD_NOT_MATCH_MESSAGE,
      });
    }
    // /logged only accepts ACTIVATE staff, so don't issue a token otherwise.
    if (existUser.status !== "ACTIVATE") {
      return res.status(403).json({
        status: ERROR_STATUS,
        message: USER_ACTIVATE_UNVERIFIED_MESSAGE,
      });
    }
    const token = setAuthCookie(res, {
      email: existUser.email,
      id: existUser.id,
      role: ROLES.STAFF,
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: LOGIN_SUCCESS_MESSAGE,
      token,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Login BPS Staff",
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

// looged bps staff
export async function loggedBpsStaff(req: Request, res: Response) {
  // authenticate(ROLES.STAFF) has already verified the staffToken cookie.
  const decoded = req.auth;
  if (!decoded)
    return res.status(401).json({
      status: ERROR_STATUS,
      message: UNAUTHORIZE_ERROR_MESSAGE,
    });
  try {
    const staff = await Prisma.bpsStaff.findUnique({
      where: { id: decoded.id, status: "ACTIVATE" },
      omit: staffOmit,
    });

    if (!staff) {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await activityLog({
      userId: staff?.id,
      action: "Logged BPS User",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    return res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      staff: staff,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({ message: INVALID_TOKEN_MESSAGE });
  }
}

// update bps staff
export async function updateBpsStaff(req: Request, res: Response) {
  const id = req.params.id as string;
  const { firstName, lastName, userName, phone } = req.body;

  try {
    const existStaff = await Prisma.bpsStaff.findUnique({
      where: {
        id: id,
      },
    });

    if (!existStaff) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const basePath = fileProtocol(req);
    const profileFile = req.file?.filename.split(" ").join("-");
    const updateStaff = await Prisma.bpsStaff.update({
      where: {
        id: id,
      },
      data: {
        firstName: firstName,
        userName: userName,
        lastName: lastName,
        phone: phone,
        profile: profileFile
          ? `${basePath}${profileFile}`
          : existStaff?.profile,
      },
      omit: staffOmit,
    });
    await notificationCreator({
      title: `${updateStaff.firstName} has been update successfully`,
      redirectUrl: `/staff/${id}`,
      profile: updateStaff.profile ?? null,
      seen: false,
      userId: id,
    });
    await activityLog({
      userId: id,
      action: "Update BPS Staff",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      staff: updateStaff,
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

// update bps staff status
export async function updateBpsStaffStatus(req: Request, res: Response) {
  const id = req.params.id as string;
  const { status } = req.body;

  try {
    const existStaff = await Prisma.bpsStaff.findUnique({
      where: {
        id: id,
      },
    });

    if (!existStaff) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const updateStaff = await Prisma.bpsStaff.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
      omit: staffOmit,
    });
    await notificationCreator({
      title: `${updateStaff?.firstName} has been update status successfully`,
      redirectUrl: `/staff/${id}`,
      profile: existStaff?.profile ? existStaff?.profile : null,
      seen: false,
      userId: id,
    });
    await activityLog({
      userId: id,
      action: "Update BPS Staff Status",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      staff: updateStaff,
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

// update password
export async function updateBpsStaffPassword(req: Request, res: Response) {
  const { password, oldPassword } = req.body;
  const id = req.params.id as string;
  try {
    const existStaff = await Prisma.bpsStaff.findUnique({
      where: {
        id: id,
      },
    });
    if (!existStaff) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const matchPassword = await bcrypt.compare(
      oldPassword,
      existStaff.password,
    );
    if (!matchPassword) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: PASSWORD_NOT_MATCH_MESSAGE,
      });
    }
    const hash = await bcrypt.hash(password, 10);
    await Prisma.bpsStaff.update({
      where: {
        id: id,
      },
      data: {
        password: hash,
      },
    });

    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: existStaff?.id,
      action: "Update Bps Staff Password",
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
      error: error.message,
    });
  }
}

// delete bps staff
export async function deleteBpsStaff(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existStaff = await Prisma.bpsStaff.findUnique({
      where: {
        id: id,
      },
    });
    if (!existStaff) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.bpsStaff.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
    });
    await activityLog({
      userId: existStaff?.id,
      action: "Delete BPS Staff",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    await alertEmail(
      "Staff Account Deleted",
      "A Staff Has Deleted Their Account",
      `${existStaff?.firstName} has successfully deleted their account. Please review the admin dashboard if any follow-up action is required.`,
    );
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
