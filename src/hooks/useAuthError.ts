import { useState } from "react";

export default function useAuthError(
  initialError: string
): [string, (errorCode: string) => void, () => void] {
  const [error, setError] = useState<string>(initialError);

  const onChange = (errorCode: string) => {
    switch (errorCode) {
      case "auth/user-not-found" || "auth/wrong-password":
        setError("이메일 혹은 비밀번호가 일치하지 않습니다.");
        break;
      case "auth/email-already-in-use":
        setError("이미 사용 중인 이메일입니다.");
        break;
      case "auth/weak-password":
        setError("비밀번호는 6글자 이상이어야 합니다.");
        break;
      case "auth/network-request-failed":
        setError("네트워크 연결에 실패 하였습니다.");
        break;
      case "auth/invalid-email":
        setError("잘못된 이메일 형식입니다.");
        break;
      case "auth/internal-error":
        setError("잘못된 요청입니다.");
        break;
      default:
        setError("로그인에 실패 하였습니다.");
        break;
    }
  };

  const reset = () => setError(initialError);

  return [error, onChange, reset];
}
