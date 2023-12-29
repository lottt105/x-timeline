import styled from "styled-components";
import { PostMessageForm, Timeline } from "../components/timeline";

export default function Home() {
  const Wrapper = styled.div`
    display: grid;
    overflow-y: scroll;
    border: 0;
    border-radius: 8px;
    grid-template-rows: 1fr 5fr;
  `;

  return (
    <Wrapper>
      <PostMessageForm />
      <Timeline />
    </Wrapper>
  );
}
