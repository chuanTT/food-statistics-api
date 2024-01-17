import { NextFunction, Request, Response } from "express";
import userServices from "../services/user.services";
import accessServices from "../services/access.services";
import { createTokenPair } from "../helpers/token";
import { OK } from "../core/success.response";

class AuthControllers {
  register = async (req: Request, res: Response, next: NextFunction) => {
    const { password, groupListFood, timestampableEntity, id, ...spread } =
      await userServices.register(req.body);
    const { token, refreshToken, publicKey } = createTokenPair({
      id,
    });
    await accessServices.createKeys({ userId: id, publicKey, refreshToken });

    new OK({
      data: {
        user: { id, ...spread, ...timestampableEntity },
        token,
        refreshToken,
      },
    }).send(res);
  };
}

export default new AuthControllers();
