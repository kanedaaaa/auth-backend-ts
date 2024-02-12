import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ILoginRequest, ISignupRequest } from "../types/auth.types";
import { ValidationError } from "../services/internal/error.service";

class AuthController extends AuthService {
  public async authWrapper(
    type: "login" | "signup",
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (type === "signup") {
        const payload = req.body as ISignupRequest;
        await this.signup(payload);

        return res.status(201).json({ message: "User signed up successfully" });
      } else if (type === "login") {
        const loginPayload = req.body as ILoginRequest;

        let token: string;

        // * will change with proper validation later
        if (loginPayload.username && !loginPayload.email) {
          token = await this.login("username", loginPayload);
        } else if (loginPayload.email && !loginPayload.username) {
          token = await this.login("email", loginPayload);
        } else {
          throw new ValidationError(
            "Can not accept both username and email for login"
          );
        }

        return res
          .status(200)
          .json({ message: "User logged in successfully", devOnly: token });
      }
    } catch (err: any) {
      next(err);
    }
  }
}

export default AuthController;
