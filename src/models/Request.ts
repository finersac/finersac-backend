import { Response, Request } from "express";
import { User } from "./User";

export interface IRequestBody<T> extends Request {
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

export interface ICustomResponse extends Response {
  success: (data: IResponse) => Response;
  error: (data: IResponse) => Response;
  badReq: (data: IResponse) => Response;
  forbidden: (data: IResponse) => Response;
  unAuth: (data: IResponse) => Response;
  internal: (data: IResponse) => Response;
}
