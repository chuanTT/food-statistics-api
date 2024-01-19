import { UnprocessableEntity } from "http-errors";
import { NextFunction, Request, Response } from "express";

import { funcWhereFind } from "../helpers";
import { TExistsCustomMiddleware } from "../types";
import { ListFood } from "../entity/ListFood";
import listFoodServices from "../services/listFood.services";

export const existsListFoodMiddleware =
  ({
    where = ["id"],
    select = ["id"],
    msgError = "Danh sách không tồn tại",
    isErrorExist = true,
    ...rest
  }: TExistsCustomMiddleware<ListFood>) =>
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

    const result = await listFoodServices.findOneListFood({
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
