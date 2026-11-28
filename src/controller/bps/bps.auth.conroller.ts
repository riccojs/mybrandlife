import { Request, Response } from "express";
import { Prisma } from "../../utils/prisma.js";
import status from "../../utils/status.js";
import response from "../../utils/response.js";
import bcrypt from "bcryptjs";
import activityLog from "../../middelware/activity.log.js";
import { FeatureName } from "@prisma/client";
import { bpsPayment } from "../../middelware/bps.payment.js";
import notificationCreator from "../../middelware/notification.createor.js";
import { setAuthCookie, ROLES } from "../../middelware/auth.js";
import welcomeEmail from "../../lib/welcome.email.js";
import { bpsPlatform } from "../../utils/bps.platforms.js";
import membershipCreator from "../../middelware/membership.creator.js";
import { registerEmail } from "../../lib/register.email.js";

const { SUCCESS_STATUS, ERROR_STATUS, LOG_SUCCESS, LOG_FAILED } = status;
const {
  DATA_NOT_FOUND_MESSAGE,
  PASSWORD_NOT_MATCH_MESSAGE,
  LOGIN_SUCCESS_MESSAGE,
  USER_ALREADY_EXIST_MESSAGE,
  QUERY_SUCCESSFUL_MESSAGE,
  REGISTRATION_SUCCESS_MESSAGE,
  BPS_MEMBERSHIP_CREATE_FAILED,
  UNAUTHORIZE_ERROR_MESSAGE,
  INVALID_TOKEN_MESSAGE,
  OTP_INCORRECT_MESSAGE,
  TOKEN_EXPIRED_MESSAGE,
  VERIFY_SUCCESSFUL_MESSAGE,
  BPS_USER_REGISTER_SUCCESSFUL_MESSAGE,
  LANDER_ALREADY_EXIST_MESSAGE,
  WORKSPACE_CREATE_SUCCESSFUL_MESSAGE,
  IVALID_WORKSPACE_ID_MESSAGE,
  ONBOARD_DOES_NOT_EXIST,
  INVALID_PLAN_MESSAGE,
  BPS_MEMBERSHIP_ALREADY_ACTIVE_MESSAGE,
} = response;

