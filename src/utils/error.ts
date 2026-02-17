import axios from "axios";

/**
 * API 에러를 표준 Error 객체로 변환
 */
export const handleApiError = (
  err: unknown,
  fallbackMessage = "요청 처리 중 문제가 발생했습니다.",
): never => {
  // axios 에러인지 확인
  if (axios.isAxiosError(err)) {
    // 서버가 내려준 메시지
    const serverMessage = err.response?.data?.message;
    if (serverMessage) {
      throw new Error(serverMessage);
    }

    // 네트워크 오류 (서버 응답 없음)
    if (!err.response) {
      throw new Error("서버에 연결할 수 없습니다.");
    }
  }

  // 인터셉터에서 message만 throw된 경우
  if (err instanceof Error && err.message) {
    throw err;
  }

  // 문자열 에러 대응
  if (typeof err === "string") {
    throw new Error(err);
  }

  // 기타 예외
  throw new Error(fallbackMessage);
};
