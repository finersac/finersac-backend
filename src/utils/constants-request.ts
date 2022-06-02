import { IResponse } from "models/Request";
import {
  AUTH_ERROR,
  BODY_EMPTY,
  EMAIL_REQUIRED,
  PASSWORD_REQUIRED,
  STATUS_400,
  STATUS_403,
  TOKEN_EMPTY,
  TOKEN_EXPIRED,
} from "./constants";

// FAILED RESPONSE
export const RESPONSE_TOKEN_EMPTY: IResponse = {
  codeError: TOKEN_EMPTY,
  code: STATUS_403,
  message: "Token Empty",
};
export const RESPONSE_TOKEN_EXPIRED: IResponse = {
  codeError: TOKEN_EXPIRED,
  code: STATUS_403,
  message: "Token Expired",
};

//COMMON RESPONSE
export const RESPONSE_EMPTY_BODY: IResponse = {
  codeError: BODY_EMPTY,
  code: STATUS_400,
  message: "All fields are required",
};

//AUTH RESPONSE
export const RESPONSE_EMPTY_EMAIL: IResponse = {
  codeError: EMAIL_REQUIRED,
  code: STATUS_400,
  message: "Email is required",
};
export const RESPONSE_EMPTY_PASSWORD: IResponse = {
  codeError: PASSWORD_REQUIRED,
  code: STATUS_400,
  message: "Password is required",
};
export const RESPONSE_AUTH_ERROR: IResponse = {
  codeError: AUTH_ERROR,
  code: STATUS_403,
  message: "Wrong email or password",
};
