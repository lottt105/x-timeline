import styled from "styled-components";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  modalStateAtom,
  profileNameAtom,
  profilePhotoAtom,
} from "../recoil/atoms/profileModalState";
import { colors } from "../resources/colors";
import Icon from "../resources/icons";
import {
  ProfileMenu,
  ProfileMessages,
  ProfileUpdateModal,
} from "../components/profile";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 25px;
  overflow-y: scroll;
`;
const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: start;
  align-self: end;
  min-height: 10px;
  position: fixed;
`;

const MenuBtn = styled.div`
  cursor: pointer;
  svg {
    width: 25px;
  }
`;

const AvatarImg = styled.img`
  width: 80px;
  min-height: 80px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const NoneAvatarImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  min-height: 80px;
  border-radius: 50%;
  background-color: ${colors.message_input_background};
  margin-top: 20px;
  svg {
    width: 50px;
  }
`;

const Name = styled.span`
  font-size: 22px;
`;

export default function Profile() {
  const user = auth.currentUser;
  // 모달 관련 전역 state
  const [profilePhoto, setProfilePhoto] = useRecoilState(profilePhotoAtom);
  const [profileName, setProfileName] = useRecoilState(profileNameAtom);
  const isModalOpen = useRecoilValue(modalStateAtom);

  // 메뉴 관련 state
  const [menuToggle, setMenuToggle] = useState<boolean>(false);

  const handleMenuBtnClick = () => {
    setMenuToggle(!menuToggle);
  };

  useEffect(() => {
    setProfilePhoto(user?.photoURL);
    setProfileName(user?.displayName);
  }, []);

  return (
    <Wrapper>
      <MenuWrapper>
        <MenuBtn onClick={handleMenuBtnClick}>
          <Icon icon="menuBtn" />
        </MenuBtn>
        {menuToggle && <ProfileMenu />}
      </MenuWrapper>
      {profilePhoto ? (
        <AvatarImg src={profilePhoto} />
      ) : (
        <NoneAvatarImg>
          <Icon icon="defaultAvatarImg" />
        </NoneAvatarImg>
      )}
      <Name>{profileName || "Anonymous"}</Name>
      <ProfileMessages />
      {isModalOpen && <ProfileUpdateModal />}
    </Wrapper>
  );
}
