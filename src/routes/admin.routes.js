import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controllers/admin.controller.js";

const router = Router();
router.post("/signup",registerAdmin)
router.post("/login", loginAdmin);

export default router;
