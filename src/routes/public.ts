import { Router } from "express";
import { authController } from "./auth";

const router = Router();
/**
 * AUTH
 */
router.post("/sign-in", authController.signIn);
router.post("/sign-up", authController.createUser);
router.post("/forgot-password", authController.forgotPassword);

export default router;
