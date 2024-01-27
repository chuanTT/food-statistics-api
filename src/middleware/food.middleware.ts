import { UnprocessableEntity, Forbidden } from "http-errors";
import { NextFunction, Response } from "express";

import { funcWhereFind } from "../helpers";
import { IRequest, TExistsCustomMiddleware } from "../types";
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

    const result = await foodServices.findOneListFood({
      select,
      where: newWhere,
      relations: {
        listFood: {
          groupListFood: {
            user: true
          }
        }
      },
      ...rest,
    });

    if (!result) {
      isErrorExist ? next() : next(UnprocessableEntity(msgError));
      return;
    } else {
      if (!(userId === result?.listFood?.groupListFood?.user?.id)) {
        next(Forbidden());
        return;
      }

      isErrorExist ? next(UnprocessableEntity(msgError)) : next();
      return;
    }
  };
