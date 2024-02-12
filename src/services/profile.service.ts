import prisma from "../clients/prisma.client";
import { AsyncError, NotFoundError } from "./internal/error.service";

class ProfileService {
  public async getProfile(id: number) {
    let user: any;
    try {
      user = await prisma.user.findUnique({
        where: { id },
        select: { username: true, email: true },
      });
    } catch (err: any) {
      throw new AsyncError(undefined, undefined, err);
    }

    if (!user) {
      throw new NotFoundError("User doesn't exists");
    }

    return user;
  }
}
