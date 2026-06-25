import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import { google } from "googleapis";
import parseTimeString from "../lib/parse.timestring.js";
import notificationEmail from "../lib/notification.email.js";
import addAmPm from "../lib/add.amPm.js";
import activityLog from "../middelware/activity.log.js";
import notificationCreator from "../middelware/notification.createor.js";
const { SUCCESS_STATUS, ERROR_STATUS, LOG_SUCCESS, LOG_FAILED } = status;
const {
  DATA_NOT_FOUND_MESSAGE,
  QUERY_SUCCESSFUL_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  BOOKING_SUBMIT_SUCCESSFUL,
  GOOGLE_CALENDAR_NOT_CONNECTED,
  FORM_SUBMITION_SUCCESSFUL_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  ONBOARD_DOES_NOT_EXIST,
} = response;
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

// get all event
export async function getAllEvent(req: Request, res: Response) {
  const { searchBy = "", statusBy = "", userId } = req.query;
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
    const event = await Prisma.event.findMany({
      skip: skip,
      take: limit,
      where: filter,
      include: {
        user: true,
      },
    });
    const totalEvent = await Prisma.event.count({ where: filter });
    const totalPage = Math.ceil(totalEvent / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        event,
        totalPage,
        totalEvent,
        currentPage: page,
      },
    });
    await activityLog({
      userId: "",
      action: "Get all brandbook",
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

// get all slot
export async function getAllSlot(req: Request, res: Response) {
  const { userId } = req.query;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const skip = (page - 1) * page;
  let filter: any = {};
  if (userId) {
    filter.userId = userId;
  }
  try {
    const slot = await Prisma.slot.findMany({
      skip: skip,
      take: limit,
      where: filter,
      include: {
        user: true,
      },
    });
    const totalSlot = await Prisma.slot.count({ where: filter });
    const totalPage = Math.ceil(totalSlot / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        slot,
        totalPage,
        totalSlot,
        currentPage: page,
      },
    });
    await activityLog({
      userId: "",
      action: "Get all brandbook stots",
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

// get all slot by ander
export async function getAllSlotByLander(req: Request, res: Response) {
  const userId = req.query.userId as string;
  try {
    const slot = await Prisma.slot.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
    });
    if (slot?.length === 0) {
      return res.status(200).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      slot: slot,
    });
    await activityLog({
      userId: userId,
      action: "Get all brandbook slot by lander",
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

// get one event
export async function getOneEvent(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existEvent = await Prisma.event.findUnique({
      where: {
        id: id,
      },
    });
    if (!existEvent) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      event: existEvent,
    });
    await activityLog({
      userId: existEvent?.userId,
      action: "Get one brandbook",
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

// create event
export async function createEvent(req: Request, res: Response) {
  const { name, email, date, time, userId, note } = req.body;
  try {
    const integration = await Prisma.user.findUnique({
      where: { id: userId },
      select: {
        calendarId: true,
        accessToken: true,
        refreshToken: true,
      },
    });
    if (!integration || !integration.accessToken || !integration.refreshToken) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: GOOGLE_CALENDAR_NOT_CONNECTED,
      });
    }
    const newBrandbook = await Prisma.event.create({
      data: {
        name,
        email,
        date,
        time,
        note,
        userId,
        status: "PENDING",
      },
    });
    oauth2Client.setCredentials({
      access_token: integration.accessToken,
      refresh_token: integration.refreshToken,
    });
    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });
    const startDateTime = new Date(date);
    const { hours, minutes } = parseTimeString(time);
    startDateTime.setHours(hours, minutes, 0);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    await calendar.events.insert({
      calendarId: integration.calendarId!,
      requestBody: {
        summary: name,
        description: note ?? `Booking from ${email}`,
        start: { dateTime: startDateTime.toISOString() },
        end: { dateTime: endDateTime.toISOString() },
        attendees: [{ email }],
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: BOOKING_SUBMIT_SUCCESSFUL,
    });
    await activityLog({
      userId: userId,
      action: "Create brandbook",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    await notificationCreator({
      title: `${name} create brandbook successfully`,
      redirectUrl: `/admin/brandbook?view=${newBrandbook?.id}`,
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

// create slot
export async function createSlot(req: Request, res: Response) {
  const { date, times, userId } = req.body;
  try {
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
    await Prisma.slot.create({
      data: {
        date: new Date(date),
        times: times,
        userId: userId,
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: FORM_SUBMITION_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: userId,
      action: "Create brandbook slot",
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

// google auth
export async function goolgeAuth(req: Request, res: Response) {
  const userId = req.query.userId as string;
  try {
    const scopes = [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes,
      state: JSON.stringify({ userId }),
    });
    res.redirect(url);
    await activityLog({
      userId: userId,
      action: "Request google authentication",
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

// google auth callback
export async function googleAuthCallback(req: Request, res: Response) {
  const code = req.query.code as string;
  const state = req.query.state as string;
  const { userId } = JSON.parse(state);

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const user = await Prisma.user.findUnique({ where: { id: userId } });
    const calendarSummary = `${user?.username || "Brand"} - MyBrandLife Calendar`;
    const calendarList = await calendar.calendarList.list();
    const existingCalendar = calendarList.data.items?.find(
      (cal): boolean => cal.summary?.includes("MyBrandLife") ?? false,
    );
    let calendarId;
    if (existingCalendar) {
      calendarId = existingCalendar.id;
    } else {
      const newCalendar = await calendar.calendars.insert({
        requestBody: { summary: calendarSummary },
      });
      calendarId = newCalendar.data.id;
    }
    await Prisma.user.update({
      where: { id: userId },
      data: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        calendarId,
      },
    });
    res.redirect(`${process.env.FRONTEND_CORS_URL}/google/connect/success`);
    await activityLog({
      userId: userId,
      action: "Callback google authentication",
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
export async function toggleEvent(req: Request, res: Response) {
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
        message: ONBOARD_DOES_NOT_EXIST,
      });
    }

    await Prisma.userTemplete.update({
      where: {
        id: existTemplete?.id,
      },
      data: {
        enableEvent: status,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: userId,
      action: "Toggle brandbook status",
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

// delete slot
export async function deleteSlot(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existSlot = await Prisma.slot.findUnique({
      where: {
        id: id,
      },
    });
    if (!existSlot) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.slot.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
    });
    await activityLog({
      userId: existSlot?.userId,
      action: "Create brandbook slot",
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
export async function updateEventStatus(req: Request, res: Response) {
  const id = req.params.id as string;
  const { status } = req.body;

  try {
    const existEvent = await Prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
      },
    });
    if (!existEvent) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }

    await Prisma.event.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
    const { email, name } = existEvent || {};
    if (status === "CONFIRMED") {
      await notificationEmail(
        name,
        email,
        "We're pleased to inform you that your booking has been confirmed. You'll receive further updates shortly.",
        "Booking Confirmed",
      );
    }

    if (status === "REJECTED") {
      await notificationEmail(
        name,
        email,
        "We're sorry to inform you that your booking could not be confirmed at this time. Please feel free to try again or contact our support team for assistance.",
        "Booking Not Confirmed",
      );
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await notificationCreator({
      title: `${existEvent?.user?.landerName} ${status} brandbook status successfully`,
      redirectUrl: `/admin/brandbook?view=${existEvent?.id}`,
      profile: existEvent?.user?.profile ? existEvent?.user?.profile : null,
      seen: false,
      userId: existEvent?.user?.id,
    });
    await activityLog({
      userId: existEvent?.userId,
      action: "Update brandbook status",
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

// update event
export async function updateEvent(req: Request, res: Response) {
  const { name, email, date, time, note, status } = req.body;
  const id = req.params.id as string;
  try {
    const existEvent = await Prisma.event.findUnique({
      where: {
        id: id,
      },
    });
    if (!existEvent) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.event.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        date: new Date(date),
        time: addAmPm(time),
        note,
        status,
      },
    });

    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: existEvent?.userId,
      action: "Update brandbook",
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

// delete event
export async function deleteEvent(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existEvent = await Prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
      },
    });
    if (!existEvent) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.event.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
    });
    await activityLog({
      userId: existEvent?.userId,
      action: "Delete brandbook",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    await notificationCreator({
      title: `${existEvent?.user?.landerName} delete brandbook successfully`,
      redirectUrl: `/admin/brandbook?view=${existEvent?.id}`,
      profile: existEvent?.user?.profile ? existEvent?.user?.profile : null,
      seen: false,
      userId: existEvent?.user?.id,
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
