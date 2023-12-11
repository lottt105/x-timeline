import { sendPasswordResetEmail } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";

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
  border-bottom: 0.5px solid #4d4d63;
  width: 90%;
`;

export default function AuthMenu({
  email,
}: {
  email: string | null | undefined;
}) {
  const handlePWUpdateClick = async () => {
    const ok = confirm("비밀번호를 변경하시겠습니까?");
    if (ok && email) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert("비밀번호를 변경할 수 있는 메일을 보냈습니다.");
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <Menu>
      <MenuItem onClick={handlePWUpdateClick}>비밀번호 변경</MenuItem>
      <Line />
      <MenuItem>회원 탈퇴</MenuItem>
    </Menu>
  );
}
