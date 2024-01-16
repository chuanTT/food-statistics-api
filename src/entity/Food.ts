import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { ListFood } from "./ListFood";

@Entity()
export class Food {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column("nvarchar", { length: 40 })
  name: string;

  @ManyToOne(() => ListFood, (listFood) => listFood.foods)
  listFood: ListFood;

  @Column("integer", { default: 0 })
  price: number;

  @Column("integer", { default: 1 })
  count: number;
}
