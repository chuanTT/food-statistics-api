import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Food } from "../entity/Food";
import { funcTransactionsQuery } from "../helpers/transactionsQuery";
import listFoodServices from "./listFood.services";
import { awaitAll } from "../utils/functions";
import { ListFood } from "../entity/ListFood";

type createFoodsProps = {
  foods: { name: string; price: number; count?: number }[];
  listFoodId: number;
};

type deleteFoodsProps = {
  foodIds: number[];
};

class FoodServices {
  foodDB = AppDataSource.getRepository(Food);

  createFoods = async ({ foods, listFoodId }: createFoodsProps) => {
    const newFoods: any[] = foods.map((food) => ({
      ...food,
      listFood: {
        id: listFoodId,
      },
    }));

    const resultFood: Food[] = await this.foodDB.save(newFoods);
    const newResultFoods: Food[] = [];
    if (resultFood?.length > 0) {
      const totalPrice = resultFood.reduce((total, current) => {
        const { id, count, ...spread } = current;
        newResultFoods.push({ id, count, ...spread });
        return total + current.price * current.count;
      }, 0);

      await listFoodServices.incrementListFood(listFoodId, totalPrice);
    }
    return newResultFoods;
  };

  deleteFoods = async ({ foodIds }: deleteFoodsProps) => {
    return await funcTransactionsQuery({
      callBack: async (queryRunner) => {
        const resultFoods = await queryRunner.manager.find(Food, {
          where: {
            id: In(foodIds),
          },
          relations: {
            listFood: true,
          },
        });

        if (resultFoods?.length > 0) {
          const priceListFoods: {
            id: number;
            total: number;
          }[] = resultFoods?.reduce((total, current) => {
            const findIndex = total.findIndex(
              (item) => item?.id === current?.listFood?.id
            );

            if (findIndex !== -1) {
              total[findIndex].total += current?.price * current?.count;
            } else {
              total.push({
                id: current?.listFood?.id,
                total: current?.price * current?.count,
              });
            }
            return total;
          }, []);

          await awaitAll(priceListFoods, async (item) => {
            await queryRunner.manager.decrement(
              ListFood,
              {
                id: item?.id,
              },
              "totalPrice",
              item.total
            );
          });

          await queryRunner.manager.delete(Food, resultFoods);
          await queryRunner.commitTransaction();
          return resultFoods;
        }
        return null;
      },
    });
  };
}

export default new FoodServices();
