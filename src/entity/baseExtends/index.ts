import { Column } from "typeorm";

export abstract class TimestampableEntity {
  @Column("timestamp")
  createdAt: Date;

  @Column("timestamp")
  updatedAt: Date;
}
