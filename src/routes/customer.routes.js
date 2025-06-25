import { Router } from "express";
import customerController from "../controllers/customer.controller.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { SelfGuard } from "../guards/self.guard.js";

const controller = customerController;

const router = Router();

router
  .post("/", controller.createCustomer)
  .post("/signup", controller.signUp)
  .post("/signin", controller.signIn)
  .post("/confirm-signin", controller.confirmSignin)
  .post("/token", controller.newAccesToken)
  .post("/log-out", controller.logOut)
  .get("/", AuthGuard, SelfGuard, controller.getAllCustomer)
  .get("/:id", AuthGuard, SelfGuard, controller.getCustomerById)
  .patch("/:id", AuthGuard, SelfGuard, controller.updateCustomer)
  .delete("/:id", AuthGuard, SelfGuard, controller.deleteCustomer);

export default router;
