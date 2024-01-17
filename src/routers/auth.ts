import * as express from "express";
import AuthControllers from "../controllers/auth.controller";
import { asyncHandler } from "../helpers";
import validateRequest from "../middleware/validateRequest";
import { configPasswordBody } from "../configs/configSchemaValidate";
const router = express.Router();

router.post(
  "/register",
  validateRequest(configPasswordBody),
  asyncHandler(AuthControllers.register)
);

export default router;
