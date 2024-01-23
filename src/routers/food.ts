import { configFoodUpdate } from './../configs/configSchemaValidate';
import * as express from "express";
import { asyncHandler } from "../helpers";
import foodController from "../controllers/food.controller";
import { existsListFoodMiddleware } from "../middleware/listFood.middleware";
import validateRequest from "../middleware/validateRequest";
import {
  configDefaultID,
  configFoodCreate,
  configFoodDelete,
} from "../configs/configSchemaValidate";
import { existsFoodMiddleware } from "../middleware/food.middleware";
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

router.patch(
  "/:id",
  validateRequest(configFoodUpdate),
  existsFoodMiddleware({
    isErrorExist: false
  }),
  asyncHandler(foodController.update)
);

export default router;
