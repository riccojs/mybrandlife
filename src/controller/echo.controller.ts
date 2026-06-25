import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import echoEmail from "../lib/echo.email.js";
import echoPaymentcreator from "../middelware/echo.paymentcreator.js";
import Stripe from "stripe";
import { getIo } from "../middelware/socket.js";
import notificationEmail from "../lib/notification.email.js";
import activityLog from "../middelware/activity.log.js";
import notificationCreator from "../middelware/notification.createor.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const { SUCCESS_STATUS, ERROR_STATUS, LOG_SUCCESS, LOG_FAILED } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  FORM_SUBMITION_SUCCESSFUL_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  CONNECTION_REDIRECT_MESSAGE,
  USER_STRIPE_CONNECTION_FAILED,
} = response;

// get all echo
export async function getAllEcho(req: Request, res: Response) {
  const { searchBy = "", statusBy = "", userId = "" } = req.query;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const skip = (page - 1) * page;
  let filter: any = {};
  if (searchBy) {
    filter.name = {
      contains: searchBy,
      mode: "insensitive",
    };
  }
  if (statusBy) {
    filter.status = statusBy;
  }
  if (userId) {
    filter.userId = userId;
  }

  try {
    const echo = await Prisma.echo.findMany({
      skip: skip,
      take: limit,
      where: filter,
      include: {
        user: true,
      },
    });
    const totalEcho = await Prisma.echo.count({ where: filter });
    const totalPage = Math.ceil(totalEcho / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        echo,
        totalPage,
        totalEcho,
        currentPage: page,
      },
    });
    await activityLog({
      userId: "",
      action: "Get all echo",
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

// get all echo by ander
export async function getAllEchoByLander(req: Request, res: Response) {
  const { landerName } = req.query;
  const lander = landerName as string;
  try {
    const echo = await Prisma.echo.findMany({
      where: {
        user: {
          landerName: lander,
        },
        status: "CONFIRMED",
      },
      include: {
        user: true,
      },
      orderBy: {
        create_at: "desc",
      },
    });
    const existUser = await Prisma.user.findUnique({
      where: {
        landerName: lander,
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
      echo: echo,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Get all echo by lander",
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

// get one echo
export async function getOneEcho(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existEcho = await Prisma.echo.findUnique({
      where: {
        id: id,
      },
    });
    if (!existEcho) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      echo: existEcho,
    });
    await activityLog({
      userId: existEcho?.userId,
      action: "Get one echo",
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

// create echo
export async function createEcho(req: Request, res: Response) {
  const { name, email, message, tip, userId, city, shoutOut } = req.body;
  try {
    let newEcho;
    const existUser = await Prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    let data;
    if (Number(tip)) {
      data = await echoPaymentcreator(
        Number(tip),
        userId,
        name,
        existUser?.landerName ?? "",
        existUser.domain ?? "",
      );
      newEcho = await Prisma.echo.create({
        data: {
          name: name,
          email: email,
          message: message,
          tip: Number(tip),
          userId: userId,
          transactionId: data?.transactionId,
          shoutOut: shoutOut,
          city: city,
        },
        include: {
          user: true,
        },
      });
    } else {
      newEcho = await Prisma.echo.create({
        data: {
          name: name,
          email: email,
          message: message,
          userId: userId,
          shoutOut: shoutOut,
          city: city,
          tip: 0,
        },
        include: {
          user: true,
        },
      });
      data = {
        pageUrl: existUser?.landerName,
      };
    }
    await echoEmail(name, email, city, message, shoutOut, tip, false);
    await echoEmail(name, existUser?.email, city, message, shoutOut, tip, true);

    res.status(200).json({
      status: SUCCESS_STATUS,
      message: FORM_SUBMITION_SUCCESSFUL_MESSAGE,
      pageUrl: data?.pageUrl,
    });
    await activityLog({
      userId: userId,
      action: "Create echo",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    await notificationCreator({
      title: `${name} echo submit successfully`,
      redirectUrl: `/admin/echo?view=${newEcho?.id}`,
      profile: null,
      seen: false,
      userId: null,
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

// update echo
export async function updateEcho(req: Request, res: Response) {
  const { name, email, message, tip, shoutOut, city, status } = req.body;
  const id = req.params.id as string;
  try {
    const existEcho = await Prisma.echo.findUnique({
      where: {
        id: id,
      },
    });
    if (!existEcho) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.echo.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        email: email,
        message: message,
        tip: Number(tip),
        shoutOut: shoutOut,
        city: city,
        status: status,
      },
    });

    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: existEcho?.userId,
      action: "Update echo",
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

// delete echo
export async function deleteEcho(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existEcho = await Prisma.echo.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
      },
    });
    if (!existEcho) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.echo.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
    });
    await activityLog({
      userId: existEcho?.userId,
      action: "Delete echo",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    await notificationCreator({
      title: `${existEcho?.user?.landerName} delete echo successfully`,
      redirectUrl: `/admin/echo?view=${existEcho?.id}`,
      profile: existEcho?.user?.profile ? existEcho?.user?.profile : null,
      seen: false,
      userId: existEcho?.user?.id,
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

// connect stripe account
export async function connectStripeAccount(req: Request, res: Response) {
  const { id } = req.body;

  try {
    let accountId;
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existUser) {
      return res.json(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    if (existUser && !existUser.stripeAccountId) {
      const newAccount = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: existUser?.email,
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
      });
      await Prisma.user.update({
        where: { id: id },
        data: { stripeAccountId: newAccount?.id },
      });
      accountId = newAccount?.id;
    } else {
      accountId = existUser?.stripeAccountId;
    }
    const accountLink = await stripe.accountLinks.create({
      account: accountId ?? "",
      refresh_url: `${process.env.FRONTEND_CORS_URL}`,
      return_url: `${process.env.FRONTEND_CORS_URL}/stripe/connect/success`,
      type: "account_onboarding",
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: CONNECTION_REDIRECT_MESSAGE,
      url: accountLink.url,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Connect stripe account",
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

// check stripe connection
export async function checkStripeConnection(req: Request, res: Response) {
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
    if (!existUser.stripeAccountId) {
      return res.json({
        status: ERROR_STATUS,
        message: USER_STRIPE_CONNECTION_FAILED,
        connected: false,
        ready: false,
        stripeAccountId: null,
      });
    }
    const account = await stripe.accounts.retrieve(existUser.stripeAccountId);
    const connected = account.details_submitted;
    const ready = account.charges_enabled && account.payouts_enabled;

    res.json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      connected,
      ready,
      stripeAccountId: existUser.stripeAccountId,
      accountStatus: account.requirements,
    });
    await activityLog({
      userId: existUser?.id,
      action: "Check stripe connection",
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

// update status event
export async function toggleEcho(req: Request, res: Response) {
  const userId = req.params.id as string;
  const { status } = req.body;
  try {
    const existTemplete = await Prisma.userTemplete.findFirst({
      where: {
        userId: userId,
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
        enableEcho: status,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: userId,
      action: "Toggle echo status",
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

// update event status
export async function updateEchoStatus(req: Request, res: Response) {
  const id = req.params.id as string;
  const { status } = req.body;

  try {
    const existEcho = await Prisma.echo.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
      },
    });
    if (!existEcho) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }

    const updateEcho = await Prisma.echo.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
      include: {
        user: true,
      },
    });
    const { email, name } = existEcho || {};
    if (status === "CONFIRMED") {
      const io = getIo();
      io.emit("newEcho", updateEcho);
      await notificationEmail(
        name,
        email,
        "We are pleased to inform you that your request has been confirmed. Your request is now live on the feed. Thank you for your submission.",
        "Congratulations, Echo request Confirmed",
      );
    }
    if (status === "CANCELED") {
      const io = getIo();
      io.emit("CancelEcho", updateEcho);
      await notificationEmail(
        name,
        email,
        "We're sorry to inform you that your echo request is cancel at this time. Please feel free to try again or contact our support team for assistance.",
        "Sorry to say, your ECHO request was Canceled",
      );
    }

    if (status === "REJECTED") {
      const io = getIo();
      io.emit("rejectEcho", updateEcho);
      await notificationEmail(
        name,
        email,
        "We're sorry to inform you that your echo request is reject at this time. Please feel free to try again or contact our support team for assistance.",
        "Sorry to say, your ECHO request was rejected",
      );
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: existEcho?.userId,
      action: "Update echo status",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    await notificationCreator({
      title: `${existEcho?.user?.landerName} ${status} echo successfully`,
      redirectUrl: `/admin/echo?view=${existEcho?.id}`,
      profile: existEcho?.user?.profile ? existEcho?.user?.profile : null,
      seen: false,
      userId: existEcho?.user?.id,
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
