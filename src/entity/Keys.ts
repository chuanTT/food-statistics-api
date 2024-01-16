import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { RefreshTokenUsed } from "./RefreshTokenUsed";

@Entity()
export class Keys {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @OneToMany(() => RefreshTokenUsed, (refreshTokenUsed) => refreshTokenUsed.key)
  refreshTokenUsed: RefreshTokenUsed[];

  @Column("nvarchar")
  publicKey: string;

  @Column("nvarchar")
  refreshToken: string;
}
