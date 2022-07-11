export type UserRole = "superadmin" | "admin" | "coach" | "athlete";

export interface User {
  id: string;
  id_country: string;
  id_role: number;
  id_coach: number;
  role: UserRole;
  first_name: string;
  password: string;
  last_name: string;
  path_photo: string;
  weight: string;
  height: string;
  blocked: boolean;
  email: string;
  deleted: string;
  create_at: Date;
  update_at: Date;
}

export interface ModelUserAuth extends User {
  user: User;
}
