import { IResponse } from "models/Request";
import { User } from "models/User";

declare global {
  namespace Express {
    interface Request {
      user: User;
      body: T;
    }
    interface Response {
      success: (data: IResponse) => Response;
      error: (data: IResponse) => Response;
      badReq: (data: IResponse) => Response;
      forbidden: (data: IResponse) => Response;
      unAuth: (data: IResponse) => Response;
      internal: (data: IResponse) => Response;
    }
  }
}
