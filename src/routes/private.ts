import { Router } from "express";
import { userController } from "./user";
import { ensureToken } from "../utils/function";

const router = Router();
router.use(ensureToken);

/**
 * GET USER
 */
router.get("/user", userController.getUser);
export default router;
