import express from "express";
import { googleLoginController, login, register, logoutController } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.delete("/logout", logoutController)
router.post("/googleLogin", googleLoginController)

export default router