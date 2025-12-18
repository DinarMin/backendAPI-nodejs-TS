import { SignOptions } from "jsonwebtoken";

export interface ITokenService {
  generatedToken(payload: object, expiresIn: SignOptions['expiresIn']): string;
}
