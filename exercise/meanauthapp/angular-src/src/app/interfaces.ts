export interface User {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface APIResponse {
  success: boolean;
  msg: string;
  user: User;
  token: string;
}
