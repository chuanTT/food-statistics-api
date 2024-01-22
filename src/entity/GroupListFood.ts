import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import { User } from "./User";
import { ListFood } from "./ListFood";
import { TimestampableEntity } from "./baseExtends";

@Entity()
export class GroupListFood {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column("nvarchar", { length: 200 })
  name: string;

  @Column("integer", { default: 1 })
  people: number;

  @Column("integer", { default: 0 })
  isPaid: number;

  @ManyToOne(() => User, (user) => user.groupListFood)
  user: User;

  @OneToMany(() => ListFood, (ListFood) => ListFood.groupListFood)
  listFood: ListFood[];

  @Column(() => TimestampableEntity, { prefix: false })
  timestampableEntity: TimestampableEntity;

  @BeforeInsert()
  insertDate() {
    const timestamp = new TimestampableEntity();
    this.timestampableEntity = timestamp.initDate();
  }
}
