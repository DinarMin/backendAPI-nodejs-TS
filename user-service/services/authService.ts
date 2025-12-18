import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { ITokenService } from "../interfaces/ITokenService.js";
import { IEncryptionService } from "../interfaces/IEncryptionService.js";
import dotenv from "dotenv";

dotenv.config();

export class BcryptService implements IEncryptionService {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export class JwtService implements ITokenService {
  generatedToken(payload: object, expiresIn: SignOptions["expiresIn"]): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn });
  }
}
