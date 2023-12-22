import { useState } from "react";
import styled from "styled-components";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { auth, storage } from "../firebase";
import { useRecoilState } from "recoil";
import {
  modalStateAtom,
  profileNameAtom,
  profilePhotoAtom,
} from "../stores/modalAtom";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 50%);
  z-index: 2;
`;

const Modal = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 300px;
  height: 50%;
  background-color: white;
  z-index: 3;
`;

const CloseModalBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  svg {
    width: 25px;
    fill: #4d4d63;
  }
`;

const Text = styled.span`
  font-size: 11px;
  color: #4d4d63;
`;

const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e4e5ec;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
  background-color: transparent;
  border: 1px solid #afafbc;
  width: 70%;
  font-size: 14px;
`;

const SubmitInput = styled.input`
  border: none;
  border-radius: 20px;
  background-color: #4d4d63;
  color: #eeeff3;
  padding: 10px;
  margin-top: 50px;
  width: 70%;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export default function ProfileUpdateModal() {
  const user = auth.currentUser;

  const [previewPhoto, setPreviewPhoto] = useRecoilState(profilePhotoAtom);
  const [previewName, setPreviewName] = useRecoilState(profileNameAtom);
  const [isModalOpen, setModalOpen] = useRecoilState(modalStateAtom);

  // 업데이트할 이미지 파일 저장용 state
  const [updatePhoto, setUpdatePhoto] = useState<File | undefined>();

  const handleProfileModalCloseClick = () => {
    setModalOpen(!isModalOpen);
  };

  // 이미지 파일 선택 시 호출 됨
  const handleProfilePhotoUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const file = files[0];
      setPreviewPhoto(URL.createObjectURL(file));
      setUpdatePhoto(file);
    }
  };

  // 이름 변경 시 호출 됨
  const handleProfileNameUpdate = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    if (!value) return;
    setPreviewName(value);
  };

  // 저장 버튼 클릭 시, 사용자 프로필 업데이트 (에러 체크 넣기)
  const handleSubmitProfileUpdate = async (
    updateName: string | undefined,
    updateFile: File | null = null
  ) => {
    if (!user) return;
    await updateProfile(user, {
      displayName: updateName,
    });
    if (updateFile) {
      const locationRef = ref(storage, `avatars/${user.uid}`);
      const result = await uploadBytes(locationRef, updateFile);
      const avatarUrl = await getDownloadURL(result.ref);
      setPreviewPhoto(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  // 저장 버튼 클릭 시, 이미지 파일 유뮤 확인
  const handleSubmitClick = async () => {
    if (!updatePhoto) {
      await handleSubmitProfileUpdate(previewName);
    } else {
      await handleSubmitProfileUpdate(previewName, updatePhoto);
    }
    handleProfileModalCloseClick();
  };

  return (
    <Wrapper>
      <Modal>
        <CloseModalBtn onClick={handleProfileModalCloseClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </CloseModalBtn>

        <Text>※ 프로필 사진 변경 : 이미지 영역 클릭</Text>
        <AvatarUpload htmlFor="avatar">
          {previewPhoto ? (
            <AvatarImg
              src={
                typeof previewPhoto === "string"
                  ? previewPhoto
                  : URL.createObjectURL(previewPhoto)
              }
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
            </svg>
          )}
        </AvatarUpload>
        <AvatarInput
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleProfilePhotoUpdate}
        />
        <Input
          id="updateName"
          type="updateName"
          placeholder="변경할 이름을 입력해주세요."
          defaultValue={previewName || ""}
          onChange={handleProfileNameUpdate}
        />
        <SubmitInput type="submit" value="저장" onClick={handleSubmitClick} />
        <Text>❗ 이전에 작성한 메세지의 프로필은 변경되지 않습니다.</Text>
      </Modal>
    </Wrapper>
  );
}
