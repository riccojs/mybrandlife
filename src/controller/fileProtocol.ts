import { Request } from "express";

function fileProtocol(req: Request) {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const basePath = `${protocol}://${req.get("host")}/public/`;
  return basePath;
}

export default fileProtocol;
