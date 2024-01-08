import { useState } from "react";
import styled from "styled-components";
import { ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { auth, storage } from "../../firebase";
import { useRecoilState } from "recoil";
import {
  modalStateAtom,
  profileNameAtom,
  profilePhotoAtom,
} from "../../recoil/atoms";
import { colors } from "../../resources/colors";
import Icon from "../../resources/icons";
import { motion } from "framer-motion";

const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 9;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 15%;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 300px;
  background-color: white;
  z-index: 10;
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
    fill: ${colors.deep_gray};
  }
`;

const Text = styled.span`
  font-size: 11px;
  color: ${colors.deep_gray};
`;

const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background-color: ${colors.message_input_background};
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
  border: 1px solid ${colors.gray};
  width: 70%;
  font-size: 14px;
`;

const SubmitInput = styled.input`
  border: none;
  border-radius: 20px;
  background-color: ${colors.deep_gray};
  color: ${colors.light_gray};
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
    console.log(`first ${previewPhoto}`);
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
    // if (!value) return;
    setPreviewName(value);
  };

  // 저장 버튼 클릭 시, 사용자 프로필 업데이트 (에러 체크 넣기)
  const handleSubmitProfileUpdate = async (
    updateName: string | null | undefined,
    updateFile: File | null = null
  ) => {
    if (!user) return;
    await updateProfile(user, {
      displayName: updateName,
    });
    if (updateFile) {
      const locationRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(locationRef, updateFile);
      // const avatarUrl = await getDownloadURL(result.ref);
      // console.log(`after ${avatarUrl}`);
      // setPreviewPhoto(avatarUrl);
      // await updateProfile(user, {
      //   photoURL: avatarUrl,
      // });
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
    <>
      <BackDrop onClick={handleProfileModalCloseClick} />
      <Modal
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <CloseModalBtn onClick={handleProfileModalCloseClick}>
          <Icon icon="closeModalBtn" />
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
            <Icon icon="defaultAvatarImg" />
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
        <Text>❗ 이전에 작성한 메세지의 프로필 이름은 변경되지 않습니다.</Text>
      </Modal>
    </>
  );
}
