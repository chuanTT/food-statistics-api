import * as express from "express";
import groupListFoodController from "../controllers/groupListFood.controller";
import validateRequest from "../middleware/validateRequest";
import {
  configDefaultID,
  configGroupListFood,
  configGroupListFoodUpdate,
  configPageAndLimit,
} from "../configs/configSchemaValidate";
import { asyncHandler } from "../helpers";
import { existsGroupListMiddleware } from "../middleware/groupListFood.middleware";
const router = express.Router();

router.get(
  "/",
  validateRequest(configPageAndLimit),
  asyncHandler(groupListFoodController.getAll)
);
router.get(
  "/:id",
  validateRequest({
    params: configDefaultID,
  }),
  existsGroupListMiddleware({
    isErrorExist: false,
  }),
  asyncHandler(groupListFoodController.getOne)
);

router.post(
  "/",
  validateRequest(configGroupListFood),
  asyncHandler(groupListFoodController.create)
);

router.patch(
  "/:id",
  validateRequest(configGroupListFoodUpdate),
  existsGroupListMiddleware({
    isErrorExist: false,
  }),
  asyncHandler(groupListFoodController.update)
);

router.delete(
  "/:id",
  validateRequest({
    params: configDefaultID,
  }),
  existsGroupListMiddleware({
    isErrorExist: false,
  }),
  asyncHandler(groupListFoodController.delete)
);

export default router;
