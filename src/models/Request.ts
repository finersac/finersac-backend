import * as express from "express";
import { User } from "./User";

export interface IRequestBody<T> extends express.Request {
  body: T;
  user?: User;
}

export interface IResponse {
  result?: any;
  code?: number;
  message?: string;
  codeError?: any;
  token?: string;
}

export interface ICustomResponse extends express.Response {
  success: (data: IResponse) => express.Response;
  error: (data: IResponse) => express.Response;
  badReq: (data: IResponse) => express.Response;
  forbidden: (data: IResponse) => express.Response;
  unAuth: (data: IResponse) => express.Response;
  internal: (data: IResponse) => express.Response;
}
