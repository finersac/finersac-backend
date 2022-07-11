import { Request, Response } from "express";
import env from "config/env";
import sql from "../models/db";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as util from "util";
import sgMail from "config/sendgrid";
import _ from "lodash";

import {
  RESPONSE_AUTH_ERROR,
  RESPONSE_EMAIL_SEND,
  RESPONSE_EMPTY_BODY,
  RESPONSE_EMPTY_EMAIL,
  RESPONSE_EMPTY_FIRST_NAME,
  RESPONSE_EMPTY_HEIGHT,
  RESPONSE_EMPTY_LAST_NAME,
  RESPONSE_EMPTY_PASSWORD,
  RESPONSE_EMPTY_ROLE,
  RESPONSE_EMPTY_WEIGHT,
  RESPONSE_USER_ALREADY_EXISTS,
  RESPONSE_USER_CREATED,
  RESPONSE_USER_NOT_EXIST,
} from "utils/constants-request";
import { ICustomResponse, IRequestBody } from "models/Request";
import { User } from "models/User";
import { MailDataRequired } from "@sendgrid/mail";
import { getRole } from "utils/function";

// node native promisify
const query = util.promisify(sql.query).bind(sql);

export class AuthController {
  public async signIn(req: IRequestBody<User>, res: ICustomResponse) {
    try {
      const body = req.body;
      if (!body) {
        return res.badReq(RESPONSE_EMPTY_BODY);
      }

      const { email, password } = req.body;
      if (!email) {
        return res.badReq(RESPONSE_EMPTY_EMAIL);
      }
      if (!password) {
        return res.badReq(RESPONSE_EMPTY_PASSWORD);
      }

      const response = await query("select * from users where email = ?", [
        email,
      ]);

      if (response.length === 0) {
        return res.forbidden(RESPONSE_AUTH_ERROR);
      }

      const user: User = response[0];
      var passwordIsValid = bcrypt.compareSync(password, user?.password);
      if (!passwordIsValid) return res.forbidden(RESPONSE_AUTH_ERROR);

      const token = jwt.sign(
        { id: user?.id, role: getRole(user?.id_role) },
        env.SECRET,
        {
          expiresIn: Number(env.TOKEN_LIFE),
        }
      );
      res.success({
        token,
        result: {
          user: _.omit(user, ["password"]),
        },
      });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }

  public async createUser(
    req: IRequestBody<User>,
    res: ICustomResponse
  ): Promise<Response> {
    try {
      const {
        first_name,
        last_name,
        weight,
        height,
        email,
        password,
        id_role,
        id_coach,
      } = req.body;

      if (!email) {
        return res.badReq(RESPONSE_EMPTY_EMAIL);
      }
      if (!password) {
        return res.badReq(RESPONSE_EMPTY_PASSWORD);
      }
      if (!first_name) {
        return res.badReq(RESPONSE_EMPTY_FIRST_NAME);
      }
      if (!last_name) {
        return res.badReq(RESPONSE_EMPTY_LAST_NAME);
      }
      if (!weight) {
        return res.badReq(RESPONSE_EMPTY_WEIGHT);
      }
      if (!height) {
        return res.badReq(RESPONSE_EMPTY_HEIGHT);
      }
      if (!id_role) {
        return res.badReq(RESPONSE_EMPTY_ROLE);
      }

      const responseEmail = await query("SELECT * from users where email = ?", [
        email,
      ]);

      if (responseEmail.length > 0) {
        return res.forbidden(RESPONSE_USER_ALREADY_EXISTS);
      }

      const hashedPassword = bcrypt.hashSync(password, 8);

      const result = await query(
        "insert into users (email, password, first_name, last_name, weight, height, id_role, id_coach) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          email,
          hashedPassword,
          first_name,
          last_name,
          weight,
          height,
          id_role,
          id_coach,
        ]
      );
      const response = await query(
        "select id, id_country, id_role, id_coach, email, first_name, last_name, path_photo, weight, height, blocked, create_at, update_at from users where id = ?",
        [result.insertId]
      );
      return res.success({ result: response[0] });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }

  public async forgotPassword(
    req: IRequestBody<User>,
    res: ICustomResponse
  ): Promise<Response> {
    const { email } = req.body;

    try {
      //check if user exists
      if (!email) {
        return res.badReq(RESPONSE_EMPTY_EMAIL);
      }
      const response: User[] = await query(
        "SELECT id from users where email = ?",
        [email]
      );

      if (!response.length) {
        return res.forbidden(RESPONSE_USER_NOT_EXIST);
      }

      const user: User = response[0];

      const token = jwt.sign({ id: user.id }, env.SECRET, {
        expiresIn: Number(env.TOKEN_LIFE),
      });

      const content: MailDataRequired = {
        to: email,
        from: "info@finersac.com",
        subject: "Reset Password",
        templateId: "d-cb6c1eda07834a4f88c878ee987c263e",
        dynamicTemplateData: {
          url: `${env.WEB_URL}/auth/reset-password?token=${token}`,
          subject: "Reset Password",
        },
      };
      await sgMail.send(content);
      return res.success(RESPONSE_EMAIL_SEND);
    } catch (error) {
      res.internal({ message: error.message });
    }
  }
}
