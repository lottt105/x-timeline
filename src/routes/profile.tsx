import styled from "styled-components";
import Tweet from "../components/common/Message";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { MessageType } from "../types";
import AuthMenu from "../components/profile/ProfileMenu";
import ProfileUpdateModal from "../components/profile/ProfileUpdateModal";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  modalStateAtom,
  profileNameAtom,
  profilePhotoAtom,
} from "../recoil/atoms/profileModalState";
import { colors } from "../resources/colors";
import Icon from "../resources/icons";

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

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
  overflow-y: scroll;
`;

export default function Profile() {
  const user = auth.currentUser;
  // 모달 관련 전역 state
  const [profilePhoto, setProfilePhoto] = useRecoilState(profilePhotoAtom);
  const [profileName, setProfileName] = useRecoilState(profileNameAtom);
  const isModalOpen = useRecoilValue(modalStateAtom);

  // 메뉴 관련 state
  const [menuToggle, setMenuToggle] = useState<boolean>(false);

  // 사용자 본인 작성한 트윗 데이터 리스트
  const [tweets, setTweets] = useState<MessageType[]>([]);

  const handleMenuBtnClick = () => {
    setMenuToggle(!menuToggle);
  };

  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc"),
      where("userId", "==", user?.uid),
      limit(25)
    );
    const tweetDocs = await getDocs(tweetsQuery);
    const tweets = tweetDocs.docs.map((doc) => {
      const { tweet, createdAt, userId, username, userPhoto, photo } =
        doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        userPhoto,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };

  useEffect(() => {
    setProfilePhoto(user?.photoURL);
    setProfileName(user?.displayName);
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      <MenuWrapper>
        <MenuBtn onClick={handleMenuBtnClick}>
          <Icon icon="menuBtn" />
        </MenuBtn>
        {menuToggle && <AuthMenu />}
      </MenuWrapper>
      {profilePhoto ? (
        <AvatarImg src={profilePhoto} />
      ) : (
        <NoneAvatarImg>
          <Icon icon="defaultAvatarImg" />
        </NoneAvatarImg>
      )}
      <Name>{profileName || "Anonymous"}</Name>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
      {isModalOpen && <ProfileUpdateModal />}
    </Wrapper>
  );
}
