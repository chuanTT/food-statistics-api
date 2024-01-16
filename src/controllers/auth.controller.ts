import { NextFunction, Request, Response } from "express";
import userServices from "../services/user.services";

class AuthControllers {
  register = async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.register(req.body);

    return res.json(result);
  };
}

export default new AuthControllers();
