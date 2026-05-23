import { Prisma } from "../utils/prisma.js";
import { Request, Response } from "express";
import status from "../utils/status.js";
import response from "../utils/response.js";
import wristbandPayment from "../middelware/wristband.payment.js";
const { SUCCESS_STATUS, ERROR_STATUS } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  PULSETRACK_CREATE_SUCCESSFUL,
  INVALID_USER_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  PULSETRACK_ID_INVALID_MESSAGE,
  PULSETRACK_ID_VALID_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  PULSETRACK_ID_IS_NOT_EDITABLE,
  USER_ASSIGNED_SUCCESSFUL,
  REGISTRATION_SUCCESS_MESSAGE,
  INVALID_EXPORT_FILE_TYPE,
} = response;
const frontendUrl = process.env.FRONTEND_CORS_URL;
import PDFDocument from "pdfkit";
import { Parser } from "json2csv";
import pulsetrackEmail from "../lib/pulsetrack.email.js";
import alertEmail from "../lib/alert.email.js";

// get all pulsetrack
export async function getAllPulsetrack(req: Request, res: Response) {
  const { searchBy = "", statusBy = "", userId, orderId = "" } = req.query;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const skip = (page - 1) * limit;
  let filter: any = {};
  if (searchBy) {
    filter.name = {
      contains: searchBy,
      mode: "insensitive",
    };
  }
  if (statusBy) {
    filter.active = statusBy;
  }
  if (userId) {
    filter.landerId = userId;
  }
  if (orderId) {
    filter.sequence = Number(orderId);
  }
  try {
    const pulsetrack = await Prisma.pulsetrack.findMany({
      skip: skip,
      take: limit,
      where: filter,
      include: {
        lander: true,
        wristbands: true,
        pulsetrackData: true,
      },
    });
    const totalPulsetrack = await Prisma.pulsetrack.count({ where: filter });
    const totalPage = Math.ceil(totalPulsetrack / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        pulsetrack,
        totalPage,
        totalPulsetrack,
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

// get default pulsetrack
export async function getDefaultPulsetrack(req: Request, res: Response) {
  const userId = req.query.userId as string;
  try {
    const pulsetrack = await Prisma.pulsetrack.findMany({
      where: {
        landerId: userId,
      },
      include: {
        lander: true,
        wristbands: true,
        pulsetrackData: true,
      },
    });
    const wristband = await Prisma.wristbandItem.findMany({
      where: {
        userId: userId,
        mode: "PULSETRACK",
      },
    });
    const analytics = await Prisma.pulsetrackData.findMany({
      where: {
        landerId: userId,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      pulsetrack,
      wristband,
      analytics,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get one pulsetrack
export async function getOnePulsetrack(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existPulsetrack = await Prisma.pulsetrack.findUnique({
      where: {
        id: id,
      },
      include: {
        wristbands: true,
        lander: true,
        pulsetrackData: true,
      },
    });
    if (!existPulsetrack) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      pulsetrack: existPulsetrack,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get all wristband item by pulsetrack
export async function getPulsetrackCart(req: Request, res: Response) {
  const { pulsetrackId = "", modeBy = "" } = req.query;

  let filter: any = {};
  if (pulsetrackId) {
    filter.pulsetrackId = pulsetrackId;
  }
  if (modeBy) {
    filter.mode = modeBy;
  }
  try {
    const wristband = await Prisma.wristbandItem.findMany({
      where: filter,
      include: {
        pulsetrack: true,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      wristband,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// create pulsetrack
export async function createPulsetrack(req: Request, res: Response) {
  const { landerId, name, idPrefix } = req.body;

  try {
    const existLander = await Prisma.user.findUnique({
      where: {
        id: landerId,
      },
    });
    if (!existLander) {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: INVALID_USER_MESSAGE,
      });
    }
    const newPulsetrack = await Prisma.pulsetrack.create({
      data: {
        name,
        landerId,
        baseDomain: existLander?.domain,
        basePath: existLander?.landerName,
        active: "INPROCESS",
      },
    });
    const idPrefixValue = idPrefix
      ? Number(idPrefix)
      : newPulsetrack.sequence + 1000;
    await Prisma.pulsetrack.update({
      where: { id: newPulsetrack.id },
      data: {
        idPrefix: idPrefixValue,
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: PULSETRACK_CREATE_SUCCESSFUL,
      pulsetrack: newPulsetrack,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// check pulsetrack by idPrefix
export async function checkPulsetrack(req: Request, res: Response) {
  const { idPrefix } = req.body;
  try {
    const existPulsetrack = await Prisma.pulsetrack.findUnique({
      where: {
        idPrefix: Number(idPrefix),
      },
    });
    if (existPulsetrack) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: PULSETRACK_ID_INVALID_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: PULSETRACK_ID_VALID_MESSAGE,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update pulsetrack
export async function updatePulsetrack(req: Request, res: Response) {
  const id = req.params.id as string;
  const { name, idPrefix } = req.body;
  try {
    const existBrandtap = await Prisma.pulsetrack.findUnique({
      where: {
        id: id,
      },
    });

    if (!existBrandtap) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    if (existBrandtap?.active === "ACTIVATE") {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: PULSETRACK_ID_IS_NOT_EDITABLE,
      });
    }
    await Prisma.pulsetrack.update({
      where: { id: id },
      data: {
        idPrefix: Number(idPrefix),
        name: name,
      },
    });
    return res.status(201).json({
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

// update pulsetrack status
export async function updatePulsetrackStatus(req: Request, res: Response) {
  const id = req.params.id as string;
  const { status } = req.body;
  try {
    const existBrandtap = await Prisma.pulsetrack.findUnique({
      where: {
        id: id,
      },
    });
    if (!existBrandtap) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.pulsetrack.update({
      where: { id: id },
      data: {
        active: status,
      },
    });
    return res.status(201).json({
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

// delete pulsetrack
export async function deletePulsetrack(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existBrandtap = await Prisma.pulsetrack.findUnique({
      where: {
        id: id,
      },
    });
    if (!existBrandtap) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.pulsetrack.delete({
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

// assigned pulsetrack wristband user
export async function assignedPulsetrackWristband(req: Request, res: Response) {
  const id = req.params.id as string;
  const { firstname, lastname, nickname } = req.body;
  try {
    const existBrandtapWristband = await Prisma.wristbandItem.findUnique({
      where: {
        id: id,
      },
    });
    if (!existBrandtapWristband) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.wristbandItem.update({
      where: {
        id: id,
      },
      data: {
        assignedFirstName: firstname,
        assignedLastName: lastname,
        assignedNickname: nickname,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: USER_ASSIGNED_SUCCESSFUL,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// create or update pulsetrack wristband
export async function togglePulsetrack(req: Request, res: Response) {
  const {
    wristbandId,
    title,
    price,
    subTotal,
    quantity,
    idPrefix,
    banner,
    color,
    userId,
  } = req.body;

  const pulsetrackId = req.params.id as string;
  try {
    const existPulsetrack = await Prisma.pulsetrack.findUnique({
      where: {
        id: pulsetrackId,
      },
      include: {
        wristbands: true,
      },
    });

    if (existPulsetrack) {
      const existItem = await Prisma.wristbandItem.findFirst({
        where: {
          wristbandId: wristbandId,
          pulsetrackId: pulsetrackId,
        },
      });

      if (existItem) {
        await Prisma.wristbandItem.update({
          where: {
            id: existItem?.id,
          },
          data: {
            price: price,
            quantity: quantity,
            subTotal: subTotal,
          },
        });
      } else {
        const existUser = await Prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        await Prisma.wristbandItem.create({
          data: {
            pulsetrackId: pulsetrackId,
            wristbandId: wristbandId,
            userId: userId,
            idPrefix: idPrefix,
            title: title,
            price: price,
            quantity: quantity,
            subTotal: subTotal,
            banner: banner,
            color: color,
            trackingNumber: `${existUser?.landerName}-${color}`,
            qrCode: `https://${existUser?.domain}/${existUser?.landerName}?idprefix=${idPrefix}`,
            mode: "PULSETRACK",
          },
        });
      }
      const updatedItems = await Prisma.wristbandItem.findMany({
        where: {
          pulsetrackId: pulsetrackId,
        },
      });
      const subTotalPrice =
        updatedItems?.reduce(
          (acc: number, item: { subTotal: number }) => acc + item.subTotal,
          0,
        ) ?? 0;
      const updateBrandtap = await Prisma.pulsetrack.update({
        where: {
          id: pulsetrackId,
        },
        data: {
          subTotal: Number(subTotalPrice?.toFixed(2)),
          total: Number(subTotalPrice?.toFixed(2)),
          expediteProduction: 0,
          expediteShipping: 0,
        },
      });
      return res.status(200).json({
        status: SUCCESS_STATUS,
        message: UPDATE_SUCCESSFUL_MESSAGE,
        brandtap: updateBrandtap,
      });
    } else {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// create pulsetrack payment
export async function createPulsetrackPayment(req: Request, res: Response) {
  const { total, pulsetrackId, userId, address, city, zip, state } = req.body;

  try {
    const existPulsetrack = await Prisma.pulsetrack.findUnique({
      where: {
        id: pulsetrackId,
      },
      include: {
        lander: true,
        wristbands: true,
      },
    });
    if (!existPulsetrack) {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const payment = await wristbandPayment(pulsetrackId, userId, total);
    const userName = existPulsetrack?.lander?.username ?? "";
    await pulsetrackEmail(
      userName,
      total,
      existPulsetrack?.landerId,
      city,
      zip,
      address,
    );
    await Prisma.pulsetrack.update({
      where: {
        id: pulsetrackId,
      },
      data: {
        transactionId: payment?.transactionId,
        address: address,
        city: city,
        zip: Number(zip),
        state: state,
      },
    });
    await alertEmail(
      "New Wristband Order",
      "User Purchased Wristbands",
      `A new wristband order has been placed.
            Order Details:
            - User ID: ${existPulsetrack?.landerId}
            - Lander Name: ${existPulsetrack?.lander?.landerName}
            - Domain: ${existPulsetrack?.lander?.domain}
            Wristbands:
            ${existPulsetrack?.wristbands
              .map(
                (w) =>
                  `• ${w.title} | Qty: ${w.quantity} | Price: ${w.price} | Subtotal: ${w.subTotal}`,
              )
              .join("\n")}
            Please review the admin dashboard for full order details and fulfillment processing.`,
    );
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: REGISTRATION_SUCCESS_MESSAGE,
      pageUrl: payment.pageUrl,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// delete pulsetrack cart item
export async function deleteCartItem(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existWristband = await Prisma.wristbandItem.findUnique({
      where: {
        id: id,
      },
    });
    if (!existWristband) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.wristbandItem.delete({
      where: {
        id: id,
      },
    });
    const subTotal = existWristband?.subTotal;
    const pulsetrackId = existWristband?.pulsetrackId as string;
    const existPulstrack = await Prisma.pulsetrack.findUnique({
      where: {
        id: pulsetrackId,
      },
    });
    const pulsetrackSubtotal = existPulstrack?.subTotal || 0;
    const pulsetracktotal = existPulstrack?.subTotal || 0;
    const calculateSubtotal = (pulsetrackSubtotal - subTotal).toFixed(2);
    const calculatetotal = (pulsetracktotal - subTotal).toFixed(2);
    await Prisma.pulsetrack.update({
      where: {
        id: pulsetrackId,
      },
      data: {
        subTotal: Number(calculateSubtotal),
        total: Number(calculatetotal),
        expediteProduction: 0,
        expediteShipping: 0,
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

// toggle extra cost
export async function toggleExtraPulsetrackCost(req: Request, res: Response) {
  const id = req.params.id as string;
  const { expediteProduction = 0, expediteShipping = 0 } = req.body;
  try {
    const existBrandtap = await Prisma.pulsetrack.findUnique({
      where: { id },
    });
    if (!existBrandtap) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const expediteProductionValue =
      expediteProduction >= 0
        ? expediteProduction
        : existBrandtap.expediteProduction;
    const expediteShippingValue =
      expediteShipping >= 0 ? expediteShipping : existBrandtap.expediteShipping;
    const total =
      (existBrandtap.subTotal ?? 0) +
      expediteProductionValue +
      expediteShippingValue;
    await Prisma.pulsetrack.update({
      where: { id },
      data: {
        expediteProduction: expediteProductionValue,
        expediteShipping: expediteShippingValue,
        total: Number(total.toFixed(2)),
      },
    });
    return res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// scan wristband
export async function savePulsetrackScan(req: Request, res: Response) {
  try {
    const {
      landerId,
      occurredAt,
      browser,
      os,
      deviceType,
      screenWidth,
      screenHeight,
      devicePixelRatio,
      language,
      timeZone,
      connectionType,
      ipAddress,
      geoCity,
      geoRegion,
      geoCountry,
    } = req.body;
    const idPrefix = req.params.id as string;

    const existPulsetrack = await Prisma.pulsetrack.findUnique({
      where: {
        idPrefix: Number(idPrefix),
      },
      include: {
        lander: true,
      },
    });

    if (!existPulsetrack) {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const existingScan = await Prisma.pulsetrackData.findFirst({
      where: {
        pulsetrackId: existPulsetrack?.id,
        ipAddress,
      },
    });
    const isUnique = existingScan ? false : true;
    const firstVisit = isUnique;

    const newScanData = await Prisma.pulsetrackData.create({
      data: {
        pulsetrackId: existPulsetrack?.id,
        landerId,
        idPrefix: Number(idPrefix),
        occurredAt: occurredAt ? new Date(occurredAt) : new Date(),
        landingUrl: `${frontendUrl}/${existPulsetrack?.lander?.landerName}?idPrefix=${idPrefix}`,
        referrer: existPulsetrack?.lander?.landerName,
        referrerDomain: existPulsetrack?.lander?.domain,
        browser,
        os,
        deviceType,
        screenWidth,
        screenHeight,
        devicePixelRatio,
        language,
        timeZone,
        connectionType,
        firstVisit,
        isUnique,
        ipAddress,
        geoCity,
        geoRegion,
        geoCountry,
      },
    });
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      pulsetrack: newScanData,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// gps scan wristband
export async function saveGpsPulsetrackScan(req: Request, res: Response) {
  const { gpsLat, gpsLan, gpsAccuracy, gpsTimestamp, gpsConsent } = req.body;
  try {
    const scanId = req.params.id as string;
    const existPulsetrackData = await Prisma.pulsetrackData.findFirst({
      where: {
        id: scanId,
      },
    });

    if (!existPulsetrackData) {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.pulsetrackData.update({
      where: {
        id: scanId,
      },
      data: {
        gpsLat: gpsLat,
        gpsLan: gpsLan,
        gpsAccuracy: gpsAccuracy,
        gpsTimestamp: gpsTimestamp ? new Date(gpsTimestamp) : null,
        gpsConsent: gpsConsent,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// export pulsetrack data
export async function exportPulsetrackData(req: Request, res: Response) {
  const { days, type } = req.body;
  const userId = req.params.id as string;
  const numDays = Number(days) || 7;
  const exportType = String(type).toLowerCase();
  const filename = `pulsetrack_last_${numDays}_days.${exportType}`;
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - numDays);
  let pulsetrackId = "";
  let exportStatus = "";
  try {
    if (!["csv", "pdf", "json"].includes(exportType)) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: INVALID_EXPORT_FILE_TYPE,
      });
    }
    const data = await Prisma.pulsetrackData.findMany({
      where: {
        landerId: userId,
        occurredAt: { gte: fromDate },
      },
    });

    if (data?.length === 0) {
      pulsetrackId = "";
      exportStatus = "failed";
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    pulsetrackId = data.length ? data[0].pulsetrackId : "";
    if (exportType === "csv") {
      const fields = [
        "id",
        "pulsetrackId",
        "landerId",
        "idPrefix",
        "occurredAt",
        "landingUrl",
        "referrer",
        "referrerDomain",
        "browser",
        "os",
        "deviceType",
        "screenWidth",
        "screenHeight",
        "devicePixelRatio",
        "language",
        "timeZone",
        "connectionType",
        "firstVisit",
        "isUnique",
        "ipAddress",
        "geoCity",
        "geoRegion",
        "geoCountry",
        "gpsLat",
        "gpsLan",
        "gpsAccuracy",
        "gpsTimestamp",
        "gpsConsent",
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(data);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      exportStatus = "success";
      return res.send(csv);
    }
    if (exportType === "pdf") {
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      doc.pipe(res);
      doc.fontSize(18).text(`Pulsetrack Data - Last ${numDays} days`, {
        align: "center",
      });
      doc.moveDown(2);
      doc.font("Courier").fontSize(9);
      data.forEach((row) => {
        const jsonBlock = JSON.stringify(row, null, 2);
        doc.text(jsonBlock, {
          width: 520,
        });
        doc.moveDown();
      });
      doc.end();
      exportStatus = "success";
      return;
    }
  } catch (error: any) {
    return res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  } finally {
    await Prisma.trackExport.create({
      data: {
        landerId: userId,
        pulsetrackId: pulsetrackId ? pulsetrackId : null,
        name: filename,
        status: exportStatus,
        action: "download",
      },
    });
  }
}

// get all export Data
export async function getAllExportData(req: Request, res: Response) {
  const userId = req.query.userId as string;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const skip = (page - 1) * limit;
  try {
    const exports = await Prisma.trackExport.findMany({
      skip: skip,
      take: limit,
      where: {
        landerId: userId,
      },
    });
    const totalExports = await Prisma.trackExport.count({
      where: {
        landerId: userId,
      },
    });
    const totalPage = Math.ceil(totalExports / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        exports,
        totalPage,
        totalExports,
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
