import { useEffect, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import "./style/login.style.css";
import { useAuthStore } from "../../stores/authStore";

// const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
// const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LoginPage = () => {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const signin = useAuthStore((s) => s.signin);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string>("");

  // 이미 로그인 상태면 이동 (렌더 중 navigate 금지 → useEffect에서)
  useEffect(() => {
    if (isAuthed && user) {
      navigate("/", { replace: true });
    }
  }, [isAuthed, user, navigate]);

  const handleLoginWithEmail = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");

    try {
      await signin({ email, password });
      navigate("/", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "로그인에 실패했어요.";
      setLoginError(message);
    }
  };

  // 구글 로그인
  const handleGoogleLogin = async (_googleData: unknown) => {
    // TODO: 백엔드에 google token 보내서 로그인 처리하는 API 필요
    // setLoginError("구글 로그인은 아직 준비 중이에요.");
  };
  return (
    <>
      <Container className="login-area">
        {loginError && (
          <div className="error-message">
            <Alert variant="danger">{loginError}</Alert>
          </div>
        )}
        <Form className="login-form" onSubmit={handleLoginWithEmail}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              required
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
            />
          </Form.Group>
          <div className="display-space-between login-button-area">
            <Button variant="danger" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div>
              아직 계정이 없으세요?<Link to="/register">회원가입 하기</Link>{" "}
            </div>
          </div>

          <div className="text-align-center mt-2">
            <p>-외부 계정으로 로그인하기-</p>
            <div className="display-center">
              <div className="display-center">
                {GOOGLE_CLIENT_ID ? (
                  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={() => setLoginError("구글 로그인에 실패했어요.")}
                    />
                  </GoogleOAuthProvider>
                ) : (
                  <small className="text-muted">
                    VITE_GOOGLE_CLIENT_ID가 없어 구글 로그인을 표시하지 않았어요.
                  </small>
                )}
              </div>
            </div>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default LoginPage;
