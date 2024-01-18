import { FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

class UserServices {
  userDB = AppDataSource.getRepository(User);

  async createUser({ firstName, lastName, username, password }) {
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.password = password;
    const result = this.userDB.save(user);
    return result;
  }

  async findOneUser({ select = ["id"], ...rest }: FindOneOptions<User>) {
    const result = await this.userDB.findOne({ select, ...rest });
    return result;
  }
}

export default new UserServices();
