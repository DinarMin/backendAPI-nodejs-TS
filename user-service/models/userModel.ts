import { prisma } from "../db/prisma.js";

type CreateUserParams = {
  name: string;
  email: string;
  hashedPassword: string;
};

export type CheckUserParams = {
  id: number;
  name: string;
  email: string | null;
  password: string;
  role: string;
};

export class UserRepository {
  async createUser({
    name,
    email,
    hashedPassword,
  }: CreateUserParams): Promise<void> {
    try {
      await prisma.users.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
        },
      });
    } catch (err: any) {
      throw err;
    }
  }

  async checkUser(email: string): Promise<CheckUserParams | null> {
    try {
      const result = await prisma.users.findUnique({
        where: {
          email: email,
        },
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
