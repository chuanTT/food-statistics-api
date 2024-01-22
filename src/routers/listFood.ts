import * as express from "express";
import listFoodController from "../controllers/listFood.controller";
import { asyncHandler } from "../helpers";
import validateRequest from "../middleware/validateRequest";
import {
  configDefaultID,
  configListFood,
  configListFoodUpdate,
  configPageAndLimit,
} from "../configs/configSchemaValidate";
import { existsListFoodMiddleware } from "../middleware/listFood.middleware";
import { existsGroupListMiddleware } from "../middleware/groupListFood.middleware";
const router = express.Router();

router.get(
  "/",
  validateRequest(configPageAndLimit),
  asyncHandler(listFoodController.getAll)
);
router.get("/:id", asyncHandler(listFoodController.getOne));

router.post(
  "/",
  validateRequest(configListFood),
  existsGroupListMiddleware({
    isErrorExist: false,
    where: [
      {
        key: "id",
        value: "idGroupList",
      },
    ],
  }),
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
