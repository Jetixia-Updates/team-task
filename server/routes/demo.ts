import { RequestHandler } from "express";
import { DemoResponse } from "@shared/api";
import { getLocaleFromHeader, t } from "../lib/locale";

export const handleDemo: RequestHandler = (req, res) => {
  const locale = getLocaleFromHeader(req.headers["accept-language"]);
  const response: DemoResponse = {
    message: t(locale, "demo.message"),
  };
  res.status(200).json(response);
};
