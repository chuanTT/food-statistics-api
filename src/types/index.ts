import { Request } from "express";
import { Keys } from "../entity/Keys";

// middleware request
export type configValidateValueType = {
  rules: any[];
  dependent?: string;
  isDisableKey?: boolean;
  msg: {
    [key: string]: string;
  };
};

export type variableNode = "body" | "params" | "query";

export type configValidateType = {
  [P in variableNode]?: {
    [key: string]: configValidateValueType;
  };
};

export type IRequest = Request & {
  keyStore: Keys;
  refreshToken?: string
};
