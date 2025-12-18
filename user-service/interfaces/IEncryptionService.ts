export interface IEncryptionService {
  hash(password: string, hash: number): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
