import { Response, Request } from "express";
import * as util from "util";

import { pickBy, identity, capitalize } from "lodash";

import {
  RESPONSE_EMPTY_EXERCISE_NAME,
  RESPONSE_EXERCISE_ALREADY_EXISTS,
} from "utils/constants-request";

import sql from "models/db";
import {
  Exercise,
  ModelUserWithExercise,
  ModelUserWithExercises,
} from "models/Exercises";
// node native promisify
const query = util.promisify(sql.query).bind(sql);

export class ExercisesController {
  public async getVerifiedExercises(
    req: Request<ModelUserWithExercise>,
    res: Response
  ) {
    try {
      const resultVerify = await query(
        `select id, exercise_name, video_url, preview_base64, is_verified, create_at, update_at from exercises where is_verified = 1 and deleted = 0`,
        []
      );
      const exercisesVerify: Exercise[] = resultVerify;
      res.success({
        result: exercisesVerify,
      });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }

  public async getUnverifiedExercises(
    req: Request<ModelUserWithExercise>,
    res: Response
  ) {
    try {
      const resultUnVerify = await query(
        `select id, exercise_name, video_url, preview_base64, is_verified, create_at, update_at from exercises where is_verified = 0 and deleted = 0`,
        []
      );
      const exercisesUnVerify: Exercise[] = resultUnVerify;
      res.success({
        result: exercisesUnVerify,
      });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }

  public async createExercise(
    req: Request<Exercise>,
    res: Response
  ): Promise<Response> {
    try {
      const { exercise_name, video_url, preview_base64 } = req.body;

      if (!exercise_name) {
        res.badReq(RESPONSE_EMPTY_EXERCISE_NAME);
        return;
      }

      const exerciseName = capitalize(String(exercise_name).trim());

      const responseExercise = await query(
        "SELECT * from exercises where exercise_name = ?",
        [exerciseName]
      );

      if (responseExercise.length > 0) {
        res.forbidden(RESPONSE_EXERCISE_ALREADY_EXISTS);
        return;
      }

      const result = await query(
        "insert into exercises (exercise_name, video_url, preview_base64) VALUES (?, ?, ?)",
        [exerciseName, video_url, preview_base64]
      );

      const response = await query(
        "select id, exercise_name, video_url, preview_base64, is_verified, create_at, update_at from exercises where id = ?",
        [result.insertId]
      );

      res.success({ result: response[0] });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }

  public async updateExercises(req: Request<Exercise>, res: Response) {
    const {
      id,
      exercise_name,
      video_url,
      preview_base64,
      is_verified,
      deleted,
    } = req.body;

    const cleanedObject = pickBy(
      {
        exercise_name,
        video_url,
        preview_base64,
        deleted,
        is_verified,
      },
      identity
    );
    const data = [cleanedObject, id];

    try {
      await query("UPDATE exercises SET ? WHERE id = ?", data);
      const result = await query(
        "select id, exercise_name, video_url, preview_base64, is_verified, create_at, update_at from exercises where id = ?",
        [id]
      );

      const exercise = result[0];

      res.success({ result: exercise });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }

  public async uploadExercise(
    req: Request<ModelUserWithExercises>,
    res: Response
  ) {
    const { exercises } = req.body;

    const data = [
      exercises.map((exercise) => [exercise.exercise_name, exercise.video_url]),
    ];

    await query(
      `INSERT INTO exercises (exercise_name, video_url) VALUES ? ON DUPLICATE KEY UPDATE exercise_name = VALUES(exercise_name),
      video_url = VALUES(video_url);`,
      data
    );

    try {
      res.success({ result: [] });
    } catch (error) {
      throw res.internal({ message: error });
    }
  }
}
