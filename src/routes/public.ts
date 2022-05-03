import { Router } from "express";
import { authController } from "./auth";

const router = Router();
/**
 * AUTH
 */
router.post("/sign-in", authController.signIn);
router.post("/sign-up", authController.createUser);

export default router;
