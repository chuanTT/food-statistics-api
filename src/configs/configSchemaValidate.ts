import * as _ from "lodash";

import { configValidateType } from "../types";
import {
  isDependent,
  isMax,
  isMin,
  isMinLength,
  isNumber,
  isRequired,
  isValidDate,
  isValidUserName,
  isValidateArrayItem,
  isValueArray,
} from "../utils/validate";

export const configDefaultID: configValidateType["body"] = {
  id: {
    rules: [isRequired, isNumber],
    msg: {
      isRequired: "Id không được để trống",
      isNumber: "Id phải là số",
    },
  },
};

export const configPageAndLimit: configValidateType = {
  query: {
    page: {
      rules: [isRequired, isNumber],
      msg: {
        isRequired: "Vui lòng nhập số trang",
        isNumber: "Số trang không đúng dịnh dạng",
      },
      isDisableKey: true,
    },

    limit: {
      rules: [isRequired, isNumber],
      msg: {
        isRequired: "Vui lòng nhập giới hạn số trang",
        isNumber: "Giới hạn số trang không đúng dịnh dạng",
      },
      isDisableKey: true,
    },
  },
};

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
      rules: [isRequired, isValidUserName, isMin(6), isMax(30)],
      msg: {
        isRequired: "Vui lòng nhập tên đăng nhập",
        isValidUserName: "Tên đăng nhập không hợp lệ",
        isMin: "Tên đăng nhập tối thiểu 6 ký tự",
        isMax: "Tên đăng nhập tối đa 30 ký tự"
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

//  group list food

export const configGroupListFood: configValidateType = {
  body: {
    name: {
      rules: [isRequired],
      msg: {
        isRequired: "Vui lòng nhập tên nhóm danh sách",
      },
    },

    people: {
      rules: [isRequired, isNumber],
      msg: {
        isRequired: "Vui lòng nhập số người",
      },
      isDisableKey: true,
    },

    isPaid: {
      rules: [isRequired, isNumber],
      msg: {
        isRequired: "Vui lòng chọn trạng thái",
      },
      isDisableKey: true,
    },
  },
};

export const configGroupListFoodUpdate: configValidateType = {
  ...configGroupListFood,
  params: {
    ...configDefaultID,
  },
};

export const configGroupListFoodPaid: configValidateType = {
  body: {
    ...configDefaultID,
    isPaid: {
      rules: [isRequired, isNumber],
      msg: {
        isRequired: "Vui lòng nhập trạng thái",
        isNumber: "Trạng thái phải là số",
      },
    },
  },
};

// list food
export const configListFood: configValidateType = {
  body: {
    idGroupList: {
      rules: [isRequired, isNumber],
      msg: {
        isRequired: "Vui lòng nhập id nhóm danh sách",
        isNumber: "id nhóm danh sách phải là số",
      },
    },

    people: {
      rules: [isRequired, isNumber],
      msg: {
        isRequired: "Vui lòng nhập số người",
      },
      isDisableKey: true,
    },

    date: {
      rules: [isRequired, isValidDate],
      msg: {
        isRequired: "Vui lòng chọn ngày",
        isValidDate: "Ngày không đúng định dạng",
      },
      isDisableKey: true,
    },
  },
};

export const configListFoodUpdate: configValidateType = {
  body: {
    ..._.omit(configListFood.body, "idGroupList"),
  },
  params: {
    ...configDefaultID,
  },
};

// food
export const configFoodCreate: configValidateType = {
  body: {
    idListFood: {
      rules: [isRequired, isNumber],
      msg: {
        isRequired: "Vui lòng chọn id danh sách",
        isNumber: "id danh sách phải là số",
      },
    },

    foods: {
      rules: [isValueArray, isMinLength(1), isValidateArrayItem()],
      msg: {
        isValueArray: "Không đúng định dạng",
        isMinLength: "Tối thiểu một phần tử",
        isValidateArrayItem: "Phần tử không đúng định dạng",
      },
    },
  },
};

export const configFoodDelete: configValidateType = {
  body: {
    foodIds: {
      rules: [isValueArray, isMinLength(1), isValidateArrayItem("number")],
      msg: {
        isValueArray: "Không đúng định dạng",
        isMinLength: "Tối thiểu một phần tử",
        isValidateArrayItem: "Phần tử không đúng định dạng",
      },
    },
  },
};

export const configFoodUpdate: configValidateType = {
  body: {
    name: {
      rules: [isRequired],
      msg: {
        isRequired: "Vui lòng nhập tên",
      },
    },

    price: {
      rules: [isRequired, isNumber],
      msg: {
        isRequired: "Vui lòng nhập giá",
        isNumber: "Giá phải là số",
      },
    },

    count: {
      rules: [isRequired, isNumber],
      msg: {
        isRequired: "Vui lòng nhập số lượng",
        isNumber: "Số lượng phải là số",
      },
    },
  },
  params: configDefaultID,
};
