import styled from "styled-components";
import Tweet from "../components/tweet";
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
import { TweetType } from "../models/tweet";
import AuthMenu from "../components/auth-menu";
import ProfileUpdateModal from "../components/profile-update-modal";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  modalStateAtom,
  profileNameAtom,
  profilePhotoAtom,
} from "../stores/modalAtom";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
`;
const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: start;
  align-self: end;
  min-height: 125px;
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
`;

const NoneAvatarImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  min-height: 80px;
  border-radius: 50%;
  background-color: #e4e5ec;
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
  gap: 10px;
  width: 100%;
  background-color: white;
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
  const [tweets, setTweets] = useState<TweetType[]>([]);

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </MenuBtn>
        {menuToggle && <AuthMenu />}
      </MenuWrapper>
      {profilePhoto ? (
        <AvatarImg src={profilePhoto} />
      ) : (
        <NoneAvatarImg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        </NoneAvatarImg>
      )}
      <Name>{profileName ?? "Anonymous"}</Name>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
      {isModalOpen && <ProfileUpdateModal />}
    </Wrapper>
  );
}
