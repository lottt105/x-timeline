import styled from "styled-components";
import { auth, db, storage } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { MessageType } from "../../types";
import moment from "moment";
import { colors } from "../../resources/colors";
import Icon from "../../resources/icons";
import { memo } from "react";

const Wrapper = styled.div`
  background-color: ${colors.message_background};
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
  background-color: ${colors.message_input_background};
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
    fill: ${colors.deep_gray};
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

const Message = memo(function Message({
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
            <Icon icon="defaultAvatarImg" />
          )}
          <Username>{username || "Anonymous"}</Username>
        </User>
        <LeftHeader>
          <Date>{moment(createdAt).format("YYYY-MM-DD")}</Date>
          {user?.uid === userId ? (
            <DeleteBtn onClick={handleDeleteClick}>
              <Icon icon="deleteBtn" />
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
});

export default Message;
