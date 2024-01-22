import { Request, Response } from "express";
import { BadRequest } from "http-errors";
import { CREATED, OK } from "../core/success.response";
import groupListFoodServices from "../services/groupListFood.services";
import { IRequest } from "../types";

class GroupListFoodController {
  getAll = async (req: Request, res: Response) => {
    const { page, limit, searchName } = req.query;

    new OK({
      data: await groupListFoodServices.findAndCountGroupListFood({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        nameStr: searchName?.toString() ?? "",
      }),
    }).send(res);
  };
  getOne = async (req: Request, res: Response) => {};
  create = async (req: IRequest, res: Response) => {
    const { user } = req.keyStore;
    const { name, people, isPaid } = req.body;

    const resultGroupListFood = await groupListFoodServices.createGroupListFood(
      {
        userId: user.id,
        name,
        people,
        isPaid,
      }
    );

    if (resultGroupListFood) {
      const { id, timestampableEntity, ...rest } = resultGroupListFood;
      return new CREATED({
        data: {
          id,
          ...rest,
          people: Number(rest?.people),
          ...timestampableEntity,
        },
      }).send(res);
    }
    throw BadRequest();
  };
  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, people, isPaid } = req.body;

    await groupListFoodServices.updateGroupListFood({
      id: Number(id),
      name,
      people,
      isPaid,
    });

    new OK({}).send(res);
  };
  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    const successGroupList = await groupListFoodServices.deleteGroupListFood(
      Number(id)
    );

    if (successGroupList) {
      return new OK({}).send(res);
    }
    throw BadRequest();
  };
}

export default new GroupListFoodController();
