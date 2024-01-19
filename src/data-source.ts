import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  password: "",
  database: "statistics",
  connectorPackage: "mysql2",
  synchronize: true,
  logging: false,
  charset: "utf8",
  entities: [__dirname + "/entity/*.ts"],
  migrations: [__dirname + "/migration/*.ts"],
  subscribers: [__dirname + "/subscribers/*.ts"],
});
