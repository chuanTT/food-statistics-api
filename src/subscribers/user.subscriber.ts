import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { User } from "../entity/User";
import { defaultAvatarGender } from "../utils/defaultAvatar";
import { bcryptPass } from "../utils/bcryptFuc";
import { TimestampableEntity } from "../entity/baseExtends";

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
    const timestamp = new TimestampableEntity();
    event.entity.timestampableEntity = timestamp.initDate();
  }
}
