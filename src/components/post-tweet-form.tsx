import { useForm } from "react-hook-form";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect } from "react";
import { PostTweetType } from "../models/tweet";

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  border: none;
  background-color: #e4e5ec;
`;

const TextArea = styled.textarea`
  grid-column: 1/4;
  padding: 30px 30px 0;
  font-size: 16px;
  color: #4d4d63;
  border: none;
  background-color: #e4e5ec;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #6ba2e6;
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
    fill: #4d4d63;
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
  background-color: #6ba2e6;
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
export default function PostTweetForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<PostTweetType>({
    defaultValues: {
      tweet: "",
      file: null,
    },
  });

  // 업로드 할 이미지 파일 미리보기 용
  const watchFile = watch("file");

  // 포스트할 때 텍스트는 필수, 이미지는 선택
  const onSubmit = async (data: PostTweetType) => {
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
      if (file) {
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
        required
        rows={5}
        maxLength={180}
        placeholder="트윗을 작성해주세요."
        {...register("tweet")}
      />
      <AttachFileBtn htmlFor="file">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
            clipRule="evenodd"
          />
        </svg>
      </AttachFileBtn>
      <AttachFileInput
        disabled={isSubmitting}
        id="file"
        type="file"
        accept="image/*"
        {...register("file")}
      />
      {watchFile !== null ? (
        <PreviewImg src={URL.createObjectURL(watchFile[0])} />
      ) : null}
      <SubmitBtn
        type="submit"
        value={isSubmitting ? "포스팅 중..." : "포스트"}
      />
    </Form>
  );
}
