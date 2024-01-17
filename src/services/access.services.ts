import { AppDataSource } from "../data-source";
import { Keys } from "../entity/Keys";

class AccessServices {
  keysDB = AppDataSource.getRepository(Keys);

  createKeys = async ({ userId, publicKey, refreshToken }) => {
    const keys = new Keys();
    keys.user = userId;
    keys.publicKey = publicKey;
    keys.refreshToken = refreshToken;
    const result = await this.keysDB.save(keys);
    return result;
  };
}

export default new AccessServices();
