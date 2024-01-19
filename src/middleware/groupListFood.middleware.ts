import { UnprocessableEntity, Forbidden } from "http-errors";
import { NextFunction, Response } from "express";

import { GroupListFood } from "../entity/GroupListFood";
import { funcWhereFind } from "../helpers";
import groupListFoodServices from "../services/groupListFood.services";
import { IRequest, TExistsCustomMiddleware } from "../types";

export const existsGroupListMiddleware =
  ({
    where = ["id"],
    select = ["id", "user"],
    msgError = "Nhóm danh sách không tồn tại",
    isErrorExist = true,
    ...rest
  }: TExistsCustomMiddleware<GroupListFood>) =>
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

    const result = await groupListFoodServices.findOneGroupListFood({
      select,
      where: newWhere,
      relations: {
        user: true,
      },
      ...rest,
    });


    if (!result) {
      isErrorExist ? next() : next(UnprocessableEntity(msgError));
      return;
    } else {
      if (!(userId === result?.user?.id)) {
        next(Forbidden());
        return;
      }
      
      isErrorExist ? next(UnprocessableEntity(msgError)) : next();
      return;
    }
  };
