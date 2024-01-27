import { BadRequest } from "http-errors";
import { OK } from "../core/success.response";
import foodServices from "../services/food.services";
import { IRequest } from "../types";
import { parseArr } from "../utils/validate";

class FoodController {
  create = async (req: IRequest, res: Response) => {
    const { foods, idListFood } = req.body;
    const arrFoods = parseArr(foods);
    const resultFoods = await foodServices.createFoods({
      foods: arrFoods,
      listFoodId: Number(idListFood),
    });

    if (resultFoods?.length > 0) {
      return new OK({
        data: resultFoods,
      }).send(res);
    }

    throw BadRequest();
  };

  update = async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const { name, price, count } = req.body;

    if (name || price || count) {
      await foodServices.updateFoods({
        name,
        count: Number(count),
        price: Number(price),
        id: Number(id),
      });
    }

    new OK({}).send(res);
  };

  delete = async (req: IRequest, res: Response) => {
    const { foodIds } = req.body;
    const {
      user: { id: userID },
    } = req.keyStore;
    const newFoodIds = parseArr(foodIds);

    const resultDeleteFood = await foodServices.deleteFoods({
      foodIds: newFoodIds,
      userID,
    });

    if (resultDeleteFood) {
      return new OK({}).send(res);
    }
    throw BadRequest();
  };
}

export default new FoodController();
