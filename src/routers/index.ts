import * as express from "express";
import routerAuth from "./auth";
import routerGroupListFood from "./groupListFood";
import routerPath from "../configs";
import { AuthorizationPair } from "../helpers/token";
const router = express.Router();

router.use(routerPath.auth, routerAuth);

router.use(AuthorizationPair);
router.use(routerPath.groupListFood, routerGroupListFood);

export default router;
