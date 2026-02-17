import api from "../utils/api";
import { handleApiError } from "../utils/error";
import type { AuthState, UserRole } from "../types/auth";

export interface SignupArgs {
  name: string;
  email: string;
  password: string;
}

export interface SigninArgs {
  email: string;
  password: string;
}

export interface User {
  _id?: string; // MongoDB면 _id
  id?: string; // 또는 id
  email: string;
  name?: string;
  role?: UserRole; // 권한
}

export interface SigninResponse {
  message: string;
  token: string;
  user: User;
}

export interface SignupResponse {
  message: string;
  id: string;
}

export const signupApi = async (args: SignupArgs): Promise<SignupResponse> => {
  try {
    const res = await api.post("/users", args);
    return res.data;
  } catch (err) {
    handleApiError(err, "회원가입 처리 중 문제가 발생했어요.");
    throw err; // 호출부에서 catch 가능하게 유지
  }
};

export const signinApi = async (args: SigninArgs): Promise<AuthState> => {
  try {
    const res = await api.post("/users/login", args);
    return res.data; // { token, user }
  } catch (err) {
    handleApiError(err, "로그인 처리 중 문제가 발생했어요.");
    throw err;
  }
};

export const meApi = async (): Promise<{ user: AuthState["user"] }> => {
  try {
    const res = await api.get("/users/me");
    return res.data;
  } catch (err) {
    handleApiError(err, "사용자 정보를 불러오는 중 문제가 발생했어요.");
    throw err;
  }
};
