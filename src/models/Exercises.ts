import { User } from "./User";

export interface Exercise {
  id: string;
  user_id: User["id"];
  exercise_name: string;
  video_url: string;
  preview_base64: string;
  is_verified: boolean;
  deleted: number;
  create_at: Date;
  update_at: Date;
}

export interface ModelUserWithExercise extends Exercise {
  user: User;
}

export interface ModelUserWithExercises {
  user: User;
  exercises: Exercise[];
}
