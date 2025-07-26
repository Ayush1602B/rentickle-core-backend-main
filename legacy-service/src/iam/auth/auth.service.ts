import { Injectable } from '@nestjs/common'

interface IAuthService {
  [key: string]: any
  // Define the methods and properties that the AuthService should implement
  // For example:
  // login(username: string, password: string): Promise<string>;
  // logout(): Promise<void>;
  // isAuthenticated(): boolean;
  // getUser(): User | null;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor() {}
}
