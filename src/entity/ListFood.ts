import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import { GroupListFood } from "./GroupListFood";
import { Food } from "./Food";
import { TimestampableEntity } from "./baseExtends";

@Entity()
export class ListFood {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column("datetime")
  date: Date;

  @Column("integer", { nullable: true })
  people: number;

  @ManyToOne(() => GroupListFood, (GroupListFood) => GroupListFood.listFood)
  groupListFood: GroupListFood;

  @OneToMany(() => Food, (Food) => Food.listFood)
  foods: Food[];

  @Column(() => TimestampableEntity, { prefix: false })
  timestampableEntity: TimestampableEntity;

  @BeforeInsert()
  insertDate() {
    const timestamp = new TimestampableEntity();
    this.timestampableEntity = timestamp.initDate();
  }
}
