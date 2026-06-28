import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import bcrypt from "bcryptjs";
import membershipCreator from "../middelware/membership.creator.js";
import { paymentCreator } from "../middelware/payment.creator.js";
import { registerEmail } from "../lib/register.email.js";
import { UserType } from "../utils/types.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import welcomeEmail from "../lib/welcome.email.js";
import { v4 as uuidv4 } from "uuid";
import resetEmail from "../lib/reset.email.js";
import otpEmail from "../lib/otp.email.js";
import deactivateEmail from "../lib/deactivate.email.js";
import fileProtocol from "./fileProtocol.js";
import alertEmail from "../lib/alert.email.js";
import defaultWristband from "../middelware/default.wristband.js";
import activityLog from "../middelware/activity.log.js";
import notificationCreator from "../middelware/notification.createor.js";

const SecretKey = process.env.SECRET_KEY ?? "";
const corsUrl = process.env.FRONTEND_CORS_URL ?? "";
const { SUCCESS_STATUS, ERROR_STATUS, LOG_SUCCESS, LOG_FAILED } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  USER_ALREADY_EXIST_MESSAGE,
  LANDER_ALREADY_EXIST_MESSAGE,
  REGISTRATION_SUCCESS_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  USER_UNVERIFYED_MESSAGE,
  PASSWORD_NOT_MATCH_MESSAGE,
  LOGIN_SUCCESS_MESSAGE,
  TOKEN_EXPIRED_MESSAGE,
  OTP_INCORRECT_MESSAGE,
  VERIFY_SUCCESSFUL_MESSAGE,
  LOGOUT_SUCCESSFUL_MESSAGE,
  UNAUTHORIZE_ERROR_MESSAGE,
  INVALID_TOKEN_MESSAGE,
  RESET_LINK_SEND_SUCCESSFUL,
  OTP_CODE_SEND_MESSAGE,
  TOKEN_INVALID_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  LANDERNAME_ALREADY_EXIST,
  LANDERNAME_AVAILABLE_MESSAGE,
  ACCOUNT_IS_DEACTIVATE_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} = response;

