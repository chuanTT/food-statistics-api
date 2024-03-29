import { UnprocessableEntity } from "http-errors";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { FindOneOptions } from "typeorm";
import { funcWhereFind } from "../helpers";
import userServices from "../services/user.services";
import { TExistsCustomMiddleware } from "../types";

export const existsUserMiddleware =
  ({
    where = ["username"],
    select = ["id"],
    msgError = "Tài khoản đã tồn tại",
    isErrorExist = true,
    ...rest
  }: TExistsCustomMiddleware<User>) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const newObject = {
      ...Object.assign({}, req.body),
      ...req.params,
      ...req.query,
    };

    const newWhere = funcWhereFind({
      where,
      obj: newObject,
    });

    const result = await userServices.findOneUser({
      select,
      where: newWhere,
      ...rest,
    });

    if (!result) {
      isErrorExist ? next() : next(UnprocessableEntity(msgError));
      return;
    } else {
      isErrorExist ? next(UnprocessableEntity(msgError)) : next();
      return;
    }
  };
