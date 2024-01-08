import { useForm } from "react-hook-form";
import styled from "styled-components";
import { auth, db, storage } from "../../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect } from "react";
import { PostMessageType } from "../../types";
import { colors } from "../../resources/colors";
import Icon from "../../resources/icons";

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  border: none;
  background-color: ${colors.message_input_background};
`;

const TextArea = styled.textarea`
  grid-column: 1/4;
  padding: 30px 30px 0;
  font-size: 16px;
  color: ${colors.deep_gray};
  border: none;
  background-color: ${colors.message_input_background};
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: ${colors.deep_blue};
  }
`;

const AttachFileBtn = styled.label`
  grid-column: 1/2;
  justify-self: start;
  padding: 10px 22px;
  margin: 10px;
  cursor: pointer;
  svg {
    width: 20px;
    fill: ${colors.deep_gray};
  }
  &:hover {
    opacity: 0.8;
  }
`;

const PreviewImg = styled.img`
  justify-self: center;
  box-shadow: 2px 2px 4px #999;
  width: 50px;
  height: 50px;
  border-radius: 5px;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  grid-column: 3/4;
  place-self: end;
  background-color: ${colors.deep_blue};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  padding: 8px 15px;
  margin: 15px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

// 메세지 작성 컴포넌트
export default function PostMessageForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<PostMessageType>({
    defaultValues: {
      tweet: "",
      file: undefined,
    },
  });

  // 업로드 할 이미지 파일 미리보기 용
  const watchFile = watch("file");

  // 포스트할 때 텍스트는 필수, 이미지는 선택
  const onSubmit = async (data: PostMessageType) => {
    const user = auth.currentUser;
    // 사용자 로그인 정보가 없거나 포스트 중인 경우 중단
    if (!user || isSubmitting) return;
    try {
      const { tweet, file } = data;
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
        userPhoto: user.photoURL,
      });
      // 첨부된 이미지가 있는 경우,
      if (file && file.length !== 0) {
        console.log(file);
        // 1. storage에 이미지 업로드
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file[0]);
        // 2. 이미지 url 다운
        const url = await getDownloadURL(result.ref);
        // 3. 메세지 데이터에 이미지 url 추가
        await updateDoc(doc, { photo: url });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 메세지 업로드가 종료되면, form 데이터들 다시 default 데이터로 reset
  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        rows={5}
        placeholder="트윗을 작성해주세요."
        {...register("tweet", {
          required: "업로드할 글을 작성해주세요.",
          maxLength: {
            value: 180,
            message: "글은 최대 180자까지 작성 가능합니다.",
          },
        })}
      />
      <AttachFileBtn htmlFor="file">
        <Icon icon="attachFileBtn" />
      </AttachFileBtn>
      <AttachFileInput
        disabled={isSubmitting}
        id="file"
        type="file"
        accept="image/*"
        {...register("file")}
      />
      {watchFile && watchFile.length !== 0 && (
        <PreviewImg src={URL.createObjectURL(watchFile[0])} />
      )}
      <SubmitBtn
        type="submit"
        value={isSubmitting ? "포스팅 중..." : "포스트"}
      />
    </Form>
  );
}
