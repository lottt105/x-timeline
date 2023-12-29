import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

/**
 * 로그인 상태인 경우에만 children 컴포넌트로 이동 가능
 * 로그인 상태가 아니면, 로그인 페이지로 리다이렉트
 */

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser;
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
}
