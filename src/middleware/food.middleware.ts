import { UnprocessableEntity } from "http-errors";
import { NextFunction, Request, Response } from "express";

import { funcWhereFind } from "../helpers";
import { TExistsCustomMiddleware } from "../types";
import foodServices from "../services/food.services";
import { Food } from "../entity/Food";

export const existsFoodMiddleware =
  ({
    where = ["id"],
    select = ["id"],
    msgError = "Không tồn tại",
    isErrorExist = true,
    ...rest
  }: TExistsCustomMiddleware<Food>) =>
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

    const result = await foodServices.findOneListFood({
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