// get all user
export async function getAllUser(req: Request, res: Response) {
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
      filter.landerName = {
        contains: searchBy,
        mode: "insensitive",
      };
    }
    const user = await Prisma.user.findMany({
      skip,
      take: limit,
      where: filter,
    });
    const totalUser = await Prisma.user.count({ where: filter });
    const totalPage = Math.ceil(totalUser / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        user,
        totalPage,
        totalUser,
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

// get all user by admin
export async function getAllUserByAdmin(req: Request, res: Response) {
  try {
    const users = await Prisma.user.findMany({
      where: {
        userTemplete: {
          some: {},
        },
      },
      include: {
        userTemplete: true,
      },
    });
    const templates = await Prisma.userTemplete.findMany();
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      users,
      templates,
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

// get one user
export async function getOneUser(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        membership: true,
        wristbands: {
          where: {
            mode: "GLOBAL",
          },
        },
        address: true,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      user: existUser,
    });
    await activityLog({
      userId: id,
      action: "Get One User",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: id,
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

// find landername
export async function findLanderName(req: Request, res: Response) {
  const { landerName } = req.body;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        landerName: landerName,
      },
    });

    if (existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: LANDERNAME_ALREADY_EXIST,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: LANDERNAME_AVAILABLE_MESSAGE,
    });
    await activityLog({
      userId: "",
      action: "Find Lander Name",
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

// get one user by landername
export async function getOneUserByLandername(req: Request, res: Response) {
  const name = req.params.name as string;
  try {
    const existUser = await Prisma.user.findFirst({
      where: {
        landerName: name,
      },
      include: {
        membership: true,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      user: existUser,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Get Lander Details",
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

// register user
export async function register(req: Request, res: Response) {
  const {
    domain,
    packageType,
    firstName,
    lastName,
    planKey,
    planPrice,
    planOldPrice,
    frequency,
    email,
    password,
    landerName,
    midName,
    phone,
    aggreement,
    discount,
    discountType,
    referalCode,
    phoneCode,
    primaryAddress,
    shippingAddress,
    privateDomain,
  } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });
    const existUserByLandname = await Prisma.user.findUnique({
      where: {
        landerName: landerName,
      },
    });
    if (existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: USER_ALREADY_EXIST_MESSAGE,
      });
    }
    if (existUserByLandname) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: LANDER_ALREADY_EXIST_MESSAGE,
      });
    }
    const getPrimaryAddress = primaryAddress as {
      state: string;
      city: string;
      country: string;
      zip: string;
      streetOne: string;
      streetTow: string;
      type: "PRIMARY";
    };
    const getShippingAddress = shippingAddress as {
      state: string;
      city: string;
      country: string;
      zip: string;
      streetOne: string;
      streetTow: string;
      type: "PRIMARY";
    };

    bcrypt.hash(password, 10, async function (err, hash) {
      const newUser = await Prisma.user.create({
        data: {
          domain: `${domain}.me`,
          package: packageType,
          planKey: planKey,
          planPrice: Number(planPrice),
          planOldPrice: Number(planOldPrice),
          frequency: frequency,
          email: normalizedEmail,
          password: hash || "",
          landerName: landerName,
          midName: midName,
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          aggreement: aggreement,
          discount: discount,
          referalCode: referalCode,
          discountType: discountType ? discountType : null,
          phoneCode: phoneCode,
          privateDomain: privateDomain,
        },
        include: {
          membership: true,
        },
      });
      if (getPrimaryAddress) {
        await Prisma.address.create({
          data: {
            country: getPrimaryAddress?.country,
            city: getPrimaryAddress?.city,
            state: getPrimaryAddress?.state,
            zip: getPrimaryAddress?.zip,
            streetOne: getPrimaryAddress?.streetOne,
            streetTow: getPrimaryAddress?.streetTow,
            userId: newUser?.id,
            type: "PRIMARY",
          },
        });
      }
      if (getShippingAddress) {
        await Prisma.address.create({
          data: {
            country: getShippingAddress?.country,
            city: getShippingAddress?.city,
            state: getShippingAddress?.state,
            zip: getShippingAddress?.zip,
            streetOne: getShippingAddress?.streetOne,
            streetTow: getShippingAddress?.streetTow,
            userId: newUser?.id,
            type: "SHIPPING",
          },
        });
      }
      if (referalCode) {
        const existReferal = await Prisma.referralCode.findUnique({
          where: {
            code: referalCode,
          },
        });

        const joining = existReferal ? existReferal.joined : 0;
        await Prisma.referralCode.update({
          where: {
            code: referalCode,
          },
          data: {
            joined: joining ? joining + 1 : 1,
          },
        });
        const referralCodeId = existReferal ? existReferal?.id : "";
        await Prisma.joinUser.create({
          data: {
            code: referalCode,
            referralcodeId: referralCodeId,
            firstName: firstName,
            lastName: lastName,
            midName: midName,
            email: email,
            phone: phone,
            landerName: landerName,
          },
        });
      }
      if (packageType === "gold" && frequency === "yearly") {
        await Prisma.referralCode.create({
          data: {
            code: landerName,
            type: "MONTHLY",
            value: 2,
            active: true,
            userId: newUser.id,
          },
        });
      }
      await registerEmail(landerName, normalizedEmail, newUser.id, domain);
      await alertEmail(
        "New User Registration",
        "A New User Has Registered",
        `${firstName} has successfully registered.
        Lander Name: ${landerName}
        Selected Domain: ${domain}
        Selected Package: ${packageType}
        Please review the new user details in the admin dashboard if any action is required.`,
      );
      let resData;
      if (discountType === "LIFETIME") {
        resData = {
          pageUrl: `${corsUrl}/auth/verify`,
        };
        await membershipCreator({
          user: newUser,
          planKey,
          planPrice,
          frequency,
          planOldPrice,
          session: null,
          status: true,
        });
      } else {
        const userData: UserType = {
          ...newUser,
          planKey: newUser.planKey ?? "",
          planPrice: newUser.planPrice ?? 0,
          planOldPrice: newUser.planOldPrice ?? 0,
          frequency: newUser.frequency ?? "monthly",
          planId: newUser.planId ?? "",
        };
        resData = await paymentCreator(userData, referalCode);
      }
      if (packageType === "silver" || packageType === "gold") {
        await defaultWristband(newUser, "621ea9bb-70fe-4b53-8a98-08e197c9a24e");
      }
      await activityLog({
        userId: "",
        action: "Register User",
        status: LOG_SUCCESS,
        endpoint: req.originalUrl,
        method: req.method,
      });
      await notificationCreator({
        title: `${newUser?.firstName} has been registered successfully.`,
        redirectUrl: `/admin/user/${newUser?.id}`,
        profile: null,
        seen: false,
        userId: newUser?.id,
      });
      return res.status(201).json({
        status: SUCCESS_STATUS,
        message: REGISTRATION_SUCCESS_MESSAGE,
        pageUrl: resData.pageUrl,
        user: newUser,
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

// login User
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const existUser = await Prisma.user.findUnique({
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

    if (existUser?.status !== "ACTIVATE") {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: USER_UNVERIFYED_MESSAGE,
      });
    }
    const matchPassword = await bcrypt.compare(password, existUser.password);
    const token = jwt.sign(
      { email: existUser.email, id: existUser.id, role: "USER" },
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
    await activityLog({
      userId: existUser?.id,
      action: "Login User",
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

// logout User
export async function logout(req: Request, res: Response) {
  const { email, role } = req.body;
  try {
    if (role === "ADMIN") {
      const existAdmin = await Prisma.admin.findUnique({
        where: {
          email: email,
        },
      });
      if (!existAdmin) {
        return res.status(404).json({
          status: ERROR_STATUS,
          message: DATA_NOT_FOUND_MESSAGE,
        });
      }
    } else {
      const existUser = await Prisma.user.findUnique({
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
      await activityLog({
        userId: existUser?.id,
        action: "Logout User",
        status: LOG_SUCCESS,
        endpoint: req.originalUrl,
        method: req.method,
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

// verify user
export async function verify(req: Request, res: Response) {
  const { code } = req.body;
  try {
    const existOtp = await Prisma.otpModel.findUnique({
      where: {
        code: Number(code),
      },
    });
    if (!existOtp) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: OTP_INCORRECT_MESSAGE,
      });
    }
    const existUser = await Prisma.user.findUnique({
      where: {
        id: existOtp.userId,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const currentTime = Date.now();
    if (!existOtp.expireIn) {
      return res.status(500).json({
        message: TOKEN_EXPIRED_MESSAGE,
      });
    }
    const expireTime = existOtp.expireIn.getTime();
    const differenceTime = expireTime - currentTime;
    if (differenceTime < 0) {
      return res.status(500).json({
        message: TOKEN_EXPIRED_MESSAGE,
      });
    }
    await Prisma.user.update({
      where: { id: existOtp.userId },
      data: { status: "ACTIVATE" },
    });
    const lander = existUser.landerName ?? "";
    const email = existUser.email ?? "";
    await welcomeEmail(lander, email);
    await activityLog({
      userId: existUser?.id,
      action: "Verify User",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    await notificationCreator({
      title: `${existUser?.landerName} has been verify successfully`,
      redirectUrl: `/admin/user/${existUser?.id}`,
      profile: existUser?.profile ? existUser?.profile : null,
      seen: false,
      userId: existUser?.id,
    });
    return res.status(200).json({
      message: VERIFY_SUCCESSFUL_MESSAGE,
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

// looged user
export async function logged(req: Request, res: Response) {
  interface AuthTokenPayload extends JwtPayload {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
  }
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      status: ERROR_STATUS,
      message: UNAUTHORIZE_ERROR_MESSAGE,
    });
  try {
    const decoded = jwt.verify(token, SecretKey) as AuthTokenPayload;
    let userData = null;

    if (decoded.role === "ADMIN") {
      userData = await Prisma.admin.findUnique({ where: { id: decoded.id } });
    } else {
      userData = await Prisma.user.findUnique({
        where: { id: decoded.id, status: "ACTIVATE" },
        include: {
          userTemplete: true,
          membership: true,
          address: true,
        },
      });
    }
    if (!userData) {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await activityLog({
      userId: userData?.id,
      action: "Logged User",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    return res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      user: {
        ...userData,
        role: decoded.role,
      },
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

// send reset code
export async function sendResetCode(req: Request, res: Response) {
  const { email } = req.body;

  try {
    const existUser = await Prisma.user.findUnique({
      where: { email },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const resetToken = uuidv4();
    await Prisma.tokens.create({
      data: {
        userId: existUser.id,
        token: resetToken,
        expireAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    const resetURL = `${corsUrl}/auth/reset-password/${resetToken}`;
    const landerName = existUser.landerName ? existUser.landerName : "";
    await resetEmail(landerName, email, resetURL);
    await activityLog({
      userId: existUser?.id,
      action: "Send Reset Code",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    return res.status(200).json({
      status: SUCCESS_STATUS,
      message: RESET_LINK_SEND_SUCCESSFUL,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    return res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// send reset code
export async function sendResetOtp(req: Request, res: Response) {
  const { email } = req.body;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        messahe: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const landerName = existUser?.landerName ?? "";
    await otpEmail(landerName, email, existUser.id);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: OTP_CODE_SEND_MESSAGE,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Send OTP Code",
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

// reset user password
export async function reset(req: Request, res: Response) {
  const { token, password } = req.body;
  try {
    const existToken = await Prisma.tokens.findUnique({
      where: {
        token: token,
      },
    });
    if (!existToken) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: TOKEN_INVALID_MESSAGE,
      });
    }
    const existUser = await Prisma.user.findUnique({
      where: {
        id: existToken?.userId,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    bcrypt.hash(password, 10, async function (err, hash) {
      const updatePassword = await Prisma.user.update({
        where: {
          id: existToken?.userId,
        },
        data: {
          password: hash,
        },
      });
      await Prisma.tokens.delete({
        where: {
          token: token,
        },
      });
      await activityLog({
        userId: existUser?.id,
        action: "Reset User",
        status: LOG_SUCCESS,
        endpoint: req.originalUrl,
        method: req.method,
      });
      res.status(201).json({
        status: SUCCESS_STATUS,
        message: UPDATE_SUCCESSFUL_MESSAGE,
        user: updatePassword,
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

// toggle user directory status
export async function togglrUserDirectoryStatus(req: Request, res: Response) {
  const id = req.params.id as string;
  const { directory } = req.body;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.user.update({
      where: {
        id: id,
      },
      data: {
        enableDirectory: directory,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Toggle User Directory Status",
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

// toggle user directory status
export async function togglrUserBrandshare(req: Request, res: Response) {
  const id = req.params.id as string;
  const { enableBrandshare } = req.body;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.user.update({
      where: {
        id: id,
      },
      data: {
        enableBrandshare: enableBrandshare,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Toggle User Brandshare Status",
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

// verify user by admin
export async function verifyUserByAdmin(req: Request, res: Response) {
  const { id } = req.body;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.user.update({
      where: {
        id: id,
      },
      data: {
        status: "ACTIVATE",
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: VERIFY_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Verify User",
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

// update user
export async function updateUser(req: Request, res: Response) {
  const {
    firstName,
    midName,
    lastName,
    username,
    phone,
    landerName,
    privateDomain,
    phoneCode,
    enablePrivateDomain,
  } = req.body;
  const id = req.params.id as string;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }

    const basePath = fileProtocol(req);
    const profileFile = req.file?.filename.split(" ").join("-");
    await Prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: username,
        firstName: firstName,
        midName: midName,
        lastName: lastName,
        phone: phone,
        landerName: landerName,
        profile: profileFile ? `${basePath}${profileFile}` : existUser?.profile,
        privateDomain: privateDomain,
        phoneCode: phoneCode,
        enablePrivateDomain: enablePrivateDomain === "true" ? true : false,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Update User",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    await notificationCreator({
      title: `${existUser?.landerName} has been update his profile`,
      redirectUrl: `/admin/user/${existUser?.id}`,
      profile: existUser?.profile ? existUser?.profile : null,
      seen: false,
      userId: existUser?.id,
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

// update user admin
export async function updateUserByAdmin(req: Request, res: Response) {
  const {
    username,
    firstName,
    midName,
    lastName,
    email,
    enablePrivateDomain,
    phone,
    landerName,
    privateDomain,
    phoneCode,
    package: packageName,
    frequency,
    status,
    domain,
    discountType,
  } = req.body;
  const id = req.params.id as string;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const basePath = fileProtocol(req);
    const profileFile = req.file?.filename.split(" ").join("-");
    await Prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: username,
        firstName: firstName,
        midName: midName,
        email: email,
        package: packageName,
        frequency: frequency,
        status: status,
        domain: domain,
        lastName: lastName,
        phone: phone,
        discountType: discountType ? discountType : null,
        landerName: landerName,
        profile: profileFile ? `${basePath}${profileFile}` : existUser?.profile,
        phoneCode: phoneCode,
        privateDomain: privateDomain,
        enablePrivateDomain: enablePrivateDomain === "true" ? true : false,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Update User",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    await notificationCreator({
      title: `Admin has been update ${existUser?.landerName} profile`,
      redirectUrl: `/admin/user/${existUser?.id}`,
      profile: existUser?.profile ? existUser?.profile : null,
      seen: false,
      userId: existUser?.id,
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
export async function updatePassword(req: Request, res: Response) {
  const { password, oldPassword } = req.body;
  const id = req.params.id as string;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const matchPassword = await bcrypt.compare(oldPassword, existUser.password);
    if (!matchPassword) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: PASSWORD_NOT_MATCH_MESSAGE,
      });
    }
    bcrypt.hash(password, 10, async function (err, hash) {
      await Prisma.user.update({
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
        userId: existUser?.id,
        action: "Update User Password",
        status: LOG_SUCCESS,
        endpoint: req.originalUrl,
        method: req.method,
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
      error: error.message,
    });
  }
}

// update password by admin
export async function updateUserPasswordByAdmin(req: Request, res: Response) {
  const { password } = req.body;
  const id = req.params.id as string;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    bcrypt.hash(password, 10, async function (err, hash) {
      await Prisma.user.update({
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
        userId: existUser?.id,
        action: "Update User Password",
        status: LOG_SUCCESS,
        endpoint: req.originalUrl,
        method: req.method,
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
      error: error.message,
    });
  }
}

// update user membership
export async function updateUserMembership(req: Request, res: Response) {
  const { plan, price, duration, activate_at, oldPrice, status } = req.body;
  const id = req.params.id as string;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.userMembership.update({
      where: {
        userId: id,
      },
      data: {
        plan,
        price: Number(price),
        duration,
        activate_at: new Date(activate_at),
        oldPrice: Number(oldPrice),
        status,
        expired: false,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Update User Membership",
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

// deactivate account
export async function togglrUserActivation(req: Request, res: Response) {
  const id = req.params.id as string;
  const { status } = req.body;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.user.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
    await Prisma.userMembership.update({
      where: {
        userId: id,
      },
      data: {
        status: status,
      },
    });
    await Prisma.userTemplete.updateMany({
      where: {
        userId: id,
      },
      data: {
        status: status,
      },
    });
    const existEvents = await Prisma.event.findMany({
      where: {
        userId: id,
      },
    });
    if (existEvents?.length > 0) {
      await Prisma.event.updateMany({
        where: {
          userId: id,
        },
        data: {
          status: status,
        },
      });
    }
    const existEcho = await Prisma.echo.findMany({
      where: {
        userId: id,
      },
    });
    if (existEcho?.length > 0) {
      await Prisma.echo.updateMany({
        where: {
          userId: id,
        },
        data: {
          status: status,
        },
      });
    }
    const landerName = existUser?.landerName ? existUser?.landerName : "";
    await deactivateEmail(landerName, existUser?.email);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: ACCOUNT_IS_DEACTIVATE_MESSAGE,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Toggle User Activation",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    if (status === "DEACTIVATE") {
      await notificationCreator({
        title: `${existUser?.landerName} has been deactivated`,
        redirectUrl: `/admin/user/${existUser?.id}`,
        profile: existUser?.profile ? existUser?.profile : null,
        seen: false,
        userId: existUser?.id,
      });
    }
    if (status === "SUSPEND") {
      await notificationCreator({
        title: `${existUser?.landerName} has been suspended`,
        redirectUrl: `/admin/user/${existUser?.id}`,
        profile: existUser?.profile ? existUser?.profile : null,
        seen: false,
        userId: existUser?.id,
      });
    }
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

// delete user
export async function deleteUser(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const deleteUser = await Prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
      user: deleteUser,
    });
    await alertEmail(
      "User Account Deleted",
      "A User Has Deleted Their Account",
      `${existUser?.landerName} has successfully deleted their account. Please review the admin dashboard if any follow-up action is required.`,
    );
    await activityLog({
      userId: existUser?.id,
      action: "Delete User",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    await notificationCreator({
      title: `${existUser?.landerName} account has been deleted`,
      redirectUrl: "/admin/user",
      profile: existUser?.profile ? existUser?.profile : null,
      seen: false,
      userId: existUser?.id,
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
