import { Column } from "typeorm";

export class TimestampableEntity {
  @Column("timestamp", { nullable: true })
  createdAt: Date;

  @Column("timestamp", { nullable: true })
  updatedAt: Date;

  initDate() {
    const date = new Date();
    this.createdAt = date;
    this.updatedAt = date;
    return this;
  }
}
