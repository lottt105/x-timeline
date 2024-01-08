import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Wrapper,
  Title,
  Form,
  Input,
  InputErrorText,
  Error,
  Switcher,
  SubmitInput,
} from "../components/auth/AuthComponents";
import { LoginType } from "../types";
import Icon from "../resources/icons";
import useAuthError from "../hooks/useAuthError";

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginType>();

  const [error, setError, reset] = useAuthError("");

  const onSubmit = async (data: LoginType) => {
    reset();
    const { email, password } = data;
    if (isSubmitting) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.code);
      }
    }
  };

  return (
    <Wrapper>
      <Title>로그인</Title>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="email"
          type="email"
          placeholder="이메일을 입력해주세요."
          {...register("email", {
            required: "이메일은 필수 입력입니다.",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "이메일 형식에 맞지 않습니다.",
            },
          })}
        />
        {errors.email && (
          <InputErrorText>
            <Icon icon="inputErrorText" />
            {errors.email.message}
          </InputErrorText>
        )}
        <Input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          {...register("password", {
            required: "비밀번호는 필수 입력입니다.",
            minLength: {
              value: 8,
              message: "8자리 이상 비밀번호를 사용해주세요.",
            },
          })}
        />
        {errors.password && (
          <InputErrorText>
            <Icon icon="inputErrorText" />
            {errors.password.message}
          </InputErrorText>
        )}
        <SubmitInput
          type="submit"
          disabled={isSubmitting}
          value={isSubmitting ? "Loading..." : "로그인"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        계정이 존재하지 않나요?{" "}
        <Link to="/create-account">회원가입 &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
