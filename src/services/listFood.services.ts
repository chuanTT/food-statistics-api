import { FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { ListFood } from "./../entity/ListFood";
import groupListFoodServices from "./groupListFood.services";

type TcreateGroupListFood = {
  idGroupList: number;
  date?: Date;
  people?: number;
};

class ListFoodServices {
  ListFoodDB = AppDataSource.manager.getRepository(ListFood);

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
}

export default new ListFoodServices();
