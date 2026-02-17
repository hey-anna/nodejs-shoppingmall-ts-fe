export type UserRole = "customer" | "admin";

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  role?: UserRole;
}

export interface AuthState {
  token: string;
  user: AuthUser;
}
