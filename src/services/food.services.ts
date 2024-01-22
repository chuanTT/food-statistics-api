import { AppDataSource } from "../data-source";
import { Food } from "../entity/Food";

class FoodServices {
  foodDB = AppDataSource.manager.getRepository(Food);

  createFoods = async (data) => {
    return this.foodDB.create(data);
  };
}

export default new FoodServices();
