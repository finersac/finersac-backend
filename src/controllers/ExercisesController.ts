import { Response } from "express";
import * as util from "util";

import { pickBy, identity, camelCase, capitalize } from "lodash";
import { ICustomResponse, IRequestBody } from "models/Request";
import { ModelUserAuth } from "models/User";

import {
  RESPONSE_EMPTY_EXERCISE_NAME,
  RESPONSE_EXERCISE_ALREADY_EXISTS,
  RESPONSE_EXERCISE_CREATED,
  RESPONSE_USER_ALREADY_EXISTS,
} from "utils/constants-request";

import sql from "models/db";
import { Exercise } from "models/Exercises";
// node native promisify
const query = util.promisify(sql.query).bind(sql);

export class ExercisesController {
  public async getExercises(
    req: IRequestBody<ModelUserAuth>,
    res: ICustomResponse
  ) {
    try {
      const response = await query(
        `select id, exercise_name, video_url, preview_base64, create_at, update_at from exercises where deleted = 0`,
        []
      );
      const exercises: Exercise[] = response;
      res.success({ result: exercises });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }

  public async createExercise(
    req: IRequestBody<Exercise>,
    res: ICustomResponse
  ): Promise<Response> {
    try {
      const { exercise_name, video_url, preview_base64 } = req.body;

      if (!exercise_name) {
        return res.badReq(RESPONSE_EMPTY_EXERCISE_NAME);
      }

      const exerciseName = capitalize(String(exercise_name).trim());

      const responseExercise = await query(
        "SELECT * from exercises where exercise_name = ?",
        [exerciseName]
      );

      if (responseExercise.length > 0) {
        return res.forbidden(RESPONSE_EXERCISE_ALREADY_EXISTS);
      }

      await query(
        "insert into exercises (exercise_name, video_url, preview_base64) VALUES (?, ?, ?)",
        [exerciseName, video_url, preview_base64]
      );

      return res.success(RESPONSE_EXERCISE_CREATED);
    } catch (error) {
      throw res.internal({ message: error });
    }
  }

  public async updateExercises(
    req: IRequestBody<Exercise>,
    res: ICustomResponse
  ) {
    const { id, exercise_name, video_url, preview_base64, deleted } = req.body;

    const cleanedObject = pickBy(
      {
        exercise_name,
        video_url,
        preview_base64,
        deleted,
      },
      identity
    );
    const data = [{ ...cleanedObject }, id];

    try {
      const response = await query("UPDATE exercises SET ? WHERE id = ?", data);

      const exercise = response[0];

      res.success({ result: exercise });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }
}
