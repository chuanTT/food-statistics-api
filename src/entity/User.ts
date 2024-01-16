import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import { GroupListFood } from "./GroupListFood";
import { TimestampableEntity } from "./baseExtends";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column("nvarchar", { length: 40 })
  firstName: string;

  @Column("nvarchar", { length: 30 })
  lastName: string;

  @Column("nvarchar", { length: 30, unique: true })
  username: string;

  @Column("nvarchar", { length: 64 })
  password: string;

  @Column("nvarchar", { nullable: true })
  avatar: string;

  @OneToMany(() => GroupListFood, (GroupListFood) => GroupListFood.user)
  groupListFood: GroupListFood[];

  @Column(() => TimestampableEntity, { prefix: false })
  timestampableEntity: TimestampableEntity;
}
