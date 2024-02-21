import styled from "styled-components";
import { colors } from "../../resources/colors";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background-color: ${colors.gray};
  opacity: 85%;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
`;

const LoginLink = styled.u`
  cursor: pointer;
`;

export default function LoginInformMessage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };
  return (
    <Wrapper>
      <LoginLink onClick={handleLoginClick}>로그인</LoginLink> 후 메세지를
      남겨보세요!
    </Wrapper>
  );
}
