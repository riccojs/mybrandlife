import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
const { SUCCESS_STATUS, ERROR_STATUS } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  REPORT_SUBMIT_SUCCESSFUL_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
} = response;

// get all report
export async function getAllReport(req: Request, res: Response) {
  const pageNumber = req.query.page
    ? parseInt(req.query.page as string, 10)
    : 1;
  const limitNumber = req.query.limit
    ? parseInt(req.query.limit as string, 10)
    : 10;
  const skip = (pageNumber - 1) * limitNumber;
  try {
    const report = await Prisma.reports.findMany({
      skip: skip,
      take: limitNumber,
    });
    const totalReport = await Prisma.reports.count();
    const totalPage = Math.ceil(totalReport / limitNumber);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        report,
        totalPage,
        totalReport,
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

// get one report
export async function getOneReport(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existReport = await Prisma.reports.findUnique({
      where: {
        id: id,
      },
    });
    if (!existReport) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      report: existReport,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// create report
export async function createReport(req: Request, res: Response) {
  const { comment, reason } = req.body;
  try {
    const newReport = await Prisma.reports.create({
      data: {
        comment: comment,
        reason: reason,
      },
    });
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: REPORT_SUBMIT_SUCCESSFUL_MESSAGE,
      referral: newReport,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update report
export async function updateReport(req: Request, res: Response) {
  const id = req.params.id as string;
  const { comment, reason } = req.body;
  try {
    const existReport = await Prisma.reports.findUnique({
      where: {
        id: id,
      },
    });
    if (!existReport) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const updateReport = await Prisma.reports.update({
      where: {
        id: id,
      },
      data: {
        comment: comment,
        reason: reason,
      },
    });
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      report: updateReport,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// delete report
export async function deleteReport(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existReport = await Prisma.reports.findUnique({
      where: {
        id: id,
      },
    });
    if (!existReport) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const deleteReport = await Prisma.reports.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
      report: deleteReport,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}
