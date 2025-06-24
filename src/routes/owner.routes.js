import { Router } from "express";
import { createSuperAdmin } from "../db/create.owner.js";

const router = Router();

router.get("/create-superadmin", createSuperAdmin);

export default router;
