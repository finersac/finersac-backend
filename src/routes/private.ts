import { Router } from "express";
import { userController } from "./user";
import { authController } from "./auth";
import { panelController } from "./panel";
import { exercisesController } from "./exercise";
import { ensureToken } from "../utils/function";

const router = Router();
router.use(ensureToken);

/**
 * GET USER
 */
router.get("/user", userController.getUser);
router.post("/update-user", userController.updateUser);
router.post("/reset-password", userController.resetPassword);

/**
 * PANEL ADMIN
 */
router.get("/panel/users", panelController.getUsers);
router.get("/panel/coaches", panelController.getCoaches);
router.post("/panel/create-user", authController.createUser);
router.post("/panel/update-user", panelController.updateUser);

//PANEL ADMIN EXERCISES
router.get("/panel/exercises", exercisesController.getExercises);
router.post("/panel/create-exercise", exercisesController.createExercise);
router.post("/panel/update-exercise", exercisesController.updateExercises);

export default router;
