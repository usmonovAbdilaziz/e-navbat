import { Router } from "express";
import AdminController from "../controllers/admin.controller.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { logMid } from "../middlware/guards.js";

const router = Router();

const controller = AdminController;

router
  .post("/", AuthGuard, logMid(["superadmin"]), controller.createAdmin)
  .post("/signin", controller.adminSignin)
  .post("/token", controller.newAccesToken)
  .post("/log-out", controller.logOut)
  .get("/", controller.getAdmins)
  .get("/:id", controller.getAdminById)
  .patch("/:id", controller.updateAdmin)
  .delete("/:id", controller.deleteAdmin);

export default router;
