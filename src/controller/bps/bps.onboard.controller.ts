import { Request, Response } from "express";
import { Prisma } from "../../utils/prisma.js";
import status from "../../utils/status.js";
import response from "../../utils/response.js";
import activityLog from "../../middelware/activity.log.js";
import fileProtocol from "../fileProtocol.js";
import onboardNotifyEmail from "../../lib/onboard.notify.email.js";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { createHash, randomBytes } from "crypto";
const csApiKey = process.env.CONTENT_STUDIO_API_KEY ?? "";
// CONTENT_SUDIO_API_URL is the old misspelled name, still accepted as a fallback.
const csApi =
  process.env.CONTENT_STUDIO_API_URL ?? process.env.CONTENT_SUDIO_API_URL ?? "";
const csReturnUrl = process.env.CONTENT_STUDIO_RETURN_URL ?? "";
const bpsAppUrl = process.env.BPS_APP_URL || "https://app.mybrandlife.me";
const bpsStaffUrl = process.env.BPS_STAFF_URL || "https://staff.mybrandlife.me";
const socialAccountsUrl = `${bpsAppUrl}/settings/social-accounts`;
const { SUCCESS_STATUS, ERROR_STATUS, LOG_SUCCESS, LOG_FAILED } = status;
const {
  DATA_NOT_FOUND_MESSAGE,
  BPS_ONBOARD_SUCCESSFUL_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  QUERY_SUCCESSFUL_MESSAGE,
  CONNECTION_REDIRECT_MESSAGE,
  ASSETS_UPLOAD_SUCCESSFUL_MESSAGE,
  APPROVER_NOT_FOUND_MESSAGE,
  MEDIA_NOT_FOUND_MESSAGE,
  REQUIRED_FIELDS_MISSING_MESSAGE,
} = response;

// Multipart forms send a repeated field as an array and a single value as a
// string; normalize both (and missing values) to a flat string array.
function toArray(value: unknown): string[] {
  if (value === undefined || value === null || value === "") return [];
  return (Array.isArray(value) ? value : [value]).map(String);
}

// Only include a list field in an update when it was actually provided.
function optionalArray(value: unknown): string[] | undefined {
  return value === undefined ? undefined : toArray(value);
}

// Only include a numeric field in an update when it was actually provided.
function optionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

