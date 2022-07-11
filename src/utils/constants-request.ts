import { IResponse } from "models/Request";
import {
  AUTH_ERROR,
  BODY_EMPTY,
  EMAIL_REQUIRED,
  EXERCISE_ALREADY_EXISTS,
  EXERCISE_NAME_REQUIRED,
  FAILED_TO_UPDATE_USER,
  FIRST_NAME_REQUIRED,
  HEIGHT_REQUIRED,
  LAST_NAME_REQUIRED,
  PASSWORD_REQUIRED,
  ROLE_REQUIRED,
  STATUS_200,
  STATUS_201,
  STATUS_202,
  STATUS_400,
  STATUS_403,
  TOKEN_EMPTY,
  TOKEN_EXPIRED,
  USER_ALREADY_EXISTS,
  USER_ALREADY_NOT_EXIST,
  WEIGHT_REQUIRED,
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

export const RESPONSE_EMAIL_SEND: IResponse = {
  code: STATUS_200,
  message: "Email Send",
};

//EXERCISE RESPONSE SUCCESS

export const RESPONSE_EXERCISE_CREATED: IResponse = {
  code: STATUS_200,
  message: "Exercise created!",
};

//AUTH RESPONSE SUCCESS

export const RESPONSE_USER_CREATED: IResponse = {
  code: STATUS_201,
  message: "User created",
};

export const RESPONSE_USER_UPDATED: IResponse = {
  code: STATUS_202,
  message: "User updated",
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
export const RESPONSE_EMPTY_FIRST_NAME: IResponse = {
  codeError: FIRST_NAME_REQUIRED,
  code: STATUS_400,
  message: "First name is required",
};
export const RESPONSE_EMPTY_LAST_NAME: IResponse = {
  codeError: LAST_NAME_REQUIRED,
  code: STATUS_400,
  message: "Last name is required",
};
export const RESPONSE_EMPTY_WEIGHT: IResponse = {
  codeError: WEIGHT_REQUIRED,
  code: STATUS_400,
  message: "Weight is required",
};
export const RESPONSE_EMPTY_HEIGHT: IResponse = {
  codeError: HEIGHT_REQUIRED,
  code: STATUS_400,
  message: "Height is required",
};
export const RESPONSE_EMPTY_ROLE: IResponse = {
  codeError: ROLE_REQUIRED,
  code: STATUS_400,
  message: "Role is required",
};
export const RESPONSE_USER_ALREADY_EXISTS: IResponse = {
  codeError: USER_ALREADY_EXISTS,
  code: STATUS_403,
  message: "User already exists",
};
export const RESPONSE_USER_NOT_EXIST: IResponse = {
  codeError: USER_ALREADY_NOT_EXIST,
  code: STATUS_403,
  message: "User not exists",
};
export const RESPONSE_AUTH_ERROR: IResponse = {
  codeError: AUTH_ERROR,
  code: STATUS_403,
  message: "Wrong email or password",
};
export const RESPONSE_FAILED_TO_UPDATE_USER: IResponse = {
  codeError: FAILED_TO_UPDATE_USER,
  code: STATUS_400,
  message: "Failed to update user",
};

//EXERCISE RESPONSE
export const RESPONSE_EMPTY_EXERCISE_NAME: IResponse = {
  codeError: EXERCISE_NAME_REQUIRED,
  code: STATUS_400,
  message: "Exercise name is required",
};
export const RESPONSE_EXERCISE_ALREADY_EXISTS: IResponse = {
  codeError: EXERCISE_ALREADY_EXISTS,
  code: STATUS_403,
  message: "Exercise already exists",
};
