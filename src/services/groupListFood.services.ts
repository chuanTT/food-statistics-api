import { FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { GroupListFood } from "../entity/GroupListFood";
import userServices from "./user.services";
import listFoodServices from "./listFood.services";
import { ListFood } from "../entity/ListFood";
import { Food } from "../entity/Food";
import { awaitAll } from "../utils/functions";
import { funcTransactionsQuery } from "../helpers/transactionsQuery";

type ICreateGroupListFood = {
  userId: number;
  name: string;
  people?: number;
  isPaid?: number;
};

class GroupListFoodServices {
  groupListFoodDB = AppDataSource.manager.getRepository(GroupListFood);

  findOneGroupListFood = async ({
    select = ["id"],
    ...rest
  }: FindOneOptions<GroupListFood>) => {
    const result = await this.groupListFoodDB.findOne({ select, ...rest });
    return result;
  };

  createGroupListFood = async ({
    userId,
    name,
    people,
    isPaid,
  }: ICreateGroupListFood) => {
    const user = await userServices.findOneUser({
      where: {
        id: userId,
      },
    });

    if (user) {
      const groupListFood = new GroupListFood();
      groupListFood.name = name;
      groupListFood.people = people || 1;
      groupListFood.isPaid = isPaid ? 1 : 0;
      groupListFood.user = user;
      return this.groupListFoodDB.save(groupListFood);
    }

    return null;
  };

  updateGroupListFood = async ({
    id,
    name,
    people,
    isPaid,
  }: Omit<ICreateGroupListFood, "userId"> & { id: number }) => {
    return await this.groupListFoodDB.update(id, {
      name,
      isPaid,
      people,
    });
  };

  deleteGroupListFood = async (id: number) => {
    return await funcTransactionsQuery({
      callBack: async (queryRunner) => {
        const resultListFood = await queryRunner.manager.find(ListFood, {
          select: ["id"],
          where: {
            groupListFood: {
              id,
            },
          },
          relations: {
            foods: true,
          },
        });

        if (resultListFood?.length > 0) {
          let foodIds: number[] = [];
          let listFoodIds: number[] = [];
          resultListFood.forEach((item) => {
            listFoodIds.push(item.id);
            if (item.foods?.length > 0) {
              foodIds = [...foodIds, ...item.foods.map((food) => food.id)];
            }
          });
          foodIds.length > 0 && (await queryRunner.manager.delete(Food, foodIds))
          listFoodIds.length > 0 && (await queryRunner.manager.delete(ListFood, listFoodIds))
        }

        await queryRunner.manager.delete(GroupListFood, id)
        await queryRunner.commitTransaction();
        return true;
      },
    });
  };
}

export default new GroupListFoodServices();
