import * as express from "express";
import { asyncHandler } from "../helpers";
import foodController from "../controllers/food.controller";
const router = express.Router();

router.post("/", asyncHandler(foodController.create));

export default router;
