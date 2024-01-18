import { FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { Keys } from "../entity/Keys";
import { RefreshTokenUsed } from "../entity/RefreshTokenUsed";

class AccessServices {
  keysDB = AppDataSource.getRepository(Keys);
  refreshTokenUsedDB = AppDataSource.getRepository(RefreshTokenUsed);

  findOneKey = async ({
    select = ["id", "refreshToken"],
    userID,
  }: { userID: number } & FindOneOptions<Keys>) => {
    return await this.keysDB.findOne({
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

  createRefreshTokenUsed = async (userID: number) => {
    const resultKeys = await this.findOneKey({
      select: [],
      userID,
    });
    const refreshTokenUsed = new RefreshTokenUsed();
    refreshTokenUsed.key = resultKeys;
    refreshTokenUsed.refreshToken = resultKeys?.refreshToken;
    return await this.refreshTokenUsedDB.save(refreshTokenUsed);
  };

  removeRefreshTokenUsed = async (idKey: number) => {
    return this.refreshTokenUsedDB.delete({
      key: {
        id: idKey,
      },
    });
  };
}

export default new AccessServices();
