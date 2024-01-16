import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Keys } from "./Keys";

@Entity()
export class RefreshTokenUsed {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Keys, (keys) => keys.id)
  key: Keys;

  @Column("nvarchar")
  refreshToken: string;
}
