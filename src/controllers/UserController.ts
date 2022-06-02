import sql from "../models/db";
import * as util from "util";
import { Response } from "express";
import { ICustomResponse, IRequestBody } from "models/Request";
import { ModelGetUser } from "models/User";
// node native promisify
const query = util.promisify(sql.query).bind(sql);

export class UserController {
  public async getUser(req: IRequestBody<ModelGetUser>, res: ICustomResponse) {
    try {
      const { id: userId } = req.body.user;
      const response = await query(
        "select id, email, first_name, last_name, path_photo, weight, height, blocked, create_at, update_at from users where id = ?",
        [userId]
      );
      res.success({ result: response[0] });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }

  public async updateUser(req: any, res: Response<any, Record<string, any>>) {
    try {
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

      const response = await query("select * from users where email = ?", [
        email,
      ]);

      if (response.length === 0) {
        return res
          .status(401)
          .json({ body: "Correo o contraseña incorrectos" });
      }

      const user = response[0];

      res.status(200).json({ auth: true });
    } catch (error) {
      throw res.status(500).json({ error });
    }
  }

  public async changePassword(
    req: any,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const body = req.body;
      if (!body) {
        return res.sendStatus(403);
      }

      const { email } = req.body;
      if (!email) {
        return res.sendStatus(403);
      }

      const response = await query("select * from users where email = ?", [
        email,
      ]);

      if (response.length === 0) {
        return res.status(401).json({
          message: `The email address ${email} is not associated with any account. Double-check your email address and try again.`,
        });
      }

      const user = response[0];

      res.status(200).json({ auth: true });
    } catch (error) {
      throw res.status(500).json({ error });
    }
  }
}
