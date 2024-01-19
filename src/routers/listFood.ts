import * as express from "express";
import listFoodController from "../controllers/listFood.controller";
import { asyncHandler } from "../helpers";
import validateRequest from "../middleware/validateRequest";
import {
  configDefaultID,
  configListFood,
  configListFoodUpdate,
} from "../configs/configSchemaValidate";
import { existsListFoodMiddleware } from "../middleware/listFood.middleware";
const router = express.Router();

router.get("/", asyncHandler(listFoodController.getAll));
router.get("/:id", asyncHandler(listFoodController.getOne));

router.post(
  "/",
  validateRequest(configListFood),
  asyncHandler(listFoodController.create)
);


router.patch(
  "/:id",
  validateRequest(configListFoodUpdate),
  existsListFoodMiddleware({ isErrorExist: false }),
  asyncHandler(listFoodController.update)
);

router.delete(
  "/:id",
  validateRequest({
    params: configDefaultID,
  }),
  existsListFoodMiddleware({ isErrorExist: false }),
  asyncHandler(listFoodController.delete)
);

export default router;
