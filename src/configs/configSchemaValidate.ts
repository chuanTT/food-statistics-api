import { configValidateType } from "../types";
import { isDependent, isMin, isRequired } from "../utils/validate";

// user
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
        isDependent: "Mật khẩu không khớp",
      },
      dependent: "password",
    },
  },
};

export const configUserNameBody: configValidateType = {
  body: {
    username: {
      rules: [isRequired],
      msg: {
        isRequired: "Vui lòng nhập tên đăng nhập",
      },
    },
  },
};

export const configRegisterBody: configValidateType = {
  body: {
    firstName: {
      rules: [isRequired],
      msg: {
        isRequired: "Vui lòng nhập họ & đệm",
      },
    },

    lastName: {
      rules: [isRequired],
      msg: {
        isRequired: "Vui lòng nhập tên",
      },
    },

    ...configUserNameBody.body,
    ...configPasswordBody.body,
  },
};

export const configLoginBody: configValidateType = {
  body: {
    ...configUserNameBody.body,
    ...configPasswordBody.body,
  },
};
