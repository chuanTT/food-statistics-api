import * as express from "express";
import AuthControllers from "../controllers/auth.controller";
import { asyncHandler } from "../helpers";
import validateRequest from "../middleware/validateRequest";
import { configLoginBody, configRegisterBody } from "../configs/configSchemaValidate";
import { existsUserMiddleware } from "../middleware/user.middleware";
const router = express.Router();

router.post(
  "/register",
  validateRequest(configRegisterBody),
  existsUserMiddleware({}),
  asyncHandler(AuthControllers.register)
);

router.post(
  "/login",
  validateRequest(configLoginBody),
  existsUserMiddleware({
    isErrorExist: false,
    msgError: "Tài khoản không tồn tại"
  }),
  asyncHandler(AuthControllers.login)
);

export default router;
