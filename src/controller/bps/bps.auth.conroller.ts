import { Request, Response } from "express";
import { Prisma } from "../../utils/prisma.js";
import status from "../../utils/status.js";
import response from "../../utils/response.js";
import bcrypt from "bcryptjs";
import activityLog from "../../middelware/activity.log.js";
import { FeatureName } from "@prisma/client";
import { bpsPayment } from "../../middelware/bps.payment.js";
import googleDriveSaver from "../../middelware/google.drive.saver.js";
import membershipCreator from "../../middelware/membership.creator.js";
import notificationCreator from "../../middelware/notification.createor.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { registerEmail } from "../../lib/register.email.js";
import welcomeEmail from "../../lib/welcome.email.js";
import fileProtocol from "../fileProtocol.js";

const SecretKey = process.env.SECRET_KEY ?? "";
const { SUCCESS_STATUS, ERROR_STATUS, LOG_SUCCESS, LOG_FAILED } = status;
const {
  DATA_NOT_FOUND_MESSAGE,
  PASSWORD_NOT_MATCH_MESSAGE,
  LOGIN_SUCCESS_MESSAGE,
  BPS_USER_REGISTER_SUCCESSFUL_MESSAGE,
  USER_ALREADY_EXIST_MESSAGE,
  LANDER_ALREADY_EXIST_MESSAGE,
  QUERY_SUCCESSFUL_MESSAGE,
  REGISTRATION_SUCCESS_MESSAGE,
  BPS_MEMBERSHIP_CREATE_FAILED,
  BPS_ONBOARD_SUCCESSFUL_MESSAGE,
  UNAUTHORIZE_ERROR_MESSAGE,
  INVALID_TOKEN_MESSAGE,
  OTP_INCORRECT_MESSAGE,
  TOKEN_EXPIRED_MESSAGE,
  VERIFY_SUCCESSFUL_MESSAGE,
  BPS_STAFF_REGISTER_SUCCESSFUL_MESSAGE,
} = response;

