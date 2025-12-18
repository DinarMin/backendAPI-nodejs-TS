import { CheckUserParams } from "../models/userModel.js";

export interface IUserRepository {
  createUser(data: any): Promise<void>;
  checkUser(email: string): Promise<CheckUserParams | null>;
}
