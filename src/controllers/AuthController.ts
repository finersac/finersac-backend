import { Request, Response } from "express";
import env from "config/env";
import sql from "../models/db";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as util from "util";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { STATUS_400 } from "utils/constants";
import {
  RESPONSE_AUTH_ERROR,
  RESPONSE_EMPTY_BODY,
  RESPONSE_EMPTY_EMAIL,
  RESPONSE_EMPTY_PASSWORD,
} from "utils/constants-request";
import { ICustomResponse, IRequestBody } from "models/Request";
import { User } from "models/User";

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

      const response = await query(
        "select id, email, password from users where email = ?",
        [email]
      );

      if (response.length === 0) {
        return res.forbidden(RESPONSE_AUTH_ERROR);
      }

      const user = response[0];
      var passwordIsValid = bcrypt.compareSync(password, user?.password);
      if (!passwordIsValid) return res.forbidden(RESPONSE_AUTH_ERROR);

      const token = jwt.sign({ id: user?.id }, env.SECRET, {
        expiresIn: env.TOKEN_LIFE,
      });
      res.success({ token });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }
  public async createUser(req: IRequestBody<User>, res: ICustomResponse) {
    try {
      const { first_name, last_name, weight, height, email, password } =
        req.body;

      if (!email) {
        return res.badReq(RESPONSE_EMPTY_EMAIL);
      }
      if (!password) {
        return res.badReq(RESPONSE_EMPTY_PASSWORD);
      }
      if (!last_name) {
        return res.status(STATUS_400).json({ body: "El nombre es requerido" });
      }
      if (!first_name) {
        return res
          .status(STATUS_400)
          .json({ body: "El apellido es requerido" });
      }
      if (!weight) {
        return res.status(STATUS_400).json({ body: "El peso es requerido" });
      }
      if (!height) {
        return res.status(STATUS_400).json({ body: "La altura requerida" });
      }

      const responseEmail = await query("SELECT * from users where email = ?", [
        email,
      ]);

      if (responseEmail.length > 0) {
        return res
          .status(400)
          .json({ body: "El correo electronico ya existente" });
      }

      var hashedPassword = bcrypt.hashSync(password, 8);

      await query(
        "insert into users (email, password, first_name, last_name, weight, height) VALUES (?, ?, ?, ?, ?, ?)",
        [email, hashedPassword, first_name, last_name, weight, height]
      );
      res.status(200).json({ body: "Usuario fue creado con exito" });
    } catch (error) {
      throw res.status(500).json({ error });
    }
  }

  public forgotPassword(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): void {
    throw new Error("Method not implemented.");
  }
}

/*8const signIn = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.sendStatus(403);
  }

  const { email, password } = req.body;
  if (!email) {
    return res.sendStatus(403);
  }
  if (!password) {
    return res.sendStatus(403);
  }

  const response = await query("SELECT * from users ur where ur.email = $1", [
    email,
  ]);

  if (response.values.length === 0) {
    return res.status(401).json({ body: "Correo o contraseña incorrectos" });
  }

  const user = response.values[0];
  var passwordIsValid = bcrypt.compareSync(password, user?.password);
  if (!passwordIsValid)
    return res.status(401).send({
      auth: false,
      body: "Correo o contraseña incorrectos",
      token: null,
    });

  const token = jwt.sign({ id: user?.id }, "my_secret_key", {
    expiresIn: 86400,
  });
  res.status(200).json({ auth: true, token: token });
};

const createUsers = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!email) {
    return res.status(400).json({ body: "El correo electronico es requerido" });
  }

  if (!password) {
    return res.status(400).json({ body: "La contraseña es requerida" });
  }

  if (!phone) {
    return res.status(400).json({ body: "El telefono es requerido" });
  }

  if (!name) {
    return res.status(400).json({ body: "El nombre es requerido" });
  }

  const responseEmail = await query(
    "SELECT * from users ur where ur.email = $1",
    [email]
  );
  const responsePhone = await query(
    "SELECT * from users ur where ur.phone = $1",
    [phone]
  );

  if (responseEmail.values.length > 0) {
    return res.status(400).json({ body: "El correo electronico ya existente" });
  }

  if (responsePhone.values.length > 0) {
    return res.status(400).json({ body: "El telefono ya existe" });
  }

  var hashedPassword = bcrypt.hashSync(password, 8);

  await query(
    "INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4)",
    [name, email, hashedPassword, phone]
  );
  res.status(200).json({ body: "Usuario fue creado con exito" });
};

// export { createUsers, signIn };*/
