import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import type { UserRole } from "../types/auth";

interface RequireAuthProps {
  permissionLevel: UserRole; // "customer" | "admin"
}

export default function RequireAuth({ permissionLevel }: RequireAuthProps) {
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading); // store에 없으면 제거

  const location = useLocation();

  // (선택) hydrate/loginWithToken 같은 처리 중이면 로딩 처리
  if (isLoading) return null; // 또는 스피너 컴포넌트

  // 로그인 안 됨 → /login
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // 권한 체크 (프로젝트가 user.level 쓰면 level, role 쓰면 role)
  // const level = user?.level ?? user?.role;

  if (permissionLevel === "admin" && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
