import * as express from "express";
import AuthControllers from "../controllers/auth.controller";
const router = express.Router();

router.post("/register", AuthControllers.register);

export default router;
