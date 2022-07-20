import env from "config/env";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { ICustomResponse, IResponse } from "models/Request";
import { User, UserRole } from "models/User";
import {
  STATUS_200,
  STATUS_400,
  STATUS_401,
  STATUS_403,
  STATUS_500,
} from "./constants";
import {
  RESPONSE_TOKEN_EMPTY,
  RESPONSE_TOKEN_EXPIRED,
} from "./constants-request";

const ensureToken = (
  req: Request<{ token: string; user: User }>,
  res: ICustomResponse,
  next: Function
) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader === "undefined") {
    return res.status(403).json(RESPONSE_TOKEN_EMPTY);
  }

  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];
  jwt.verify(bearerToken, env.SECRET || "", (err: any, data: any) => {
    if (err) {
      return res.unAuth(RESPONSE_TOKEN_EXPIRED);
    }
    req.body.token = bearerToken;
    req.body.user = data;
    next();
  });
};

const customResponse = (
  req: Request,
  res: ICustomResponse,
  next: Function
): void => {
  /**
   * (default status 200)
   * Success response
   */
  res.success = (iResponse: IResponse) => {
    iResponse.code = STATUS_200;
    return res.status(iResponse.code).json(iResponse);
  };

  /**
   * Custom error response
   */
  res.error = (iResponse: IResponse) => {
    iResponse.code = STATUS_400;
    return res.status(iResponse.code).json(iResponse);
  };

  /**
   * (status 400)
   * Bad request response
   */
  res.badReq = (iResponse: IResponse) => {
    iResponse.code = STATUS_400;
    return res.status(iResponse.code).json(iResponse);
  };

  /**
   * (status 403)
   * Forbidden request response
   */
  res.forbidden = (iResponse: IResponse) => {
    iResponse.code = STATUS_403;
    return res.status(iResponse.code).json(iResponse);
  };

  /**
   * (status 401)
   * Unauthorize request response
   */
  res.unAuth = (iResponse: IResponse) => {
    iResponse.code = STATUS_401;
    return res.status(iResponse.code).json(iResponse);
  };

  /**
   * (status 500)
   * Internal request response
   */
  res.internal = (iResponse: IResponse) => {
    iResponse.code = STATUS_500;
    return res.status(iResponse.code).json(iResponse);
  };

  next();
};

const getRole = (idRole: number): UserRole => {
  switch (idRole) {
    case 1:
      return "superadmin";
    case 2:
      return "admin";
    case 3:
      return "coach";
    default:
      return "athlete";
  }
};

export { ensureToken, customResponse, getRole };