// register bps user
export async function registerBpsUser(req: Request, res: Response) {
  const {
    email,
    firstName,
    midName,
    lastName,
    password,
    phone,
    domain,
    phoneCode,
    landerName,
    aggreement,
  } = req.body;
  try {
    const normalizedEmail = String(email ?? "")
      .trim()
      .toLowerCase();
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
    const hash = await bcrypt.hash(password, 10);
    const newUser = await Prisma.user.create({
      data: {
        email: normalizedEmail,
        firstName: firstName,
        midName: midName,
        lastName: lastName,
        password: hash,
        phone: phone,
        phoneCode: phoneCode,
        landerName: landerName,
        aggreement: aggreement,
        package: "gold",
        domain: domain,
        frequency: "yearly",
        planKey: "PULSE_GOLD_YEARLY",
        planPrice: 299.99,
        planOldPrice: 0,
        enablevcf: false,
      },
      include: {
        membership: true,
      },
      omit: {
        password: true,
      },
    });
    await membershipCreator({
      user: newUser,
      planKey: "PULSE_GOLD_YEARLY",
      planPrice: 299.99,
      frequency: "yearly",
      planOldPrice: 0,
      session: null,
      status: false,
    });
    await notificationCreator({
      title: `${newUser?.landerName} has been register successfully`,
      redirectUrl: `/user/${newUser?.id}`,
      profile: newUser?.profile ? newUser?.profile : null,
      seen: false,
      userId: newUser?.id,
    });
    await registerEmail(landerName, normalizedEmail, newUser.id, domain);
    await activityLog({
      userId: newUser?.id,
      action: "Register BPS User",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: BPS_USER_REGISTER_SUCCESSFUL_MESSAGE,
      user: newUser,
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

// login bps user
export async function loginBpsUser(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const normalizedEmail = String(email ?? "")
      .trim()
      .toLowerCase();
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
    const matchPassword = await bcrypt.compare(password, existUser.password);
    if (!matchPassword) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: PASSWORD_NOT_MATCH_MESSAGE,
      });
    }
    const token = setAuthCookie(res, {
      email: existUser.email,
      id: existUser.id,
      role: ROLES.BPS,
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: LOGIN_SUCCESS_MESSAGE,
      token,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Login BPS User",
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

// verify bps user
export async function verifyBpsUser(req: Request, res: Response) {
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
      data: { verifyEmail: true },
    });
    const firstName = existUser.firstName ?? "";
    const email = existUser.email ?? "";
    await welcomeEmail(firstName, email);
    await activityLog({
      userId: existUser?.id,
      action: "Verify BPS User",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    await notificationCreator({
      title: `${existUser?.landerName} has been verify successfully`,
      redirectUrl: `/user/${existUser?.id}`,
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

// verify bps user
export async function createUserWorkspace(req: Request, res: Response) {
  const id = req.params.id as string;
  const { csAccountId, csWorkspaceId } = req.body;
  try {
    if (!csWorkspaceId) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: IVALID_WORKSPACE_ID_MESSAGE,
      });
    }
    const existMembership = await Prisma.bpsMembership.findUnique({
      where: {
        id: id,
      },
    });
    if (!existMembership) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const existOnboard = await Prisma.bpsOnboard.findFirst({
      where: {
        membershipId: id,
      },
      orderBy: { create_at: "desc" },
    });
    if (!existOnboard) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: ONBOARD_DOES_NOT_EXIST,
      });
    }
    await Prisma.bpsMembership.update({
      where: {
        id: id,
      },
      data: {
        csWorkspaceId: csWorkspaceId,
        csAccountId: csAccountId,
      },
    });
    await Prisma.bpsProccess.create({
      data: {
        onboardId: existOnboard.id,
        name: "Onboard Workspace Created",
        description: "BPS onboarding workspace has been successfully created.",
        completeAt: new Date(),
        status: "CREATE_WORKSPACE",
      },
    });

    await notificationCreator({
      title: "workspace has been created",
      redirectUrl: `/bps/onboard/${existOnboard?.id}`,
      profile: existOnboard?.logo ? existOnboard?.logo : null,
      seen: false,
      userId: existMembership?.userId ?? "",
    });
    await activityLog({
      userId: existMembership?.userId,
      action: "Staff create a workspace",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: WORKSPACE_CREATE_SUCCESSFUL_MESSAGE,
    });
  } catch (error: any) {
    console.log(error);
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

// looged bps user
export async function loggedBpsUser(req: Request, res: Response) {
  // authenticate(ROLES.BPS) has already verified the bpsToken cookie.
  const decoded = req.auth;
  if (!decoded)
    return res.status(401).json({
      status: ERROR_STATUS,
      message: UNAUTHORIZE_ERROR_MESSAGE,
    });
  try {
    const user = await Prisma.user.findUnique({
      where: { id: decoded.id, verifyEmail: true },
      include: { bpsMembership: true },
      omit: { password: true },
    });

    if (!user) {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await activityLog({
      userId: user?.id,
      action: "Logged BPS User",
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
    res.status(500).json({ message: INVALID_TOKEN_MESSAGE });
  }
}

// checkout bps user
export async function checkoutBpsUser(req: Request, res: Response) {
  const id = req.params.id as string;
  const { plan, heading, tier, price, setupFee, features, planKey } = req.body;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
      include: { bpsMembership: true },
    });

    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const platforms = bpsPlatform[planKey];
    if (!plan || !platforms) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: INVALID_PLAN_MESSAGE,
      });
    }
    if (existUser.bpsMembership?.status === "ACTIVATE") {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: BPS_MEMBERSHIP_ALREADY_ACTIVE_MESSAGE,
      });
    }
    const session = await bpsPayment({
      planKey: plan,
      userId: id,
    });

    if (!session?.pageUrl) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: BPS_MEMBERSHIP_CREATE_FAILED,
      });
    }
    const membershipData = {
      plan: plan,
      heading: heading,
      tier: tier,
      price: Number(price),
      setupFee: Number(setupFee),
      transactionId: session?.transactionId ?? "",
      status: "PENDING" as const,
    };
    // A user has at most one BPS membership (userId is unique), so a retried
    // checkout reuses the pending membership instead of creating a new one.
    await Prisma.$transaction(async (tx) => {
      const membership = await tx.bpsMembership.upsert({
        where: { userId: id },
        create: { userId: id, ...membershipData },
        update: membershipData,
      });
      await tx.bpsPackage.deleteMany({
        where: { membershipId: membership.id },
      });
      await tx.bpsPlatfrom.deleteMany({
        where: { membershipId: membership.id },
      });
      if (Array.isArray(features) && features.length > 0) {
        await tx.bpsPackage.createMany({
          data: features.map(
            (service: { title: FeatureName; value: number }) => ({
              key: service.title,
              value: Number(service.value),
              membershipId: membership.id,
            }),
          ),
        });
      }
      await tx.bpsPlatfrom.createMany({
        data: platforms.map((platform) => ({
          membershipId: membership.id,
          name: platform,
          status: "CREATED" as const,
        })),
      });
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: REGISTRATION_SUCCESS_MESSAGE,
      pageUrl: session?.pageUrl,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Checkout BPS User",
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
