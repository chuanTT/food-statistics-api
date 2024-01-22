import { QueryRunner } from "typeorm";
import { AppDataSource } from "../data-source";

type funcTransactionsQueryParams = {
  callBack?: (queryRunner: QueryRunner) => Promise<void | any>;
  callBackError?: (queryRunner: QueryRunner) => Promise<void>;
};

export const funcTransactionsQuery = async ({
  callBack,
  callBackError,
}: funcTransactionsQueryParams) => {
  // create a new query runner
  const queryRunner = AppDataSource.createQueryRunner();
  // establish real database connection using our new query runner
  await queryRunner.connect();
  // lets now open a new transaction:
  await queryRunner.startTransaction();

  try {
    return callBack && (await callBack(queryRunner));
  } catch (err) {
    console.log(err)
    callBackError && (await callBackError(queryRunner));
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
  return null;
};
