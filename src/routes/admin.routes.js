import { Router } from "express";
import AdminController from "../controllers/admin.controller.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/roles.guard.js";
import { SelfGuard } from "../guards/self.guard.js";

const router = Router();

const controller = AdminController;

router
  .post("/", AuthGuard, RolesGuard(["superadmin"]), controller.createAdmin)
  .post("/signin", controller.adminSignin)
  .post("/token", controller.newAccesToken)
  .post("/log-out", AuthGuard, controller.logOut)
  .get("/", AuthGuard, RolesGuard(["superadmin"]), controller.getAdmins)
  .get("/:id", AuthGuard, SelfGuard, controller.getAdminById)
  .patch("/:id", AuthGuard, SelfGuard, controller.updateAdmin)
  .delete(
    "/:id",
    AuthGuard,
    RolesGuard(["superadmin"]),
    controller.deleteAdmin
  );

export default router;
