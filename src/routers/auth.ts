import * as express from "express";
import AuthControllers from "../controllers/auth.controller";
import { asyncHandler } from "../helpers";
const router = express.Router();

router.post("/register", asyncHandler(AuthControllers.register));

export default router;
