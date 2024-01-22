import { FindManyOptions, FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { ListFood } from "./../entity/ListFood";
import groupListFoodServices from "./groupListFood.services";
import { funcTransactionsQuery } from "../helpers/transactionsQuery";
import { Food } from "../entity/Food";

type TcreateGroupListFood = {
  idGroupList: number;
  date?: Date;
  people?: number;
};

class ListFoodServices {
  ListFoodDB = AppDataSource.manager.getRepository(ListFood);

  findListFood = async ({
    select = ["id"],
    ...rest
  }: FindManyOptions<ListFood>) => {
    const result = await this.ListFoodDB.find({ select, ...rest });
    return result;
  };

  findOneListFood = async ({
    select = ["id"],
    ...rest
  }: FindOneOptions<ListFood>) => {
    const result = await this.ListFoodDB.findOne({ select, ...rest });
    return result;
  };

  createGroupListFood = async ({
    idGroupList,
    date,
    people,
  }: TcreateGroupListFood) => {
    if (idGroupList) {
      const groupListFood = await groupListFoodServices.findOneGroupListFood({
        where: {
          id: idGroupList,
        },
      });

      if (groupListFood) {
        const listFood = new ListFood();
        listFood.date = date || new Date();
        if (people) {
          listFood.people = people || null;
        }
        listFood.groupListFood = groupListFood;
        return this.ListFoodDB.save(listFood);
      }
    }

    return null;
  };

  updateListFood = async ({
    id,
    date,
    people,
  }: Omit<TcreateGroupListFood, "idGroupList"> & { id: number }) => {
    return await this.ListFoodDB.update(id, {
      date,
      people,
    });
  };

  deleteListFood = async (idKey: number) => {
    return await funcTransactionsQuery({
      callBack: async (queryRunner) => {
        const resultFood = await queryRunner.manager.find(Food, {
          select: ["id"],
          where: {
            listFood: {
              id: idKey,
            },
          },
        });

        if (resultFood?.length > 0) {
          await queryRunner.manager.delete(Food, resultFood);
        }
        await queryRunner.manager.delete(ListFood, idKey);
        await queryRunner.commitTransaction();
        return true;
      },
    });
  };
}

export default new ListFoodServices();
