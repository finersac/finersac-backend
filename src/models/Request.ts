import { Response } from "express";

export interface IRequestBody<T> extends Express.Request {
  body: T;
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
