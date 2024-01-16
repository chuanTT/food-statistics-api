import { BeforeInsert, Column } from "typeorm";

export abstract class TimestampableEntity {
  @Column("timestamp", { nullable: true })
  createdAt: Date;

  @Column("timestamp", { nullable: true })
  updatedAt: Date;

  @BeforeInsert()
  initDate() {
    const date = new Date();
    this.createdAt = date;
    this.updatedAt = date;
  }
}