// registers customer
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
    bcrypt.hash(password, 10, async function (err, hash) {
      const newUser = await Prisma.user.create({
        data: {
          email: normalizedEmail,
          firstName: firstName,
          midName: midName,
          lastName: lastName,
          password: hash || "",
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
        action: "Register bps user",
        status: LOG_SUCCESS,
        endpoint: req.originalUrl,
        method: req.method,
      });
      return res.status(201).json({
        status: SUCCESS_STATUS,
        message: BPS_USER_REGISTER_SUCCESSFUL_MESSAGE,
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

// register Staff
export async function registerBpsStaff(req: Request, res: Response) {
  const {
    firstName,
    lastName,
    userName,
    email,
    password,
    role,
    phone,
    secretKey,
    status,
  } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  try {
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
    bcrypt.hash(password, 10, async function (err, hash) {
      const newStaff = await Prisma.bpsStaff.create({
        data: {
          email: normalizedEmail,
          firstName: firstName,
          userName: userName,
          lastName: lastName,
          password: hash || "",
          phone: phone,
          role: role,
          secretKey: secretKey,
          status: status,
        },
      });

      await notificationCreator({
        title: `${newStaff?.firstName} has been register successfully`,
        redirectUrl: `/user/${newStaff?.id}`,
        profile: newStaff?.profile ? newStaff?.profile : null,
        seen: false,
        userId: newStaff?.id,
      });
      await activityLog({
        userId: newStaff?.id,
        action: "Register bps staff",
        status: LOG_SUCCESS,
        endpoint: req.originalUrl,
        method: req.method,
      });
      return res.status(201).json({
        status: SUCCESS_STATUS,
        message: BPS_STAFF_REGISTER_SUCCESSFUL_MESSAGE,
        user: newStaff,
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

// login customer
export async function loginBpsUser(req: Request, res: Response) {
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
    const matchPassword = await bcrypt.compare(password, existUser.password);
    if (!matchPassword) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: PASSWORD_NOT_MATCH_MESSAGE,
      });
    }
    const token = jwt.sign(
      { email: existUser.email, id: existUser.id, role: "USER" },
      SecretKey,
      { expiresIn: "7d" },
    );
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
      token,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Login bps user",
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

// verify customer
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

// looged customer
export async function loggedBpsUser(req: Request, res: Response) {
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
    const user = await Prisma.user.findUnique({
      where: { id: decoded.id, verifyEmail: true },
      include: { bpsMembership: true },
    });

    if (!user) {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await activityLog({
      userId: user?.id,
      action: "Logged User",
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

// checkout customer
export async function checkoutBpsUser(req: Request, res: Response) {
  const id = req.params.id as string;
  const { plan, heading, tier, price, setupFee, features } = req.body;
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
    const newBpsMembership = await Prisma.bpsMembership.create({
      data: {
        userId: id,
        plan: plan,
        heading: heading,
        tier: tier,
        price: price,
        setupFee: setupFee,
        transactionId: session?.transactionId ?? "",
      },
    });
    if (features?.length > 0) {
      await Promise.all(
        features.map((service: { title: FeatureName; value: number }) =>
          Prisma.bpsPackage.create({
            data: {
              key: service?.title,
              value: service.value,
              membershipId: newBpsMembership?.id,
            },
          }),
        ),
      );
    }
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: REGISTRATION_SUCCESS_MESSAGE,
      pageUrl: session?.pageUrl,
    });
    await activityLog({
      userId: "",
      action: "Checkout bps user",
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

// bps onboarding customer
export async function OnboardBpsUser(req: Request, res: Response) {
  const {
    brandName,
    website,
    industry,
    location,
    services,
    businessHour,
    brandOwner,
    activity,
    promotions,
    events,
    lead,
    targetAudince,
    tarritory,
    tone,
    language,
    brandDo,
    brandDont,
    keyClaim,
    avoidTopics,
    upcommingEvents,
    approvalMode,
    staffId,
    notes,
    googleEmail,
    timeZone,
  } = req.body;
  const membershipId = req.params.id as string;
  try {
    const existMembership = await Prisma.bpsMembership.findUnique({
      where: {
        id: membershipId,
      },
    });

    if (!existMembership) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const files = req.files as Record<string, Express.Multer.File[]>;
    const basePath = fileProtocol(req);
    let medias = {
      logo: "",
      cover: "",
      brandAssests: [] as string[],
    };
    for (const fieldName in files) {
      if (fieldName === "logo" && files[fieldName]?.[0]) {
        medias.logo = `${basePath}${files[fieldName][0].filename}`;
      }

      if (fieldName === "cover" && files[fieldName]?.[0]) {
        medias.cover = `${basePath}${files[fieldName][0].filename}`;
      }

      if (fieldName === "brandAssests" && files[fieldName]?.length) {
        medias.brandAssests = files[fieldName].map(
          (file) => `${basePath}${file.filename}`,
        );
      }
    }
    const newOnboard = await Prisma.bpsOnboard.create({
      data: {
        membership: {
          connect: {
            id: membershipId,
          },
        },
        brandName: brandName,
        website: website,
        industry: industry,
        location: location,
        timeZone: timeZone,
        services: [services],
        businessHour: Number(businessHour),
        brandOwner: brandOwner,
        activity: activity,
        promotions: [promotions],
        events: [events],
        lead: lead,
        targetAudince: targetAudince,
        tarritory: tarritory,
        tone: tone,
        language: language,
        brandDo: [brandDo],
        brandDont: [brandDont],
        keyClaim: keyClaim,
        avoidTopics: [avoidTopics],
        upcommingEvents: [upcommingEvents],
        approvalMode: approvalMode,
        logo: medias?.logo,
        cover: medias?.cover,
        brandAssests: medias?.brandAssests,
      },
    });
    if (approvalMode === "APPROVAL_REQUIRED") {
      const getStaff = await Prisma.bpsStaff.findUnique({
        where: {
          id: staffId,
        },
      });
      const { firstName, lastName, email, role } = getStaff || {};
      await Prisma.bpsApprover.create({
        data: {
          staffId: staffId,
          onboardId: newOnboard?.id,
          staffname: `${firstName} ${lastName}`,
          staffemail: email ?? "",
          staffrole: role,
          notes: notes,
        },
      });
    }

    await Prisma.bpsProccessStatus.create({
      data: {
        onboardId: newOnboard?.id,
        name: "Verify onboarding",
        description: "Customer complete onboarding information",
        completeAt: new Date(),
        status: "VERIFY_ONBOARDING",
      },
    });

    await googleDriveSaver({
      brandName: brandName,
      googleEmail: googleEmail,
      membershipId: membershipId,
      files: files,
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: BPS_ONBOARD_SUCCESSFUL_MESSAGE,
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
