import express from "express";
import { registerUser, loginUser, requestPasswordReset, resetPassword, logoutUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/logout", logoutUser);

export default router;