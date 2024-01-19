import { BadRequest } from "http-errors";
import { Request, Response } from "express";
import listFoodServices from "../services/listFood.services";
import { CREATED, OK } from "../core/success.response";

class ListFoodController {
  getAll = async (req: Request, res: Response) => {};
  getOne = async (req: Request, res: Response) => {};
  create = async (req: Request, res: Response) => {
    const { people, date, idGroupList } = req.body;

    const resultListFood = await listFoodServices.createGroupListFood({
      idGroupList,
      date: date ? new Date(date) : date,
      people,
    });

    if (resultListFood) {
      const { id, timestampableEntity, ...rest } = resultListFood;
      return new CREATED({
        data: {
          id,
          ...rest,
          ...timestampableEntity,
        },
      }).send(res);
    }

    throw BadRequest();
  };
  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { people, date } = req.body;

    if (people || date) {
      await listFoodServices.updateListFood({
        id: Number(id),
        date: date ? new Date(date) : date,
        people,
      });
    }
    new OK({}).send(res);
  };
  delete = async (req: Request, res: Response) => {};
}

export default new ListFoodController();
