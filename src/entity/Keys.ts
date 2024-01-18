import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Keys {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @Column("nvarchar", { nullable: true })
  publicKey: string;

  @Column("nvarchar", { nullable: true })
  privateKey: string;

  @Column("text", { nullable: true })
  refreshToken: string;
}
