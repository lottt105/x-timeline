import {
  EmailAuthProvider,
  User,
  deleteUser,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
} from "firebase/auth";
import styled from "styled-components";
import { auth, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { deleteObject, ref } from "firebase/storage";
import { useRecoilState } from "recoil";
import { modalStateAtom } from "../../recoil/atoms/profileModalState";
import { colors } from "../../resources/colors";

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  max-width: 20rem;
  max-height: 10rem;
  border-radius: 10px;
  background-color: white;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  width: 100%;
  height: 20px;
  padding: 10px;
  margin: 6px 0;
  background-color: white;
  cursor: pointer;
`;

const Line = styled.div`
  border-bottom: 0.5px solid ${colors.deep_gray};
  width: 90%;
`;

export default function AuthMenu() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useRecoilState(modalStateAtom);

  const handleProfileModalOpenClick = () => {
    setModalOpen(!isModalOpen);
  };

  const handlePWUpdateClick = async () => {
    const ok = confirm("비밀번호를 변경하시겠습니까?");
    if (ok && user?.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        alert("비밀번호를 변경할 수 있는 메일을 보냈습니다.");
      } catch (e) {
        console.log(e);
      }
    }
  };

  const reAuthentication = async (
    checkUser: User,
    password: string,
    email: string
  ) => {
    try {
      const credential = EmailAuthProvider.credential(email, password);
      const { user: reAuthenticatedUser } = await reauthenticateWithCredential(
        checkUser,
        credential
      );
      return reAuthenticatedUser;
    } catch (e) {
      alert(e);
      return;
    }
  };

  const handleDeleteUserClick = async () => {
    const ok = confirm("탈퇴하시겠습니까?");
    if (!ok) return;
    const password = prompt("비밀번호를 입력해주세요");
    if (!(user?.email && password)) return;
    const reAuthenticatedUser = await reAuthentication(
      user,
      password,
      user.email
    );
    if (!reAuthenticatedUser) return;
    try {
      const locationRef = ref(storage, `avatars/${reAuthenticatedUser.uid}`);
      deleteObject(locationRef);
      await deleteUser(reAuthenticatedUser);
      alert("회원 탈퇴하셨습니다.");
      navigate("/login");
    } catch (e) {
      alert(e);
    }
  };

  return (
    <Menu>
      <MenuItem onClick={handleProfileModalOpenClick}>프로필 수정</MenuItem>
      <Line />
      <MenuItem onClick={handlePWUpdateClick}>비밀번호 변경</MenuItem>
      <Line />
      <MenuItem onClick={handleDeleteUserClick}>회원 탈퇴</MenuItem>
    </Menu>
  );
}
