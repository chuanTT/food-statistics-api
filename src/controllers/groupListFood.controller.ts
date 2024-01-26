import { Request, Response } from "express";
import { BadRequest } from "http-errors";
import { CREATED, OK } from "../core/success.response";
import groupListFoodServices from "../services/groupListFood.services";
import { IRequest } from "../types";
import { getDateWeeks } from "../utils/functions";

class GroupListFoodController {
  getAll = async (req: Request, res: Response) => {
    const { page, limit, searchName } = req.query;

    new OK({
      data: await groupListFoodServices.findAndCountGroupListFood({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        nameStr: searchName?.toString() ?? "",
      }),
    }).send(res);
  };
  getOne = async (req: Request, res: Response) => {
    const { id } = req.params;

    const resultOneGroupListFood =
      await groupListFoodServices.findOneGroupListFood({
        select: [],
        where: {
          id: Number(id),
        },
        relations: {
          listFood: {
            foods: true,
          },
        },
      });

    if (resultOneGroupListFood) {
      const { timestampableEntity, listFood, ...spread } =
        resultOneGroupListFood;

      const newResultOneGroupListFood = {
        ...spread,
        totalPrice: 0,
        ...timestampableEntity,
        listFood,
      };

      const newListFoods = listFood.map((items) => {
        const { timestampableEntity, totalPrice, people, foods, ...spread } =
          items;
        const numberTotalPrice = Number(totalPrice);
        const newPeople = people || newResultOneGroupListFood.people;
        newResultOneGroupListFood.totalPrice += Math.round(
          totalPrice / newPeople
        );

        return {
          ...spread,
          totalPrice: numberTotalPrice,
          people: people,
          ...timestampableEntity,
          foods,
        };
      });

      return new OK({
        data: { ...newResultOneGroupListFood, listFood: newListFoods },
      }).send(res);
    }

    throw BadRequest();
  };

  getStatistical = async (req: IRequest, res: Response) => {
    const { user } = req.keyStore;

    let allMoneySpent = 0;
    let moneySpentYear = 0;
    let moneySpentMonth = 0;
    let moneySpentNow = 0;
    let moneySpentWeek = {
      start: "",
      end: "",
      total: 0,
    };

    const resultGroupFood = await groupListFoodServices.findGroupListFood({
      select: ["id", "people", "listFood"],
      where: {
        user: {
          id: user.id,
        },
      },
      relations: {
        listFood: true,
      },
    });

    if (resultGroupFood) {
      const { month, year, date, objDate, startDate, endDate } = getDateWeeks();
      moneySpentWeek.start = startDate.toISOString();
      moneySpentWeek.end = endDate.toISOString();

      resultGroupFood.forEach((item) => {
        const { listFood } = item;

        allMoneySpent += listFood.reduce((total, current) => {
          const newMonth = current.date.getMonth() + 1;
          const newYear = current.date.getFullYear();
          const newDate = current.date.getDate();

          const people = current?.people || item?.people;
          const newTotalPrice = Math.round(
            Number(current?.totalPrice) / people
          );

          if (month === newMonth && year === newYear) {
            moneySpentMonth += newTotalPrice;
          }

          if (year === newYear) {
            moneySpentYear += newTotalPrice;
          }

          if (
            objDate.start <= newDate &&
            objDate.end >= newDate &&
            objDate.months.includes(newMonth) &&
            objDate.years.includes(newYear)
          ) {
            moneySpentWeek.total += newTotalPrice;
          }

          if (date === newDate && month === newMonth && year === newYear) {
            moneySpentNow += newTotalPrice;
          }

          return total + newTotalPrice;
        }, 0);
      });
    }

    new OK({
      data: {
        allMoneySpent,
        moneySpentYear,
        moneySpentMonth,
        moneySpentNow,
        moneySpentWeek,
      },
    }).send(res);
  };

  paid = async (req: Request, res: Response) => {
    const { id, isPaid } = req.body;

    await groupListFoodServices.updateGroupListFood({
      id: Number(id),
      isPaid: Number(isPaid),
    });

    new OK({}).send(res);
  };
  create = async (req: IRequest, res: Response) => {
    const { user } = req.keyStore;
    const { name, people, isPaid } = req.body;

    const resultGroupListFood = await groupListFoodServices.createGroupListFood(
      {
        userId: user.id,
        name,
        people,
        isPaid,
      }
    );

    if (resultGroupListFood) {
      const { id, timestampableEntity, ...rest } = resultGroupListFood;
      return new CREATED({
        data: {
          id,
          ...rest,
          people: Number(rest?.people),
          ...timestampableEntity,
        },
      }).send(res);
    }
    throw BadRequest();
  };
  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, people, isPaid } = req.body;

    await groupListFoodServices.updateGroupListFood({
      id: Number(id),
      name,
      people,
      isPaid,
    });

    new OK({}).send(res);
  };
  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    const successGroupList = await groupListFoodServices.deleteGroupListFood(
      Number(id)
    );

    if (successGroupList) {
      return new OK({}).send(res);
    }
    throw BadRequest();
  };
}

export default new GroupListFoodController();
