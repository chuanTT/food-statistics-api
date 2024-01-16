import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { User } from "../entity/User";
import { defaultAvatarGender } from "../utils/defaultAvatar";
import { bcryptPass } from "../utils/bcryptFuc";

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<User> {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return User;
  }

  /**
   * Called before post insertion.
   */
  beforeInsert(event: InsertEvent<User>) {
    event.entity.avatar = defaultAvatarGender();
    event.entity.password = bcryptPass(event.entity.password);
  }

  afterInsert(event: InsertEvent<User>): void | Promise<any> {
    const date = new Date();
    event.entity.timestampableEntity.createdAt = date;
    event.entity.timestampableEntity.updatedAt = date;
  }
}
