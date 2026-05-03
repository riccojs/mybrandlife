import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import axios from "axios";
import fileProtocol from "./fileProtocol.js";
const { SUCCESS_STATUS, ERROR_STATUS } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  PARTNER_CREATE_SUCCESSFUL_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
} = response;
const plausibleApiKey = process.env.PLUSIBLE_API_KEY ?? "";
const plausibleSiteId = process.env.PLUSIBLE_SITE_ID ?? "";

// get all partner
export async function getAllPartner(req: Request, res: Response) {
  const { searchBy = "" } = req.query;

  const pageNumber = req.query.page
    ? parseInt(req.query.page as string, 10)
    : 1;

  const limitNumber = req.query.limit
    ? parseInt(req.query.limit as string, 10)
    : 10;

  const skip = (pageNumber - 1) * limitNumber;

  let filter: any = {};

  if (searchBy) {
    filter = {
      OR: [
        {
          title: {
            contains: searchBy,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchBy,
            mode: "insensitive",
          },
        },
      ],
    };
  }

  try {
    const partner = await Prisma.partners.findMany({
      skip,
      take: limitNumber,
      where: filter,
    });

    const totalPartner = await Prisma.partners.count({
      where: filter,
    });

    const totalPage = Math.ceil(totalPartner / limitNumber);

    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        partner,
        totalPage,
        totalPartner,
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

// get posthog data
export async function getPlausibleData(req: Request, res: Response) {
  try {
    const landername = req.params.landername as string;
    const { period = "7d" } = req.query;
    const existLander = await Prisma.user.findUnique({
      where: { landerName: landername },
    });
    if (!existLander) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const headers = { Authorization: `Bearer ${plausibleApiKey}` };
    const baseParams = { site_id: plausibleSiteId, period };
    const filterByLander = `event:page==/${landername}`;
    const [
      aggregate,
      events,
      devices,
      countries,
      buttonClicksByName,
      timeseries,
    ] = await Promise.all([
      axios.get("https://plausible.io/api/v1/stats/aggregate", {
        headers,
        params: {
          ...baseParams,
          metrics: "visitors,pageviews",
          filters: filterByLander,
        },
      }),
      axios.get("https://plausible.io/api/v1/stats/breakdown", {
        headers,
        params: {
          ...baseParams,
          property: "event:name",
          metrics: "events",
          filters: filterByLander,
        },
      }),
      axios.get("https://plausible.io/api/v1/stats/breakdown", {
        headers,
        params: {
          ...baseParams,
          property: "visit:device",
          metrics: "visitors,pageviews",
          filters: filterByLander,
        },
      }),
      axios.get("https://plausible.io/api/v1/stats/breakdown", {
        headers,
        params: {
          ...baseParams,
          property: "visit:country",
          metrics: "visitors,pageviews",
          filters: filterByLander,
        },
      }),
      axios.get("https://plausible.io/api/v1/stats/breakdown", {
        headers,
        params: {
          ...baseParams,
          property: "event:props:buttonName",
          metrics: "events",
          filters: `event:name==ButtonClick;${filterByLander}`,
        },
      }),
      axios.get("https://plausible.io/api/v1/stats/timeseries", {
        headers,
        params: {
          site_id: plausibleSiteId,
          period,
          interval: "day",
          metrics: "visitors,pageviews,events",
          filters: `event:page==/${landername}`,
        },
      }),
    ]);
    const formSubmits = events.data.results.filter((e: { name: string }) =>
      e.name?.toLowerCase().includes("formsubmit"),
    );
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      lander: landername,
      period,
      overview: aggregate.data.results,
      timeseries: timeseries.data.results,
      events: {
        all: events.data.results,
        buttonClicks: buttonClicksByName.data.results,
        formSubmits,
      },
      devices: devices.data.results,
      countries: countries.data.results,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get one partner
export async function getOnePartner(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existPartner = await Prisma.partners.findUnique({
      where: {
        id: id,
      },
    });
    if (!existPartner) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      partner: existPartner,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// create partner
export async function createPartner(req: Request, res: Response) {
  const { title, description, linkText, link, type, recipent, recipentLabel } =
    req.body;
  try {
    const basePath = fileProtocol(req);
    const profileFile = req.file?.filename.split(" ").join("-");
    let parsedRecipent: string[] = [];
    if (recipent) {
      try {
        parsedRecipent = Array.isArray(recipent)
          ? recipent
          : JSON.parse(recipent);
      } catch {
        parsedRecipent = [];
      }
    }
    const newPartner = await Prisma.partners.create({
      data: {
        title: title,
        description: description,
        link: link || null,
        linkText: linkText || null,
        type: type,
        recipent: parsedRecipent,
        logo: profileFile ? `${basePath}${profileFile}` : "",
        recipentLabel: recipentLabel ? recipentLabel : "",
      },
    });
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: PARTNER_CREATE_SUCCESSFUL_MESSAGE,
      partner: newPartner,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update partner
export async function updatePartner(req: Request, res: Response) {
  const id = req.params.id as string;
  const { title, description, linkText, link, type, recipent, recipentLabel } =
    req.body;
  try {
    const existPartner = await Prisma.partners.findUnique({
      where: {
        id: id,
      },
    });
    const basePath = fileProtocol(req);
    const profileFile = req.file?.filename.split(" ").join("-");
    let parsedRecipent: string[] = [];
    if (recipent) {
      try {
        parsedRecipent = Array.isArray(recipent)
          ? recipent
          : JSON.parse(recipent);
      } catch {
        parsedRecipent = [];
      }
    }
    const updatePartner = await Prisma.partners.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        description: description,
        link: type === "LINKTYPE" ? link : null,
        linkText: type === "LINKTYPE" ? linkText : null,
        type: type,
        logo: profileFile ? `${basePath}${profileFile}` : existPartner?.logo,
        recipent: parsedRecipent,
        recipentLabel: recipentLabel
          ? recipentLabel
          : existPartner?.recipentLabel,
      },
    });
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      partner: updatePartner,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// delete partner
export async function deletePartner(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existPartner = await Prisma.partners.findUnique({
      where: {
        id: id,
      },
    });
    if (!existPartner) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const deletePart = await Prisma.partners.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
      partner: deletePart,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}
