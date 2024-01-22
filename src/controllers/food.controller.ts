import { OK } from "../core/success.response";
import { IRequest } from "../types";

class FoodController {
  create = async (req: IRequest, res: Response) => {
    new OK({
      data: req.body,
    }).send(res);
  };
}

export default new FoodController();
