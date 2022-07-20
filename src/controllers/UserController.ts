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
// node native promisify
const query = util.promisify(sql.query).bind(sql);

export class UserController {
  public async getUser(req: IRequestBody<ModelUserAuth>, res: ICustomResponse) {
    try {
      const { id: userId } = req.body.user;
      const response = await query(
        "select id, id_country, id_role, email, first_name, last_name, path_photo, weight, height, blocked, create_at, update_at from users where id = ?",
        [userId]
      );
      const user: User = response[0];
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
      first_name,
      last_name,
      weight,
      height,
      email,
      id_role,
      deleted,
      blocked,
    } = req.body;
    const { id: userId } = req.body.user;

    const cleanedObject = pickBy(
      {
        first_name,
        last_name,
        weight,
        height,
        email,
        id_role,
        deleted,
      },
      identity
    );
    const data = [{ ...cleanedObject, blocked }, userId];
    try {
      const response = await query("UPDATE users SET ? WHERE id = ?", data);

      const user = response[0];

      res.success({ result: user });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }

  public async resetPassword(
    req: IRequestBody<ModelUserAuth>,
    res: ICustomResponse
  ) {
    try {
      const { password } = req.body;
      const { id: userId } = req.body.user;

      if (isEmpty(password)) {
        return res.badReq(RESPONSE_EMPTY_PASSWORD);
      }

      const hashedPassword = bcrypt.hashSync(password, 8);

      const response = await query(
        "UPDATE users SET password = ? where id = ?",
        [hashedPassword, userId]
      );

      if (!response.changedRows) {
        return res.forbidden(RESPONSE_FAILED_TO_UPDATE_USER);
      }

      res.success({ message: "Password Updated" });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }
}
