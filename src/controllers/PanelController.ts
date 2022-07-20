import { Response } from "express";
import * as util from "util";
import * as bcrypt from "bcryptjs";
import { pickBy, identity, isEmpty } from "lodash";
import { ICustomResponse, IRequestBody } from "models/Request";
import { ModelUserAuth, User } from "models/User";
import {
  RESPONSE_EMPTY_PASSWORD,
  RESPONSE_FAILED_TO_UPDATE_USER,
} from "utils/constants-request";

import sql from "models/db";
import { getRole } from "utils/function";
// node native promisify
const query = util.promisify(sql.query).bind(sql);

export class PanelController {
  public async getUsers(
    req: IRequestBody<ModelUserAuth>,
    res: ICustomResponse
  ) {
    try {
      const { id: userId, role } = req.body.user;
      let sqlExec = "";

      switch (role) {
        case "admin":
          sqlExec = "and id_role != 1 and id_role != 2";
          break;
        case "coach":
          sqlExec = "and id_coach = ? and id_role = 4";
          break;
        default:
          sqlExec = "";
      }

      const response = await query(
        `select id, id_country, id_role, id_coach, email, first_name, last_name, path_photo, weight, height, blocked, create_at, update_at from users where id != ? and deleted = 0 ${sqlExec}`,
        [userId, userId]
      );
      const user: User[] = response;
      res.success({ result: user });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }

  public async updateUser(
    req: IRequestBody<ModelUserAuth>,
    res: ICustomResponse
  ) {
    const {
      id: userId,
      first_name,
      last_name,
      weight,
      height,
      email,
      id_role,
      id_coach,
      deleted,
      blocked,
    } = req.body;

    const cleanedObject = pickBy(
      {
        first_name,
        last_name,
        weight,
        height,
        email,
        id_role,
        deleted,
        id_coach,
      },
      identity
    );
    const idCoach = id_role === 4 ? id_coach : null;
    const data = [{ ...cleanedObject, id_coach: idCoach, blocked }, userId];

    try {
      const response = await query("UPDATE users SET ? WHERE id = ?", data);

      const user = response[0];

      res.success({ result: user });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }

  public async getCoaches(
    req: IRequestBody<ModelUserAuth>,
    res: ICustomResponse
  ) {
    try {
      const { id: userId } = req.body.user;

      const response = await query(
        `select id, id_country, id_role, id_coach, email, first_name, last_name, path_photo, weight, height, blocked, create_at, update_at from users where id != ? and id_role = 3 and deleted = 0`,
        [userId]
      );
      const user: User[] = response;
      res.success({ result: user });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }
}
