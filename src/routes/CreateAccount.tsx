import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useForm } from "react-hook-form";
import { auth } from "../firebase";
import { useState } from "react";
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
import { RegisterType } from "../types";
import Icon from "../resources/icons";

export default function CreateAccount() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RegisterType>();
  const [error, setError] = useState("");

  const onSubmit = async (data: RegisterType) => {
    setError("");
    const { name, email, password } = data;
    if (isSubmitting) return;
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credential.user, { displayName: name });
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    }
  };

  return (
    <Wrapper>
      <Title>회원가입</Title>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="name"
          type="name"
          placeholder="이름을 입력해주세요."
          {...register("name", { required: "이름은 필수 입력입니다." })}
        />
        {errors.name && (
          <InputErrorText>
            <Icon icon="inputErrorText" />
            {errors.name.message}
          </InputErrorText>
        )}
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
          value={isSubmitting ? "Loading..." : "계정 생성"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        계정이 이미 있나요? <Link to="/login">로그인 &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
