import { FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { Keys } from "../entity/Keys";

class AccessServices {
  keysDB = AppDataSource.getRepository(Keys);

  findOneKey = async ({
    select = ["id", "refreshToken"],
    userID,
    ...rest
  }: { userID: number } & FindOneOptions<Keys>) => {
    return await this.keysDB.findOne({
      ...rest,
      select,
      where: {
        user: {
          id: userID,
        },
      },
    });
  };

  createKeys = async ({ userId, publicKey, refreshToken, privateKey }) => {
    const keys = new Keys();
    keys.user = userId;
    keys.publicKey = publicKey;
    keys.refreshToken = refreshToken;
    keys.privateKey = privateKey;
    const result = await this.keysDB.save(keys);
    return result;
  };

  updateKeys = async ({ userId, publicKey, refreshToken, privateKey }) => {
    return await this.keysDB.update(
      {
        user: {
          id: userId,
        },
      },
      {
        publicKey,
        refreshToken,
        privateKey,
      }
    );
  };

  clearKeys = async (userId: number) => {
    await this.updateKeys({
      userId,
      privateKey: null,
      publicKey: null,
      refreshToken: null,
    });
  };
}

export default new AccessServices();
