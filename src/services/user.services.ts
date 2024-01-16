import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

class UserServices {
  userDB = AppDataSource.getRepository(User);

  async register({ firstName, lastName, username, password }) {
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.password = password;
    const result = this.userDB.save(user)
    return result;
  }
}

export default new UserServices();
