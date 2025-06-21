import { Router } from "express";
import customerController from "../controllers/customer.controller.js";

const controller = customerController;

const router = Router();

router
  .post("/signup", controller.signUp)
  .post("/signin", controller.signIn)
  .post("/confirm-signin", controller.confirmSignin)
  .post("/token", controller.newAccesToken);

export default router;
