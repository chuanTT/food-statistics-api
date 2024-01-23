import { FindManyOptions, FindOneOptions, ILike } from "typeorm";
import { AppDataSource } from "../data-source";
import { GroupListFood } from "../entity/GroupListFood";
import userServices from "./user.services";
import { ListFood } from "../entity/ListFood";
import { Food } from "../entity/Food";
import { funcTransactionsQuery } from "../helpers/transactionsQuery";
import paginationShared from "../helpers/paginationShared";
import { pageAndLimit } from "../types";

type ICreateGroupListFood = {
  userId: number;
  name?: string;
  people?: number;
  isPaid?: number;
};

class GroupListFoodServices {
  groupListFoodDB = AppDataSource.manager.getRepository(GroupListFood);

  findAndCountGroupListFood = async ({
    page,
    limit,
    nameStr,
  }: pageAndLimit & { nameStr?: string }) => {
    return await paginationShared({
      page,
      limit,
      serviceCallBack: async ({ page, limit }) =>
        await this.groupListFoodDB.findAndCount({
          skip: page,
          take: limit,
          order: {
            id: "DESC",
          },
          relations: {
            listFood: true,
          },
          where: {
            name: ILike(`%${nameStr}%`),
          },
        }),
      customItems: (items) =>
        items.map((item) => {
          const { timestampableEntity, listFood, ...spread } = item;
          const totalPrice = listFood?.reduce((total, current) => {
            const totalPriceCurrent = Number(current.totalPrice);
            const people = current.people || item.people;
            return total + Math.round(totalPriceCurrent / people);
          }, 0);
          return {
            ...spread,
            totalPrice,
            ...timestampableEntity,
          };
        }),
    });
  };

  findGroupListFood = async ({
    select = ["id"],
    ...rest
  }: FindManyOptions<GroupListFood>) => {
    const result = await this.groupListFoodDB.find({ select, ...rest });
    return result;
  };

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
          loadRelationIds: true,
        });

        if (resultListFood?.length > 0) {
          let foodIds: number[] = [];
          let listFoodIds: number[] = [];
          resultListFood.forEach((item) => {
            listFoodIds.push(item.id);
            if (item.foods?.length > 0) {
              foodIds = [...foodIds, ...(item.foods as unknown as number[])];
            }
          });
          foodIds.length > 0 &&
            (await queryRunner.manager.delete(Food, foodIds));
          listFoodIds.length > 0 &&
            (await queryRunner.manager.delete(ListFood, listFoodIds));
        }

        await queryRunner.manager.delete(GroupListFood, id);
        await queryRunner.commitTransaction();
        return true;
      },
    });
  };
}

export default new GroupListFoodServices();
