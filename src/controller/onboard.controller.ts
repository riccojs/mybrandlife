import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
const { SUCCESS_STATUS, ERROR_STATUS } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  VALID_REFERRAL_CODE_MESSAGE,
  INCORRECT_REFERRAL_CODE_MESSAGE,
  REFERRAL_CODE_EXPIRED,
  USER_VERIFY_SUCCESSFUL_MESSAGE,
  REQUEST_SUBMIT_SUCCESSFUL_MESSAGE,
  ONBOARDING_SUCCESSFUL_MESSAGE,
  ONBOARD_ALREADY_CREATED_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  REGISTRATION_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} = response;
import fs from "fs";
import path from "path";
import VCard from "vcf";
import {
  centerPositionDomains,
  leftPositionDomains,
  rightPositionDomains,
  redDomains,
  lightBlueDomains,
  blueDomains,
  limeDomains,
  mangoDomains,
  orangeDomains,
} from "../utils/domains.js";
import { ButtonSetType, LayoutDetection, UserType } from "../utils/types.js";
import { paymentCreator } from "../middelware/payment.creator.js";
import getBase64Image from "../lib/getBase64Image.js";
import { fileURLToPath } from "url";
import { ButtonName } from "@prisma/client";
import fileProtocol from "./fileProtocol.js";
const card = new VCard();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// get all onboard
export async function getAllOnboard(req: Request, res: Response) {
  const { searchBy = "", statusBy = "", userId } = req.query;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const skip = (page - 1) * page;
  const filter: any = {};
  if (userId) {
    filter.userId = userId;
  }
  if (statusBy) {
    filter.verify = statusBy === "ACTIVE";
  }
  if (searchBy) {
    filter.user = {
      domain: {
        contains: searchBy,
        mode: "insensitive",
      },
    };
  }
  try {
    const onboard = await Prisma.userTemplete.findMany({
      skip,
      take: limit,
      where: filter,
      include: {
        user: true,
      },
    });
    const totalOnboard = await Prisma.userTemplete.count({
      where: filter,
    });
    const totalPage = Math.ceil(totalOnboard / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        onboard,
        totalPage,
        totalOnboard,
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

// get all onboard by default
export async function getAllOnboardByDefault(req: Request, res: Response) {
  try {
    const onboard = await Prisma.userTemplete.findMany();
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      onboard,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get all onboard by admin
export async function getAllOnboardByAdmin(req: Request, res: Response) {
  const { searchBy = "", statusBy = "" } = req.query;
  const pageNumber = req.query.page
    ? parseInt(req.query.page as string, 10)
    : 1;
  const limitNumber = req.query.limit
    ? parseInt(req.query.limit as string, 10)
    : 10;
  const skip = (pageNumber - 1) * limitNumber;
  let filter: any = {};
  if (searchBy) {
    filter.user = {
      landerName: {
        contains: searchBy,
        mode: "insensitive",
      },
    };
  }
  if (statusBy) {
    filter.status = statusBy;
  }

  try {
    const onboard = await Prisma.userTemplete.findMany({
      skip: skip,
      take: limitNumber,
      where: filter,
      include: {
        user: true,
      },
    });
    const totalOnboard = await Prisma.userTemplete.count({ where: filter });
    const totalPage = Math.ceil(totalOnboard / limitNumber);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        onboard,
        totalPage,
        totalOnboard,
        currentPage: pageNumber,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get one onboard by lander domain and name
export async function getOneOboard(req: Request, res: Response) {
  const { domain } = req.query;
  const name = req.params.name as string;
  const domainName = domain as string;
  try {
    const eixstUser = await Prisma.user.findUnique({
      where: {
        landerName: name,
        domain: domainName,
      },
    });
    if (!eixstUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const existOnoard = await Prisma.userTemplete.findFirst({
      where: {
        userId: eixstUser?.id,
        status: "ACTIVATE",
      },
      include: {
        buttonSet: true,
        services: true,
        user: true,
        customPlatfrom: true,
      },
    });
    if (!existOnoard) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      onboard: existOnoard,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get one onboard by id
export async function getOneOboardById(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existOnoard = await Prisma.userTemplete.findUnique({
      where: {
        id: id,
      },
      include: {
        templateInfo: true,
        buttonSet: true,
        user: true,
        services: true,
        customPlatfrom: true,
      },
    });
    if (!existOnoard) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      onboard: existOnoard,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// check discount code
export async function checkDiscountCode(req: Request, res: Response) {
  const { code } = req.body;
  try {
    const existReferal = await Prisma.referralCode.findUnique({
      where: {
        code: code,
      },
    });
    if (!existReferal) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: INCORRECT_REFERRAL_CODE_MESSAGE,
      });
    }
    if (!existReferal?.active) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: REFERRAL_CODE_EXPIRED,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: VALID_REFERRAL_CODE_MESSAGE,
      discount: existReferal.value,
      discountType: existReferal.type,
      discountCode: existReferal.code,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// verify template
export async function verifyOnboard(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existOnboard = await Prisma.userTemplete.findUnique({
      where: {
        id: id,
      },
    });
    if (!existOnboard) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.userTemplete.update({
      where: {
        id: id,
      },
      data: {
        verify: true,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: USER_VERIFY_SUCCESSFUL_MESSAGE,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// request a domain
export async function requestADomain(req: Request, res: Response) {
  const { domain, email } = req.body;
  try {
    const newRequest = await Prisma.domainReq.create({
      data: {
        email: email,
        domain: domain,
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: REQUEST_SUBMIT_SUCCESSFUL_MESSAGE,
      request: newRequest,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// request info
export async function requestInfo(req: Request, res: Response) {
  const { note, phone, name, templateId, email, lat, lon, accu } = req.body;
  try {
    const newRequest = await Prisma.templateInfo.create({
      data: {
        email: email,
        note: note,
        phone: phone,
        name: name,
        templateId: templateId ? templateId : null,
        lat: lat,
        lon: lon,
        accu: accu,
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: REQUEST_SUBMIT_SUCCESSFUL_MESSAGE,
      request: newRequest,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// request info location
export async function requestInfoLocation(req: Request, res: Response) {
  const { id, lat, lon, accu } = req.body;
  try {
    const newRequest = await Prisma.templateInfo.update({
      where: { id: id },
      data: {
        lat: lat,
        lon: lon,
        accu: accu,
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: REQUEST_SUBMIT_SUCCESSFUL_MESSAGE,
      request: newRequest,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// onboarding user
export async function onboardingUser(req: Request, res: Response) {
  const {
    referalCode,
    bio,
    tagLine,
    offerings,
    funnySaying,
    services,
    userId,
    vfrCreate,
    merchendiseUrl,
    customPlatform,
    ...socialLinks
  } = req.body;

  try {
    const existUser = await Prisma.user.findUnique({ where: { id: userId } });
    const existOnboard = await Prisma.userTemplete.findFirst({
      where: { userId },
    });
    if (!existUser) {
      return res
        .status(404)
        .json({ status: ERROR_STATUS, message: DATA_NOT_FOUND_MESSAGE });
    }
    if (existOnboard) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: ONBOARD_ALREADY_CREATED_MESSAGE,
      });
    }
    const basePath = fileProtocol(req);
    const files = req.files as Record<string, Express.Multer.File[]>;
    let medias = {
      portrait: "",
      logo: "",
      banner: "",
      background: "",
      epkFile: "",
    };
    for (const fieldName in files) {
      if (medias.hasOwnProperty(fieldName) && files[fieldName]?.[0]) {
        medias[fieldName as keyof typeof medias] =
          `${basePath}${files[fieldName][0].filename}`;
      }
    }
    const domain = existUser?.domain || "";
    const cleanDomain = domain.split(".")[0];
    const layoutDetection: LayoutDetection = centerPositionDomains?.includes(
      cleanDomain,
    )
      ? "CENTER"
      : leftPositionDomains?.includes(cleanDomain)
        ? "LEFT"
        : rightPositionDomains?.includes(cleanDomain)
          ? "RIGHT"
          : "LEFT";
    const colorDetection = redDomains.includes(cleanDomain)
      ? "#ab2d28"
      : lightBlueDomains.includes(cleanDomain)
        ? "#92cee8"
        : blueDomains.includes(cleanDomain)
          ? "#5171bb"
          : limeDomains.includes(cleanDomain)
            ? "#cfe14e"
            : mangoDomains.includes(cleanDomain)
              ? "#ecc246"
              : orangeDomains.includes(cleanDomain)
                ? "#de8839"
                : "#96c94b";
    const newTemplate = await Prisma.userTemplete.create({
      data: {
        bio,
        tagLine,
        offerings,
        funnySaying,
        portrait: medias.portrait,
        logo: medias.logo,
        banner: medias.banner,
        background: medias.background,
        epkFile: medias.epkFile,
        layout: layoutDetection,
        userId,
        headerBgType: "COLOR",
        ContentBGType: "COLOR",
        footerBgType: "COLOR",
        merchendiseUrl,
        verify: true,
        officialColor: colorDetection,
        status: "ACTIVATE",
      },
    });

    const allUrls = [
      "FACEBOOK",
      "TWITTER",
      "LINKEDIN",
      "YOUTUBE",
      "CUSTOM",
      "SNAPCHAT",
      "TIKTOK",
      "EMAIL",
      "PHONE",
      "INSTAGRAM",
      "REDDIT",
      "TUMBLR",
      "PINTEREST",
      "WHATSAPP",
      "WECHAT",
      "TELEGRAM",
      "DISCORD",
      "TWITCH",
      "GITHUB",
      "SOUNDCLOUD",
      "VIMEO",
      "SPOTIFY",
      "CLUBHOUSE",
      "PERISCOPE",
      "DRIBBLE",
      "BEHANCE",
      "DAILYMOTION",
      "MIXCLOUD",
      "FLICKR",
      "ANCHOR",
      "PATREON",
      "NEXTDOOR",
    ];
    const buttonData = Object.entries(socialLinks as Record<string, any>)
      .filter(
        ([key, value]) => allUrls.includes(key) && typeof value === "string",
      )
      .map(([key, value]) => ({
        name: key as ButtonName,
        url: value,
        templateId: newTemplate.id,
      }));
    if (buttonData.length > 0) {
      await Prisma.buttonSet.createMany({ data: buttonData });
    }

    if (customPlatform) {
      const parseCustomPlatform = JSON.parse(customPlatform);
      if (parseCustomPlatform?.length > 0) {
        await Promise.all(
          parseCustomPlatform.map((custom: ButtonSetType) =>
            Prisma.customPlatfrom.create({
              data: {
                name: custom.name,
                url: custom.url,
                templateId: newTemplate.id,
              },
            }),
          ),
        );
      }
    }

    if (services?.length > 0) {
      await Promise.all(
        services.map((service: string) =>
          Prisma.services.create({
            data: {
              title: service,
              templateId: newTemplate.id,
            },
          }),
        ),
      );
    }

    // vCard creation
    if (vfrCreate === "yes") {
      const { midName, email, phone, addressOne, addressTow, landerName } =
        existUser;
      card.set("fn", midName || "");
      card.set("note", offerings);
      card.set("org", landerName || "");
      card.set("title", tagLine || "");
      card.set("email", email || "");
      card.set("tel", phone || "");
      const adrString = `${addressOne ?? ""}, ${addressTow ?? ""}`;
      card.set("adr", adrString);
      const portraitPath = files?.logo?.[0]?.path;
      if (portraitPath && fs.existsSync(portraitPath)) {
        const portraitData = fs.readFileSync(portraitPath).toString("base64");
        card.set("photo", portraitData, { encoding: "b", type: "JPEG" });
      }
      for (const [key, value] of Object.entries(socialLinks)) {
        if (value && typeof value === "string")
          card.set(`x-socialprofile;type=${key.toLowerCase()}`, value);
      }
      const fileDir = path.join(__dirname, "../../public");
      if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });
      const fileName = `${landerName || "contact"}_${Date.now()}.vcf`;
      const filePath = path.join(fileDir, fileName);
      fs.writeFileSync(filePath, card.toString(), "utf-8");
      const fileUrl = `${basePath}${fileName}`;
      await Prisma.userTemplete.update({
        where: { id: newTemplate.id },
        data: { vcfFile: fileUrl },
      });
    }
    res
      .status(200)
      .json({ status: SUCCESS_STATUS, message: ONBOARDING_SUCCESSFUL_MESSAGE });
  } catch (error: any) {
    res.status(500).json({ status: ERROR_STATUS, message: error.message });
  }
}

// recreate payment
export async function recreatePayment(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    const existTemplate = await Prisma.userTemplete.findFirst({
      where: {
        userId: id,
      },
    });
    if (!existUser || !existTemplate) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const userData: UserType = {
      ...existUser,
      planKey: existUser.planKey ?? "",
      planPrice: existUser.planPrice ?? 0,
      planOldPrice: existUser.planOldPrice ?? 0,
      frequency: existUser.frequency ?? "monthly",
      planId: existUser.planId ?? "",
    };
    const resData = await paymentCreator(userData, "");
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      pageUrl: resData.pageUrl,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update templete social media
export async function updateTempleteSocial(req: Request, res: Response) {
  const id = req.params.id as string;
  const reqData = req.body;
  try {
    const existTemplete = await Prisma.userTemplete.findUnique({
      where: {
        id: id,
      },
    });
    if (!existTemplete) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Promise.all(
      reqData?.map((item: ButtonSetType) =>
        Prisma.buttonSet.update({
          where: { id: item?.id },
          data: {
            name: item.name,
            url: item.url,
          },
        }),
      ),
    );
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

// update templete social media
export async function updateCustomPlatform(req: Request, res: Response) {
  const id = req.params.id as string;
  const reqData = req.body;
  try {
    const existTemplete = await Prisma.userTemplete.findUnique({
      where: {
        id: id,
      },
    });
    if (!existTemplete) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Promise.all(
      reqData?.map((item: ButtonSetType) =>
        Prisma.customPlatfrom.update({
          where: { id: item?.id },
          data: {
            name: item.name,
            url: item.url,
          },
        }),
      ),
    );
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

// Update templete medias
export async function updateTempleteMedias(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existTemplate = await Prisma.userTemplete.findUnique({
      where: { id },
    });
    if (!existTemplate) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const basePath = fileProtocol(req);

    const files = req.files as Record<string, Express.Multer.File[]>;
    type MediaKeys = keyof typeof existTemplate;
    const medias: any = {
      portrait: "",
      logo: "",
      banner: "",
      background: "",
      epkFile: "",
    };
    for (const fieldName in files) {
      if (medias.hasOwnProperty(fieldName) && files[fieldName]?.[0]) {
        medias[fieldName as MediaKeys] =
          `${basePath}${files[fieldName][0].filename}`;
      }
    }

    const updateUserTemplete = await Prisma.userTemplete.update({
      where: { id },
      data: {
        portrait: medias.portrait || existTemplate.portrait,
        logo: medias.logo || existTemplate.logo,
        banner: medias.banner || existTemplate.banner,
        background: medias.background || existTemplate.background,
        epkFile: medias.epkFile || existTemplate.epkFile,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      userTemplete: updateUserTemplete,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update templete infos
export async function updateTempleteInfos(req: Request, res: Response) {
  const id = req.params.id as string;
  const {
    midName,
    nickName,
    bio,
    tagLine,
    businessServiced = [],
    offerings,
    funnySaying,
    firstName,
    lastName,
  } = req.body;
  try {
    const existTemplete = await Prisma.userTemplete.findUnique({
      where: { id },
      include: { services: true, user: true, buttonSet: true },
    });
    if (!existTemplete) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.user.update({
      where: { id: existTemplete.userId },
      data: {
        midName,
        nickName,
        firstName,
        lastName,
      },
    });
    const existingServices = existTemplete.services;
    const newServiceIds = businessServiced
      .filter((s: { id: string }) => s.id)
      .map((s: { id: string }) => s.id);
    const deletedServices = existingServices.filter(
      (service) => !newServiceIds.includes(service.id),
    );
    if (deletedServices.length > 0) {
      await Prisma.services.deleteMany({
        where: {
          id: { in: deletedServices.map((s) => s.id) },
        },
      });
    }
    for (const service of businessServiced) {
      if (service.id) {
        await Prisma.services.update({
          where: { id: service.id },
          data: { title: service.title },
        });
      } else {
        await Prisma.services.create({
          data: {
            title: service.title,
            templateId: id,
          },
        });
      }
    }

    // create vfc file
    if (existTemplete?.user) {
      const { midName, email, phone, addressOne, addressTow, landerName } =
        existTemplete?.user;
      card.set("fn", midName ?? "");
      card.set("note", offerings);
      card.set("org", landerName || "");
      card.set("title", tagLine || "");
      card.set("email", email || "");
      card.set("tel", phone || "");
      const adrString = `${addressOne ?? ""}, ${addressTow ?? ""}`;
      card.set("adr", adrString);
      const portraitPath = existTemplete?.logo;
      if (portraitPath) {
        const portraitData = await getBase64Image(portraitPath);
        if (portraitData) {
          card.set("photo", portraitData, {
            encoding: "b",
            type: "JPEG",
          });
        }
      }
      for (const [key, value] of Object.entries(existTemplete?.buttonSet)) {
        if (value && typeof value === "string") {
          card.set(`x-socialprofile;type=${key.toLowerCase()}`, value);
        }
      }
      const fileDir = path.join(__dirname, "../public");
      if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });
      const fileName = `${landerName || "contact"}_${Date.now()}.vcf`;
      const filePath = path.join(__dirname, "../public", fileName);
      fs.writeFileSync(filePath, card.toString(), "utf-8");
      const fileUrl = `${req.protocol}://${req.get("host")}/public/${fileName}`;
      await Prisma.userTemplete.update({
        where: { id: id },
        data: { vcfFile: fileUrl },
      });
    }

    await Prisma.userTemplete.update({
      where: { id },
      data: {
        bio,
        tagLine,
        offerings,
        funnySaying,
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

// update membership
export async function updateMemebership(req: Request, res: Response) {
  const { packageType, planKey, planPrice, planOldPrice, frequency } = req.body;
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
    await Prisma.user.update({
      where: {
        id: id,
      },
      data: {
        frequency: frequency,
        planKey: planKey,
        planPrice: Number(planPrice),
        planOldPrice: Number(planOldPrice),
        package: packageType,
      },
    });
    const userData: UserType = {
      ...existUser,
      planKey: existUser.planKey ?? "",
      planPrice: existUser.planPrice ?? 0,
      planOldPrice: existUser.planOldPrice ?? 0,
      frequency: existUser.frequency ?? "monthly",
      planId: existUser.planId ?? "",
    };
    const resData = await paymentCreator(userData, "");
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: REGISTRATION_SUCCESS_MESSAGE,
      pageUrl: resData.pageUrl,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// toggle merchendise status
export async function toggleMerchendiseStatus(req: Request, res: Response) {
  const id = req.params.id as string;
  const { merchendise } = req.body;
  try {
    const existTemplete = await Prisma.userTemplete.findFirst({
      where: {
        userId: id,
      },
    });

    if (!existTemplete) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.userTemplete.update({
      where: {
        id: existTemplete?.id,
      },
      data: {
        merchendiseStatus: merchendise,
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

// delete user templete
export async function deleteTemplete(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existTemplete = await Prisma.userTemplete.findUnique({
      where: {
        id: id,
      },
    });
    if (!existTemplete) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.userTemplete.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
      templete: existTemplete,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// delete templete social button
export async function deleteTempleteButton(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    await Prisma.buttonSet.delete({
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

// delete templete custom button
export async function deleteCustomButton(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    await Prisma.customPlatfrom.delete({
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
