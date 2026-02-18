import { Prisma } from "../utils/prisma.js";
import { Request, Response } from "express";
import status from "../utils/status.js";
import response from "../utils/response.js";
import ShippingEmail from "../lib/shipping.email.js";
import wristbandPayment from "../middelware/wristband.payment.js";
const { SUCCESS_STATUS, ERROR_STATUS } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  BRANDTAP_CREATE_SUCCESSFUL,
  INVALID_USER_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  BRANDTAP_ID_INVALID_MESSAGE,
  BRANDTAP_ID_VALID_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  BRANDTAP_ID_IS_NOT_EDITABLE,
  USER_ASSIGNED_SUCCESSFUL,
  REGISTRATION_SUCCESS_MESSAGE,
} = response;

// get all brandtap
export async function getAllBrandtap(req: Request, res: Response) {
  const { searchBy = "", statusBy = "", landerId } = req.query;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const skip = (page - 1) * page;
  let filter: any = {};
  if (searchBy) {
    filter.uniqeId = {
      contains: searchBy,
      mode: "insensitive",
    };
  }
  if (statusBy) {
    filter.status = statusBy;
  }
  if (landerId) {
    filter.landerId = landerId;
  }
  try {
    const brandtap = await Prisma.brandtap.findMany({
      skip: skip,
      take: limit,
      where: filter,
      include: {
        lander: true,
        brandtapWistbands: true,
        brandTapDatas: true,
      },
    });
    const totalBrandtap = await Prisma.brandtap.count({ where: filter });
    const totalPage = Math.ceil(totalBrandtap / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        brandtap,
        totalPage,
        totalBrandtap,
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

// get one brandtap
export async function getOneBrandtap(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existWistband = await Prisma.brandtap.findUnique({
      where: {
        id: id,
      },
      include: {
        brandtapWistbands: true,
        lander: true,
        brandTapDatas: true,
      },
    });
    if (!existWistband) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      wistband: existWistband,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// create brandtap
export async function createBrandtap(req: Request, res: Response) {
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
    const newBrandtap = await Prisma.brandtap.create({
      data: {
        name,
        landerId,
        baseDomain: existLander?.domain,
        basePath: existLander?.landerName,
        active: "INPROCESS",
      },
    });
    const idPrefixValue = idPrefix ? idPrefix : newBrandtap.sequence + 1000;
    await Prisma.brandtap.update({
      where: { id: newBrandtap.id },
      data: {
        idPrefix: idPrefixValue,
        uniqeId: `${existLander?.landerName}${idPrefixValue}`,
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: BRANDTAP_CREATE_SUCCESSFUL,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// check brandtap by idPrefix
export async function checkBrandtap(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existBrandtap = await Prisma.brandtap.findUnique({
      where: {
        idPrefix: Number(id),
      },
    });
    if (existBrandtap) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: BRANDTAP_ID_INVALID_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: BRANDTAP_ID_VALID_MESSAGE,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update brandtap
export async function updateBrandtap(req: Request, res: Response) {
  const id = req.params.id as string;
  const { name, idPrefix } = req.body;
  try {
    const existBrandtap = await Prisma.brandtap.findUnique({
      where: {
        id: id,
      },
    });
    const existBrandtapByIdprefix = await Prisma.brandtap.findUnique({
      where: {
        idPrefix: idPrefix,
      },
    });
    if (!existBrandtap) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    if (existBrandtapByIdprefix) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: BRANDTAP_ID_INVALID_MESSAGE,
      });
    }
    if (existBrandtap?.active === "ACTIVATE") {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: BRANDTAP_ID_IS_NOT_EDITABLE,
      });
    }
    await Prisma.brandtap.update({
      where: { id: id },
      data: {
        idPrefix: idPrefix,
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

// update brandtap status
export async function updateBrandtapStatus(req: Request, res: Response) {
  const id = req.params.id as string;
  const { status } = req.body;
  try {
    const existBrandtap = await Prisma.brandtap.findUnique({
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
    await Prisma.brandtap.update({
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

// delete brandtap
export async function deleteBrandtap(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existBrandtap = await Prisma.brandtap.findUnique({
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
    await Prisma.brandtap.delete({
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

// assigned brandtap wristband user
export async function assignedBrandtapWristband(req: Request, res: Response) {
  const id = req.params.id as string;
  const { firstname, lastname, nickname } = req.body;
  try {
    const existBrandtapWristband = await Prisma.brandtapWristband.findUnique({
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
    await Prisma.brandtapWristband.update({
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

// update brandtap wristband status
export async function updateBrandtapWristbandStatus(
  req: Request,
  res: Response,
) {
  const id = req.params.id as string;
  const { status } = req.body;
  try {
    const existBrandtapWristband = await Prisma.brandtapWristband.findUnique({
      where: {
        id: id,
      },
      include: {
        brandtap: {
          include: {
            lander: true,
          },
        },
      },
    });
    if (!existBrandtapWristband) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const { email, firstName, lastName, phone } =
      existBrandtapWristband?.brandtap?.lander;
    if (status === "SHIPPED") {
      await Prisma.brandtapWristband.update({
        where: { id: id },
        data: {
          status: status,
          shipped_at: new Date(),
        },
      });

      await ShippingEmail(
        email,
        firstName,
        lastName,
        `${phone}`,
        existBrandtapWristband?.trackingNumber,
        "SHIPPED",
      );
    }
    if (status === "DELIVERED") {
      await Prisma.brandtapWristband.update({
        where: { id: id },
        data: {
          status: status,
          delivered_at: new Date(),
        },
      });
      await ShippingEmail(
        email,
        firstName,
        lastName,
        `${phone}`,
        existBrandtapWristband?.trackingNumber,
        "DELIVERED",
      );
    }
    if (status !== "SHIPPED" || status !== "DELIVERED") {
      await Prisma.brandtapWristband.update({
        where: { id: id },
        data: {
          status: status,
        },
      });
      await ShippingEmail(
        email,
        firstName,
        lastName,
        `${phone}`,
        existBrandtapWristband?.trackingNumber,
        status,
      );
    }
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

// create wristban payment
export async function createWristbandPayment(req: Request, res: Response) {
  const { total, brandtapId, userId } = req.body;
  try {
    const existBrandtap = await Prisma.brandtap.findUnique({
      where: {
        id: brandtapId,
      },
    });
    if (!existBrandtap) {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const payment = await wristbandPayment(brandtapId, userId, total);
    await Prisma.brandtap.update({
      where: {
        id: brandtapId,
      },
      data: {
        transactionId: payment?.transactionId,
      },
    });
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
