import { Router } from "express";
import customerController from "../controllers/customer.controller.js";

const controller = customerController;

const router = Router();

router.post("/signup", controller.signUp);

export default router;
