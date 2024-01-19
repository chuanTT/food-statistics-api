import { AppDataSource } from "../data-source";
import { Food } from "../entity/Food";

class FoodServices {
  foodDB = AppDataSource.manager.getRepository(Food);
}

export default new FoodServices();
