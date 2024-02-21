import styled from "styled-components";
import {
  PostMessageForm,
  Timeline,
  LoginInformMessage,
} from "../components/timeline";
import { auth } from "../firebase";

const Wrapper = styled.div`
  display: grid;
  overflow-y: scroll;
  border: 0;
  border-radius: 8px;
`;

export default function Home() {
  const user = auth.currentUser;

  return (
    <Wrapper>
      {user ? <PostMessageForm /> : <LoginInformMessage />}
      <Timeline />
    </Wrapper>
  );
}
