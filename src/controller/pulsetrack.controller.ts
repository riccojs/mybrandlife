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
} = response;

// get all pulsetrack
export async function getAllPulsetrack(req: Request, res: Response) {
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
    const idPrefixValue = idPrefix ? idPrefix : newPulsetrack.sequence + 1000;
    await Prisma.pulsetrack.update({
      where: { id: newPulsetrack.id },
      data: {
        idPrefix: idPrefixValue,
        uniqeId: `${existLander?.landerName}${idPrefixValue}`,
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
  const id = req.params.id as string;
  try {
    const existPulsetrack = await Prisma.pulsetrack.findUnique({
      where: {
        idPrefix: Number(id),
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
    const existBrandtapByIdprefix = await Prisma.pulsetrack.findUnique({
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
        message: PULSETRACK_ID_IS_NOT_EDITABLE,
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
    expediteProduction,
    expediteShipping,
    title,
    price,
    subTotal,
    quantity,
    idPrefix,
    uniqeId,
    banner,
    color,
    userId,
  } = req.body;
  const brandtapId = req.params.id as string;
  try {
    const existBrandtap = await Prisma.pulsetrack.findUnique({
      where: {
        id: brandtapId,
      },
      include: {
        wristbands: true,
      },
    });
    if (!existBrandtap) {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    if (existBrandtap) {
      const existItem = await Prisma.wristbandItem.findFirst({
        where: {
          wristbandId: wristbandId,
          brandtapId: brandtapId,
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
            brandtapId: brandtapId,
            wristbandId: wristbandId,
            userId: userId,
            idPrefix: idPrefix,
            uniqeId: uniqeId,
            title: title,
            price: price,
            quantity: quantity,
            subTotal: subTotal,
            banner: banner,
            color: color,
            trackingNumber: `${existUser?.landerName}-${color}`,
            qrCode: `https://${existUser?.domain}/${existUser?.landerName}?idprefix=${uniqeId}`,
            mode: "BRANDTAP",
          },
        });
      }
      const updatedItems = await Prisma.wristbandItem.findMany({
        where: {
          brandtapId: brandtapId,
        },
      });
      const subTotalPrice =
        updatedItems?.reduce(
          (acc: number, item: { subTotal: number }) => acc + item.subTotal,
          0,
        ) ?? 0;
      const prudctionCost = expediteProduction || 0;
      const shippingCost = expediteShipping || 0;
      const totalPrice = subTotalPrice + prudctionCost + shippingCost;
      const updateBrandtap = await Prisma.pulsetrack.update({
        where: {
          id: brandtapId,
        },
        data: {
          subTotal: subTotalPrice,
          total: totalPrice,
          expediteProduction: prudctionCost,
          expediteShipping: shippingCost,
        },
      });
      return res.status(200).json({
        status: SUCCESS_STATUS,
        message: UPDATE_SUCCESSFUL_MESSAGE,
        brandtap: updateBrandtap,
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
  const { total, brandtapId, userId } = req.body;
  try {
    const existBrandtap = await Prisma.pulsetrack.findUnique({
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
    await Prisma.pulsetrack.update({
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
