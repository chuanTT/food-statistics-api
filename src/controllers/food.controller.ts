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

  delete = async (req: IRequest, res: Response) => {
    const { foodIds } = req.body;
    const newFoodIds = parseArr(foodIds);

    const resultDeleteFood = await foodServices.deleteFoods({
      foodIds: newFoodIds,
    });

    if (resultDeleteFood) {
      return new OK({}).send(res);
    }
    throw BadRequest()
  };
}

export default new FoodController();
