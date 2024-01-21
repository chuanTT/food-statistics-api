import { FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { GroupListFood } from "../entity/GroupListFood";
import userServices from "./user.services";
import listFoodServices from "./listFood.services";
import { ListFood } from "../entity/ListFood";
import { Food } from "../entity/Food";
import { awaitAll } from "../utils/functions";

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
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      try {
        const resultListFood = await transactionalEntityManager.find(ListFood, {
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
          for (const listFood of resultListFood) {
            listFood.foods = []; //
          }
          await transactionalEntityManager.remove(resultListFood);
        }

        await transactionalEntityManager.delete(GroupListFood, id);
      } catch {}
    });
  };
}

export default new GroupListFoodServices();
