import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./style/register.style.css";
import { useUserStore } from "../../stores/userStore";

type RegisterForm = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  policy: boolean;
};

const RegisterPage = () => {
  const navigate = useNavigate();

  const { register, isLoading, error, clearError } = useUserStore();

  const [formData, setFormData] = useState<RegisterForm>({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });

  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);

  const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { name, email, password, confirmPassword, policy } = formData;

    if (password !== confirmPassword) {
      setPasswordError("비밀번호 중복확인이 일치하지 않습니다.");
      return;
    }
    if (!policy) {
      setPolicyError(true);
      return;
    }

    setPasswordError("");
    setPolicyError(false);

    try {
      await register({ name, email, password });

      // ✅ 가입 성공 후 이동 (원하는 곳으로)
      navigate("/login"); // 또는 "/signin"
    } catch {
      // store.error에 이미 세팅됨
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = event.target;

    if (error) clearError();
    if (id === "confirmPassword" && passwordError) setPasswordError("");

    if (type === "checkbox") {
      if (policyError) setPolicyError(false);
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  return (
    <Container className="register-area">
      {error && (
        <Alert variant="danger" className="error-message">
          {error}
        </Alert>
      )}

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="Enter email"
            onChange={handleChange}
            required
            value={formData.email}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            id="name"
            placeholder="Enter name"
            onChange={handleChange}
            required
            value={formData.name}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            required
            value={formData.password}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            value={formData.confirmPassword}
            isInvalid={!!passwordError}
          />
          <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="이용약관에 동의합니다"
            id="policy"
            onChange={handleChange}
            isInvalid={policyError}
            checked={formData.policy}
          />
          {policyError && (
            <div className="text-danger" style={{ fontSize: 13, marginTop: 6 }}>
              이용약관에 동의해 주세요.
            </div>
          )}
        </Form.Group>

        <Button variant="danger" type="submit" disabled={isLoading}>
          {isLoading ? "가입 중..." : "회원가입"}
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;
