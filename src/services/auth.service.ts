import prisma from "../clients/prisma.client";
import * as bcrypt from "bcrypt";
import { ILoginRequest, ISignupRequest } from "../types/auth.types";
import * as errors from "./internal/error.service";
import jwt from "jsonwebtoken";

class AuthService {
  public utils: AuthUtils;

  constructor() {
    this.utils = new AuthUtils();
  }

  public async signup(payload: ISignupRequest): Promise<void> {
    if (await this.utils.exists("email", payload.email)) {
      throw new errors.ConflictError("Email was already used");
    }

    if (await this.utils.exists("username", payload.username)) {
      throw new errors.ConflictError("Username was already used");
    }

    payload.password = await this.utils.hashPasword(payload.password);

    try {
      await prisma.user.create({ data: payload });
    } catch (err: any) {
      throw new errors.AsyncError(undefined, undefined, err);
    }
  }

  public async login(
    mode: "username" | "email",
    payload: ILoginRequest
  ): Promise<string> {
    let user: any;
    try {
      if (mode == "username") {
        user = await prisma.user.findUnique({
          where: { username: payload.username },
        });
      } else {
        user = await prisma.user.findUnique({
          where: {
            email: payload.email,
          },
        });
      }

      if (!user) {
        throw new errors.NotFoundError("Email or password is wrong");
      }

      if (
        !(await this.utils.comparePasswords(user.password, payload.password))
      ) {
        throw new errors.NotFoundError("Email or password is wrong");
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1d",
        }
      );

      return token;
    } catch (err: any) {
      throw new errors.AsyncError(undefined, undefined, err);
    }
  }
}

class AuthUtils {
  public async hashPasword(password: string): Promise<string> {
    const saltRounds = 10;
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      return hash;
    } catch (err: any) {
      throw new errors.AsyncError(undefined, undefined, err);
    }
  }

  public async comparePasswords(
    dbPassword: string,
    inputPassword: string
  ): Promise<boolean> {
    try {
      const match = await bcrypt.compare(inputPassword, dbPassword);
      return match;
    } catch (err: any) {
      throw new errors.AsyncError(undefined, undefined, err);
    }
  }

  public async exists(
    inputType: "username" | "email",
    input: string
  ): Promise<boolean> {
    try {
      const user =
        inputType == "username"
          ? await prisma.user.findUnique({ where: { username: input } })
          : await prisma.user.findUnique({ where: { email: input } });
      return !!user;
    } catch (err: any) {
      throw new errors.AsyncError(undefined, undefined, err);
    }
  }
}

export { AuthService, AuthUtils };
