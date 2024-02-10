export interface ISignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface ILoginRequest {
  username?: string;
  email?: string;
  password: string;
}
