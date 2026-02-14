import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import bcrypt from "bcryptjs";
import membershipCreator from "../middelware/membership.creator.js";
import { paymentCreator } from "../middelware/payment.creator.js";
import { registerEmail } from "../lib/register.email.js";
import { UserType, WristbandNameType } from "../utils/types.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import welcomeEmail from "../lib/welcome.email.js";
import { v4 as uuidv4 } from "uuid";
import resetEmail from "../lib/reset.email.js";
import otpEmail from "../lib/otp.email.js";
import deactivateEmail from "../lib/deactivate.email.js";
import { ActivationStatus } from "@prisma/client";
import fileProtocol from "./fileProtocol.js";

const SecretKey = process.env.SECRET_KEY ?? "";
const corsUrl = process.env.FRONTEND_CORS_URL ?? "";
const { SUCCESS_STATUS, ERROR_STATUS } = status;
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
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get all user by admin
export async function getAllUserByAdmin(req: Request, res: Response) {
  const { status } = req.query;
  try {
    const userStatus = status as ActivationStatus;
    const users = await Prisma.user.findMany({
      where: {
        status: userStatus,
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
    addressOne,
    addressTow,
    nickName,
    phone,
    secondEmail,
    aggreement,
    extraRed,
    extraBlack,
    extraGreen,
    extraYellow,
    extraBlue,
    extraWhite,
    extraOrange,
    discount,
    discountType,
    referalCode,
  } = req.body;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        email: email,
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

    bcrypt.hash(password, 10, async function (err, hash) {
      const newUser = await Prisma.user.create({
        data: {
          domain: `${domain}.me`,
          package: packageType,
          planKey,
          planPrice: Number(planPrice),
          planOldPrice: Number(planOldPrice),
          frequency,
          email,
          password: hash || "",
          landerName,
          midName,
          firstName,
          lastName,
          addressOne,
          addressTow,
          nickName,
          phone,
          secondEmail,
          aggreement,
          discount: discount,
          discountType: discountType ? discountType : null,
        },
        include: {
          membership: true,
        },
      });

      if (
        extraBlack ||
        extraGreen ||
        extraRed ||
        extraYellow ||
        extraBlue ||
        extraWhite ||
        extraOrange
      ) {
        const extras = [
          { name: "BLACK", count: extraBlack },
          { name: "RED", count: extraRed },
          { name: "GREEN", count: extraGreen },
          { name: "YELLOW", count: extraYellow },
          { name: "BLUE", count: extraBlue },
          { name: "WHITE", count: extraWhite },
          { name: "ORANGE", count: extraOrange },
        ];
        const newWisteband = await Prisma.wisetband.create({
          data: {
            userId: newUser.id,
          },
        });
        for (const item of extras) {
          await Prisma.wisetbandItem.create({
            data: {
              name: item.name as WristbandNameType,
              value: Number(item.count),
              wisetbandId: newWisteband.id,
            },
          });
        }
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
      await registerEmail(landerName, email, newUser.id, domain);
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
      return res.status(201).json({
        status: SUCCESS_STATUS,
        message: REGISTRATION_SUCCESS_MESSAGE,
        pageUrl: resData.pageUrl,
        user: newUser,
      });
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// login User
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
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

    if (existUser?.status !== "ACTIVATE") {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: USER_UNVERIFYED_MESSAGE,
      });
    }
    const existTemplate = await Prisma.userTemplete.findFirst({
      where: {
        userId: existUser?.id,
      },
    });
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

    const findStatus = existTemplate?.verify;
    const responseUrl = findStatus ? "/dashboard" : "/build-your-lander";

    res.status(200).json({
      status: SUCCESS_STATUS,
      message: LOGIN_SUCCESS_MESSAGE,
      url: responseUrl,
    });
  } catch (error: any) {
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
    return res.status(200).json({
      message: VERIFY_SUCCESSFUL_MESSAGE,
    });
  } catch (error: any) {
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
        },
      });
    }
    if (!userData) {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    return res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      user: {
        ...userData,
        role: decoded.role,
      },
    });
  } catch (err) {
    res.status(401).json({ message: INVALID_TOKEN_MESSAGE });
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
    return res.status(200).json({
      status: SUCCESS_STATUS,
      message: RESET_LINK_SEND_SUCCESSFUL,
    });
  } catch (error: any) {
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
  } catch (error: any) {
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
      res.status(201).json({
        status: SUCCESS_STATUS,
        message: UPDATE_SUCCESSFUL_MESSAGE,
        user: updatePassword,
      });
    });
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update user
export async function updateUser(req: Request, res: Response) {
  const {
    landerName,
    midName,
    nickName,
    secondEmail,
    lastName,
    firstName,
    username,
    phone,
    addressOne,
    addressTow,
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
        secondEmail: secondEmail,
        phone: phone,
        addressOne: addressOne,
        addressTow: addressTow,
        landerName: landerName,
        nickName: nickName,
        profile: profileFile ? `${basePath}${profileFile}` : existUser?.profile,
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

// update user admin
export async function updateUserByAdmin(req: Request, res: Response) {
  const {
    username,
    firstName,
    midName,
    lastName,
    email,
    secondEmail,
    phone,
    addressOne,
    addressTow,
    landerName,
    nickName,
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
        secondEmail: secondEmail,
        phone: phone,
        addressOne: addressOne,
        addressTow: addressTow,
        discountType: discountType ? discountType : null,
        landerName: landerName,
        nickName: nickName,
        profile: profileFile ? `${basePath}${profileFile}` : existUser?.profile,
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
    });
  } catch (error: any) {
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
    });
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}
