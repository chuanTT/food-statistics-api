import { UnprocessableEntity, Forbidden } from "http-errors";
import { NextFunction, Response } from "express";

import { funcWhereFind } from "../helpers";
import { IRequest, TExistsCustomMiddleware } from "../types";
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
  async (req: IRequest, _res: Response, next: NextFunction) => {
    const {
      user: { id: userId },
    } = req.keyStore;
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
      relations: {
        groupListFood: {
          user: true
        }
      },
      ...rest,
    });

    if (!result) {
      isErrorExist ? next() : next(UnprocessableEntity(msgError));
      return;
    } else {
      if (!(userId === result?.groupListFood?.user?.id)) {
        next(Forbidden());
        return;
      }

      isErrorExist ? next(UnprocessableEntity(msgError)) : next();
      return;
    }
  };