// get all bps onboard
export async function getAllBpsOnboard(req: Request, res: Response) {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const searchBy = (req.query.searchBy as string) || "";
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (searchBy) {
      filter.brandName = {
        contains: searchBy,
        mode: "insensitive",
      };
    }
    const onboard = await Prisma.bpsOnboard.findMany({
      skip,
      take: limit,
      where: filter,
    });
    const totalOnboard = await Prisma.bpsOnboard.count({ where: filter });
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
    await activityLog({
      userId: "",
      action: "Get All BPS Onboard",
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

// get all bps onboard by staff
export async function getAllBpsOnboardByStaff(req: Request, res: Response) {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);
    const searchBy = (req.query.searchBy as string) || "";
    const staffId = (req.query.staffId as string) || "";
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (staffId) {
      filter.bpsApprover = { some: { staffId } };
    }

    if (searchBy) {
      filter.brandName = {
        contains: searchBy,
        mode: "insensitive",
      };
    }

    const [onboard, totalOnboard] = await Promise.all([
      Prisma.bpsOnboard.findMany({
        skip,
        take: limit,
        where: filter,
        orderBy: { create_at: "desc" },
        include: {
          bpsApprover: {
            where: { staffId },
          },
        },
      }),
      Prisma.bpsOnboard.count({ where: filter }),
    ]);
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
    await activityLog({
      userId: "",
      action: "Get All BPS Onboard By Staff",
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

// get all media
export async function getOnboardMedia(req: Request, res: Response) {
  const workspaceId = req.params.id as string;

  try {
    const existMembership = await Prisma.bpsMembership.findFirst({
      where: {
        csWorkspaceId: workspaceId,
      },
    });

    if (!existMembership) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const per_page = Math.min(
      100,
      Math.max(1, Number(req.query.per_page) || 20),
    );

    const { search, type, sort } = req.query;

    const params: Record<string, string | number> = {
      page,
      per_page,
    };

    if (typeof search === "string" && search.trim()) {
      params.search = search.trim();
    }

    if (typeof type === "string" && ["image", "video"].includes(type)) {
      params.type = type;
    }

    if (
      typeof sort === "string" &&
      ["recent", "oldest", "size", "a2z", "z2a"].includes(sort)
    ) {
      params.sort = sort;
    }

    const { data } = await axios.get(
      `${csApi}/workspaces/${workspaceId}/media`,
      {
        params,
        headers: {
          "X-API-Key": csApiKey!,
        },
      },
    );
    await activityLog({
      userId: existMembership?.userId,
      action: "Get Onboard Media",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    return res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: data.data,
      pagination: {
        currentPage: data.current_page,
        perPage: data.per_page,
        total: data.total,
        lastPage: data.last_page,
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
    return res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get one bps onboard
export async function getOneBpsOnboard(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existOnboard = await Prisma.bpsOnboard.findUnique({
      where: {
        id: id,
      },
      include: {
        membership: true,
      },
    });
    if (!existOnboard) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      onboard: existOnboard,
    });
    await activityLog({
      userId: existOnboard?.membership?.userId,
      action: "Get one BPS Onboard",
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

// onboard bps user
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
    timeZone,
  } = req.body;
  const membershipId = req.params.id as string;
  try {
    const existMembership = await Prisma.bpsMembership.findUnique({
      where: {
        id: membershipId,
      },
      include: {
        user: true,
      },
    });

    if (!existMembership) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    // Validate the approver before creating anything, so a bad staffId
    // doesn't leave a half-created onboard behind.
    const getStaff =
      approvalMode === "APPROVAL_REQUIRED" && staffId
        ? await Prisma.bpsStaff.findUnique({ where: { id: staffId } })
        : null;
    if (approvalMode === "APPROVAL_REQUIRED" && !getStaff) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: APPROVER_NOT_FOUND_MESSAGE,
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
        membershipId: membershipId,
        brandName: brandName,
        website: website,
        industry: industry,
        location: location,
        timeZone: timeZone,
        services: toArray(services),
        businessHour: Number(businessHour) || 0,
        brandOwner: brandOwner,
        activity: activity,
        promotions: toArray(promotions),
        events: toArray(events),
        lead: lead,
        targetAudince: targetAudince,
        tarritory: tarritory,
        tone: tone,
        language: language,
        brandDo: toArray(brandDo),
        brandDont: toArray(brandDont),
        keyClaim: keyClaim,
        avoidTopics: toArray(avoidTopics),
        upcommingEvents: toArray(upcommingEvents),
        approvalMode: approvalMode,
        logo: medias?.logo,
        cover: medias?.cover,
        brandAssests: medias?.brandAssests,
      },
    });
    if (getStaff) {
      const { firstName, lastName, email, role } = getStaff;
      await Prisma.bpsApprover.create({
        data: {
          staffId: getStaff.id,
          onboardId: newOnboard?.id,
          staffname: `${firstName} ${lastName}`,
          staffemail: email,
          staffrole: role,
          notes: notes,
        },
      });
      await onboardNotifyEmail(
        firstName,
        email,
        `${existMembership?.user?.landerName} has selected you as an approver. As an approver, you will be responsible for reviewing and approving or rejecting requests assigned to you. To verify this onboard, please login your staff account. If you were not expecting this request, or you believe it was sent by mistake, please contact our support team before taking any action.`,
        brandName,
        `${brandName} has been onboard successfully`,
        `${brandName} onboard has been submitted`,
        `${bpsStaffUrl}/onboard/${newOnboard?.id}`,
      );
    }

    await Prisma.bpsProccess.create({
      data: {
        onboardId: newOnboard?.id,
        name: "Submit Onboard",
        description: `${brandName} has been complete onboard.`,
        completeAt: new Date(),
        status: "ONBOARD_SUBMITED",
      },
    });
    await activityLog({
      userId: existMembership?.user?.id ?? "",
      action: "Onboard BPS User",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
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

// update bps onboard info
export async function updateOnboardInfo(req: Request, res: Response) {
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
    timeZone,
  } = req.body;
  const id = req.params.id as string;
  try {
    const existOnboard = await Prisma.bpsOnboard.findUnique({
      where: {
        id: id,
      },
      include: {
        membership: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!existOnboard) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.bpsOnboard.update({
      where: {
        id: id,
      },
      data: {
        brandName: brandName,
        website: website,
        industry: industry,
        location: location,
        timeZone: timeZone,
        services: optionalArray(services),
        businessHour: optionalNumber(businessHour),
        brandOwner: brandOwner,
        activity: activity,
        promotions: optionalArray(promotions),
        events: optionalArray(events),
        lead: lead,
        targetAudince: targetAudince,
        tarritory: tarritory,
        tone: tone,
        language: language,
        brandDo: optionalArray(brandDo),
        brandDont: optionalArray(brandDont),
        keyClaim: keyClaim,
        avoidTopics: optionalArray(avoidTopics),
        upcommingEvents: optionalArray(upcommingEvents),
        approvalMode: approvalMode,
      },
    });
    await activityLog({
      userId: existOnboard?.membership?.user?.id ?? "",
      action: "Update BPS Onboard Info",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
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

// update bps onboard info
export async function verifyOnboard(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existOnboard = await Prisma.bpsOnboard.findUnique({
      where: {
        id: id,
      },
      include: {
        membership: {
          include: {
            user: true,
          },
        },
      },
    });

    const { email, firstName } = existOnboard?.membership?.user || {};

    if (!existOnboard) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await onboardNotifyEmail(
      firstName ?? "",
      email ?? "",
      `Congratulations! Your onboarding has been successfully verified. Your onboard is now set up, and our team will begin the next steps of your service. To confirm everything is in order, please log in to your dashboard and review your onboarding details. If you notice any errors or have questions, our support team is happy to help.`,
      existOnboard?.brandName,
      `${existOnboard?.brandName} onboard has been verified`,
      `Onboard has been verified`,
      `${bpsAppUrl}/bps/onboard/${id}`,
    );
    await Prisma.bpsProccess.create({
      data: {
        onboardId: id,
        name: "Verify BPS Onboard",
        description: "BPS onboarding has been successfully verified.",
        completeAt: new Date(),
        status: "VERIFY_ONBOARDING",
      },
    });
    await activityLog({
      userId: existOnboard?.membership?.user?.id ?? "",
      action: "Verify BPS Onboard",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
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

// update bps onboard media
export async function updateOnboardMedia(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existOnboard = await Prisma.bpsOnboard.findUnique({
      where: {
        id: id,
      },
      include: {
        membership: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!existOnboard) {
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
    await Prisma.bpsOnboard.update({
      where: {
        id: id,
      },
      data: {
        logo: medias?.logo ? medias?.logo : existOnboard?.logo,
        cover: medias?.cover ? medias?.cover : existOnboard?.cover,
        brandAssests: medias.brandAssests.length
          ? medias.brandAssests
          : existOnboard?.brandAssests,
      },
    });
    await activityLog({
      userId: existOnboard?.membership?.user?.id ?? "",
      action: "Update BPS Onboard Media",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
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

// connect socials
export async function connectOnboardSocial(req: Request, res: Response) {
  const platformId = req.params.id as string;
  const { workspaceId, platform } = req.body;
  try {
    if (!workspaceId || !platform) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: REQUIRED_FIELDS_MISSING_MESSAGE,
      });
    }
    const existPlatform = await Prisma.bpsPlatfrom.findUnique({
      where: { id: platformId },
      include: {
        membership: true,
      },
    });

    if (!existPlatform) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const attemptToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(attemptToken).digest("hex");
    const returnUrl = `${csReturnUrl}?attemp=${attemptToken}`;
    const { data } = await axios.post(
      `${csApi}/workspaces/${workspaceId}/connect/${platform}`,
      {},
      {
        params: {
          process: "connect",
          return_url: returnUrl,
        },
        headers: {
          "X-API-Key": csApiKey,
        },
      },
    );
    await Prisma.bpsPlatfrom.update({
      where: {
        id: platformId,
      },
      data: {
        csWorkspaceId: workspaceId,
        attemp: tokenHash,
      },
    });
    await activityLog({
      userId: "",
      action: `Generate ${platform} social connection link`,
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    await activityLog({
      userId: existPlatform?.membership?.userId,
      action: "Connect BPS Social Link",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });

    return res.status(200).json({
      status: SUCCESS_STATUS,
      message: CONNECTION_REDIRECT_MESSAGE,
      data: {
        authorizationUrl: data.data.authorization_url,
        sessionId: data.data.session_id,
        platform: data.data.platform,
        expiresAt: data.data.expires_at,
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

    return res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// social callback webhook
export async function socialCallback(req: Request, res: Response) {
  try {
    const attemptToken = req.query.attemp;
    if (typeof attemptToken !== "string" || !attemptToken) {
      return res.redirect(`${socialAccountsUrl}?connection=failed`);
    }
    const tokenHash = createHash("sha256").update(attemptToken).digest("hex");
    const platform = await Prisma.bpsPlatfrom.findFirst({
      where: {
        attemp: tokenHash,
      },
    });
    if (!platform) {
      return res.redirect(`${socialAccountsUrl}?connection=failed`);
    }
    const { data } = await axios.get(
      `${csApi}/workspaces/${platform.csWorkspaceId}/accounts`,
      {
        headers: {
          "X-API-Key": csApiKey!,
        },
      },
    );

    if (data?.status) {
      await Prisma.bpsPlatfrom.update({
        where: {
          id: platform?.id,
        },
        data: {
          status: "CONNECTED",
          attemp: null,
        },
      });
      return res.redirect(`${socialAccountsUrl}?connection=success`);
    }

    return res.redirect(`${socialAccountsUrl}?connection=failed`);
  } catch (error: any) {
    return res.redirect(`${socialAccountsUrl}?connection=failed`);
  }
}

// upload onboard medias
export async function uploadOnboardMedia(req: Request, res: Response) {
  const workspaceId = req.params.id as string;
  const files = req.files as Record<string, Express.Multer.File[]>;
  const assets = files?.assets || [];
  try {
    const existMembership = await Prisma.bpsMembership.findFirst({
      where: {
        csWorkspaceId: workspaceId,
      },
    });
    if (!existMembership) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const uploadedAssets = [];
    for (const file of assets) {
      const form = new FormData();
      form.append("file", fs.createReadStream(file.path), {
        filename: file.originalname,
        contentType: file.mimetype,
      });
      const { data } = await axios.post(
        `${csApi}/workspaces/${workspaceId}/media`,
        form,
        {
          headers: {
            ...form.getHeaders(),
            "X-API-Key": csApiKey!,
          },
          maxBodyLength: Infinity,
        },
      );
      uploadedAssets.push({
        ...data.data,
        originalName: file.originalname,
        filename: file.filename,
      });
    }
    await activityLog({
      userId: existMembership.userId,
      action: "Assets upload",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: ASSETS_UPLOAD_SUCCESSFUL_MESSAGE,
      data: uploadedAssets,
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
  } finally {
    // Assets live in ContentStudio; don't keep the temp copies in public/.
    await Promise.all(
      assets.map((file) => fs.promises.unlink(file.path).catch(() => {})),
    );
  }
}

// delete bps onboard
export async function deleteBpsOnboard(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existOnboard = await Prisma.bpsOnboard.findUnique({
      where: {
        id: id,
      },
      include: {
        membership: true,
      },
    });

    if (!existOnboard) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.bpsOnboard.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
    });
    await activityLog({
      userId: existOnboard?.membership?.userId,
      action: "Delete BPS Onboard",
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

// delete onboard media
export async function deleteOnboardMedia(req: Request, res: Response) {
  const workspaceId = req.params.id as string;
  const mediaId = req.params.mediaId as string;
  try {
    const existMembership = await Prisma.bpsMembership.findFirst({
      where: {
        csWorkspaceId: workspaceId,
      },
    });

    if (!existMembership) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const { data } = await axios.delete(
      `${csApi}/workspaces/${workspaceId}/media/${mediaId}`,
      {
        headers: {
          "X-API-Key": csApiKey!,
        },
      },
    );
    await activityLog({
      userId: existMembership.userId,
      action: "Delete Onboard Media",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });

    return res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
      data,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: MEDIA_NOT_FOUND_MESSAGE,
      });
    }
    return res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}
