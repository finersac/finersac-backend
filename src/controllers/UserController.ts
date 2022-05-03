import sql from "../models/db";
import util from "util";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
// node native promisify
const query = util.promisify(sql.query).bind(sql);

export class UserController {
  public async getUser(req: any, res: Response<any, Record<string, any>>) {
    try {
      const idUser = req?.user?.id;
      const response = await query(
        "select id, email, first_name, last_name, country, path_photo, weigth, height, blocked, create_at, update_at from users where id = ?",
        [idUser]
      );
      res.status(200).json(response[0]);
    } catch (error) {
      throw res.status(500).json({ error });
    }
  }
}
