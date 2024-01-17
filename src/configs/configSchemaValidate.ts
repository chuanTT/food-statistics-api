import { configValidateType } from "../types";
import { isDependent, isMin, isRequired } from "../utils/validate";

export const configPasswordBody: configValidateType = {
  body: {
    password: {
      rules: [isRequired, isMin(6)],
      msg: {
        isRequired: "Vui lòng nhập mật khẩu",
        isMin: "Độ dài tối thiểu 6 kí tự",
      },
    },

    confirm_password: {
      rules: [isRequired, isMin(6), isDependent],
      msg: {
        isRequired: "Vui lòng nhập mật khẩu",
        isMin: "Độ dài tối thiểu 6 kí tự",
        isDependent: "Mật khẩu không khớp"
      },
      dependent: "password",
    },
  },
};
