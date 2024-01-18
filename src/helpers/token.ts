import { generateKeyPairSync, randomBytes } from "node:crypto";
import * as JWT from "jsonwebtoken";

export const createTokenPair = (payload: any) => {
  // const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  //   modulusLength: 4096,
  //   publicKeyEncoding: {
  //     type: "pkcs1",
  //     format: "pem",
  //   },
  //   privateKeyEncoding: {
  //     type: "pkcs1",
  //     format: "pem",
  //   },
  // });
  const publicKey = randomBytes(64).toString('hex')
  const privateKey = randomBytes(64).toString('hex')

  const token = JWT.sign(payload, publicKey, {
    expiresIn: "1 days",
    // algorithm: "RS256",
  });

  const refreshToken = JWT.sign(payload, privateKey, {
    expiresIn: "2 days",
    // algorithm: "RS256",
  });

  return {
    token,
    refreshToken,
    publicKey,
    privateKey
  };
};
