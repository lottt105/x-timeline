import styled from "styled-components";
import { auth, db, storage } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { MessageType } from "../../types";
import moment from "moment";

const Wrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 8px 0 0;
  &:last-child {
    margin-bottom: 8px;
  }
`;

const Row = styled.div`
  margin: 10px 10px 10px 65px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const User = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #e4e5ec;
  justify-content: center;
  align-items: center;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 18px;
  margin-left: 15px;
`;

const LeftHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Date = styled.span`
  font-size: 15px;
  font-weight: 300;
`;

const DeleteBtn = styled.button`
  background-color: transparent;
  border: none;
  padding-top: 5px;
  cursor: pointer;
  svg {
    width: 20px;
    fill: #4d4d63;
  }
`;

const Payload = styled.p`
  margin: 10px 0px;
  padding-right: 26px;
  font-size: 16px;
  word-wrap: break-word;
  word-break: keep-all;
  line-height: 22px;
`;

const Photo = styled.img`
  width: auto;
  height: 100px;
  border-radius: 15px;
`;

export default function Tweet({
  tweet,
  photo,
  userId,
  username,
  userPhoto,
  id,
  createdAt,
}: MessageType) {
  const user = auth.currentUser;

  const handleDeleteClick = async () => {
    const ok = confirm("이 메세지를 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      // 첨부된 이미지가 있는 경우, storage에서도 해당 이미지 삭제
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <Header>
        <User>
          {userPhoto ? (
            <AvatarImg src={userPhoto} />
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
          <Username>{username || "Anonymous"}</Username>
        </User>
        <LeftHeader>
          <Date>{moment(createdAt).format("YYYY-MM-DD")}</Date>
          {user?.uid === userId ? (
            <DeleteBtn onClick={handleDeleteClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </DeleteBtn>
          ) : null}
        </LeftHeader>
      </Header>
      <Row>
        <Payload>{tweet}</Payload>
      </Row>
      <Row>{photo ? <Photo src={photo} /> : null}</Row>
    </Wrapper>
  );
}
