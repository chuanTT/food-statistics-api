import * as express from "express";
import { asyncHandler } from "../helpers";
import foodController from "../controllers/food.controller";
import { existsListFoodMiddleware } from "../middleware/listFood.middleware";
import validateRequest from "../middleware/validateRequest";
import { configFoodCreate } from "../configs/configSchemaValidate";
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

export default router;
