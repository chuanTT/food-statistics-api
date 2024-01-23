import * as express from "express";
import { asyncHandler } from "../helpers";
import foodController from "../controllers/food.controller";
import { existsListFoodMiddleware } from "../middleware/listFood.middleware";
import validateRequest from "../middleware/validateRequest";
import {
  configFoodCreate,
  configFoodDelete,
} from "../configs/configSchemaValidate";
const router = express.Router();

router.post(
  "/",
  validateRequest(configFoodCreate),
  existsListFoodMiddleware({
    isErrorExist: false,
    where: [
      {
        key: "id",
        value: "idListFood",
      },
    ],
  }),
  asyncHandler(foodController.create)
);

router.delete(
  "/",
  validateRequest(configFoodDelete),
  asyncHandler(foodController.delete)
);

export default router;
