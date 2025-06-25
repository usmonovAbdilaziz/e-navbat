import { Router } from "express";
import PassportController from "../controllers/passport.controller.js";
import { AuthGuard } from "../guards/auth.guard.js";

const router = Router();
const {
  createPassport,
  getAllPassports,
  getPassportById,
  updatePassport,
  deletePassport,
} = PassportController;

router
  .post("/", createPassport)
  .get("/", getAllPassports)
  .get("/:id", getPassportById)
  .patch("/:id", updatePassport)
  .delete("/:id", deletePassport);
export default router;
