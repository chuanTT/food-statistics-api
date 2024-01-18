import { UnprocessableEntity } from "http-errors";
import { NextFunction, Request, Response } from "express";
import userServices from "../services/user.services";
import accessServices from "../services/access.services";
import { createTokenPair } from "../helpers/token";
import { OK } from "../core/success.response";
import { bcryptCompare } from "../utils/bcryptFuc";

class AuthControllers {
  register = async (req: Request, res: Response, _next: NextFunction) => {
    const { password, groupListFood, timestampableEntity, id, ...spread } =
      await userServices.createUser(req.body);

    const { token, refreshToken, publicKey, privateKey } = createTokenPair({
      id,
    });
    await accessServices.createKeys({
      userId: id,
      publicKey,
      refreshToken,
      privateKey,
    });

    new OK({
      data: {
        user: { id, ...spread, ...timestampableEntity },
        token,
        refreshToken,
      },
    }).send(res);
  };

  login = async (req: Request, res: Response, _next: NextFunction) => {
    const { username, password } = req.body;
    const {
      password: pwdDB,
      timestampableEntity,
      id,
      ...userData
    } = await userServices.findOneUser({
      select: [],
      where: {
        username,
      },
    });

    const isHashPwd = bcryptCompare(password, pwdDB);
    if (!isHashPwd) {
      throw UnprocessableEntity("Tài khoản hoặc mật khẩu không chính xác");
    }

    const { token, refreshToken, publicKey, privateKey } = createTokenPair({
      id,
    });

    await accessServices.createRefreshTokenUsed(id)
    await accessServices.updateKeys({
      userId: id,
      publicKey,
      refreshToken,
      privateKey,
    });

    new OK({
      data: {
        user: {
          ...userData,
          ...timestampableEntity,
        },
        token,
        refreshToken,
      },
    }).send(res);
  };
}

export default new AuthControllers();
