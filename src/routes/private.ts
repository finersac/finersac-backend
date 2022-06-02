import { Router } from "express";
import { userController } from "./user";
import { ensureToken } from "../utils/function";

const router = Router();
router.use(ensureToken);

/**
 * GET USER
 */
router.get("/user", userController.getUser);
router.post("/update-user", userController.updateUser);
router.post("/change-password", userController.changePassword);

export default router;
